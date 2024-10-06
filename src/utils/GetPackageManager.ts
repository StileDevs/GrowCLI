import { detect } from "@antfu/ni";
import path from "path";
import fs from "fs-extra";
import { type PackageJson } from "type-fest";

export async function getPackageManager(
  targetDir: string
): Promise<"yarn" | "pnpm" | "bun" | "npm"> {
  const packageManager = await detect({ programmatic: true, cwd: targetDir });

  if (packageManager === "yarn@berry") return "yarn";
  if (packageManager === "pnpm@6") return "pnpm";
  if (packageManager === "bun") return "bun";

  return packageManager ?? "npm";
}

export function getPackageInfo(targetDir: string) {
  const packageJsonPath = path.join(targetDir);

  return fs.readJSONSync(packageJsonPath) as PackageJson;
}
