// Zgyet - Lightweight Outbound & Gateway Inspector
// Pure Vanilla JavaScript, Zero Dependencies, Full chrome.i18n Localization Support (<50ms)

// Internationalization Helper
function msg(key, fallback = "", substitutions = null) {
  if (typeof chrome !== "undefined" && chrome.i18n && chrome.i18n.getMessage) {
    const translated = chrome.i18n.getMessage(key, substitutions);
    if (translated) return translated;
  }
  return fallback;
}

// Automatically translate DOM elements based on data-i18n attributes
function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const text = msg(key);
    if (text) el.textContent = text;
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    const text = msg(key);
    if (text) el.placeholder = text;
  });

  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    const key = el.getAttribute("data-i18n-title");
    const text = msg(key);
    if (text) el.title = text;
  });
}

function getDefaultGateways() {
  return [
    { id: "gw-1", name: msg("gwOpenwrt", "Soft Router Address"), url: "http://192.168.1.1" },
    { id: "gw-2", name: msg("gwMain", "Main Router Address"), url: "http://192.168.0.1" },
    { id: "gw-3", name: msg("gwProxy", "Side Router Address"), url: "http://10.0.0.1" }
  ];
}

document.addEventListener("DOMContentLoaded", () => {
  applyI18n();
  initTabs();
  initCopyActions();
  initGatewayManager();
  initRefresh();
  
  // Auto detect on popup open
  runDiagnostics();
});

// 1. Tab Switching Logic
function initTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      const targetId = tab.getAttribute("data-tab");
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add("active");
    });
  });
}

// 2. Main Diagnostics Orchestrator
async function runDiagnostics() {
  const refreshBtn = document.getElementById("btn-refresh");
  const spinIcon = refreshBtn?.querySelector(".spin-icon");
  if (spinIcon) spinIcon.classList.add("spinning");

  // Reset UI states
  const detectingText = msg("detecting", "Detecting...");
  const queryingText = msg("querying", "Querying...");

  document.getElementById("outbound-ip").textContent = detectingText;
  document.getElementById("latency-badge").textContent = "-- ms";
  document.getElementById("geo-location").textContent = queryingText;
  document.getElementById("isp-name").textContent = "--";
  document.getElementById("webrtc-ip").textContent = detectingText;
  document.getElementById("dns-server").textContent = detectingText;

  const startTime = performance.now();

  try {
    // Parallel detection: IP & Geo + WebRTC leak check
    await Promise.allSettled([
      fetchOutboundIP(startTime),
      detectWebRTCLeak(),
      detectDNSInfo()
    ]);
  } finally {
    if (spinIcon) {
      setTimeout(() => spinIcon.classList.remove("spinning"), 300);
    }
  }
}

// 3. Outbound IP & Geo Location Fetcher (High Speed Multi-Fallback + Silent Handling)
async function fetchOutboundIP(startTime) {
  let data = null;
  let latency = 0;

  // 1. Primary endpoint: ipwho.is
  try {
    const res = await fetch("https://ipwho.is/", {
      cache: "no-store",
      signal: AbortSignal.timeout(3500)
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.success !== false && json.ip) {
        data = json;
        latency = Math.round(performance.now() - startTime);
      }
    }
  } catch (err) {}

  // 2. Secondary fallback: api.ip.sb/geoip
  if (!data || !data.ip) {
    try {
      const res = await fetch("https://api.ip.sb/geoip", {
        cache: "no-store",
        signal: AbortSignal.timeout(3500)
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.ip) {
          data = {
            ip: json.ip,
            country: json.country || "",
            city: json.city || "",
            country_code: json.country_code || "",
            connection: {
              isp: json.isp || json.organization || "Outbound ISP",
              asn: json.asn ? `AS${json.asn}` : ""
            }
          };
          latency = Math.round(performance.now() - startTime);
        }
      }
    } catch (err) {}
  }

  // 3. Third fallback: api.ipify.org
  if (!data || !data.ip) {
    try {
      const res = await fetch("https://api.ipify.org?format=json", {
        cache: "no-store",
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.ip) {
          data = {
            ip: json.ip,
            country: "Internet Route",
            city: "",
            country_code: "",
            connection: { isp: "ISP Network", asn: "" }
          };
          latency = Math.round(performance.now() - startTime);
        }
      }
    } catch (err) {}
  }

  // Render to UI
  const ipEl = document.getElementById("outbound-ip");
  const latencyEl = document.getElementById("latency-badge");
  const geoEl = document.getElementById("geo-location");
  const ispEl = document.getElementById("isp-name");
  const ipVerBadge = document.getElementById("ip-version-badge");

  if (data && data.ip) {
    ipEl.textContent = data.ip;
    latencyEl.textContent = `${latency} ms`;
    latencyEl.className = getLatencyBadgeClass(latency);

    // IPv4 vs IPv6
    ipVerBadge.textContent = data.ip.includes(":") ? "IPv6" : "IPv4";

    // Geo Info: Adapt order based on locale conventions
    const country = data.country || "";
    const city = data.city || "";
    const userLocale = (typeof chrome !== "undefined" && chrome.i18n && chrome.i18n.getUILanguage) 
      ? chrome.i18n.getUILanguage().toLowerCase() 
      : (navigator.language || "en").toLowerCase();

    const isEastAsian = userLocale.startsWith("zh") || userLocale.startsWith("ja") || userLocale.startsWith("ko");

    if (country && city) {
      geoEl.textContent = isEastAsian ? `${country} · ${city}` : `${city}, ${country}`;
    } else {
      geoEl.textContent = country || city || "Unknown Location";
    }

    // ISP Info: Standardized English ISP name + ASN
    const rawIsp = (data.connection && data.connection.isp) || data.isp || "Outbound Provider";
    const asn = (data.connection && data.connection.asn) ? ` (${data.connection.asn})` : "";
    ispEl.textContent = `${rawIsp}${asn}`;
  } else {
    ipEl.textContent = msg("detecting", "Timeout / Offline");
    geoEl.textContent = "Location unavailable";
    ispEl.textContent = "--";
    latencyEl.textContent = "-- ms";
    latencyEl.className = "badge badge-neutral";
  }
}

