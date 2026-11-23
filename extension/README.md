# Ling for Chrome

Ling for Chrome is the auditable Manifest V3 extension used by the built-in Chrome plugin.

Install the production extension from the [Chrome Web Store](https://chromewebstore.google.com/detail/ling-for-chrome/mbmlnnfhebclljonhedpjghbhibfapei).

To test a local build in Chrome, follow these steps.

1. Run `corepack pnpm --dir extension build`.
2. Open `chrome://extensions`, enable Developer mode, and choose `Load unpacked`.
3. Select `extension/dist`.
4. In the companion [Ling source checkout](https://github.com/ling-stack-org/ling-stack), run `corepack pnpm ling browser-host install` once to register the development host.
5. Enable Chrome in Ling Plugin Manager. The extension connects automatically while Ling is running.

The extension does not request access to cookies, passwords, history, bookmarks, downloads,
`chrome.debugger`, or `webRequest`. It uses `nativeMessaging` only to reach the signed local Ling
Browser Host; the Host forwards the existing reviewed browser protocol and does not read page data.
The `alarms` permission only wakes the Manifest V3 worker to restore that local connection after
Ling restarts or a temporary disconnect.

The production Chrome Web Store extension ID is `mbmlnnfhebclljonhedpjghbhibfapei`. The manifest
public key is committed so local builds and the Store package keep the same reviewed identity. The
legacy development ID remains daemon-allowlisted only for compatibility with earlier local builds.

Before publication, follow [Chrome Web Store Submission](STORE_SUBMISSION.md) and use the prepared
[Dashboard copy](STORE_LISTING.md), [privacy policy](PRIVACY.md), and
[store assets](store-assets/README.md). Publisher contact verification and final submission remain
human release gates.
