import { syncCatalogCategoriesToDb } from "../lib/catalog-category-sync";

async function main() {
  const result = await syncCatalogCategoriesToDb();

  console.log(
    `Seeded ${result.importedParents}/${result.totalParents} main categories and ${result.importedChildren}/${result.totalChildren} subcategories from public navigation data.`
  );
}

main()
  .catch((error: unknown) => {
    const err = error as { message?: string; stack?: string };

    console.error(err.message ?? "Category seed failed.");

    if (err.stack) {
      console.error(err.stack);
    }

    process.exit(1);
  });
