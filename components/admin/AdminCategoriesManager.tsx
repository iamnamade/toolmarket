"use client";

import {
  FolderSearch2,
  FolderTree,
  PencilLine,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  categoryIconMap,
  categoryIconOptions,
  getCategoryIcon,
  isCategoryIconKey,
} from "@/lib/category-icons";

type CategoryNode = {
  createdAt: string;
  children: CategoryNode[];
  iconKey: string;
  id: string;
  isActive: boolean;
  name: string;
  parentId: string | null;
  slug: string;
  sortOrder: number;
  updatedAt: string;
};

type CategorySource = "database" | "fallback";

type CategoryEditorMode = "create-main" | "edit-main" | "create-child" | "edit-child";

type CategoryFormState = {
  iconKey: string;
  isActive: boolean;
  name: string;
  parentId: string | null;
  slug: string;
  sortOrder: number;
};

type CategoryFieldErrors = Partial<Record<keyof CategoryFormState, string>>;

type CategoryEditorState = {
  categoryId?: string;
  mode: CategoryEditorMode;
};

type DeleteDialogState = {
  category: CategoryNode;
  scope: "main" | "child";
};

type AdminCategoriesManagerProps = {
  initialCategories: CategoryNode[];
  initialError?: string | null;
  initialSource?: CategorySource;
  initialWarning?: string | null;
};

type ModalDialogProps = {
  allowBackdropClose?: boolean;
  allowEscapeClose?: boolean;
  children: ReactNode;
  childrenClassName?: string;
  closeDisabled?: boolean;
  description?: string;
  footer?: ReactNode;
  onClose?: () => void;
  open: boolean;
  role?: "alertdialog" | "dialog";
  size?: "lg" | "md";
  title: string;
};

const defaultFormState: CategoryFormState = {
  iconKey: "grid2x2",
  isActive: true,
  name: "",
  parentId: null,
  slug: "",
  sortOrder: 0,
};

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

let bodyLockCount = 0;
let previousBodyOverflow = "";
let previousBodyPaddingRight = "";

function lockBodyScroll() {
  if (typeof document === "undefined") {
    return () => undefined;
  }

  if (bodyLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    previousBodyPaddingRight = document.body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  bodyLockCount += 1;

  return () => {
    bodyLockCount = Math.max(0, bodyLockCount - 1);

    if (bodyLockCount === 0) {
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.paddingRight = previousBodyPaddingRight;
    }
  };
}

function getFocusableElements(container: HTMLElement | null) {
  if (!container) {
    return [];
  }

  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      !element.hasAttribute("disabled") &&
      element.getAttribute("aria-hidden") !== "true" &&
      element.getClientRects().length > 0
  );
}

function normalizeFormState(form: CategoryFormState) {
  return JSON.stringify({
    iconKey: form.iconKey,
    isActive: form.isActive,
    name: form.name,
    parentId: form.parentId,
    slug: form.slug,
    sortOrder: form.sortOrder,
  });
}

