# 🤖 Shnny Bot — WhatsApp Assistant

[![Zaileys Version](https://img.shields.io/badge/Zaileys-v4.2.1-3366cc?style=for-the-badge&logo=npm)](https://github.com/zeative/zaileys)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5%2B-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-v11-orange?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![License](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-red?style=for-the-badge)](https://creativecommons.org/licenses/by-nc-nd/4.0/)

A professional, modular WhatsApp assistant built with TypeScript, leveraging the high-level simplicity of the **Zaileys** framework.

---

## 📂 Project Architecture

The codebase features a clean, plug-and-play structure where commands are loaded dynamically from the plugins folder.

```bash
├── src/
│   ├── index.ts          # Main client entry point
│   ├── types.ts          # TypeScript declarations
│   ├── utils/            # Utility helpers
│   └── plugins/          # Dynamic plugin system
│       ├── general/      # General & help commands
│       ├── group/        # Group moderation tools
│       ├── interactive/  # Rich layout templates (buttons, bottomSheets)
│       ├── maker/        # Media conversion & quotes generator
│       ├── media/        # Media downloader and player
│       ├── owner/        # Superuser and state management commands
│       └── storage/      # History logs
```

---

## 📋 Command Categories

*   **General**: Core system tools and help utilities.
*   **Group**: Complete moderation tools for group administrators.
*   **Interactive**: Native rich media templates (interactive buttons, polls, and bottom sheets).
*   **Maker**: Utilities for converting media to stickers or generating WA-style quotes.
*   **Media**: File attachments handler for images, videos, audios, and albums.
*   **Owner**: Advanced developer settings (state controls, dynamic plugin manager, broadcast).
*   **Storage**: Message history tracking.

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
2. Configure your bot's phone number in `src/index.ts`:
   ```typescript
   const client = new Client({
     authType: 'pairing',
     phoneNumber: 'YOUR_PHONE_NUMBER', // e.g. '628xxxxxxxx'
     ...
   });
   ```
3. Run the bot:
   ```bash
   pnpm start
   ```
4. Enter the 8-digit pairing code shown in the terminal into your WhatsApp App (Linked Devices -> Link with Phone Number).

---

## 📜 License & Usage Policy

Licensed under the **Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)**.

- ❌ **Commercial resale or redistribution for profit is strictly prohibited.**
- 🏷️ Attribution to the original author and the **Zaileys** library must be preserved.

---

## 💖 Credits
- **[Zaileys Framework](https://github.com/zeative/zaileys)** — High-level WhatsApp API client.
- **[Baileys Engine](https://github.com/WhiskeySockets/Baileys)** — Lower-level socket protocol handler.
