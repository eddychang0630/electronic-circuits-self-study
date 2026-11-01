# 電子電路分析｜橫式 A4 大字完整筆記

[開啟完整教材](https://eddychang0630.github.io/electronic-circuits-self-study/)

網站首頁對應使用者指定的 `電子電路分析_橫式A4大字完整筆記.html` 完整總講義，包含全部 7 章、2026/09/09–2026/10/28 的課程內容、公式推導、作業與隨堂小考。本次發布驗證共有 911 個公式及 18 個教學 SVG。

## 本次修正

- 入門圖 0-1 的 Q 點落在電流曲線上，紅色切線通過 Q，斜率由同一平方律模型計算。
- 補正源極接地的適用範圍，以及 nMOS 的 P 型 Body 與源／汲極 PN 接面偏壓說明。
- 明確區分飽和區條件、小訊號近似、總電流與電流變動量。

## 閱讀與列印

- 首頁可閱讀完整 7 章，亦可使用工具列篩選章節、調整字體或切換單／雙欄。
- 按「列印」後選 A4、橫向，關閉瀏覽器頁首與頁尾。
- HTML 已內嵌 KaTeX 0.16.22、CSS、JavaScript、字型與 SVG，下載 `index.html` 後可離線使用。

## 內容維護與發布

內容由本機 `landscape_src/*.html` 維護，執行 `build_landscape_notes.py` 產生同名完整筆記與分章檔；發布時使用完整總講義內嵌公式資源，正文及 7 章工具列保持相同。

GitHub Pages 以 `main` 分支根目錄發布，網站首頁為 `index.html`。

## 其他教材

- [按日期整理的公式與圖解（A4 橫式，61 頁）](https://eddychang0630.github.io/electronic-circuits-self-study/formula-print/)
- [按日期公式版的列印 PDF](https://eddychang0630.github.io/electronic-circuits-self-study/formula-print/electronic-circuits-A4-landscape.pdf)
- [Q 點切線與轉導獨立圖](https://eddychang0630.github.io/electronic-circuits-self-study/formula-print/gm-tangent-corrected.svg)

KaTeX 0.16.22（MIT）授權見 `LICENSE-KaTeX.txt`。原始掃描講義與課堂照片不包含在本次完整總講義發布內容中。