export function AdminCategoriesManager({
  initialCategories,
  initialError = null,
  initialSource = "database",
  initialWarning = null,
}: AdminCategoriesManagerProps) {
  const [categories, setCategories] = useState<CategoryNode[]>(initialCategories);
  const [query, setQuery] = useState("");
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<string | null>(
    initialCategories[0]?.id ?? null
  );
  const [editor, setEditor] = useState<CategoryEditorState | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState | null>(null);
  const [form, setForm] = useState<CategoryFormState>(defaultFormState);
  const [initialFormSnapshot, setInitialFormSnapshot] = useState<CategoryFormState>(defaultFormState);
  const [fieldErrors, setFieldErrors] = useState<CategoryFieldErrors>({});
  const [pageError, setPageError] = useState<string | null>(initialError);
  const [pageWarning, setPageWarning] = useState<string | null>(initialWarning);
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categorySource, setCategorySource] = useState<CategorySource>(initialSource);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("ka");

    if (!normalizedQuery) {
      return categories;
    }

    return categories.filter((category) => {
      const parentText = [category.name, category.slug, category.iconKey]
        .join(" ")
        .toLocaleLowerCase("ka");
      const childText = category.children
        .flatMap((child) => [child.name, child.slug, child.iconKey])
        .join(" ")
        .toLocaleLowerCase("ka");

      return parentText.includes(normalizedQuery) || childText.includes(normalizedQuery);
    });
  }, [categories, query]);

  const hasSearchQuery = query.trim().length > 0;
  const selectedMainCategory = hasSearchQuery
    ? filteredCategories.find((category) => category.id === selectedMainCategoryId) ??
      filteredCategories[0] ??
      null
    : filteredCategories.find((category) => category.id === selectedMainCategoryId) ??
      categories.find((category) => category.id === selectedMainCategoryId) ??
      filteredCategories[0] ??
      categories[0] ??
      null;
  const totalSubcategories = categories.reduce((total, category) => total + category.children.length, 0);
  const activeCount =
    categories.filter((category) => category.isActive).length +
    categories.reduce(
      (total, category) => total + category.children.filter((child) => child.isActive).length,
      0
    );
  const hasCategories = categories.length > 0;
  const usesFallbackSource = categorySource === "fallback";
  const isEditorDirty =
    editor !== null && normalizeFormState(form) !== normalizeFormState(initialFormSnapshot);

  async function fetchCategories(nextSelectedId?: string | null) {
    setIsLoading(true);
    setPageError(null);

    try {
      const response = await fetch("/api/admin/categories", {
        cache: "no-store",
      });
      const payload = (await response.json().catch(() => null)) as
        | {
            categories?: CategoryNode[];
            error?: string;
            source?: CategorySource;
            warning?: string | null;
          }
        | null;

      if (!response.ok || !payload?.categories) {
        setPageError(payload?.error ?? "კატეგორიების ჩატვირთვა ვერ მოხერხდა.");
        return;
      }

      const nextCategories = payload.categories;

      setCategories(nextCategories);
      setCategorySource(payload.source ?? "database");
      setPageWarning(payload.warning ?? null);
      setSelectedMainCategoryId((current) => {
        if (nextSelectedId !== undefined) {
          return nextSelectedId ?? nextCategories[0]?.id ?? null;
        }

        return nextCategories.find((category) => category.id === current)?.id ?? nextCategories[0]?.id ?? null;
      });
    } catch {
      setPageError("კატეგორიების ჩატვირთვა ვერ მოხერხდა.");
    } finally {
      setIsLoading(false);
    }
  }

  function openEditor(mode: CategoryEditorMode, category?: CategoryNode, parentId?: string | null) {
    const nextForm = category
      ? {
          iconKey: category.iconKey,
          isActive: category.isActive,
          name: category.name,
          parentId: category.parentId,
          slug: category.slug,
          sortOrder: category.sortOrder,
        }
      : {
          ...defaultFormState,
          iconKey: selectedMainCategory?.iconKey ?? defaultFormState.iconKey,
          parentId: parentId ?? null,
          sortOrder: parentId === null ? categories.length : selectedMainCategory?.children.length ?? 0,
        };

    setNotice(null);
    setPageError(null);
    setPageWarning(null);
    setFieldErrors({});
    setDeleteDialog(null);
    setShowDiscardDialog(false);
    setEditor({ categoryId: category?.id, mode });
    setForm(nextForm);
    setInitialFormSnapshot(nextForm);
  }

  function closeEditor() {
    setEditor(null);
    setForm(defaultFormState);
    setInitialFormSnapshot(defaultFormState);
    setFieldErrors({});
    setShowDiscardDialog(false);
  }

  function requestEditorClose() {
    if (isSaving) {
      return;
    }

    if (isEditorDirty) {
      setShowDiscardDialog(true);
      return;
    }

    closeEditor();
  }

  async function handleSubmit() {
    if (!editor) {
      return;
    }

    setIsSaving(true);
    setFieldErrors({});
    setNotice(null);
    setPageError(null);

    const requestUrl =
      editor.mode === "create-main" || editor.mode === "create-child"
        ? "/api/admin/categories"
        : `/api/admin/categories/${editor.categoryId}`;
    const method =
      editor.mode === "create-main" || editor.mode === "create-child" ? "POST" : "PATCH";

    try {
      const response = await fetch(requestUrl, {
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
        },
        method,
      });

      const payload = (await response.json().catch(() => null)) as
        | {
            category?: { id: string };
            error?: string;
            field?: keyof CategoryFormState;
            message?: string;
          }
        | null;

      if (!response.ok) {
        if (payload?.field) {
          setFieldErrors({ [payload.field]: payload.error ?? "ველი არასწორია." });
        } else {
          setPageError(payload?.error ?? "კატეგორიის შენახვა ვერ მოხერხდა.");
        }

        return;
      }

      const nextSelectedId =
        form.parentId ??
        payload?.category?.id ??
        (editor.mode === "edit-main" ? editor.categoryId ?? null : selectedMainCategory?.id ?? null);

      setNotice(payload?.message ?? "კატეგორია წარმატებით შეინახა.");
      closeEditor();
      await fetchCategories(nextSelectedId);
    } catch {
      setPageError("კატეგორიის შენახვა ვერ მოხერხდა.");
    } finally {
      setIsSaving(false);
    }
  }

  function requestDelete(category: CategoryNode, scope: "main" | "child") {
    setDeleteDialog({ category, scope });
    setNotice(null);
    setPageError(null);
  }

  async function confirmDelete() {
    if (!deleteDialog) {
      return;
    }

    const { category, scope } = deleteDialog;
    setIsSaving(true);
    setNotice(null);
    setPageError(null);

    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: "DELETE",
      });
      const payload = (await response.json().catch(() => null)) as
        | { error?: string; message?: string }
        | null;

      if (!response.ok) {
        setPageError(payload?.error ?? "კატეგორიის წაშლა ვერ მოხერხდა.");
        return;
      }

      setNotice(payload?.message ?? "კატეგორია წაიშალა.");
      const nextSelectedId =
        scope === "main" && selectedMainCategoryId === category.id ? null : selectedMainCategoryId;

      setDeleteDialog(null);
      await fetchCategories(nextSelectedId);
    } catch {
      setPageError("კატეგორიის წაშლა ვერ მოხერხდა.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AdminShell
      title="კატეგორიები"
      eyebrow="კატალოგის მართვა"
      description="მართეთ მთავარი კატეგორიები და ქვეკატეგორიები ერთი სივრციდან. ცვლილებები ინახება საერთო კატეგორიების წყაროში და ავტომატურად აისახება public ნავიგაციასა და ფილტრებში."
      searchValue={query}
      searchPlaceholder="კატეგორიის, სლაგის ან icon key-ის ძიება..."
      onSearchChange={setQuery}
      actions={
        <button
          type="button"
          onClick={() => openEditor("create-main", undefined, null)}
          disabled={usesFallbackSource}
          className="focus-ring inline-flex h-11 items-center gap-2 rounded-md bg-[#072B4D] px-4 text-sm font-bold text-white transition hover:bg-[#0B3A68] disabled:cursor-not-allowed disabled:opacity-55"
        >
          <Plus className="size-4" />
          მთავარი კატეგორია
        </button>
      }
    >
      <div className="space-y-5">
        <section className="grid gap-3 sm:grid-cols-3">
          <SummaryCard label="მთავარი კატეგორიები" value={String(categories.length)} tone="navy" />
          <SummaryCard label="ქვეკატეგორიები" value={String(totalSubcategories)} tone="warning" />
          <SummaryCard label="აქტიური ჩანაწერები" value={String(activeCount)} tone="success" />
        </section>

        {notice ? <InlineNotice tone="success">{notice}</InlineNotice> : null}
        {pageWarning ? <InlineNotice tone="warning">{pageWarning}</InlineNotice> : null}
        {pageError ? <InlineNotice tone="error">{pageError}</InlineNotice> : null}

        <section className="grid min-w-0 gap-5 lg:grid-cols-[minmax(320px,380px)_minmax(0,1fr)]">
          <div className="min-w-0 rounded-xl border border-[#E5EAF0] bg-white shadow-sm lg:flex lg:max-h-[calc(100dvh-7rem)] lg:flex-col lg:overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-[#E5EAF0] p-4">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-[#0D1B2A]">მთავარი კატეგორიები</h2>
                <p className="mt-1 text-sm text-[#6B7280]">
                  აირჩიეთ კატეგორია და მარჯვნივ მუდმივად დაინახავთ მის ქვეკატეგორიებს.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void fetchCategories(selectedMainCategoryId)}
                className="focus-ring inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-[#DDE4EC] text-[#072B4D] transition hover:border-[#F58220] hover:text-[#F58220]"
              >
                <RefreshCw className="size-4" />
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-3 p-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="h-24 animate-pulse rounded-xl bg-[#F4F6F9]" />
                ))}
              </div>
            ) : hasCategories ? (
              filteredCategories.length ? (
                <div className="divide-y divide-[#EEF2F6] lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
                  {filteredCategories.map((category) => {
                    const Icon = getCategoryIcon(category.iconKey);
                    const selected = selectedMainCategory?.id === category.id;

                    return (
                      <div key={category.id} className="p-3">
                        <div
                          className={[
                            "rounded-xl border p-3 transition",
                            selected
                              ? "border-[#F58220] bg-[#FFF7F0]"
                              : "border-[#E5EAF0] bg-white hover:border-[#F7CFA7]",
                          ].join(" ")}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedMainCategoryId(category.id)}
                            className="flex w-full items-start gap-3 text-left"
                          >
                            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#F7F9FC] text-[#072B4D]">
                              <Icon className="size-5" strokeWidth={1.9} />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block break-words text-sm font-bold text-[#102033]">
                                {category.name}
                              </span>
                              <span className="mt-1 block text-xs text-[#6B7280]">/{category.slug}</span>
                              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#6B7280]">
                                <span className="rounded-full bg-[#F1F4F7] px-2 py-1">
                                  icon: {category.iconKey}
                                </span>
                                <span className="rounded-full bg-[#F1F4F7] px-2 py-1">
                                  sort: {category.sortOrder}
                                </span>
                                <span className="rounded-full bg-[#F1F4F7] px-2 py-1">
                                  {category.children.length} ქვეკატეგორია
                                </span>
                              </div>
                            </span>
                            <StatusChip active={category.isActive} />
                          </button>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => openEditor("edit-main", category)}
                              disabled={usesFallbackSource}
                              className="focus-ring inline-flex h-9 items-center gap-2 rounded-md border border-[#DDE4EC] px-3 text-xs font-bold text-[#072B4D] transition hover:border-[#F58220] hover:text-[#F58220] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <PencilLine className="size-4" />
                              რედაქტირება
                            </button>
                            <button
                              type="button"
                              onClick={() => openEditor("create-child", undefined, category.id)}
                              disabled={usesFallbackSource}
                              className="focus-ring inline-flex h-9 items-center gap-2 rounded-md border border-[#DDE4EC] px-3 text-xs font-bold text-[#072B4D] transition hover:border-[#F58220] hover:text-[#F58220] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Plus className="size-4" />
                              ქვეკატეგორია
                            </button>
                            <button
                              type="button"
                              onClick={() => requestDelete(category, "main")}
                              disabled={usesFallbackSource}
                              className="focus-ring inline-flex h-9 items-center gap-2 rounded-md border border-[#F6D5D3] px-3 text-xs font-bold text-[#C5221F] transition hover:bg-[#FFF5F5] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2 className="size-4" />
                              წაშლა
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyCard
                  actionLabel="ძიების გასუფთავება"
                  description="არსებული კატეგორიები ვერ მოიძებნა ამ საძიებო სიტყვით. შეცვალეთ ძიება ან გაასუფთავეთ ფილტრი."
                  icon={<FolderSearch2 className="size-10 text-[#F58220]" />}
                  onAction={() => setQuery("")}
                  title="შედეგი ვერ მოიძებნა"
                />
              )
            ) : (
              <EmptyCard
                actionLabel="მთავარი კატეგორია"
                description="საერთო კატეგორიების წყაროში ჯერ ჩანაწერი არ არის. დაამატეთ პირველი კატეგორია ამ ეკრანიდან."
                disabled={usesFallbackSource}
                icon={<FolderTree className="size-10 text-[#F58220]" />}
                onAction={() => openEditor("create-main", undefined, null)}
                title="კატეგორიები ჯერ არ არის დამატებული"
              />
            )}
          </div>

          <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <section className="min-w-0 rounded-xl border border-[#E5EAF0] bg-white shadow-sm lg:flex lg:max-h-[calc(100dvh-7rem)] lg:flex-col lg:overflow-hidden">
              <div className="flex flex-col gap-3 border-b border-[#E5EAF0] p-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <h2 className="break-words text-lg font-semibold text-[#0D1B2A]">
                    {selectedMainCategory ? selectedMainCategory.name : "ქვეკატეგორიები"}
                  </h2>
                  <p className="mt-1 break-words text-sm text-[#6B7280]">
                    {selectedMainCategory
                      ? `Slug: /${selectedMainCategory.slug} · Icon: ${selectedMainCategory.iconKey} · Sort: ${selectedMainCategory.sortOrder}`
                      : "აირჩიეთ მარცხნივ მთავარი კატეგორია, რათა მისი ქვეკატეგორიები აქ მუდმივად გამოჩნდეს."}
                  </p>
                </div>
                {selectedMainCategory ? (
                  <button
                    type="button"
                    onClick={() => openEditor("create-child", undefined, selectedMainCategory.id)}
                    disabled={usesFallbackSource}
                    className="focus-ring inline-flex h-11 shrink-0 items-center gap-2 rounded-md border border-[#DDE4EC] px-4 text-sm font-bold text-[#072B4D] transition hover:border-[#F58220] hover:text-[#F58220] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus className="size-4" />
                    ქვეკატეგორია
                  </button>
                ) : null}
              </div>

              {selectedMainCategory ? (
                selectedMainCategory.children.length ? (
                  <div className="divide-y divide-[#EEF2F6] lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
                    {selectedMainCategory.children.map((child) => {
                      const Icon = getCategoryIcon(child.iconKey);

                      return (
                        <div
                          key={child.id}
                          className="flex min-w-0 flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between"
                        >
                          <div className="flex min-w-0 items-start gap-3">
                            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#F7F9FC] text-[#072B4D]">
                              <Icon className="size-5" strokeWidth={1.9} />
                            </span>
                            <div className="min-w-0">
                              <p className="break-words text-sm font-bold text-[#102033]">{child.name}</p>
                              <p className="mt-1 text-xs text-[#6B7280]">/{child.slug}</p>
                              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#6B7280]">
                                <span className="rounded-full bg-[#F1F4F7] px-2 py-1">
                                  icon: {child.iconKey}
                                </span>
                                <span className="rounded-full bg-[#F1F4F7] px-2 py-1">
                                  sort: {child.sortOrder}
                                </span>
                                <span className="rounded-full bg-[#F1F4F7] px-2 py-1">
                                  განახლდა: {formatAdminDate(child.updatedAt)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 sm:justify-end">
                            <StatusChip active={child.isActive} />
                            <button
                              type="button"
                              onClick={() => openEditor("edit-child", child)}
                              disabled={usesFallbackSource}
                              className="focus-ring inline-flex h-9 items-center gap-2 rounded-md border border-[#DDE4EC] px-3 text-xs font-bold text-[#072B4D] transition hover:border-[#F58220] hover:text-[#F58220] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <PencilLine className="size-4" />
                              რედაქტირება
                            </button>
                            <button
                              type="button"
                              onClick={() => requestDelete(child, "child")}
                              disabled={usesFallbackSource}
                              className="focus-ring inline-flex h-9 items-center gap-2 rounded-md border border-[#F6D5D3] px-3 text-xs font-bold text-[#C5221F] transition hover:bg-[#FFF5F5] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2 className="size-4" />
                              წაშლა
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyCard
                    actionLabel="ქვეკატეგორია"
                    description="ამ მთავარ კატეგორიას ჯერ ქვეკატეგორიები არ აქვს. დაამატეთ პირველი ჩანაწერი ამ ფანჯრიდან."
                    disabled={usesFallbackSource}
                    icon={<FolderTree className="size-10 text-[#F58220]" />}
                    onAction={() => openEditor("create-child", undefined, selectedMainCategory.id)}
                    title="ქვეკატეგორიები ჯერ არ არის დამატებული"
                  />
                )
              ) : (
                <div className="grid min-h-60 place-items-center p-6 text-center lg:min-h-[22rem]">
                  <div>
                    <FolderTree className="mx-auto size-10 text-[#F58220]" />
                    <h3 className="mt-4 text-lg font-semibold text-[#102033]">აირჩიეთ მთავარი კატეგორია</h3>
                    <p className="mt-2 max-w-md text-sm text-[#6B7280]">
                      მარცხენა სიიდან არჩევის შემდეგ აქ გამოჩნდება შვილობილი ქვეკატეგორიები და მათი მართვის მოქმედებები.
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>
        </section>
      </div>

      {editor ? (
        <CategoryEditorDialog
          categories={categories}
          editor={editor}
          fieldErrors={fieldErrors}
          form={form}
          isDirty={isEditorDirty}
          isSaving={isSaving}
          onClose={requestEditorClose}
          onFormChange={setForm}
          onSubmit={() => void handleSubmit()}
        />
      ) : null}

      {deleteDialog ? (
        <DeleteConfirmDialog
          category={deleteDialog.category}
          isDeleting={isSaving}
          scope={deleteDialog.scope}
          onCancel={() => !isSaving && setDeleteDialog(null)}
          onConfirm={() => void confirmDelete()}
        />
      ) : null}

      {showDiscardDialog ? (
        <DiscardChangesDialog
          onCancel={() => setShowDiscardDialog(false)}
          onConfirm={() => closeEditor()}
        />
      ) : null}
    </AdminShell>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "navy" | "success" | "warning";
}) {
  const styles =
    tone === "success"
      ? "bg-[#EAF8EF] text-[#176B45]"
      : tone === "warning"
        ? "bg-[#FFF4EA] text-[#B95D14]"
        : "bg-[#EAF2FA] text-[#072B4D]";

  return (
    <article className="rounded-xl border border-[#E5EAF0] bg-white p-4 shadow-sm">
      <span className={["inline-flex rounded-md px-2 py-1 text-xs font-bold", styles].join(" ")}>
        {label}
      </span>
      <p className="mt-3 text-2xl font-semibold text-[#102033]">{value}</p>
    </article>
  );
}

function InlineNotice({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "error" | "success" | "warning";
}) {
  return (
    <div
      className={[
        "rounded-xl border px-4 py-3 text-sm font-semibold",
        tone === "success"
          ? "border-[#CBE8D5] bg-[#F4FBF6] text-[#176B45]"
          : tone === "warning"
            ? "border-[#F8D8B5] bg-[#FFF7ED] text-[#B95D14]"
            : "border-[#F3D3D1] bg-[#FFF7F7] text-[#A32A24]",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function StatusChip({ active }: { active: boolean }) {
  return (
    <span
      className={[
        "inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold",
        active ? "bg-[#EAF8EF] text-[#176B45]" : "bg-[#F0F2F5] text-[#6B7280]",
      ].join(" ")}
    >
      {active ? "აქტიური" : "არააქტიური"}
    </span>
  );
}

function EmptyCard({
  actionLabel,
  description,
  disabled = false,
  icon,
  onAction,
  title,
}: {
  actionLabel: string;
  description: string;
  disabled?: boolean;
  icon: ReactNode;
  onAction: () => void;
  title: string;
}) {
  return (
    <div className="grid min-h-60 place-items-center p-6 text-center">
      <div>
        <div className="mx-auto inline-flex">{icon}</div>
        <h3 className="mt-4 text-lg font-semibold text-[#102033]">{title}</h3>
        <p className="mt-2 max-w-md text-sm text-[#6B7280]">{description}</p>
        <button
          type="button"
          onClick={onAction}
          disabled={disabled}
          className="focus-ring mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-[#072B4D] px-4 text-sm font-bold text-white transition hover:bg-[#0B3A68] disabled:cursor-not-allowed disabled:opacity-55"
        >
          <Plus className="size-4" />
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

function Field({
  children,
  error,
  label,
}: {
  children: ReactNode;
  error?: string;
  label: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#102033]">
      <span>{label}</span>
      {children}
      {error ? <span className="text-xs font-medium text-[#C5221F]">{error}</span> : null}
    </label>
  );
}

function IconPreview({ iconKey }: { iconKey: string }) {
  const resolvedIconKey = isCategoryIconKey(iconKey) ? iconKey : "grid2x2";
  const Icon = categoryIconMap[resolvedIconKey];

  return (
    <div className="inline-flex min-w-0 items-center gap-3 rounded-xl border border-[#E5EAF0] bg-[#F7F9FC] px-4 py-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-[#072B4D]">
        <Icon className="size-5" strokeWidth={1.9} />
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-bold uppercase tracking-[0.08em] text-[#8A95A8]">
          Preview
        </span>
        <span className="block break-words text-sm font-semibold text-[#102033]">{iconKey}</span>
      </span>
    </div>
  );
}

function CategoryEditorDialog({
  categories,
  editor,
  fieldErrors,
  form,
  isDirty,
  isSaving,
  onClose,
  onFormChange,
  onSubmit,
}: {
  categories: CategoryNode[];
  editor: CategoryEditorState;
  fieldErrors: CategoryFieldErrors;
  form: CategoryFormState;
  isDirty: boolean;
  isSaving: boolean;
  onClose: () => void;
  onFormChange: Dispatch<SetStateAction<CategoryFormState>>;
  onSubmit: () => void;
}) {
  const showParentField = editor.mode === "create-child" || editor.mode === "edit-child";
  const submitLabel =
    editor.mode === "create-main" || editor.mode === "create-child"
      ? isSaving
        ? "იქმნება..."
        : "შექმნა"
      : isSaving
        ? "ინახება..."
        : "შენახვა";

  return (
    <ModalDialog
      open
      title={getEditorTitle(editor.mode)}
      description={getEditorDescription(editor.mode)}
      onClose={onClose}
      allowBackdropClose={!isSaving}
      allowEscapeClose={!isSaving}
      closeDisabled={isSaving}
      size="lg"
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <IconPreview iconKey={form.iconKey} />
            <span
              className={[
                "inline-flex rounded-full px-3 py-1 text-xs font-bold",
                isDirty ? "bg-[#FFF3E8] text-[#B95D14]" : "bg-[#EAF8EF] text-[#176B45]",
              ].join(" ")}
            >
              {isDirty ? "ცვლილებები ჯერ არაა შენახული" : "ყველა ცვლილება შენახულია"}
            </span>
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="focus-ring h-11 rounded-md border border-[#DDE4EC] px-4 text-sm font-bold text-[#072B4D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              გაუქმება
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSaving}
              className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#F58220] px-5 text-sm font-bold text-white transition hover:bg-[#E77514] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="size-4" />
              {submitLabel}
            </button>
          </div>
        </div>
      }
      childrenClassName="grid gap-4 md:grid-cols-2"
    >
      <Field label="ქართული სახელი" error={fieldErrors.name}>
        <input
          type="text"
          required
          value={form.name}
          onChange={(event) => onFormChange((current) => ({ ...current, name: event.target.value }))}
          className="focus-ring h-11 w-full rounded-md border border-[#DDE4EC] px-3 text-sm text-[#102033]"
        />
      </Field>

      <Field label="Slug" error={fieldErrors.slug}>
        <input
          type="text"
          required
          value={form.slug}
          onChange={(event) => onFormChange((current) => ({ ...current, slug: event.target.value }))}
          className="focus-ring h-11 w-full rounded-md border border-[#DDE4EC] px-3 text-sm text-[#102033]"
        />
      </Field>

      <Field label="Icon key" error={fieldErrors.iconKey}>
        <select
          value={form.iconKey}
          onChange={(event) => onFormChange((current) => ({ ...current, iconKey: event.target.value }))}
          className="focus-ring h-11 w-full rounded-md border border-[#DDE4EC] bg-white px-3 text-sm text-[#102033]"
        >
          {categoryIconOptions.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>

      {showParentField ? (
        <Field label="მშობელი კატეგორია" error={fieldErrors.parentId}>
          <select
            value={form.parentId ?? ""}
            onChange={(event) =>
              onFormChange((current) => ({
                ...current,
                parentId: event.target.value || null,
              }))
            }
            className="focus-ring h-11 w-full rounded-md border border-[#DDE4EC] bg-white px-3 text-sm text-[#102033]"
          >
            <option value="">მთავარი კატეგორია</option>
            {categories
              .filter((category) => category.id !== editor.categoryId)
              .map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
          </select>
        </Field>
      ) : (
        <Field label="სტატუსი">
          <label className="inline-flex h-11 items-center gap-3 rounded-md border border-[#DDE4EC] px-3 text-sm font-semibold text-[#102033]">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                onFormChange((current) => ({ ...current, isActive: event.target.checked }))
              }
              className="size-4 accent-[#F58220]"
            />
            აქტიური
          </label>
        </Field>
      )}

      {showParentField ? (
        <Field label="სტატუსი">
          <label className="inline-flex h-11 items-center gap-3 rounded-md border border-[#DDE4EC] px-3 text-sm font-semibold text-[#102033]">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                onFormChange((current) => ({ ...current, isActive: event.target.checked }))
              }
              className="size-4 accent-[#F58220]"
            />
            აქტიური
          </label>
        </Field>
      ) : null}

      <Field label="სორტირების რიგი" error={fieldErrors.sortOrder}>
        <input
          type="number"
          value={form.sortOrder}
          onChange={(event) =>
            onFormChange((current) => {
              const nextValue = Number.parseInt(event.target.value || "0", 10);

              return {
                ...current,
                sortOrder: Number.isNaN(nextValue) ? 0 : nextValue,
              };
            })
          }
          className="focus-ring h-11 w-full rounded-md border border-[#DDE4EC] px-3 text-sm text-[#102033]"
        />
      </Field>
    </ModalDialog>
  );
}

function DeleteConfirmDialog({
  category,
  isDeleting,
  scope,
  onCancel,
  onConfirm,
}: {
  category: CategoryNode;
  isDeleting: boolean;
  scope: "main" | "child";
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const impactCopy =
    scope === "main"
      ? "ამ მოქმედებამ შეიძლება დააზარალოს დაკავშირებული ქვეკატეგორიები, public მენიუ და პროდუქტების მიბმული ფილტრები."
      : "ამ მოქმედებამ შეიძლება იმოქმედოს დაკავშირებულ პროდუქტებზე და იმ კატეგორიულ ფილტრებზე, სადაც ეს ქვეკატეგორია გამოიყენება.";

  return (
    <ModalDialog
      open
      title="დარწმუნებული ხართ წაშლაში?"
      description="წაშლის შემდეგ დაბრუნება ავტომატურად ვერ მოხერხდება."
      onClose={onCancel}
      allowBackdropClose={!isDeleting}
      allowEscapeClose={!isDeleting}
      closeDisabled={isDeleting}
      role="alertdialog"
      size="md"
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="focus-ring h-11 rounded-md border border-[#DDE4EC] px-4 text-sm font-bold text-[#072B4D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            გაუქმება
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#C5221F] px-4 text-sm font-bold text-white transition hover:bg-[#A81A18] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 className="size-4" />
            {isDeleting ? "იშლება..." : "წაშლა"}
          </button>
        </div>
      }
    >
      <div className="flex items-start gap-3 rounded-2xl border border-[#F5D5C9] bg-[#FFF8F3] p-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#FFF0E5] text-[#F58220]">
          <TriangleAlert className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#102033]">
            {scope === "main" ? "მთავარი კატეგორია წაიშლება" : "ქვეკატეგორია წაიშლება"}
          </p>
          <p className="mt-1 text-sm leading-6 text-[#6B7280]">{impactCopy}</p>
        </div>
      </div>

      <dl className="mt-4 grid gap-3 rounded-2xl bg-[#F7F9FC] p-4 text-sm">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <dt className="font-semibold text-[#6B7280]">სახელი</dt>
          <dd className="break-words font-bold text-[#102033]">{category.name}</dd>
        </div>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <dt className="font-semibold text-[#6B7280]">Slug</dt>
          <dd className="break-all font-medium text-[#102033]">/{category.slug}</dd>
        </div>
      </dl>
    </ModalDialog>
  );
}

function DiscardChangesDialog({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <ModalDialog
      open
      title="შენახული არ არის ცვლილებები"
      description="თუ დახურავთ, მიმდინარე ჩანაწერში შეტანილი ცვლილებები დაიკარგება."
      onClose={onCancel}
      role="alertdialog"
      size="md"
      footer={
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="focus-ring h-11 rounded-md border border-[#DDE4EC] px-4 text-sm font-bold text-[#072B4D]"
          >
            გაგრძელება რედაქტირებაში
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#072B4D] px-4 text-sm font-bold text-white transition hover:bg-[#0B3A68]"
          >
            დახურვა ცვლილებების გარეშე
          </button>
        </div>
      }
    >
      <div className="rounded-2xl border border-[#E5EAF0] bg-[#F7F9FC] p-4">
        <p className="text-sm leading-6 text-[#6B7280]">
          გადაამოწმეთ ველები, თუ გსურთ შენახვა. წინააღმდეგ შემთხვევაში ფორმა დაიხურება და ეს ცვლილებები აღარ დაბრუნდება.
        </p>
      </div>
    </ModalDialog>
  );
}

function ModalDialog({
  allowBackdropClose = true,
  allowEscapeClose = true,
  children,
  childrenClassName,
  closeDisabled = false,
  description,
  footer,
  onClose,
  open,
  role = "dialog",
  size = "lg",
  title,
}: ModalDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    openerRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : openerRef.current;
    frameRef.current = window.requestAnimationFrame(() => {
      setVisible(true);
      frameRef.current = null;
    });

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      const opener = openerRef.current;

      if (opener && document.contains(opener)) {
        opener.focus({ preventScroll: true });
      }
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const isTopmostModal = () => {
      const dialogs = Array.from(
        document.querySelectorAll<HTMLElement>("[data-modal-dialog='true']")
      );

      return dialogs[dialogs.length - 1] === panelRef.current;
    };

    const releaseBodyLock = lockBodyScroll();
    const frame = window.requestAnimationFrame(() => {
      const focusableElements = getFocusableElements(panelRef.current);
      const firstFocusable = focusableElements[0];

      if (firstFocusable) {
        firstFocusable.focus({ preventScroll: true });
      } else {
        panelRef.current?.focus({ preventScroll: true });
      }
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isTopmostModal()) {
        return;
      }

      if (event.key === "Escape" && allowEscapeClose && !closeDisabled) {
        event.preventDefault();
        onClose?.();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getFocusableElements(panelRef.current);

      if (!focusableElements.length) {
        event.preventDefault();
        panelRef.current?.focus({ preventScroll: true });
        return;
      }

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      releaseBodyLock();
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [allowEscapeClose, closeDisabled, onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className={[
        "fixed inset-0 z-[95]",
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!open}
    >
      <div
        className={[
          "absolute inset-0 bg-[#041C32]/55 transition-opacity duration-200 ease-out",
          visible ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
      <div
        className="relative flex min-h-full items-center justify-center p-4 sm:p-6"
        onMouseDown={(event) => {
          if (
            event.target === event.currentTarget &&
            allowBackdropClose &&
            !closeDisabled &&
            onClose
          ) {
            onClose();
          }
        }}
      >
        <div
          ref={panelRef}
          data-modal-dialog="true"
          role={role}
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          tabIndex={-1}
          className={[
            "w-full overflow-hidden rounded-2xl border border-[#E5EAF0] bg-white shadow-2xl transition-all duration-200 ease-out",
            "max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3rem)]",
            size === "md" ? "max-w-md" : "max-w-3xl",
            visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-[0.98] opacity-0",
          ].join(" ")}
        >
          <div className="flex items-start justify-between gap-4 border-b border-[#E5EAF0] px-5 py-4">
            <div className="min-w-0">
              <h2 id={titleId} className="break-words text-lg font-semibold text-[#0D1B2A]">
                {title}
              </h2>
              {description ? (
                <p id={descriptionId} className="mt-1 text-sm leading-6 text-[#6B7280]">
                  {description}
                </p>
              ) : null}
            </div>
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                disabled={closeDisabled}
                aria-label="ფანჯრის დახურვა"
                className="focus-ring grid size-10 shrink-0 place-items-center rounded-md border border-[#DDE4EC] text-[#072B4D] transition hover:border-[#F58220] hover:text-[#F58220] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>

          <div className={["overflow-y-auto px-5 py-5", childrenClassName ?? "grid gap-4"].join(" ")}>
            {children}
          </div>

          {footer ? <div className="border-t border-[#E5EAF0] px-5 py-4">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}

function getEditorTitle(mode: CategoryEditorMode) {
  if (mode === "create-main") {
    return "მთავარი კატეგორიის დამატება";
  }

  if (mode === "edit-main") {
    return "მთავარი კატეგორიის რედაქტირება";
  }

  if (mode === "create-child") {
    return "ქვეკატეგორიის დამატება";
  }

  return "ქვეკატეგორიის რედაქტირება";
}

function getEditorDescription(mode: CategoryEditorMode) {
  if (mode === "create-main") {
    return "შეავსეთ ძირითადი ველები და შექმენით ახალი მთავარი კატეგორია.";
  }

  if (mode === "edit-main") {
    return "განაახლეთ მთავარი კატეგორიის დასახელება, slug, icon key, სტატუსი და რიგი.";
  }

  if (mode === "create-child") {
    return "აირჩიეთ მშობელი კატეგორია და შექმენით ახალი ქვეკატეგორია.";
  }

  return "განაახლეთ ქვეკატეგორიის ველები და საჭიროების შემთხვევაში შეცვალეთ მშობელი კატეგორიაც.";
}

function formatAdminDate(value: string) {
  const date = new Date(value);

  if (!value || Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("ka-GE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
