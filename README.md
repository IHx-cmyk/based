# WhatsApp Bot

<p align="center">
  <img src="src/source/background.jpg" alt="Shnny Bot Banner" width="600px" style="border-radius: 10px;">
</p>

<p align="center">
  <a href="https://github.com/zeative/zaileys"><img src="https://img.shields.io/badge/Zaileys-v4.2.1-3366cc?style=for-the-badge&logo=npm" alt="Zaileys Version"></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://img.shields.io/badge/JavaScript-ESM-yellow?style=for-the-badge&logo=javascript" alt="JavaScript ESM"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-%3E%3D20-green?style=for-the-badge&logo=node.js" alt="Node.js"></a>
  <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/"><img src="https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-red?style=for-the-badge" alt="License"></a>
</p>

A professional, modular WhatsApp assistant built with **JavaScript ES Modules (ESM)**, leveraging the high-level simplicity of the **Zaileys** framework.

---

## 📂 Project Architecture

The codebase features a clean, plug-and-play structure where commands are loaded dynamically from the plugins folder.

```bash
├── src/
│   ├── index.js          # Main client entry point
│   ├── types.js          # Project configuration exports
│   ├── config.js         # Secret API credentials
│   ├── utils/            # Utility helpers
│   │   ├── logger.js     # Custom box console logger
│   │   └── resolve-jids.js
│   └── plugins/          # Dynamic plugin system
│       ├── general/      # General & help commands
│       │   ├── help.js   # Dynamic prefix help menu
│       │   ├── ping.js
│       │   └── tqto.js   # Carousel-card thanks to list
│       ├── group/        # Group moderation tools
│       ├── maker/        # Media conversion & quotes generator
│       ├── owner/        # Superuser and state management commands
│       └── tools/        # Scraper and downloader tools
│           ├── download.js # Multi-source downloader (/dl)
│           └── igstalk.js  # Instagram profile stalker
```

---

## 📋 Command Categories

*   **General**: Core system tools and help utilities.
*   **Group**: Complete moderation tools for group administrators.
*   **Maker**: Utilities for converting media to stickers or generating WA-style quotes.
*   **Tools**: Scraper and downloader tools (IG Profile Stalk, Downloader).
*   **Owner**: Advanced developer settings (state controls, dynamic plugin manager, broadcast).

> [!NOTE]
> While the bot relies on the **Zaileys** library for simplified API endpoints and rich template layers, several underlying features and advanced modules still communicate directly with the original **Baileys** engine to preserve full raw functionality.

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20.0.0
- pnpm (recommended)

### Installation
1. Install project dependencies:
   ```bash
   pnpm install
   ```
2. Configure your bot's phone number in `src/index.js`:
   ```javascript
   const client = new Client({
     authType: 'pairing',
     phoneNumber: 'YOUR_PHONE_NUMBER', // e.g. '628xxxxxxxx'
     ...
   });
   ```
3. Run the bot directly:
   - Development (with hot-reload using Node --watch):
     ```bash
     pnpm dev
     ```
   - Production:
     ```bash
     pnpm start
     ```
4. Enter the 8-digit pairing code shown in the terminal into your WhatsApp App (Linked Devices -> Link with Phone Number).

---

## 📄 Version Changelog
Please see [CHANGELOG.md](CHANGELOG.md) for full details on the latest feature additions and codebase refactor updates.

---

## 📜 License & Usage Policy

Licensed under the **Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)**.

- ❌ **Commercial resale or redistribution for profit is strictly prohibited.**
- 🏷️ Attribution to the original author and the **Zaileys** library must be preserved.

---

## 💖 Credits
- **[Zaileys Framework](https://github.com/zeative/zaileys)** — High-level WhatsApp API client.
- **[Baileys Engine](https://github.com/WhiskeySockets/Baileys)** — Lower-level socket protocol handler.
