import { isCategoryIconKey } from "@/lib/category-icons";
import { db } from "@/lib/db";
import {
  type CatalogCategoryData,
  type CatalogChildCategoryData,
} from "@/data/category-navigation";
import { resolvePublicCategorySlug } from "@/lib/admin-categories";
import {
  getCatalogCategorySeedData,
  syncCatalogCategoriesToDb,
} from "@/lib/catalog-category-sync";

type CategoryRow = {
  createdAt: Date;
  iconKey: string | null;
  id: string;
  isActive: boolean;
  name: string;
  parentId: string | null;
  slug: string;
  sortOrder: number;
  updatedAt: Date;
};

export type AdminCategoryNode = {
  createdAt: string;
  children: AdminCategoryNode[];
  iconKey: string;
  id: string;
  isActive: boolean;
  name: string;
  parentId: string | null;
  slug: string;
  sortOrder: number;
  updatedAt: string;
};

export type AdminCategoryTreeResult = {
  categories: AdminCategoryNode[];
  source: "database" | "fallback";
  warning: string | null;
};

const fallbackCatalogData = getCatalogCategorySeedData();

const fallbackParentBySlug = new Map(
  fallbackCatalogData.map((category) => [category.slug, category] as const)
);
const fallbackParentByName = new Map(
  fallbackCatalogData.map((category) => [category.nameKa, category] as const)
);
const fallbackChildByCompositeKey = new Map(
  fallbackCatalogData.flatMap((category) =>
    category.children.map((child) => [`${category.slug}:${child.slug}`, child] as const)
  )
);
const fallbackChildByName = new Map(
  fallbackCatalogData.flatMap((category) =>
    category.children.map((child) => [`${category.nameKa}:${child.nameKa}`, child] as const)
  )
);

function normalizeIconKey(iconKey: string | null | undefined) {
  return isCategoryIconKey(iconKey) ? iconKey : null;
}

function sortCategoryRows(
  first: Pick<CategoryRow, "sortOrder" | "name">,
  second: Pick<CategoryRow, "sortOrder" | "name">
) {
  if (first.sortOrder !== second.sortOrder) {
    return first.sortOrder - second.sortOrder;
  }

  return first.name.localeCompare(second.name, "ka");
}

function getFallbackParent(row: Pick<CategoryRow, "name" | "slug">) {
  return fallbackParentBySlug.get(row.slug) ?? fallbackParentByName.get(row.name) ?? null;
}

function getFallbackChild(
  parent: Pick<CategoryRow, "name" | "slug">,
  child: Pick<CategoryRow, "name" | "slug">
) {
  return (
    fallbackChildByCompositeKey.get(`${parent.slug}:${child.slug}`) ??
    fallbackChildByName.get(`${parent.name}:${child.name}`) ??
    null
  );
}

function buildDescription(name: string, children: CatalogChildCategoryData[]) {
  if (children.length) {
    return children
      .slice(0, 4)
      .map((child) => child.nameKa)
      .join(", ");
  }

  return `${name} კატეგორია`;
}

async function readCategoryRows() {
  await syncCatalogCategoriesToDb({ onlyIfEmpty: true });

  return db.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      createdAt: true,
      iconKey: true,
      id: true,
      isActive: true,
      name: true,
      parentId: true,
      slug: true,
      sortOrder: true,
      updatedAt: true,
    },
  });
}

function buildFallbackAdminCategoryTree() {
  return fallbackCatalogData.map<AdminCategoryNode>((parent, parentIndex) => {
    const parentId = `fallback:${parent.slug}`;

    return {
      createdAt: "",
      iconKey: parent.iconKey,
      id: parentId,
      isActive: true,
      name: parent.nameKa,
      parentId: null,
      slug: parent.slug,
      sortOrder: parentIndex,
      updatedAt: "",
      children: parent.children.map((child, childIndex) => ({
        createdAt: "",
        children: [],
        iconKey: child.iconKey,
        id: `${parentId}:${child.slug}`,
        isActive: true,
        name: child.nameKa,
        parentId,
        slug: child.slug,
        sortOrder: childIndex,
        updatedAt: "",
      })),
    };
  });
}

