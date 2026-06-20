import { cpSync, existsSync, mkdirSync, renameSync, rmSync } from "node:fs";
import { execSync } from "node:child_process";

const API_PATH = "src/app/api";
const API_BACKUP = "src/app/_api_static_backup";
const BASE_PATH = "/skybook-flight-search";

mkdirSync("public/data", { recursive: true });
cpSync("data/flights.json", "public/data/flights.json");

if (existsSync(API_PATH)) {
  if (existsSync(API_BACKUP)) rmSync(API_BACKUP, { recursive: true, force: true });
  renameSync(API_PATH, API_BACKUP);
}

try {
  execSync("npx next build", {
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_PUBLIC_STATIC_EXPORT: "true",
      NEXT_PUBLIC_BASE_PATH: BASE_PATH,
    },
  });
  cpSync("public/.nojekyll", "out/.nojekyll");
} finally {
  if (existsSync(API_BACKUP)) {
    if (existsSync(API_PATH)) rmSync(API_PATH, { recursive: true, force: true });
    renameSync(API_BACKUP, API_PATH);
  }
}