// 4. WebRTC IP Leak Detector (Uses Browser Local RTCPeerConnection)
function detectWebRTCLeak() {
  return new Promise(resolve => {
    const webrtcEl = document.getElementById("webrtc-ip");
    const webrtcStatus = document.getElementById("webrtc-status");

    try {
      const rtc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
      });

      let hasResolved = false;
      const ips = new Set();

      function finalize() {
        if (hasResolved) return;
        hasResolved = true;

        try { rtc.close(); } catch (e) {}

        if (ips.size === 0) {
          webrtcEl.textContent = msg("webrtcSafe", "Protected (No IP Leak)");
          webrtcStatus.className = "status-indicator status-ok";
          resolve();
          return;
        }

        // Sort: IPv4 first, IPv6 second
        const sortedIps = Array.from(ips).sort((a, b) => {
          const isV6A = a.includes(":");
          const isV6B = b.includes(":");
          if (isV6A === isV6B) {
            return a.localeCompare(b, undefined, { numeric: true });
          }
          return isV6A ? 1 : -1; // v4 first, v6 second
        });

        const label = msg("candidateLabel", "Candidate IPs:");
        let html = `<div class="webrtc-candidate-box">`;
        html += `<div class="webrtc-candidate-label">${escapeHtml(label)}</div>`;
        html += `<div class="webrtc-ip-list">`;

        sortedIps.forEach(ip => {
          const isV6 = ip.includes(":");
          const typeBadge = isV6 
            ? `<span class="ip-type-badge badge-v6">IPv6</span>` 
            : `<span class="ip-type-badge badge-v4">IPv4</span>`;
          html += `<div class="webrtc-ip-row">${typeBadge}<span class="webrtc-ip-text">${escapeHtml(ip)}</span></div>`;
        });

        html += `</div></div>`;
        webrtcEl.innerHTML = html;
        webrtcStatus.className = "status-indicator status-warning";
        resolve();
      }

      rtc.createDataChannel("");
      rtc.createOffer().then(offer => rtc.setLocalDescription(offer)).catch(() => finalize());

      rtc.onicecandidate = evt => {
        if (!evt || !evt.candidate || !evt.candidate.candidate) {
          finalize();
          return;
        }

        const cand = evt.candidate.candidate;
        const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;
        const matches = cand.match(ipRegex);

        if (matches) {
          matches.forEach(ip => {
            if (!ip.endsWith(".local") && !ip.startsWith("0.0.0.0")) {
              ips.add(ip);
            }
          });
        }
      };

      // 1.8s Timeout fallback
      setTimeout(() => finalize(), 1800);

    } catch (e) {
      webrtcEl.textContent = msg("webrtcDisabled", "WebRTC Disabled / Protected");
      webrtcStatus.className = "status-indicator status-ok";
      resolve();
    }
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

function getLatencyColorClass(ms) {
  if (ms < 450) return "latency-good";       // 绿字 (<450ms)
  if (ms <= 1000) return "latency-medium";    // 黄字 (450ms - 1000ms)
  return "latency-slow";                     // 红字 (>1000ms)
}

function getLatencyBadgeClass(ms) {
  if (ms < 450) return "badge badge-latency-good";
  if (ms <= 1000) return "badge badge-latency-medium";
  return "badge badge-latency-slow";
}

// 5. DNS / Fast Protocol Detection & Resolver IP
async function detectDNSInfo() {
  const dnsEl = document.getElementById("dns-server");
  const dnsStatus = document.getElementById("dns-status");

  let dnsLatency = null;
  let dnsIp = null;

  // 1. Measure Latency
  const latencyPromise = (async () => {
    try {
      const t0 = performance.now();
      const res = await fetch("https://1.1.1.1/cdn-cgi/trace", { cache: "no-store", signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        dnsLatency = Math.round(performance.now() - t0);
      }
    } catch (e) {
      try {
        const t0 = performance.now();
        await fetch("https://cloudflare-dns.com/dns-query?name=cloudflare.com&type=A", {
          headers: { accept: "application/dns-json" },
          signal: AbortSignal.timeout(3000)
        });
        dnsLatency = Math.round(performance.now() - t0);
      } catch (e2) {}
    }
  })();

  // 2. Fetch Recursive DNS Resolver IP
  const resolverIpPromise = (async () => {
    try {
      const res = await fetch("https://edns.ip-api.com/json", { cache: "no-store", signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        if (data && data.dns && data.dns.ip) {
          dnsIp = data.dns.ip;
        }
      }
    } catch (e) {}
  })();

  await Promise.allSettled([latencyPromise, resolverIpPromise]);

  const colorClass = dnsLatency !== null ? getLatencyColorClass(dnsLatency) : "latency-good";
  const coloredLatency = dnsLatency !== null ? `<span class="${colorClass}">${dnsLatency}</span>` : "";
  const latencyStr = dnsLatency !== null
    ? msg("dnsOk", `Normal (Response: ${dnsLatency}ms)`, [coloredLatency])
    : msg("dnsOk", "Normal");

  let statusIndicatorClass = "status-indicator status-ok";
  if (dnsLatency !== null) {
    if (dnsLatency < 450) {
      statusIndicatorClass = "status-indicator status-ok";
    } else if (dnsLatency <= 1000) {
      statusIndicatorClass = "status-indicator status-warning";
    } else {
      statusIndicatorClass = "status-indicator status-danger";
    }
  }

  if (dnsIp) {
    dnsEl.innerHTML = `
      <div class="webrtc-ip-row" style="margin-top: 3px;">
        <span class="ip-type-badge badge-dns">DNS</span>
        <span class="webrtc-ip-text">${escapeHtml(dnsIp)}</span>
      </div>
      <div class="dns-sub-status">${latencyStr}</div>
    `;
    dnsStatus.className = statusIndicatorClass;
  } else if (dnsLatency !== null) {
    dnsEl.innerHTML = `
      <div class="dns-sub-status">${latencyStr}</div>
    `;
    dnsStatus.className = statusIndicatorClass;
  } else {
    dnsEl.innerHTML = `
      <div class="dns-sub-status">${msg("dnsCustom", "Local Gateway / Proxy Managed")}</div>
    `;
    dnsStatus.className = "status-indicator status-ok";
  }
}

// 6. Gateway & Homelab Manager (Chrome Storage Integration)
function initGatewayManager() {
  loadGateways();

  const addBtn = document.getElementById("btn-add-gw");
  const nameInput = document.getElementById("custom-gw-name");
  const urlInput = document.getElementById("custom-gw-url");

  const handleAdd = () => {
    const name = nameInput.value.trim();
    let url = urlInput.value.trim();

    if (!name || !url) {
      showToast(msg("enterGwAlert", "Please enter gateway name and address"));
      return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;
    }

    const newGw = {
      id: "gw-" + Date.now(),
      name,
      url
    };

    saveGateway(newGw);
    nameInput.value = "";
    urlInput.value = "";
  };

  addBtn?.addEventListener("click", handleAdd);
  nameInput?.addEventListener("keydown", e => { if (e.key === "Enter") handleAdd(); });
  urlInput?.addEventListener("keydown", e => { if (e.key === "Enter") handleAdd(); });
}

function loadGateways() {
  const defaultList = getDefaultGateways();
  const normalize = (list) => {
    return list.map(item => {
      if (item.id === "gw-1" && (item.name.includes("OpenWrt") || item.name.includes("软路由") || item.name.includes("Soft Router"))) {
        item.name = msg("gwOpenwrt", "Soft Router Address");
      }
      if (item.id === "gw-2" && (item.name.includes("主路由网关") || item.name === "Main Router Gateway")) {
        item.name = msg("gwMain", "Main Router Address");
      }
      if (item.id === "gw-3" && (item.name.includes("旁路") || item.name.includes("梯子") || item.name.includes("Proxy") || item.name.includes("Side Gateway"))) {
        item.name = msg("gwProxy", "Side Router Address");
      }
      return item;
    });
  };

  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(["zgyet_gateways"], result => {
      const list = result.zgyet_gateways ? normalize(result.zgyet_gateways) : defaultList;
      renderGateways(list);
    });
  } else {
    const local = localStorage.getItem("zgyet_gateways");
    const list = local ? normalize(JSON.parse(local)) : defaultList;
    renderGateways(list);
  }
}

function saveGateway(newGw) {
  const defaultList = getDefaultGateways();
  const handleSave = (list) => {
    list.push(newGw);
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ zgyet_gateways: list }, () => {
        renderGateways(list);
        showToast(msg("gwAdded", "Gateway added"));
      });
    } else {
      localStorage.setItem("zgyet_gateways", JSON.stringify(list));
      renderGateways(list);
      showToast(msg("gwAdded", "Gateway added"));
    }
  };

  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(["zgyet_gateways"], result => {
      const list = result.zgyet_gateways || [...defaultList];
      handleSave(list);
    });
  } else {
    const local = localStorage.getItem("zgyet_gateways");
    const list = local ? JSON.parse(local) : [...defaultList];
    handleSave(list);
  }
}

