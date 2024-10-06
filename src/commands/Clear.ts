import { Command } from "commander";
import { emptyDir } from "fs-extra/esm";
import { join } from "path";
import prompts from "prompts";

export const clear = new Command()
  .name("clear")
  .description("clear something")
  .argument("<option>", "clear argument <cache | plugin>")
  .action(async (arg: string) => {
    switch (arg) {
      case "cache": {
        const path = join(process.cwd(), ".cache");

        const response = await prompts({
          type: "confirm",
          name: "value",
          message: `Are you sure want to clear "${path}" directory?`
        });

        if (!response.value) {
          console.log("Aborted");
          break;
        }

        await emptyDir(path);
        console.log(`cleared .cache folder ${path}`);
        break;
      }
      case "plugin": {
        const path = join(process.cwd(), "plugins");

        const response = await prompts({
          type: "confirm",
          name: "value",
          message: `Are you sure want to clear "${path}" directory?`
        });

        if (!response.value) {
          console.log("Aborted");
          break;
        }
        await emptyDir(path);
        console.log(`cleared plugins folder: ${path}`);
        break;
      }

      default: {
        console.log(`missing clear option for '${arg}'`);
        break;
      }
    }
  });
