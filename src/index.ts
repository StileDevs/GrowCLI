#!/usr/bin/env node

import prompts from "prompts";
import { Command } from "commander";
import { addPlugin } from "./commands/AddPlugin";
import { clear } from "./commands/Clear";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

(async () => {
  const program = new Command()
    .name("growcli")
    .description("add components and dependencies to your project")
    .version("1.0.0", "-v, --version", "display the version number");

  program.addCommand(addPlugin).addCommand(clear);
  program.parse();
})();
