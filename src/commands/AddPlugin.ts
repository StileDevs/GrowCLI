import { Command } from "commander";
import prompts from "prompts";
import { z } from "zod";
import { downloadPlugins, getPluginsInfo, PluginInfo } from "../utils/GetPluginsInfo";
import { existsSync, mkdirSync, readdirSync, renameSync } from "fs";
import { join } from "path";
import decompress from "decompress";

export const addPlugin = new Command()
  .name("addplugin")
  .description("add a growserver plugin to your server")
  .argument("[plugin-name]", "the plugin to add")
  .action(async (pluginName: string | undefined) => {
    await downloadingPlugin(pluginName);
    await extractPlugins();
  });

async function downloadingPlugin(pluginName?: string) {
  const plugRes = await getPluginsInfo();

  if (!plugRes) return console.log("Fail to request plugins repository");

  if (pluginName) {
    const community = plugRes.plugins.community.find((v) => v.name === pluginName);
    if (!community) return console.log("No plugin found with that name :(");

    const plugins: PluginInfo[] = [];

    plugins.push(community);

    await downloadPlugins(plugins);
    return;
  }

  const response = await prompts([
    {
      type: "multiselect",
      name: "plugins",
      message: "Choose plugins",
      choices: plugRes.plugins.core
        .map((v) => {
          return { title: `${v.name} (core)`, value: v, selected: true };
        })
        .concat(
          plugRes.plugins.community.map((v) => {
            return { title: `${v.name}`, value: v, selected: false };
          }) ?? []
        )
    }
  ]);

  if (!response) return console.log("Aborting");

  await downloadPlugins(response.plugins);
  return;
}

async function extractPlugins() {
  const pluginPath = join(process.cwd(), "plugins");
  const pluginCachePath = join(process.cwd(), ".cache", "plugins");

  if (!existsSync(pluginPath)) mkdirSync(pluginPath, { recursive: true });

  const pluginsCache = readdirSync(pluginCachePath);
  for (const plugin of pluginsCache) {
    const pluginName = plugin.replace(".zip", "");
    await decompress(join(pluginCachePath, plugin), pluginPath);
    renameSync(join(pluginPath, `${pluginName}-main`), join(pluginPath, pluginName));
  }
}
