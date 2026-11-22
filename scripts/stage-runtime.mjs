import { cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, ".."); const platform = process.argv.find((arg) => arg.startsWith("--platform="))?.slice(11); const host = platform === "win32" ? "ling-browser-host.exe" : "ling-browser-host";
if (!platform) throw new Error("stage_runtime_platform_required"); const staged = resolve(root, ".ling-plugin-runtime"); await rm(staged, { recursive: true, force: true }); await mkdir(resolve(staged, ".ling-plugin"), { recursive: true });
for (const file of [".ling-plugin/plugin.json", "README.md", "mcp-server.json"]) await cp(resolve(root, file), resolve(staged, file));
await mkdir(resolve(staged, "runtime"), { recursive: true }); await cp(resolve(root, "extension/ling-for-chrome.zip"), resolve(staged, "runtime/ling-for-chrome.zip")); await cp(resolve(root, `host/dist/native/${host}`), resolve(staged, `runtime/${host}`)); await cp(resolve(root, `host/dist/native/build-metadata.json`), resolve(staged, "runtime/build-metadata.json"));