function deleteGateway(id) {
  const defaultList = getDefaultGateways();
  const handleDelete = (list) => {
    const updated = list.filter(item => item.id !== id);
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ zgyet_gateways: updated }, () => {
        renderGateways(updated);
        showToast(msg("gwDeleted", "Gateway removed"));
      });
    } else {
      localStorage.setItem("zgyet_gateways", JSON.stringify(updated));
      renderGateways(updated);
      showToast(msg("gwDeleted", "Gateway removed"));
    }
  };

  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(["zgyet_gateways"], result => {
      handleDelete(result.zgyet_gateways || defaultList);
    });
  } else {
    const local = localStorage.getItem("zgyet_gateways");
    handleDelete(local ? JSON.parse(local) : defaultList);
  }
}

function renderGateways(list) {
  const container = document.getElementById("gateway-list");
  if (!container) return;

  container.innerHTML = "";
  const enterText = msg("enterBtn", "Open");

  list.forEach(gw => {
    const item = document.createElement("div");
    item.className = "gateway-item";

    const cleanDisplayUrl = gw.url.replace(/^https?:\/\//, "");

    item.innerHTML = `
      <div class="gw-meta">
        <span class="gw-name">${escapeHtml(gw.name)}</span>
        <span class="gw-ip">${escapeHtml(cleanDisplayUrl)}</span>
      </div>
      <div class="gw-actions">
        <a href="${escapeHtml(gw.url)}" target="_blank" class="btn-link">${escapeHtml(enterText)}</a>
        <button class="btn-del-gw" data-id="${gw.id}" title="Delete">&times;</button>
      </div>
    `;

    item.querySelector(".btn-del-gw")?.addEventListener("click", () => {
      deleteGateway(gw.id);
    });

    container.appendChild(item);
  });
}

// 7. Clipboard & Copy Utilities
function initCopyActions() {
  document.getElementById("btn-copy-ip")?.addEventListener("click", () => {
    const ipText = document.getElementById("outbound-ip")?.textContent;
    if (ipText && !ipText.includes("...")) {
      copyText(ipText, msg("ipCopied", "IP Copied"));
    }
  });

  document.querySelectorAll(".btn-copy-cmd").forEach(btn => {
    btn.addEventListener("click", () => {
      const cmd = btn.getAttribute("data-cmd");
      if (cmd) copyText(cmd, msg("cmdCopied", "Command Copied"));
    });
  });
}

function copyText(text, message) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(message || msg("copied", "Copied to clipboard"));
  }).catch(() => {
    const input = document.createElement("input");
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    showToast(message || msg("copied", "Copied to clipboard"));
  });
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove("hidden");

  clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.classList.add("hidden");
  }, 1800);
}

function initRefresh() {
  document.getElementById("btn-refresh")?.addEventListener("click", () => {
    runDiagnostics();
  });
}

// Helper: Country Code to Emoji Flag (e.g. US -> 🇺🇸, CN -> 🇨🇳)
function getCountryFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, tag => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  }[tag] || tag));
}
