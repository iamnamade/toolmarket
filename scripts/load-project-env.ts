import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ENV_FILES = [".env", ".env.local"];

function parseEnvLine(line: string) {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith("#")) {
    return null;
  }

  const separatorIndex = trimmed.indexOf("=");

  if (separatorIndex === -1) {
    return null;
  }

  const key = trimmed.slice(0, separatorIndex).trim();
  let value = trimmed.slice(separatorIndex + 1).trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return { key, value };
}

export function loadProjectEnv(rootDirectory = process.cwd()) {
  for (const envFile of ENV_FILES) {
    const filePath = resolve(rootDirectory, envFile);

    if (!existsSync(filePath)) {
      continue;
    }

    const contents = readFileSync(filePath, "utf8");

    for (const line of contents.split(/\r?\n/)) {
      const parsed = parseEnvLine(line);

      if (!parsed) {
        continue;
      }

      process.env[parsed.key] = parsed.value;
    }
  }
}
