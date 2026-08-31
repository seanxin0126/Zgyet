# Zgyet - Lightweight Outbound IP & Gateway Inspector
> 🌐 A high-performance, privacy-first Manifest V3 browser extension for Chrome & Edge.

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue.svg)](https://developer.chrome.com/docs/extensions/mv3/)
[![Pure Vanilla](https://img.shields.io/badge/Dependencies-0%20Zero-green.svg)](https://github.com)
[![Multi-language](https://img.shields.io/badge/i18n-8%20Languages-cyan.svg)](_locales)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[English](#features) | [简体中文](#功能特性)

---

## ✨ Features (功能特性)

- ⚡ **Instant Outbound IP Detection**: Ultra-fast fetching of Public IPv4 / IPv6, Location, ISP & ASN.
- 🛡️ **WebRTC IP Leak Checker**: Real-time detection of WebRTC public and internal IP exposures with clean IPv4 / IPv6 sorted alignment.
- 🔍 **DNS Status & Latency**: Measures live resolution response times and detects split-routing / proxy states.
- 🏠 **LAN & Homelab Gateways**: Built-in quick shortcuts for Soft Routers, Main Routers, and Sub-gateways, with custom one-click addition.
- 🛠️ **Geek Network Cheatsheet**: Copyable essential network troubleshooting commands (`ipconfig`, `tracert`, `nslookup`, `curl`).
- 🌐 **Full Automatic Localization (i18n)**: Out-of-the-box support for English, 简体中文, 繁體中文, 日本語, 한국어, Deutsch, Español, and Français.
- 🪶 **Ultra Lightweight**: Pure Vanilla JS & CSS, zero runtime dependencies, < 35 KB total package size.

---

## 🚀 Installation & Loading (安装与本地调试)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/your-username/zgyet.git
   ```
2. Open your browser's extension manager:
   - **Google Chrome**: navigate to `chrome://extensions`
   - **Microsoft Edge**: navigate to `edge://extensions`
3. Enable **"Developer mode" (开发者模式)** in the top right / sidebar.
4. Click **"Load unpacked" (加载已解压的扩展程序)** and select the project folder.
5. Pin **Zgyet** to your toolbar and enjoy!

---

## 📂 Project Structure (项目目录结构)

```
zgyet/
├── _locales/              # Multi-language localization packages (8 locales)
│   ├── en/messages.json
│   ├── zh_CN/messages.json
│   └── ...
├── icons/                # High-res extension icons (16x16, 48x48, 128x128)
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── manifest.json         # Manifest V3 extension configuration
├── popup.html            # Minimalist, semantic popup UI
├── popup.js              # Pure client-side diagnostics and storage logic
├── styles.css            # Dark geek theme styling (< 10KB)
├── .gitignore
└── README.md
```

---

## 📄 License

MIT License © 2026 Zgyet
