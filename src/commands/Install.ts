import { Command } from "commander";

export const install = new Command()
  .name("install")
  .description("install depedencies & build installed plugin");
