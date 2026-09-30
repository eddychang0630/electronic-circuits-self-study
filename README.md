# 電子電路分析自學筆記

線上閱讀：<https://eddychang0630.github.io/electronic-circuits-self-study/>

根據使用者提供的 21 頁影像型《電子電路分析講義.pdf》（投影片 1–82）整理的繁體中文自學網站。包含摘要、目錄、電荷／離子／電場／等電位先備課、原創剖面示意、標準電路符號、KaTeX 公式、可調 VGS／VDS／VSB 的 MOS 互動動畫、公式推導、解題流程、自編例題與講義頁碼對照。

## 閱讀與安裝

- 直接打開 `index.html` 即可閱讀全部內容。
- 網站發布到 HTTPS（例如 GitHub Pages）後，可在 iPhone／iPad Safari 用「分享 → 加入主畫面」，或在 Android Chrome 用「安裝應用程式／加入主畫面」。首次連網開啟後，Service Worker 會快取網站內容供離線閱讀。
- 本機測試 PWA 可在目錄中執行 `python -m http.server 8000`，再開啟 `http://localhost:8000/`。

## GitHub Pages

本專案是純靜態檔，所有資源均用相對路徑，可直接將 `main` 分支根目錄設為 Pages 發布來源。GitHub 儲存庫的 **Settings → Pages → Build and deployment → Deploy from a branch → main / (root) → Save**。稍後可在 Pages 設定頁看到公開網址。

## 來源與範圍

原始掃描 PDF 與 `source-pages/` 僅供本機核對，不屬於網站發布內容。剖面與載子圖為教學示意；電路圖由開源標準符號產生。公式是長通道第一階模型，適用條件在筆記正文中列出；實際晶片設計需使用製程模型。

第 00A 章是為零基礎自學新增的先備課，來源文字維護於 `tools/foundations-section.html`，執行 `python tools/build-foundations.py` 可重新整合進 `index.html`。內容區分電解液中的可移動離子與矽晶格中固定的離化摻雜原子，並標出適用的電場與導體近似條件。

## 開源元件

- [KaTeX](https://katex.org/) 0.18.9（MIT）：網站自帶排版程式與字型，授權見 `vendor/katex/LICENSE.txt`。
- [Schemdraw](https://schemdraw.readthedocs.io/) 0.23（MIT）：在建置時產生 `assets/diagrams/` 的標準符號向量圖；授權見 `assets/LICENSE-schemdraw.txt`。可用 `pip install -r tools/requirements.txt` 和 `python tools/generate_diagrams.py` 重新產生。
- 互動剖面屬於定性教學動畫。參數已在頁面列出，不代表特定晶片或粒子的實際尺寸與速度。
