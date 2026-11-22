import { copyFile, mkdir, mkdtemp, rm } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const [platform, arch] = process.argv.slice(2);
if (process.platform !== platform || process.arch !== arch
  || !["darwin/arm64", "win32/x64"].includes(platform + "/" + arch)) {
  throw new Error("Build Ling for Chrome on its target platform and architecture.");
}

const staging = await mkdtemp(resolve(tmpdir(), "ling-chrome-plugin-"));
try {
  await mkdir(resolve(staging, ".ling-plugin"));
  await mkdir(resolve(staging, "runtime"));
  for (const name of [".ling-plugin/plugin.json", "mcp-server.json", "LICENSE"]) {
    await copyFile(resolve(root, name), resolve(staging, name));
  }
  const host = platform === "win32" ? "ling-browser-host.exe" : "ling-browser-host";
  const sources = [
    ["extension/ling-for-chrome.zip", "runtime/ling-for-chrome.zip"],
    ["extension/dist/build-metadata.json", "runtime/extension-build-metadata.json"],
    ["host/dist/native/" + host, "runtime/" + host],
    ["host/dist/native/build-metadata.json", "runtime/build-metadata.json"],
  ];
  for (const [source, target] of sources) {
    await copyFile(resolve(root, source), resolve(staging, target));
  }
  execFileSync(process.execPath, [
    resolve(root, "scripts/package-plugin.mjs"),
    "--root", staging,
    "--output", resolve(root, "dist/packages"),
    "--platform", platform,
    "--arch", arch,
    "--channel", "dev",
    "--repository", "ling-stack-org/ling-plugin-chrome-browser",
    "--releaseTag", process.env.LING_PLUGIN_RELEASE_TAG ?? "local-dev",
    "--sourceSha", process.env.GITHUB_SHA ?? "local",
  ], { stdio: "inherit" });
} finally {
  await rm(staging, { recursive: true, force: true });
}
