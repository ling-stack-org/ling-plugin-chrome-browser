import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { releaseInputs, verifyNativeReleaseSignature } from "./release-inputs.mjs";

const root = resolve(import.meta.dirname, "..");
const [platform, arch] = process.argv.slice(2);
if (process.platform !== platform || process.arch !== arch
  || !["darwin/arm64", "win32/x64"].includes(platform + "/" + arch)) {
  throw new Error("Build Ling for Chrome on its target platform and architecture.");
}
const release = await releaseInputs(root);

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
  if (release.channel === "stable") {
    const hostPath = resolve(staging, "runtime", host);
    verifyNativeReleaseSignature(hostPath, platform);
    const hostMetadataPath = resolve(staging, "runtime/build-metadata.json");
    const hostMetadata = JSON.parse(await readFile(hostMetadataPath, "utf8"));
    const extensionMetadata = JSON.parse(await readFile(resolve(staging, "runtime/extension-build-metadata.json"), "utf8"));
    if (hostMetadata.sourceCommit !== release.sourceSha || extensionMetadata.sourceCommit !== release.sourceSha
      || extensionMetadata.zipSha256 !== sha256(await readFile(resolve(staging, "runtime/ling-for-chrome.zip")))) {
      throw new Error("Chrome build metadata must match the selected source and extension archive.");
    }
    await writeFile(hostMetadataPath, JSON.stringify({ ...hostMetadata,
      hostSha256: sha256(await readFile(hostPath)),
      signing: platform === "darwin" ? "developer-id" : "authenticode",
    }, null, 2) + "\n");
  }
  execFileSync(process.execPath, [
    resolve(root, "scripts/package-plugin.mjs"),
    "--root", staging,
    "--output", resolve(root, "dist/packages"),
    "--platform", platform,
    "--arch", arch,
    "--channel", release.channel,
    "--repository", "ling-stack-org/ling-plugin-chrome-browser",
    "--releaseTag", release.tag,
    "--sourceSha", release.sourceSha,
  ], { stdio: "inherit" });
} finally {
  await rm(staging, { recursive: true, force: true });
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}
