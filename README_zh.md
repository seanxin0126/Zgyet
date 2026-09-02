# Zgyet 🌐 `v1.0.4`

<div align="center">

[![Version](https://img.shields.io/badge/version-v1.0.4-blue.svg)](https://github.com/seanxin0126/Zgyet)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-success.svg)](https://developer.chrome.com/docs/extensions/mv3/)
[![Pure Vanilla](https://img.shields.io/badge/Dependencies-0%20Zero-green.svg)](https://github.com/seanxin0126/Zgyet)
[![Multi-language](https://img.shields.io/badge/i18n-8%20Languages-cyan.svg)](_locales)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**[English](README.md) | [简体中文](README_zh.md)**

</div>

---

> **专为 Chrome 与 Edge 打造的高性能、轻量级 Manifest V3 网络出口与网关助手**

`Zgyet` 是一款专为网络工程师、Homelab 玩家及注重隐私的用户打造的浏览器轻量扩展。纯原生开发，毫秒级探测公网出口链路、递归 DNS 解析节点、WebRTC 候选泄露，并提供局域网网关快捷直达，0 依赖、0 追踪、轻巧迅速。

---

### 🌟 核心特性与技术亮点

| 功能模块 | 核心机制 | 性能与安全优势 |
| :--- | :--- | :--- |
| **公网出口链路极速探测** | `IPv4 / IPv6 三级容灾引擎` | 毫秒级呈现真实公网 IP、运营商（ISP）、地理位置（国家与地区）及 ASN。 |
| **WebRTC 隐私防泄漏监测** | `STUN 候选地址穿透嗅探` | 实时排查浏览器 WebRTC 局域网与公网候选泄露，IPv4/IPv6 完美排序对齐。 |
| **DNS 解析节点与防污染** | `递归 DNS 实时分析器` | 识别当前上游 DNS 出口 IP，三段式响应延迟变色提示（`<450ms` 绿，`450~1000ms` 黄，`>1000ms` 红），并实时提示防污染状态。 |
| **常用局域网网关直达** | `安全协议白名单直连` | 软路由、主路由、旁路由地址一键直达，支持自定义添加，严格限制 `http/https` 防范 XSS。 |
| **网络排障指令速查** | `一键剪贴板交互中心` | 内置 `ipconfig`、`tracert`、`nslookup`、`curl` 等常用排障命令，点击即复制。 |
| **全自动 8 国语言国际化** | `Chrome i18n 语言引擎` | 自适应简体中文、繁体中文、英语、日语、韩语、德语、西班牙语、法语。 |

---

### 📸 界面预览

<div align="center">
  <img src="assets/screenshot-zh-outbound.png" alt="出口链路与防泄漏" width="32%" />
  <img src="assets/screenshot-zh-gateways.png" alt="常用局域网网关" width="32%" />
  <img src="assets/screenshot-zh-tools.png" alt="网络排障速查" width="32%" />
</div>

---

### 🚀 快速安装与本地加载

1. **克隆或下载项目源码**：
   ```bash
   git clone https://github.com/seanxin0126/Zgyet.git
   ```
2. **打开浏览器扩展管理页面**：
   - **Google Chrome**：地址栏输入 `chrome://extensions`
   - **Microsoft Edge**：地址栏输入 `edge://extensions`
3. **开启右上角的“开发者模式”** 开关。
4. **加载扩展程序**：
   - 点击 **“加载已解压的扩展程序”** 按钮，选择 `Zgyet` 源码文件夹。
5. **固定至工具栏**：
   - 在浏览器右上角扩展栏固定 **Zgyet** 图标，点击即可随时唤起网络诊断面板！

---

### 📝 版本更新日志

#### `v1.0.4` (最新版本)
- 🔒 **安全加固**：网关链接实施协议白名单，阻断 `javascript:` / `data:` XSS 注入攻击，防御 Storage 数据投毒。
- 🛡️ **DOM 强化**：所有外部链接添加 `rel="noopener noreferrer"` 防护，网关标识转义防注入。
- 🐛 **代码精简**：清理冗余函数定义，移除未调用的死代码。
- 🎨 **色彩修复**：补充 `--accent-text` CSS 变量，版本号与 DNS 状态标签恢复标准青色高亮。

#### `v1.0.3`
- ✨ **DNS 安全检测**：新增实时 DNS 泄露与污染检测状态行，支持 8 语言自适应。
- ⚡ **DNS IP 与动态延迟**：递归 DNS 服务器 IP 展示及三段式色彩延迟指标。
- 🛡️ **后台 0 报警**：三级高速容灾出口探测引擎，确保扩展管理页 0 错误、0 警告。

#### `v1.0.0` ~ `v1.0.2`
- 🎉 正式发布，基于 Manifest V3 原生架构，总体积仅约 35 KB，纯原生 JavaScript / CSS 编写。

---

## 📄 开源协议

MIT License © 2026 [Zgyet](https://github.com/seanxin0126/Zgyet)