function createChildrenMap(rows: CategoryRow[]) {
  const childrenByParentId = new Map<string, CategoryRow[]>();

  rows.forEach((row) => {
    if (!row.parentId) {
      return;
    }

    const currentChildren = childrenByParentId.get(row.parentId) ?? [];
    currentChildren.push(row);
    childrenByParentId.set(row.parentId, currentChildren);
  });

  childrenByParentId.forEach((rowsForParent) => rowsForParent.sort(sortCategoryRows));

  return childrenByParentId;
}

function mapRowsToAdminCategoryTree(rows: CategoryRow[]) {
  const parents = rows.filter((row) => row.parentId === null).sort(sortCategoryRows);
  const childrenByParentId = createChildrenMap(rows);

  return parents.map<AdminCategoryNode>((parent) => {
    const fallbackParent = getFallbackParent(parent);

    return {
      createdAt: parent.createdAt.toISOString(),
      iconKey: normalizeIconKey(parent.iconKey) ?? fallbackParent?.iconKey ?? "grid2x2",
      id: parent.id,
      isActive: parent.isActive,
      name: parent.name,
      parentId: null,
      slug: parent.slug,
      sortOrder: parent.sortOrder,
      updatedAt: parent.updatedAt.toISOString(),
      children: (childrenByParentId.get(parent.id) ?? []).map((child) => {
        const publicChildSlug = resolvePublicCategorySlug(child.slug, child.parentId);
        const fallbackChild = getFallbackChild(parent, {
          ...child,
          slug: publicChildSlug,
        });

        return {
          createdAt: child.createdAt.toISOString(),
          iconKey:
            normalizeIconKey(child.iconKey) ??
            fallbackChild?.iconKey ??
            fallbackParent?.iconKey ??
            "grid2x2",
          id: child.id,
          isActive: child.isActive,
          name: child.name,
          parentId: child.parentId,
          slug: publicChildSlug,
          sortOrder: child.sortOrder,
          updatedAt: child.updatedAt.toISOString(),
          children: [],
        };
      }),
    };
  });
}

export async function getAdminCategoryTreeResult(): Promise<AdminCategoryTreeResult> {
  try {
    const rows = await readCategoryRows();

    return {
      categories: mapRowsToAdminCategoryTree(rows),
      source: "database",
      warning: null,
    };
  } catch {
    return {
      categories: buildFallbackAdminCategoryTree(),
      source: "fallback",
      warning:
        "კატეგორიები დროებით public ნავიგაციის წყაროდან ჩაიტვირთა. Category ბაზა არ იყო ხელმისაწვდომი, ამიტომ CRUD ცვლილებები ვერ შეინახება, სანამ import/sync არ დასრულდება.",
    };
  }
}

export async function getAdminCategoryTree() {
  const result = await getAdminCategoryTreeResult();
  return result.categories;
}

export async function getPublicCatalogCategoryData(): Promise<CatalogCategoryData[]> {
  let rows: CategoryRow[];

  try {
    rows = await readCategoryRows();
  } catch {
    return fallbackCatalogData;
  }

  const activeRows = rows.filter((row) => row.isActive);

  if (!activeRows.length) {
    return fallbackCatalogData;
  }

  const parents = activeRows.filter((row) => row.parentId === null).sort(sortCategoryRows);

  if (!parents.length) {
    return fallbackCatalogData;
  }

  const childrenByParentId = createChildrenMap(activeRows);

  return parents.map((parent) => {
    const fallbackParent = getFallbackParent(parent);
    const children = (childrenByParentId.get(parent.id) ?? []).map((child) => {
      const publicChildSlug = resolvePublicCategorySlug(child.slug, child.parentId);
      const fallbackChild = getFallbackChild(parent, {
        ...child,
        slug: publicChildSlug,
      });

      return {
        nameKa: child.name,
        slug: publicChildSlug,
        iconKey:
          normalizeIconKey(child.iconKey) ??
          fallbackChild?.iconKey ??
          fallbackParent?.iconKey ??
          "grid2x2",
        productIds: fallbackChild?.productIds,
        productCount: fallbackChild?.productCount,
      };
    });

    return {
      nameKa: parent.name,
      slug: parent.slug,
      iconKey: normalizeIconKey(parent.iconKey) ?? fallbackParent?.iconKey ?? "grid2x2",
      description: fallbackParent?.description ?? buildDescription(parent.name, children),
      productCategoryNames: fallbackParent?.productCategoryNames,
      productIds: fallbackParent?.productIds,
      productCount: fallbackParent?.productCount,
      children,
    };
  });
}

export function getFallbackCatalogCategoryData() {
  return fallbackCatalogData;
}
