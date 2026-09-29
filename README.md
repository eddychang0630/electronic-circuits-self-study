# 電子電路分析自學筆記

根據使用者提供的 21 頁影像型《電子電路分析講義.pdf》（投影片 1–82）整理的繁體中文自學網站。包含摘要、目錄、原創示意圖、公式推導、解題流程、自編例題與講義頁碼對照。

## 閱讀與安裝

- 直接打開 `index.html` 即可閱讀全部內容。
- 網站發布到 HTTPS（例如 GitHub Pages）後，可在 iPhone／iPad Safari 用「分享 → 加入主畫面」，或在 Android Chrome 用「安裝應用程式／加入主畫面」。首次連網開啟後，Service Worker 會快取網站內容供離線閱讀。
- 本機測試 PWA 可在目錄中執行 `python -m http.server 8000`，再開啟 `http://localhost:8000/`。

## GitHub Pages

本專案是純靜態檔，所有資源均用相對路徑，可直接將 `main` 分支根目錄設為 Pages 發布來源。GitHub 儲存庫的 **Settings → Pages → Build and deployment → Deploy from a branch → main / (root) → Save**。稍後可在 Pages 設定頁看到公開網址。

## 來源與範圍

原始掃描 PDF 與 `source-pages/` 僅供本機核對，不屬於網站發布內容。所有網站圖均為原創 SVG 概念圖。公式是長通道第一階模型，適用條件在筆記正文中列出；實際晶片設計需使用製程模型。
