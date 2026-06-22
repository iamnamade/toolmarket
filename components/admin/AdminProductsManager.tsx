"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgePlus,
  Bell,
  Box,
  ChevronLeft,
  ChevronRight,
  CloudUpload,
  Eye,
  EyeOff,
  Menu,
  Search,
  SlidersHorizontal,
  Trash2,
  X,
  Pencil,
} from "lucide-react";
import { useSession } from "next-auth/react";
import type { ChangeEvent, ComponentProps, ReactNode, RefObject } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { allProducts } from "@/data/products";
import { brands } from "@/data/brands";
import { categories } from "@/data/categories";
import { formatPrice, parsePriceToCents } from "@/lib/price";
import type { ProductDetail } from "@/types/catalog";
import { adminNavigationItems } from "@/components/admin/admin-navigation";
import type { AdminNavigationItem } from "@/components/admin/admin-navigation";
import { HeaderUserMenu } from "@/components/layout/HeaderUserMenu";
import { Logo } from "@/components/ui/Logo";

type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  price: number;
  oldPrice: number | null;
  discountPercent: number;
  stock: number;
  unit: string;
  shortDescription: string;
  description: string;
  specifications: Record<string, string>;
  imageUrl: string;
  active: boolean;
  featured: boolean;
  discounted: boolean;
  showPrice: boolean;
};

type ProductFormState = {
  name: string;
  sku: string;
  brand: string;
  category: string;
  price: string;
  oldPrice: string;
  discountPercent: string;
  stock: string;
  unit: string;
  shortDescription: string;
  description: string;
  specifications: string;
  imageUrl: string;
  active: boolean;
  featured: boolean;
  discounted: boolean;
  showPrice: boolean;
};

type ProductFilters = {
  search: string;
  category: string;
  brand: string;
  status: "all" | "active" | "inactive" | "low-stock" | "discounted" | "hidden-price";
};

type NoticeTone = "success" | "info" | "danger";

type NoticeState = {
  title: string;
  text: string;
  tone: NoticeTone;
} | null;

type ModalMode = {
  type: "create" | "edit";
  id: string | null;
};

type DeleteTarget = AdminProduct | null;

const unitOptions = ["ცალი", "კომპლექტი", "მეტრი", "ლიტრი", "კგ", "ც"];
const productsPerPage = 5;

const statusOptions: Array<{
  value: ProductFilters["status"];
  label: string;
}> = [
  { value: "all", label: "ყველა სტატუსი" },
  { value: "active", label: "აქტიური" },
  { value: "inactive", label: "გამორთული" },
  { value: "low-stock", label: "დაბალი მარაგი" },
  { value: "discounted", label: "ფასდაკლებული" },
  { value: "hidden-price", label: "ფასი დამალულია" }
];

const toastToneStyles: Record<NoticeTone, string> = {
  success: "border-[#CBE8D5] bg-[#F0FBF4] text-[#176B45]",
  info: "border-[#DDE6F2] bg-[#F5F9FD] text-[#072B4D]",
  danger: "border-[#F7CFCF] bg-[#FFF5F5] text-[#C5221F]"
};

function normalizeProducts(products: ProductDetail[]): AdminProduct[] {
  return products.map((product) => {
    const price = parsePriceToCents(product.price) / 100;
    const oldPrice = product.oldPrice ? parsePriceToCents(product.oldPrice) / 100 : null;
    const discountPercent = product.discount
      ? Number.parseInt(product.discount.replace(/[^\d-]/g, ""), 10)
      : oldPrice && oldPrice > price
        ? Math.round((1 - price / oldPrice) * 100)
        : 0;

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      brand: product.brand,
      category: product.category,
      price,
      oldPrice,
      discountPercent: Number.isFinite(discountPercent) ? discountPercent : 0,
      stock: product.stock,
      unit: "ცალი",
      shortDescription: product.shortDescription,
      description: product.description,
      specifications: product.specifications,
      imageUrl: product.image,
      active: product.stock > 0,
      featured: product.isFeatured,
      discounted: Boolean(oldPrice && oldPrice > price),
      showPrice: true
    };
  });
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9ა-ჰ]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

