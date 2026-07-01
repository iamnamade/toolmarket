import { db } from "@/lib/db";
import { isCategoryIconKey } from "@/lib/category-icons";

export type CategoryMutationInput = {
  iconKey: string;
  isActive: boolean;
  name: string;
  parentId: string | null;
  slug: string;
  sortOrder: number;
};

const CATEGORY_CHILD_SLUG_SEPARATOR = "__";

export function normalizeCategorySlug(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("ka")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildStoredCategorySlug(slug: string, parentId: string | null) {
  return parentId ? `${parentId}${CATEGORY_CHILD_SLUG_SEPARATOR}${slug}` : slug;
}

export function resolvePublicCategorySlug(storedSlug: string, parentId: string | null) {
  if (!parentId) {
    return storedSlug;
  }

  const prefix = `${parentId}${CATEGORY_CHILD_SLUG_SEPARATOR}`;
  return storedSlug.startsWith(prefix) ? storedSlug.slice(prefix.length) : storedSlug;
}

export function parseCategoryMutationInput(body: unknown) {
  const source = body && typeof body === "object" ? (body as Record<string, unknown>) : null;
  const name = typeof source?.name === "string" ? source.name.trim() : "";
  const slugInput = typeof source?.slug === "string" ? source.slug : "";
  const slug = normalizeCategorySlug(slugInput);
  const iconKey = typeof source?.iconKey === "string" ? source.iconKey.trim() : "";
  const parentId = typeof source?.parentId === "string" && source.parentId.trim() ? source.parentId.trim() : null;
  const sortOrderValue = source?.sortOrder;
  const numericSortOrder =
    typeof sortOrderValue === "number"
      ? sortOrderValue
      : typeof sortOrderValue === "string"
        ? Number.parseInt(sortOrderValue, 10)
        : Number.NaN;

  const isActive =
    typeof source?.isActive === "boolean"
      ? source.isActive
      : typeof source?.isActive === "string"
        ? source.isActive === "true"
        : true;

  if (!name) {
    return {
      error: "კატეგორიის სახელის მითითება აუცილებელია.",
      field: "name" as const,
    };
  }

  if (!slug) {
    return { error: "სლაგის მითითება აუცილებელია.", field: "slug" as const };
  }

  if (!iconKey || !isCategoryIconKey(iconKey)) {
    return { error: "აირჩიეთ სწორი ხატულა.", field: "iconKey" as const };
  }

  if (!Number.isFinite(numericSortOrder)) {
    return {
      error: "სორტირების მნიშვნელობა არასწორია.",
      field: "sortOrder" as const,
    };
  }

  return {
    data: {
      iconKey,
      isActive,
      name,
      parentId,
      slug,
      sortOrder: numericSortOrder,
    } satisfies CategoryMutationInput,
  };
}

export async function validateCategoryMutationInput(input: CategoryMutationInput, currentId?: string) {
  let resolvedParentId: string | null = null;

  if (input.parentId) {
    const parentCategory = await db.category.findUnique({
      where: { id: input.parentId },
      select: { id: true, parentId: true },
    });

    if (!parentCategory) {
      return {
        error: "მშობელი კატეგორია ვერ მოიძებნა.",
        field: "parentId" as const,
      };
    }

    if (parentCategory.parentId) {
      return {
        error: "ქვეკატეგორია მხოლოდ მთავარ კატეგორიას შეიძლება მიებას.",
        field: "parentId" as const,
      };
    }

    if (currentId && parentCategory.id === currentId) {
      return {
        error: "კატეგორია საკუთარ მშობლად ვერ შეინახება.",
        field: "parentId" as const,
      };
    }

    resolvedParentId = parentCategory.id;
  }

  const storedSlug = buildStoredCategorySlug(input.slug, resolvedParentId);
  const duplicateCategory = await db.category.findFirst({
    where: {
      slug: storedSlug,
      ...(currentId ? { NOT: { id: currentId } } : {}),
    },
    select: { id: true },
  });

  if (duplicateCategory) {
    return {
      error: "ეს სლაგი უკვე გამოიყენება.",
      field: "slug" as const,
    };
  }

  return {
    data: {
      ...input,
      parentId: resolvedParentId,
      slug: storedSlug,
    } satisfies CategoryMutationInput,
  };
}
