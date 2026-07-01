import { loadProjectEnv } from "./load-project-env";

loadProjectEnv();

async function main() {
  const { syncCatalogCategoriesToDb } = await import("../lib/catalog-category-sync");
  const result = await syncCatalogCategoriesToDb();

  console.log(
    `Synced ${result.importedParents}/${result.totalParents} main categories and ${result.importedChildren}/${result.totalChildren} subcategories.`
  );
}

main().catch((error: unknown) => {
  const err = error as { message?: string; stack?: string };

  console.error(err.message ?? "Category sync failed.");

  if (err.stack) {
    console.error(err.stack);
  }

  process.exit(1);
});
