# Ling for Chrome releases

GitHub Actions type-checks and tests the extension, tests the Rust Native Host, then creates platform candidates. The archives and SHA-256 sidecars are attached to the [candidate run](https://github.com/ling-stack-org/ling-plugin-chrome-browser/actions/workflows/release.yml).

Preserve the Chrome Web Store extension ID and the `ling.chrome.native.v1` protocol. Follow the [store submission guide](../extension/STORE_SUBMISSION.md) for browser publication. Verify the Native Host system signature and its end-to-end registration and connection on the supported platforms before publishing the Ling runtime package.

Release assets include the reviewed extension archive, build metadata, platform Native Host and notices. Submit the immutable Release URLs, size and SHA-256 to the [official Ling catalog](https://github.com/ling-stack-org/ling-stack/blob/main/docs/design/plugin-independent-packaging.md).