function specsToText(specifications: Record<string, string>) {
  return Object.entries(specifications)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

function parseSpecsText(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((accumulator, line) => {
      const separatorIndex = line.indexOf(":");

      if (separatorIndex === -1) {
        return accumulator;
      }

      const key = line.slice(0, separatorIndex).trim();
      const specValue = line.slice(separatorIndex + 1).trim();

      if (key && specValue) {
        accumulator[key] = specValue;
      }

      return accumulator;
    }, {});
}

function toNumber(value: string) {
  const normalized = Number(value.replace(",", "."));
  return Number.isFinite(normalized) ? normalized : NaN;
}

function getInitialForm(product?: AdminProduct): ProductFormState {
  return {
    name: product?.name ?? "",
    sku: product?.sku ?? "",
    brand: product?.brand ?? brands[0]?.name ?? "",
    category: product?.category ?? categories[0]?.name ?? "",
    price: product ? product.price.toFixed(2) : "",
    oldPrice: product?.oldPrice ? product.oldPrice.toFixed(2) : "",
    discountPercent: product?.discountPercent ? String(product.discountPercent) : "",
    stock: product ? String(product.stock) : "0",
    unit: product?.unit ?? "ცალი",
    shortDescription: product?.shortDescription ?? "",
    description: product?.description ?? "",
    specifications: product ? specsToText(product.specifications) : "",
    imageUrl: product?.imageUrl ?? "",
    active: product?.active ?? true,
    featured: product?.featured ?? false,
    discounted: product?.discounted ?? false,
    showPrice: product?.showPrice ?? true
  };
}

function buildProductFromForm(
  form: ProductFormState,
  existingProduct?: AdminProduct
): { product?: AdminProduct; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!form.name.trim()) {
    errors.name = "სახელი სავალდებულოა";
  }

  if (!form.sku.trim()) {
    errors.sku = "SKU სავალდებულოა";
  }

  if (!form.brand.trim()) {
    errors.brand = "ბრენდი სავალდებულოა";
  }

  if (!form.category.trim()) {
    errors.category = "კატეგორია სავალდებულოა";
  }

  const price = toNumber(form.price);
  if (!Number.isFinite(price) || price <= 0) {
    errors.price = "ფასი უნდა იყოს 0-ზე მეტი";
  }

  const oldPrice = form.oldPrice.trim() ? toNumber(form.oldPrice) : NaN;
  if (form.oldPrice.trim() && (!Number.isFinite(oldPrice) || oldPrice <= 0)) {
    errors.oldPrice = "ძველი ფასი არასწორია";
  }

  if (Number.isFinite(price) && Number.isFinite(oldPrice) && oldPrice <= price) {
    errors.oldPrice = "ძველი ფასი ახალ ფასზე მეტი უნდა იყოს";
  }

  const stock = Number.parseInt(form.stock, 10);
  if (!Number.isInteger(stock) || stock < 0) {
    errors.stock = "მარაგი არასწორია";
  }

  const discountPercent = form.discountPercent.trim() ? toNumber(form.discountPercent) : 0;
  if (
    form.discountPercent.trim() &&
    (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 100)
  ) {
    errors.discountPercent = "ფასდაკლება უნდა იყოს 0-100 შორის";
  }

  if (form.discounted && !form.oldPrice.trim() && !form.discountPercent.trim()) {
    errors.discountPercent = "ფასდაკლებისთვის მიუთითეთ ძველი ფასი ან პროცენტი";
  }

  if (Object.keys(errors).length) {
    return { errors };
  }

  const normalizedOldPrice =
    Number.isFinite(oldPrice) && oldPrice > 0
      ? oldPrice
      : form.discountPercent.trim() && Number.isFinite(discountPercent) && discountPercent > 0 && Number.isFinite(price)
        ? Number((price / (1 - discountPercent / 100)).toFixed(2))
        : null;

  const computedDiscount =
    normalizedOldPrice && normalizedOldPrice > price
      ? Math.round((1 - price / normalizedOldPrice) * 100)
      : Number.isFinite(discountPercent)
        ? discountPercent
        : 0;

  const slug = existingProduct?.slug || slugify(`${form.name}-${form.sku}`);
  const imageUrl = form.imageUrl.trim() || existingProduct?.imageUrl || "";

  return {
    errors: {},
    product: {
      id: existingProduct?.id ?? `admin-${slug}-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`,
      slug,
      name: form.name.trim(),
      sku: form.sku.trim(),
      brand: form.brand.trim(),
      category: form.category.trim(),
      price,
      oldPrice: normalizedOldPrice,
      discountPercent: computedDiscount,
      stock,
      unit: form.unit.trim() || "ცალი",
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      specifications: parseSpecsText(form.specifications),
      imageUrl,
      active: form.active,
      featured: form.featured,
      discounted: form.discounted || Boolean(normalizedOldPrice && normalizedOldPrice > price),
      showPrice: form.showPrice
    }
  };
}

function getStatusLabel(product: AdminProduct) {
  if (!product.active) {
    return "გამორთული";
  }

  if (product.stock === 0) {
    return "მარაგი ამოწურულია";
  }

  if (product.stock <= 8) {
    return "დაბალი მარაგი";
  }

  return "აქტიური";
}

function getStatusTone(product: AdminProduct): "success" | "warning" | "danger" | "neutral" {
  if (!product.active) {
    return "danger";
  }

  if (product.stock === 0) {
    return "danger";
  }

  if (product.stock <= 8) {
    return "warning";
  }

  return "success";
}

