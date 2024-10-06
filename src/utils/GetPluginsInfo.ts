import { createWriteStream, existsSync, mkdirSync } from "fs";
import { request } from "undici";
import { join } from "path";
import ora from "ora";

export interface PluginInfo {
  name: string;
  url: string;
}

export interface ResponsePluginInfo {
  plugins: {
    version: string;
    core: PluginInfo[];
    community: PluginInfo[];
  };
}

export async function getPluginsInfo() {
  const pluginData = await request(
    "https://raw.githubusercontent.com/StileDevs/register-plugin/refs/heads/main/plugins.json"
  );

  if (pluginData.statusCode !== 200) return undefined;
  const data = (await pluginData.body.json()) as ResponsePluginInfo;

  return data;
}

export async function downloadPlugins(plugins: PluginInfo[]) {
  for (const v of plugins) {
    const url = `${v.url}/archive/refs/heads/main.zip`;
    const filePath = join(process.cwd(), ".cache", "plugins", `${v.name}.zip`);

    if (!existsSync(join(process.cwd(), ".cache", "plugins")))
      mkdirSync(join(process.cwd(), ".cache", "plugins"), { recursive: true });

    const spinner = ora(`Downloading ${v.name}`).start();
    try {
      const response = await request(url, {
        method: "GET",
        headers: {},
        maxRedirections: 5
      });

      if (response.statusCode !== 200) {
        throw new Error(`Failed to download file: ${response.statusCode}`);
      }

      const fileStream = createWriteStream(filePath);

      response.body.pipe(fileStream);

      await new Promise((resolve, reject) => {
        fileStream.on("finish", resolve);
        fileStream.on("error", reject);
      });

      spinner.succeed(`Sucessfully downloaded ${v.name}`);
    } catch (error) {
      spinner.fail(`Fail to download ${v.name}\n`);
      console.error("Error downloading file:", error);
    }
  }
}
