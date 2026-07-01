import {
  serializeCatalogCategories,
  catalogCategories,
  type CatalogCategoryData,
  type CatalogChildCategoryData,
} from "../data/category-navigation";
import { buildStoredCategorySlug, resolvePublicCategorySlug } from "./admin-categories";
import { db } from "./db";

type CategoryRecord = {
  iconKey: string | null;
  id: string;
  isActive: boolean;
  name: string;
  parentId: string | null;
  slug: string;
  sortOrder: number;
};

type SyncCatalogCategoriesOptions = {
  onlyIfEmpty?: boolean;
};

export type SyncCatalogCategoriesResult = {
  importedChildren: number;
  importedParents: number;
  skipped: boolean;
  totalChildren: number;
  totalParents: number;
};

const categoryRecordSelect = {
  iconKey: true,
  id: true,
  isActive: true,
  name: true,
  parentId: true,
  slug: true,
  sortOrder: true,
} as const;

const catalogCategorySeedData = serializeCatalogCategories(catalogCategories);

function findParentRecord(rows: CategoryRecord[], category: CatalogCategoryData) {
  return (
    rows.find(
      (row) => row.parentId === null && (row.slug === category.slug || row.name === category.nameKa)
    ) ?? null
  );
}

function findChildRecord(
  rows: CategoryRecord[],
  parentId: string,
  child: CatalogChildCategoryData
) {
  const desiredStoredSlug = buildStoredCategorySlug(child.slug, parentId);

  return (
    rows.find(
      (row) =>
        row.parentId === parentId &&
        (row.slug === desiredStoredSlug ||
          resolvePublicCategorySlug(row.slug, row.parentId) === child.slug ||
          row.name === child.nameKa)
    ) ??
    rows.find((row) => row.slug === desiredStoredSlug) ??
    null
  );
}

export function getCatalogCategorySeedData() {
  return catalogCategorySeedData;
}

export async function syncCatalogCategoriesToDb(
  options: SyncCatalogCategoriesOptions = {}
): Promise<SyncCatalogCategoriesResult> {
  const { onlyIfEmpty = false } = options;
  const existingRows = await db.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: categoryRecordSelect,
  });

  const totalParents = catalogCategorySeedData.length;
  const totalChildren = catalogCategorySeedData.reduce(
    (total, category) => total + category.children.length,
    0
  );

  if (onlyIfEmpty && existingRows.length > 0) {
    return {
      importedChildren: 0,
      importedParents: 0,
      skipped: true,
      totalChildren,
      totalParents,
    };
  }

  let importedParents = 0;
  let importedChildren = 0;

  const workingRows = existingRows.map((row) => ({ ...row }));

  for (const [parentIndex, parentCategory] of catalogCategorySeedData.entries()) {
    const existingParent = findParentRecord(workingRows, parentCategory);
    const parentPayload = {
      iconKey: parentCategory.iconKey,
      isActive: true,
      name: parentCategory.nameKa,
      parentId: null,
      slug: parentCategory.slug,
      sortOrder: parentIndex,
    };

    const parentRecord = existingParent
      ? await db.category.update({
          where: { id: existingParent.id },
          data: parentPayload,
          select: categoryRecordSelect,
        })
      : await db.category.create({
          data: parentPayload,
          select: categoryRecordSelect,
        });

    if (existingParent) {
      Object.assign(existingParent, parentRecord);
    } else {
      workingRows.push(parentRecord);
    }

    importedParents += 1;

    for (const [childIndex, childCategory] of parentCategory.children.entries()) {
      const existingChild = findChildRecord(workingRows, parentRecord.id, childCategory);
      const childPayload = {
        iconKey: childCategory.iconKey,
        isActive: true,
        name: childCategory.nameKa,
        parentId: parentRecord.id,
        slug: buildStoredCategorySlug(childCategory.slug, parentRecord.id),
        sortOrder: childIndex,
      };

      const childRecord = existingChild
        ? await db.category.update({
            where: { id: existingChild.id },
            data: childPayload,
            select: categoryRecordSelect,
          })
        : await db.category.create({
            data: childPayload,
            select: categoryRecordSelect,
          });

      if (existingChild) {
        Object.assign(existingChild, childRecord);
      } else {
        workingRows.push(childRecord);
      }

      importedChildren += 1;
    }
  }

  return {
    importedChildren,
    importedParents,
    skipped: false,
    totalChildren,
    totalParents,
  };
}