function useBodyLock(locked: boolean) {
  useEffect(() => {
    if (!locked) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [locked]);
}

export function AdminProductsManager() {
  const [products, setProducts] = useState<AdminProduct[]>(() => normalizeProducts(allProducts));
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    category: "all",
    brand: "all",
    status: "all"
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [draft, setDraft] = useState<ProductFormState | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [notice, setNotice] = useState<NoticeState>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useBodyLock(mobileSidebarOpen || Boolean(modalMode) || Boolean(deleteTarget));

  useEffect(() => {
    if (!modalMode) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setModalMode(null);
        setDraft(null);
        setFormErrors({});
        setDeleteTarget(null);
      }
    };

    window.addEventListener("keydown", onEscape);

    return () => {
      window.removeEventListener("keydown", onEscape);
    };
  }, [modalMode]);

  useEffect(() => {
    if (!deleteTarget) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDeleteTarget(null);
      }
    };

    window.addEventListener("keydown", onEscape);

    return () => {
      window.removeEventListener("keydown", onEscape);
    };
  }, [deleteTarget]);

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setNotice(null);
    }, 3500);

    return () => window.clearTimeout(timeout);
  }, [notice]);

  useEffect(() => {
    if (!modalMode) {
      return;
    }

    window.setTimeout(() => {
      nameInputRef.current?.focus();
    }, 50);
  }, [modalMode]);

  const categoryOptions = useMemo(() => {
    const knownCategories = categories.map((category) => category.name);
    const uniqueCategories = Array.from(
      new Set(products.map((product) => product.category).concat(knownCategories))
    );

    return uniqueCategories;
  }, [products]);

  const brandOptions = useMemo(() => {
    const knownBrands = brands.map((brand) => brand.name);
    const uniqueBrands = Array.from(new Set(products.map((product) => product.brand).concat(knownBrands)));

    return uniqueBrands;
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesQuery =
        !query ||
        [
          product.name,
          product.sku,
          product.brand,
          product.category,
          product.shortDescription,
          product.description
        ].some((value) => value.toLowerCase().includes(query));

      const matchesCategory =
        filters.category === "all" || product.category === filters.category;
      const matchesBrand = filters.brand === "all" || product.brand === filters.brand;

      const matchesStatus =
        filters.status === "all" ||
        (filters.status === "active" && product.active) ||
        (filters.status === "inactive" && !product.active) ||
        (filters.status === "low-stock" && product.stock <= 8) ||
        (filters.status === "discounted" && product.discounted) ||
        (filters.status === "hidden-price" && !product.showPrice);

      return matchesQuery && matchesCategory && matchesBrand && matchesStatus;
    });
  }, [filters, products]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  const activePage = Math.min(currentPage, pageCount);
  const visibleProducts = filteredProducts.slice(
    (activePage - 1) * productsPerPage,
    activePage * productsPerPage
  );
  const firstVisibleResult = filteredProducts.length
    ? (activePage - 1) * productsPerPage + 1
    : 0;
  const lastVisibleResult = Math.min(activePage * productsPerPage, filteredProducts.length);

  const updateFilters = (nextFilters: Partial<ProductFilters>) => {
    setFilters((current) => ({ ...current, ...nextFilters }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "all",
      brand: "all",
      status: "all"
    });
    setCurrentPage(1);
  };

  const openCreateModal = () => {
    setModalMode({ type: "create", id: null });
    setDraft(getInitialForm());
    setFormErrors({});
  };

  const openEditModal = (product: AdminProduct) => {
    setModalMode({ type: "edit", id: product.id });
    setDraft(getInitialForm(product));
    setFormErrors({});
  };

  const closeModal = () => {
    setModalMode(null);
    setDraft(null);
    setFormErrors({});
  };

  const handleSave = () => {
    if (!draft) {
      return;
    }

    const existingProduct =
      modalMode?.type === "edit"
        ? products.find((product) => product.id === modalMode.id)
        : undefined;

    const result = buildProductFromForm(draft, existingProduct);

    if (Object.keys(result.errors).length) {
      setFormErrors(result.errors);
      return;
    }

    setFormErrors({});

    const updatedProduct = result.product;

    if (!updatedProduct) {
      return;
    }

    setProducts((currentProducts) => {
      if (modalMode?.type === "edit") {
        return currentProducts.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        );
      }

      return [updatedProduct, ...currentProducts];
    });

    setNotice({
      title: modalMode?.type === "edit" ? "პროდუქტი განახლდა" : "პროდუქტი დაემატა",
      text:
        modalMode?.type === "edit"
          ? "მოკვლევა დასრულდა და ცვლილებები დროებით ადგილობრივ state-ში შეინახა."
          : "ახალი პროდუქტი დამატებულია და ცხრილში მაშინვე გამოჩნდა.",
      tone: "success"
    });

    closeModal();
  };

  const handleDelete = () => {
    if (!deleteTarget) {
      return;
    }

    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== deleteTarget.id)
    );
    setNotice({
      title: "პროდუქტი წაიშალა",
      text: `${deleteTarget.name} დროებითი mock სიიდან ამოიშალა.`,
      tone: "danger"
    });
    setDeleteTarget(null);
  };

  const toggleActive = (id: string) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === id ? { ...product, active: !product.active } : product
      )
    );
    setNotice({
      title: "სტატუსი განახლდა",
      text: "აქტიური / გამორთული სტატუსი წარმატებით შეიცვალა.",
      tone: "info"
    });
  };

  const togglePriceVisibility = (id: string) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === id ? { ...product, showPrice: !product.showPrice } : product
      )
    );
    setNotice({
      title: "ფასის ჩვენება შეიცვალა",
      text: "ფასი ახლა ამ პროდუქტისთვის დროებით სხვანაირად გამოჩნდება ცხრილში.",
      tone: "info"
    });
  };

  const showUploadPlaceholder = () => {
    setNotice({
      title: "ატვირთვა მომავალ ფაზაში",
      text: "Cloudinary ინტეგრაცია მოგვიანებით დაემატება. ამჟამად შეგიძლიათ მხოლოდ image URL გამოიყენოთ.",
      tone: "info"
    });
  };

  const resetFormValue = (
    field: keyof ProductFormState,
    value: ProductFormState[keyof ProductFormState]
  ) => {
    setDraft((currentDraft) => {
      if (!currentDraft) {
        return currentDraft;
      }

      return {
        ...currentDraft,
        [field]: value
      } as ProductFormState;
    });
  };

  const title = modalMode?.type === "edit" ? "პროდუქტის რედაქტირება" : "ახალი პროდუქტის დამატება";

  return (
    <div className="min-h-screen bg-[#F3F6F9]">
      <DesktopSidebar />

      {mobileSidebarOpen ? (
        <MobileSidebar onClose={() => setMobileSidebarOpen(false)} />
      ) : null}

      <div className="min-w-0 lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-[#E5EAF0] bg-white/95 backdrop-blur">
          <div className="flex h-[72px] items-center gap-3 px-4 lg:px-7">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="focus-ring grid size-11 shrink-0 place-items-center rounded-md border border-[#E5EAF0] text-[#072B4D] transition hover:border-[#F58220] hover:text-[#F58220] lg:hidden"
              aria-label="ადმინისტრაციის მენიუს გახსნა"
            >
              <Menu className="size-5" />
            </button>

            <div className="relative hidden w-full max-w-xl sm:block lg:ml-2">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8A95A8]" />
              <input
                type="search"
                value={filters.search}
                onChange={(event) =>
                  updateFilters({ search: event.target.value })
                }
                placeholder="პროდუქტის სწრაფი ძიება..."
                aria-label="პროდუქტის სწრაფი ძიება"
                className="focus-ring h-11 w-full rounded-md border border-[#DDE4EC] bg-[#F9FAFC] pl-11 pr-4 text-sm text-[#102033] placeholder:text-[#8A95A8]"
              />
            </div>

            <button
              type="button"
              aria-label="შეტყობინებები"
              className="focus-ring relative ml-auto grid size-11 shrink-0 place-items-center rounded-md border border-[#DDE4EC] text-[#072B4D] transition hover:border-[#F58220]"
            >
              <Bell className="size-5" />
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-[#F58220] text-[10px] font-black text-white ring-2 ring-white">3</span>
            </button>
            <HeaderUserMenu onOpenWishlist={() => undefined} />
          </div>
        </header>

        <main className="px-4 py-6 lg:px-6 lg:py-8">
          <div className="mx-auto max-w-[1600px] space-y-6">
            {notice ? (
              <NoticeBanner
                title={notice.title}
                text={notice.text}
                tone={notice.tone}
                onClose={() => setNotice(null)}
              />
            ) : null}

            <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#6B7280]">მთავარი / პროდუქტები</p>
                <h1 className="mt-3 text-2xl font-semibold text-[#0D1B2A] sm:text-3xl">
                  პროდუქტების მართვა
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">
                  შექმენი, დაარედაქტირე და მართე პროდუქტები
                </p>
              </div>
              <button
                type="button"
                onClick={openCreateModal}
                className="focus-ring inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-[#F58220] px-4 text-sm font-bold text-white transition hover:bg-[#E77514]"
              >
                <BadgePlus className="size-4" />
                პროდუქტის დამატება
              </button>
            </section>

            <section className="rounded-lg border border-[#E5EAF0] bg-white shadow-sm">
              <div className="grid gap-3 p-4 xl:grid-cols-[minmax(220px,1.35fr)_repeat(3,minmax(150px,0.8fr))_auto]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8A95A8]" />
                  <input
                    type="search"
                    value={filters.search}
                    onChange={(event) =>
                      updateFilters({ search: event.target.value })
                    }
                    placeholder="პროდუქტი, SKU, ბრენდი, კატეგორია"
                    className="focus-ring h-11 w-full rounded-md border border-[#DDE4EC] bg-white pl-11 pr-4 text-sm font-medium text-[#102033] placeholder:text-[#8A95A8]"
                    aria-label="პროდუქტების ძიება"
                  />
                </div>

                <SelectField
                  value={filters.category}
                  onChange={(event) =>
                    updateFilters({ category: event.target.value })
                  }
                  options={[
                    { value: "all", label: "ყველა კატეგორია" },
                    ...categoryOptions.map((category) => ({ value: category, label: category }))
                  ]}
                />

                <SelectField
                  value={filters.brand}
                  onChange={(event) =>
                    updateFilters({ brand: event.target.value })
                  }
                  options={[
                    { value: "all", label: "ყველა ბრენდი" },
                    ...brandOptions.map((brand) => ({ value: brand, label: brand }))
                  ]}
                />

                <SelectField
                  value={filters.status}
                  onChange={(event) =>
                    updateFilters({ status: event.target.value as ProductFilters["status"] })
                  }
                  options={statusOptions}
                />
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#072B4D] px-4 text-sm font-bold text-white transition hover:bg-[#0B3A68]"
                >
                  <SlidersHorizontal className="size-4" />
                  ფილტრი
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-[#E5EAF0] px-4 py-3">
                <p className="text-sm font-bold text-[#041C32]">
                  ნაპოვნია {filteredProducts.length} პროდუქტი
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="focus-ring ml-auto inline-flex h-9 items-center rounded-md border border-[#E5EAF0] px-3 text-xs font-bold text-[#072B4D] transition hover:border-[#F58220] hover:text-[#F58220]"
                >
                  ფილტრების გასუფთავება
                </button>
              </div>
            </section>

            <section className="overflow-hidden rounded-lg border border-[#E5EAF0] bg-white shadow-sm">
              {filteredProducts.length ? (
                <>
                  <div className="hidden overflow-x-auto xl:block">
                    <table className="w-full min-w-[1180px] border-collapse text-left">
                      <thead>
                        <tr className="border-b border-[#E5EAF0] bg-[#F7F9FC] text-xs font-black uppercase tracking-[0.08em] text-[#6B7280]">
                          <th className="px-5 py-3">Image</th>
                          <th className="px-5 py-3">Name</th>
                          <th className="px-5 py-3">SKU</th>
                          <th className="px-5 py-3">Brand</th>
                          <th className="px-5 py-3">Category</th>
                          <th className="px-5 py-3">Price</th>
                          <th className="px-5 py-3">Stock</th>
                          <th className="px-5 py-3">Status</th>
                          <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleProducts.map((product) => (
                          <tr
                            key={product.id}
                            className="border-b border-[#EEF1F4] align-top text-sm last:border-b-0 hover:bg-[#FBFCFD]"
                          >
                            <td className="px-5 py-4">
                              <ProductThumb product={product} />
                            </td>
                            <td className="px-5 py-4">
                              <div className="min-w-0 space-y-2">
                                <p className="font-black text-[#041C32]">{product.name}</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {product.featured ? <Badge label="რჩეული" tone="blue" /> : null}
                                  {product.discounted ? (
                                    <Badge label={`-${product.discountPercent}%`} tone="orange" />
                                  ) : null}
                                  {!product.showPrice ? <Badge label="ფასი დამალულია" tone="slate" /> : null}
                                </div>
                                <p className="text-xs leading-5 text-[#6B7280]">
                                  {product.shortDescription || product.description.slice(0, 90)}
                                </p>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className="font-bold text-[#102033]">{product.sku}</span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="font-bold text-[#102033]">{product.brand}</span>
                            </td>
                            <td className="px-5 py-4">
                              <span className="font-bold text-[#102033]">{product.category}</span>
                            </td>
                            <td className="px-5 py-4">
                              {product.showPrice ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-black text-[#041C32]">
                                      {formatPrice(product.price)}
                                    </p>
                                    <button
                                      type="button"
                                      onClick={() => togglePriceVisibility(product.id)}
                                      aria-label="ფასის დამალვა"
                                      title="ფასის დამალვა"
                                      className="focus-ring grid size-7 shrink-0 place-items-center rounded text-[#8A95A8] transition hover:bg-[#F7F9FC] hover:text-[#F58220]"
                                    >
                                      <EyeOff className="size-3.5" />
                                    </button>
                                  </div>
                                  {product.oldPrice ? (
                                    <p className="text-xs font-semibold text-[#8A95A8] line-through">
                                      {formatPrice(product.oldPrice)}
                                    </p>
                                  ) : null}
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => togglePriceVisibility(product.id)}
                                  className="focus-ring inline-flex items-center gap-1.5 rounded text-sm font-bold text-[#8A95A8] transition hover:text-[#F58220]"
                                >
                                  <Eye className="size-3.5" /> დამალულია
                                </button>
                              )}
                            </td>
                            <td className="px-5 py-4">
                              <div className="space-y-1">
                                <p className="font-black text-[#041C32]">
                                  {product.stock} {product.unit}
                                </p>
                                {product.stock <= 8 ? (
                                  <p className="text-xs font-semibold text-[#B95D14]">
                                    დაბალი მარაგი
                                  </p>
                                ) : null}
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <button type="button" onClick={() => toggleActive(product.id)} title="სტატუსის შეცვლა" className="focus-ring rounded-full">
                                <StatusBadge product={product} />
                              </button>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex flex-wrap justify-end gap-2">
                                <Link
                                  href={`/products/${product.slug}`}
                                  aria-label="პროდუქტის ნახვა"
                                  title="პროდუქტის ნახვა"
                                  className="focus-ring grid size-9 place-items-center rounded-md border border-[#DDE6F2] bg-white text-[#072B4D] transition hover:border-[#F58220] hover:text-[#F58220]"
                                >
                                  <Eye className="size-4" />
                                </Link>
                                <IconActionButton
                                  label="რედაქტირება"
                                  icon={<Pencil className="size-4" />}
                                  onClick={() => openEditModal(product)}
                                  tone="blue"
                                />
                                <IconActionButton
                                  label="წაშლა"
                                  icon={<Trash2 className="size-4" />}
                                  onClick={() => setDeleteTarget(product)}
                                  tone="danger"
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid gap-3 p-3 xl:hidden sm:grid-cols-2">
                    {visibleProducts.map((product) => (
                      <article
                        key={product.id}
                        className="rounded-xl border border-[#E5EAF0] p-4 transition hover:border-[#F58220] hover:bg-[#FFFDFB]"
                      >
                        <div className="flex items-start gap-4">
                          <ProductThumb product={product} />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm font-black text-[#041C32]">
                                  {product.name}
                                </p>
                                <p className="mt-1 text-xs font-semibold text-[#6B7280]">
                                  {product.sku} · {product.brand}
                                </p>
                              </div>
                              <button type="button" onClick={() => toggleActive(product.id)} title="სტატუსის შეცვლა" className="focus-ring rounded-full">
                                <StatusBadge product={product} />
                              </button>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {product.featured ? <Badge label="რჩეული" tone="blue" /> : null}
                              {product.discounted ? (
                                <Badge label={`-${product.discountPercent}%`} tone="orange" />
                              ) : null}
                              {!product.showPrice ? <Badge label="ფასი დამალულია" tone="slate" /> : null}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                          <div className="rounded-lg bg-[#F7F9FC] p-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
                              ფასი
                            </p>
                            {product.showPrice ? (
                              <div className="mt-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-base font-black text-[#041C32]">
                                    {formatPrice(product.price)}
                                  </p>
                                  <button type="button" onClick={() => togglePriceVisibility(product.id)} aria-label="ფასის დამალვა" className="focus-ring grid size-8 place-items-center rounded text-[#8A95A8] hover:text-[#F58220]"><EyeOff className="size-4" /></button>
                                </div>
                                {product.oldPrice ? (
                                  <p className="text-xs font-semibold text-[#8A95A8] line-through">
                                    {formatPrice(product.oldPrice)}
                                  </p>
                                ) : null}
                              </div>
                            ) : (
                              <button type="button" onClick={() => togglePriceVisibility(product.id)} className="focus-ring mt-1 inline-flex items-center gap-1.5 rounded text-sm font-bold text-[#8A95A8] hover:text-[#F58220]"><Eye className="size-4" /> დამალულია</button>
                            )}
                          </div>

                          <div className="rounded-lg bg-[#F7F9FC] p-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
                              მარაგი
                            </p>
                            <p className="mt-1 text-base font-black text-[#041C32]">
                              {product.stock} {product.unit}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <Link
                            href={`/products/${product.slug}`}
                            aria-label="პროდუქტის ნახვა"
                            title="პროდუქტის ნახვა"
                            className="focus-ring grid size-9 place-items-center rounded-md border border-[#DDE6F2] bg-white text-[#072B4D] transition hover:border-[#F58220] hover:text-[#F58220]"
                          >
                            <Eye className="size-4" />
                          </Link>
                          <IconActionButton
                            label="რედაქტირება"
                            icon={<Pencil className="size-4" />}
                            onClick={() => openEditModal(product)}
                            tone="blue"
                          />
                          <IconActionButton
                            label="წაშლა"
                            icon={<Trash2 className="size-4" />}
                            onClick={() => setDeleteTarget(product)}
                            tone="danger"
                          />
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              ) : (
                <div className="px-5 py-14 text-center">
                  <Search className="mx-auto size-10 text-[#F58220]" />
                  <h3 className="mt-4 text-lg font-black text-[#041C32]">
                    პროდუქტი ვერ მოიძებნა
                  </h3>
                  <p className="mt-2 text-sm text-[#6B7280]">
                    სცადეთ სხვა სიტყვით ძიება ან გაასუფთავეთ ფილტრები.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="focus-ring mt-4 inline-flex h-10 items-center rounded-md bg-[#F58220] px-4 text-xs font-black text-white transition hover:bg-[#E77514]"
                  >
                    ფილტრების გასუფთავება
                  </button>
                </div>
              )}

              {filteredProducts.length ? (
                <div className="flex flex-col gap-3 border-t border-[#E5EAF0] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs font-medium text-[#6B7280] sm:text-sm">
                    ნაჩვენებია {firstVisibleResult} - {lastVisibleResult} / {filteredProducts.length} შედეგი
                  </p>
                  <div className="flex items-center gap-1 overflow-x-auto" aria-label="პროდუქტების გვერდები">
                    <button
                      type="button"
                      disabled={activePage === 1}
                      onClick={() => setCurrentPage(activePage - 1)}
                      aria-label="წინა გვერდი"
                      className="focus-ring grid size-9 shrink-0 place-items-center rounded-md border border-[#DDE4EC] text-[#072B4D] transition hover:border-[#F58220] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
                      <button
                        type="button"
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        aria-current={activePage === page ? "page" : undefined}
                        className={[
                          "focus-ring grid size-9 shrink-0 place-items-center rounded-md border text-xs font-bold transition",
                          activePage === page
                            ? "border-[#072B4D] bg-[#072B4D] text-white"
                            : "border-[#DDE4EC] text-[#072B4D] hover:border-[#F58220]"
                        ].join(" ")}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={activePage === pageCount}
                      onClick={() => setCurrentPage(activePage + 1)}
                      aria-label="შემდეგი გვერდი"
                      className="focus-ring grid size-9 shrink-0 place-items-center rounded-md border border-[#DDE4EC] text-[#072B4D] transition hover:border-[#F58220] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                </div>
              ) : null}
            </section>
          </div>
        </main>
      </div>

      {modalMode && draft ? (
        <ProductModal
          title={title}
          mode={modalMode.type}
          draft={draft}
          errors={formErrors}
          brandOptions={brandOptions}
          categoryOptions={categoryOptions}
          onClose={closeModal}
          onSave={handleSave}
          onUploadClick={showUploadPlaceholder}
          onChange={resetFormValue}
          nameInputRef={nameInputRef}
        />
      ) : null}

      {deleteTarget ? (
        <DeleteDialog
          product={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      ) : null}
    </div>
  );
}

function DesktopSidebar() {
  const { data: session } = useSession();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-white/10 bg-[#041C32] text-white lg:flex">
      <div className="border-b border-white/10 px-5 py-4">
        <Link href="/" className="focus-ring inline-flex rounded-md">
          <Logo compact inverted />
        </Link>
        <p className="mt-2 text-xs text-white/55">Admin control panel</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="ადმინისტრაციის ნავიგაცია">
        <div className="grid gap-1">
          {adminNavigationItems.map((item) => (
            <SidebarItemRow key={item.href} item={item} />
          ))}
        </div>
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#0B3A68] text-sm font-black text-white">
            {(session?.user?.name ?? "Admin").slice(0, 1).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-bold text-white">
              {session?.user?.name ?? "Admin User"}
            </span>
            <span className="block truncate text-xs text-white/50">
              {session?.user?.email ?? "admin@toolmarket.ge"}
            </span>
          </span>
        </div>
        <Link
          href="/"
          className="focus-ring flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm font-bold text-white/80 transition hover:border-[#F58220] hover:text-white"
        >
          <ArrowUpRight className="size-5 text-[#F58220]" />
          მაღაზიაზე დაბრუნება
          <ArrowUpRight className="ml-auto size-4" />
        </Link>
      </div>
    </aside>
  );
}

function MobileSidebar({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="მენიუს დახურვა"
        onClick={onClose}
        className="absolute inset-0 bg-[#041C32]/45 backdrop-blur-sm"
      />
      <aside className="absolute inset-y-0 left-0 flex w-[min(320px,88vw)] flex-col bg-[#041C32] text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
          <Link href="/" className="focus-ring inline-flex rounded-md" onClick={onClose}>
            <Logo compact inverted />
          </Link>
          <button
            type="button"
            aria-label="მენიუს დახურვა"
            onClick={onClose}
            className="focus-ring grid size-10 place-items-center rounded-md border border-white/12 text-white"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="მობილური ნავიგაცია">
          <div className="grid gap-1">
            {adminNavigationItems.map((item) => (
              <SidebarItemRow key={item.href} item={item} />
            ))}
          </div>
        </nav>
      </aside>
    </div>
  );
}

function SidebarItemRow({ item }: { item: AdminNavigationItem }) {
  const Icon = item.icon;
  const active = item.href === "/admin/products";

  return (
    <Link
      href={item.href}
      className={[
        "focus-ring flex min-h-11 items-center gap-3 rounded-md px-3 py-2 text-sm font-bold transition",
        active
          ? "bg-[#174B78] text-white shadow-[inset_3px_0_0_#F58220]"
          : "text-white/68 hover:bg-white/8 hover:text-white"
      ].join(" ")}
    >
      <Icon className={["size-4.5 shrink-0", active ? "text-[#F58220]" : "text-white/48"].join(" ")} />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

function Badge({
  label,
  tone
}: {
  label: string;
  tone: "blue" | "orange" | "slate";
}) {
  const styles: Record<typeof tone, string> = {
    blue: "border-[#DDE6F2] bg-[#F5F9FD] text-[#072B4D]",
    orange: "border-[#F7CFA7] bg-[#FFF4EA] text-[#B95D14]",
    slate: "border-[#E5EAF0] bg-[#F7F9FC] text-[#6B7280]"
  };

  return (
    <span className={["inline-flex rounded-full border px-2.5 py-1 text-[11px] font-black", styles[tone]].join(" ")}>
      {label}
    </span>
  );
}

function StatusBadge({ product }: { product: AdminProduct }) {
  const tone = getStatusTone(product);
  const styles: Record<typeof tone, string> = {
    success: "bg-[#EAF8EF] text-[#176B45]",
    warning: "bg-[#FFF7EF] text-[#B95D14]",
    danger: "bg-[#FFF1F1] text-[#C5221F]",
    neutral: "bg-[#F7F9FC] text-[#6B7280]"
  };

  return (
    <span className={["inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-black", styles[tone]].join(" ")}>
      {getStatusLabel(product)}
    </span>
  );
}

function ProductThumb({ product }: { product: AdminProduct }) {
  return (
    <div className="relative size-16 overflow-hidden rounded-xl border border-[#E5EAF0] bg-[#F7F9FC]">
      {product.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <Box className="size-6 text-[#8A95A8]" />
        </div>
      )}
    </div>
  );
}

function IconActionButton({
  label,
  icon,
  onClick,
  tone
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  tone: "blue" | "success" | "slate" | "danger";
}) {
  const styles: Record<typeof tone, string> = {
    blue: "border-[#DDE6F2] text-[#072B4D] hover:border-[#F58220] hover:text-[#F58220]",
    success: "border-[#CBE8D5] text-[#176B45] hover:border-[#F58220] hover:text-[#F58220]",
    slate: "border-[#E5EAF0] text-[#072B4D] hover:border-[#F58220] hover:text-[#F58220]",
    danger: "border-[#F7CFCF] text-[#C5221F] hover:border-[#C5221F] hover:bg-[#FFF5F5]"
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "focus-ring grid size-9 place-items-center rounded-md border bg-white transition",
        styles[tone]
      ].join(" ")}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}

function NoticeBanner({
  title,
  text,
  tone,
  onClose
}: {
  title: string;
  text: string;
  tone: NoticeTone;
  onClose: () => void;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        "flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-sm",
        toastToneStyles[tone]
      ].join(" ")}
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/70">
        <ArrowUpRight className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-black">{title}</p>
        <p className="mt-1 text-sm leading-6">{text}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="focus-ring ml-auto grid size-8 shrink-0 place-items-center rounded-md transition hover:bg-white/70"
        aria-label="შეტყობინების დახურვა"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options
}: {
  label?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{ value: string; label: string }>;
}) {
  const select = (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="focus-ring h-11 w-full appearance-none rounded-md border border-[#DDE4EC] bg-white px-4 pr-10 text-sm font-medium text-[#102033]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ArrowUpRight className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 rotate-90 text-[#8A95A8]" />
    </div>
  );

  if (!label) {
    return select;
  }

  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-[#102033]">{label}</label>
      {select}
    </div>
  );
}

function ProductModal({
  title,
  mode,
  draft,
  errors,
  brandOptions,
  categoryOptions,
  onClose,
  onSave,
  onUploadClick,
  onChange,
  nameInputRef
}: {
  title: string;
  mode: "create" | "edit";
  draft: ProductFormState;
  errors: Record<string, string>;
  brandOptions: string[];
  categoryOptions: string[];
  onClose: () => void;
  onSave: () => void;
  onUploadClick: () => void;
  onChange: (field: keyof ProductFormState, value: ProductFormState[keyof ProductFormState]) => void;
  nameInputRef: RefObject<HTMLInputElement | null>;
}) {
  const imagePreview = draft.imageUrl.trim();

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#041C32]/45 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-[#E5EAF0] bg-white shadow-[0_24px_90px_rgba(4,28,50,0.22)]">
        <div className="flex items-center justify-between border-b border-[#E5EAF0] px-5 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#F58220]">
              {mode === "edit" ? "Edit mode" : "Create mode"}
            </p>
            <h3 className="mt-1 text-xl font-black text-[#041C32]">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="focus-ring grid size-10 place-items-center rounded-md border border-[#E5EAF0] text-[#072B4D] transition hover:border-[#F58220] hover:text-[#F58220]"
            aria-label="ფორმის დახურვა"
          >
            <X className="size-5" />
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSave();
          }}
          className="grid max-h-[calc(90vh-72px)] gap-6 overflow-y-auto p-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.45fr)]"
        >
          <div className="space-y-5">
            <section className="grid gap-4 rounded-2xl border border-[#E5EAF0] bg-[#FBFCFD] p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="პროდუქტის სახელი"
                  error={errors.name}
                  inputRef={nameInputRef}
                  value={draft.name}
                  onChange={(event) => onChange("name", event.target.value)}
                  placeholder="INGCO აკუმულატორული დრელი 20V"
                />
                <FormField
                  label="SKU / კოდი"
                  error={errors.sku}
                  value={draft.sku}
                  onChange={(event) => onChange("sku", event.target.value)}
                  placeholder="TM-ING-CD20V-001"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#102033]">ბრენდი</label>
                  <select
                    value={draft.brand}
                    onChange={(event) => onChange("brand", event.target.value)}
                    className="focus-ring h-12 w-full rounded-md border border-[#DDE4EC] bg-white px-4 text-sm font-medium text-[#102033]"
                  >
                    <option value="">აირჩიეთ ბრენდი</option>
                    {brandOptions.map((brand) => (
                      <option key={brand} value={brand}>
                        {brand}
                      </option>
                    ))}
                  </select>
                  {errors.brand ? <FieldError message={errors.brand} /> : null}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-bold text-[#102033]">კატეგორია</label>
                  <select
                    value={draft.category}
                    onChange={(event) => onChange("category", event.target.value)}
                    className="focus-ring h-12 w-full rounded-md border border-[#DDE4EC] bg-white px-4 text-sm font-medium text-[#102033]"
                  >
                    <option value="">აირჩიეთ კატეგორია</option>
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category ? <FieldError message={errors.category} /> : null}
                </div>

                <SelectField
                  label="ერთეული"
                  value={draft.unit}
                  onChange={(event) => onChange("unit", event.target.value)}
                  options={unitOptions.map((unit) => ({ value: unit, label: unit }))}
                />
              </div>
            </section>

            <section className="grid gap-4 rounded-2xl border border-[#E5EAF0] bg-[#FBFCFD] p-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  label="ფასი"
                  error={errors.price}
                  value={draft.price}
                  onChange={(event) => onChange("price", event.target.value)}
                  placeholder="189.00"
                  inputMode="decimal"
                />
                <FormField
                  label="ძველი ფასი"
                  error={errors.oldPrice}
                  value={draft.oldPrice}
                  onChange={(event) => onChange("oldPrice", event.target.value)}
                  placeholder="239.00"
                  inputMode="decimal"
                />
                <FormField
                  label="ფასდაკლება %"
                  error={errors.discountPercent}
                  value={draft.discountPercent}
                  onChange={(event) => onChange("discountPercent", event.target.value)}
                  placeholder="21"
                  inputMode="decimal"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  label="მარაგი"
                  error={errors.stock}
                  value={draft.stock}
                  onChange={(event) => onChange("stock", event.target.value)}
                  placeholder="18"
                  inputMode="numeric"
                />
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-bold text-[#102033]">სურათის URL</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={draft.imageUrl}
                      onChange={(event) => onChange("imageUrl", event.target.value)}
                      placeholder="https://picsum.photos/seed/..."
                      className="focus-ring h-12 min-w-0 flex-1 rounded-md border border-[#DDE4EC] bg-white px-4 text-sm font-medium text-[#102033]"
                    />
                    <button
                      type="button"
                      onClick={onUploadClick}
                      className="focus-ring inline-flex h-12 shrink-0 items-center gap-2 rounded-md border border-[#DDE4EC] bg-[#F7F9FC] px-3 text-xs font-black text-[#072B4D] transition hover:border-[#F58220] hover:text-[#F58220]"
                    >
                      <CloudUpload className="size-4" />
                      ატვირთვა
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <ToggleChip
                  label={draft.active ? "აქტიური" : "გამორთული"}
                  checked={draft.active}
                  onClick={() => onChange("active", !draft.active)}
                />
                <ToggleChip
                  label={draft.featured ? "რჩეული პროდუქტი" : "რჩეულში დამატება"}
                  checked={draft.featured}
                  onClick={() => onChange("featured", !draft.featured)}
                />
                <ToggleChip
                  label={draft.discounted ? "ფასდაკლებული" : "ფასდაკლება გამორთულია"}
                  checked={draft.discounted}
                  onClick={() => onChange("discounted", !draft.discounted)}
                />
                <ToggleChip
                  label={draft.showPrice ? "ფასი გამოჩნდება" : "ფასი დამალულია"}
                  checked={draft.showPrice}
                  onClick={() => onChange("showPrice", !draft.showPrice)}
                />
              </div>
            </section>

            <section className="grid gap-4 rounded-2xl border border-[#E5EAF0] bg-[#FBFCFD] p-4">
              <div className="grid gap-4">
                <FormField
                  label="მოკლე აღწერა"
                  value={draft.shortDescription}
                  onChange={(event) => onChange("shortDescription", event.target.value)}
                  placeholder="მოკლე აღწერა..."
                />
                <TextareaField
                  label="სრული აღწერა"
                  value={draft.description}
                  onChange={(event) => onChange("description", event.target.value)}
                  placeholder="სრული აღწერა..."
                  rows={5}
                />
                <TextareaField
                  label="სპეციფიკაციები"
                  value={draft.specifications}
                  onChange={(event) => onChange("specifications", event.target.value)}
                  placeholder={"ბრენდი: INGCO\nმოდელი: CDLI2003\nსრული ძაბვა: 20V"}
                  rows={6}
                />
              </div>
            </section>
          </div>

          <div className="space-y-4">
            <section className="rounded-2xl border border-[#E5EAF0] bg-[#FBFCFD] p-4">
              <p className="text-sm font-black text-[#041C32]">სურათის პრევიუ</p>
              <div className="mt-3 overflow-hidden rounded-xl border border-[#E5EAF0] bg-white">
                <div className="relative aspect-square bg-[#F7F9FC]">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt={draft.name || "პროდუქტის პრევიუ"}
                      fill
                      sizes="(max-width: 1024px) 100vw, 320px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-[#8A95A8]">
                      <Box className="size-8" />
                      <p className="text-xs font-semibold">სურათის პრევიუ აქ გამოჩნდება</p>
                    </div>
                  )}
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-[#6B7280]">
                ატვირთვა ჯერ Cloudinary-ზე არ არის დაკავშირებული. გამოიყენეთ image URL ან დააჭირეთ
                ატვირთვის ღილაკს ინფო შეტყობინებისთვის.
              </p>
            </section>

            <section className="rounded-2xl border border-[#E5EAF0] bg-[#FBFCFD] p-4">
              <p className="text-sm font-black text-[#041C32]">მზადებული ქმედება</p>
              <div className="mt-3 space-y-2 text-sm text-[#6B7280]">
                <p>• პროდუქტი უნდა იყოს უსაფრთხოდ შესაცვლელი, წასაშლელი და დასამატებელი.</p>
                <p>• გამონათქვამები და შეცდომები ჩანს ქართულად.</p>
                <p>• ყველა ცვლილება ამ სესიის განმავლობაში ადგილობრივ state-ში ინახება.</p>
              </div>
            </section>

            <section className="rounded-2xl border border-[#E5EAF0] bg-[#FBFCFD] p-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="focus-ring inline-flex h-11 items-center justify-center rounded-md border border-[#DDE4EC] px-4 text-sm font-black text-[#072B4D] transition hover:border-[#F58220] hover:text-[#F58220]"
                >
                  გაუქმება
                </button>
                <button
                  type="submit"
                  className="focus-ring inline-flex h-11 items-center justify-center rounded-md bg-[#F58220] px-4 text-sm font-black text-white transition hover:bg-[#E77514]"
                >
                  შენახვა
                </button>
              </div>
            </section>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({
  label,
  error,
  inputRef,
  ...props
}: {
  label: string;
  error?: string;
  inputRef?: RefObject<HTMLInputElement | null>;
} & Omit<ComponentProps<"input">, "className">) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-[#102033]">{label}</label>
      <input
        ref={inputRef}
        className="focus-ring h-12 w-full rounded-md border border-[#DDE4EC] bg-white px-4 text-sm font-medium text-[#102033] placeholder:text-[#8A95A8]"
        {...props}
      />
      {error ? <FieldError message={error} /> : null}
    </div>
  );
}

function TextareaField({
  label,
  ...props
}: {
  label: string;
} & Omit<ComponentProps<"textarea">, "className">) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-[#102033]">{label}</label>
      <textarea
        className="focus-ring w-full rounded-md border border-[#DDE4EC] bg-white px-4 py-3 text-sm font-medium text-[#102033] placeholder:text-[#8A95A8]"
        {...props}
      />
    </div>
  );
}

function FieldError({ message }: { message: string }) {
  return <p className="mt-1.5 text-xs font-semibold text-[#C5221F]">{message}</p>;
}

function ToggleChip({
  label,
  checked,
  onClick
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "focus-ring inline-flex h-11 items-center justify-center rounded-md border px-3 text-xs font-black transition",
        checked
          ? "border-[#F7CFA7] bg-[#FFF4EA] text-[#B95D14]"
          : "border-[#DDE4EC] bg-white text-[#072B4D] hover:border-[#F58220] hover:text-[#F58220]"
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function DeleteDialog({
  product,
  onCancel,
  onConfirm
}: {
  product: AdminProduct;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#041C32]/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[#E5EAF0] bg-white p-5 shadow-[0_24px_90px_rgba(4,28,50,0.22)]">
        <div className="flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#FFF1F1] text-[#C5221F]">
            <Trash2 className="size-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-black text-[#041C32]">პროდუქტის წაშლა</h3>
            <p className="mt-1 text-sm leading-6 text-[#6B7280]">
              ნამდვილად გსურთ <span className="font-bold text-[#102033]">{product.name}</span>-ის წაშლა?
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="focus-ring inline-flex h-11 flex-1 items-center justify-center rounded-md border border-[#DDE4EC] px-4 text-sm font-black text-[#072B4D] transition hover:border-[#F58220] hover:text-[#F58220]"
          >
            გაუქმება
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="focus-ring inline-flex h-11 flex-1 items-center justify-center rounded-md bg-[#C5221F] px-4 text-sm font-black text-white transition hover:bg-[#A81A18]"
          >
            წაშლა
          </button>
        </div>
      </div>
    </div>
  );
}
