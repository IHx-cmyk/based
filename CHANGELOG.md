# Changelog

All notable changes and updates made to this WhatsApp bot repository.

---

## [1.1.0] - 2026-06-25

### 🚀 Added
- **Dynamic Prefix Detection (Help Menu)**:
  - The menu now scans incoming messages to detect the specific prefix used by the user (e.g., `#help` vs `/help`).
  - Stored per-chat JID so that subsequent button clicks and category lists dynamically match and display the prefix used by the user.
- **Auto-Read Messages (markRead)**:
  - Implemented automatic mark-as-read `client.chat.markRead` for all incoming text, media, documents, and stickers.
- **Instagram Profile Stalker (`/igstalk` / `/stalkig`)**:
  - Fetches target profile details (followers, category, biography, posts/reels count, private status, and bio links) using ZPI API.
  - Automatically fetches and attaches the profile picture (`avatar`) as the message media.
- **Savefrom Downloader (`/dl` / `/download`)**:
  - Fetches direct media links using Savefrom scraper.
  - Automatically checks file sizes (max 50MB) and sends them to the user formatted as native Video, Audio, or Image messages.
- **Thanks To Kredit (`/tqto` / `/thanksto`)**:
  - Added an interactive thanks-to message using `zaileys` Carousel Card layout, featuring developers, framework, and API credits.
  - Includes a fallback text format for clients that do not support interactive carousels.
- **Crash Prevention Handlers**:
  - Registered `uncaughtException` and `unhandledRejection` process listeners in the main entrypoint. This ensures the bot logs error traces instead of dying suddenly and leaving session files (`creds.json`) in a corrupted state.

### 🔄 Refactored & Converted
- **Pure JavaScript ESM Migration**:
  - Converted the entire codebase from TypeScript (`.ts`) to native **JavaScript ES Modules (ESM)**.
  - All `.ts` files inside `src/` were deleted and replaced with `.js` files.
  - Removed the compilation/build step (`tsc`) completely, allowing the bot to run natively and lightweight on Termux.
  - Updated start scripts in `package.json` to execute `node src/index.js` directly with native `--watch` mode.
- **Terminal Logger Refactoring**:
  - Separated the console logging helper functions and constants (`logIncomingMessage`, `stripAnsi`, `getStringWidth`, `wrapText`, and colors) out of the main `src/index.js` file into a dedicated utility file: `src/utils/logger.js`.
  - Saved over 180 lines of code in the main entrypoint file.

### 🧹 Cleaned & Ignored
- Updated `.gitignore` to exclude `.gemini/` temporary agent files, `pnpm-workspace.yaml`, and `pnpm-lock.yaml` workspace lockfiles.
- Removed unused sample interactive plugins from the repository.
