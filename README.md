# Ling for Chrome Plugin

This repository owns the Manifest V3 Ling for Chrome extension and the signed local Native Messaging Host. Ling Desktop still owns pairing, loopback session state, browser approvals and host registration.

## Local build

```sh
pnpm install --frozen-lockfile
pnpm package:mac
# or
pnpm package:win
```

The extension remains Chrome Web Store-owned for production browser installation. The independent Ling plugin package contains the reviewed extension archive and platform Native Host so Desktop can install or update them from the signed catalog.

See the [Chrome integration contract](docs/chrome-browser-built-in-plugin.md) and [release workflow](docs/RELEASE.md). The [extension directory](extension/) owns storefront copy, privacy and submission instructions.
