import { cpSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const sourceDir = path.join(projectRoot, ".next", "types", "app");
const targetDir = path.join(projectRoot, ".next", "dev", "types", "app");

if (!existsSync(sourceDir)) {
  process.exit(0);
}

mkdirSync(path.dirname(targetDir), { recursive: true });
cpSync(sourceDir, targetDir, { force: true, recursive: true });
