# Zgyet - Lightweight Outbound IP & Gateway Inspector
> 🌐 A high-performance, privacy-first Manifest V3 browser extension for Chrome & Edge.

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue.svg)](https://developer.chrome.com/docs/extensions/mv3/)
[![Pure Vanilla](https://img.shields.io/badge/Dependencies-0%20Zero-green.svg)](https://github.com/seanxin0126/Zgyet)
[![Multi-language](https://img.shields.io/badge/i18n-8%20Languages-cyan.svg)](_locales)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[English](#-english) | [简体中文](#-简体中文)

---

## 🇺🇸 English

### ✨ Features
- ⚡ **Instant Outbound IP Detection**: Ultra-fast fetching of Public IPv4 / IPv6, Location, ISP & ASN.
- 🛡️ **WebRTC IP Leak Checker**: Real-time detection of WebRTC public and internal IP exposures with clean IPv4 / IPv6 sorted alignment.
- 🔍 **DNS Status & Latency**: Measures live resolution response times and detects split-routing / proxy states.
- 🏠 **LAN & Homelab Gateways**: Built-in quick shortcuts for Soft Routers, Main Routers, and Sub-gateways, with custom one-click addition.
- 🛠️ **Network Tools & Cheatsheet**: Copyable essential network troubleshooting commands (`ipconfig`, `tracert`, `nslookup`, `curl`).
- 🌐 **Full Automatic Localization (i18n)**: Out-of-the-box support for English, 简体中文, 繁體中文, 日本語, 한국어, Deutsch, Español, and Français.
- 🪶 **Ultra Lightweight**: Pure Vanilla JS & CSS, zero runtime dependencies, < 35 KB total package size.

### 🚀 Installation & Local Debugging
1. Clone or download this repository:
   ```bash
   git clone https://github.com/seanxin0126/Zgyet.git
   ```
2. Open your browser's extension manager:
   - **Google Chrome**: navigate to `chrome://extensions`
   - **Microsoft Edge**: navigate to `edge://extensions`
3. Enable **"Developer mode"** in the top right / sidebar.
4. Click **"Load unpacked"** and select the `zgyet` folder.
5. Pin **Zgyet** to your toolbar and enjoy!

### 📂 Project Structure
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
├── styles.css            # Dark theme styling (< 10KB)
├── .gitignore
└── README.md
```

---

## 🇨🇳 简体中文

### ✨ 功能特性
- ⚡ **公网出口 IP 极速探测**：毫秒级展示当前公网 IPv4 / IPv6、运营商（ISP）、地理位置（国家与地区）及 ASN。
- 🛡️ **WebRTC 防泄漏检测**：实时探测浏览器 WebRTC 候选 IP，严格按 IPv4 在前、IPv6 在后智能排序并首位完美对齐。
- 🔍 **DNS 解析与延迟监测**：实时测试 DNS 响应延迟，判断分流与网络接管状态。
- 🏠 **常用局域网网关直达**：内置软路由地址、主路由地址、旁路由地址一键直达，支持自定义添加与回车快捷保存。
- 🛠️ **网络排障指令速查**：内置常用网络命令（`ipconfig`, `tracert`, `nslookup`, `curl` 等），支持一键复制到剪贴板。
- 🌐 **全自动多语言国际化**：内置 8 国语言包（简体中文、繁体中文、英语、日语、韩语、德语、西班牙语、法语），跟随系统语言自动切换。
- 🪶 **极致轻量无依赖**：纯原生 JS 与 CSS 编写，零第三方依赖库，总体积不足 35 KB。

### 🚀 安装与本地加载步骤
1. 克隆或下载本项目源码：
   ```bash
   git clone https://github.com/seanxin0126/Zgyet.git
   ```
2. 打开浏览器的扩展程序管理页：
   - **Google Chrome**：在地址栏输入 `chrome://extensions`
   - **Microsoft Edge**：在地址栏输入 `edge://extensions`
3. 开启页面右上角或左侧的 **“开发者模式”** 开关。
4. 点击 **“加载已解压的扩展程序”**，选择本插件所在的文件夹。
5. 在浏览器工具栏固定 **Zgyet** 图标即可随时使用！

---

## 📄 License

MIT License © 2026 Zgyet
