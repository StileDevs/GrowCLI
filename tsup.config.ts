import { defineConfig, type Options } from "tsup";

let config: Options = {
  entry: ["src/index.ts"],
  splitting: false,
  sourcemap: false,
  bundle: true,
  clean: true,
  dts: false,
  target: "node20",
  format: "esm"
};

export default defineConfig(config);
