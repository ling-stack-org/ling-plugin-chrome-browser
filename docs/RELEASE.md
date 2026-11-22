# Ling for Chrome releases

GitHub Actions type-checks and tests the extension, tests the Rust Native Host, then creates platform candidates. The archives and SHA-256 sidecars are attached to the [candidate run](https://github.com/ling-stack-org/ling-plugin-chrome-browser/actions/workflows/release.yml).

Preserve the Chrome Web Store extension ID and the `ling.chrome.native.v1` protocol. Follow the [store submission guide](../extension/STORE_SUBMISSION.md) for browser publication. Verify the Native Host system signature and its end-to-end registration and connection on the supported platforms before publishing the Ling runtime package.

After signing the Native Host in `host/dist/native`, set `LING_PLUGIN_RELEASE_TAG` to the matching stable tag and run `node scripts/stage-runtime.mjs darwin arm64` or `node scripts/stage-runtime.mjs win32 x64` on the corresponding target. The staging step preserves the signed bytes and checks the release identity against `LING_PLUGIN_DARWIN_TEAM_ID` on macOS or `LING_PLUGIN_WINDOWS_SIGNER_SHA256` on Windows.

Release assets include the reviewed extension archive, build metadata, platform Native Host and notices. Upload the archives and sidecars from `dist/packages` under the new immutable tag. Submit the tag, source commit and platform archive digests to the [official Ling catalog](https://github.com/ling-stack-org/ling-stack/blob/main/docs/design/plugin-independent-packaging.md).
