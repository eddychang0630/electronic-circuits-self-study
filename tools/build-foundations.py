"""Insert the beginner foundations source into the static single-page site."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
page = ROOT / "index.html"
fragment = (Path(__file__).parent / "foundations-section.html").read_text(encoding="utf-8").strip()
html = page.read_text(encoding="utf-8")
begin = "<!-- BEGIN FOUNDATIONS -->"
end = "<!-- END FOUNDATIONS -->"
section = f"{begin}\n{fragment}\n{end}"

if begin in html and end in html:
    before, rest = html.split(begin, 1)
    _, after = rest.split(end, 1)
    html = before + section + after
else:
    anchor = '<section class="chapter" id="silicon">'
    assert anchor in html
    html = html.replace(anchor, section + "\n\n" + anchor, 1)

if 'href="#foundations"' not in html.split('<main class="content">', 1)[0]:
    html = html.replace(
        '<a href="#silicon">01　矽、摻雜與 PN 接面</a>',
        '<a href="#foundations">00A　電荷、離子、電場與等電位</a><a href="#silicon">01　矽、摻雜與 PN 接面</a>',
        1,
    )
if '<a class="btn ghost" href="#foundations">' not in html:
    html = html.replace(
        '<a class="btn ghost" href="#mos-lab">操作 MOS 動畫</a>',
        '<a class="btn ghost" href="#foundations">先補基礎觀念</a><a class="btn ghost" href="#mos-lab">操作 MOS 動畫</a>',
        1,
    )
html = html.replace('第一次學</td><td>01→02→03', '第一次學</td><td>00A→01→02→03', 1)
html = html.replace(
    '從矽、PN 接面與 MOS 電容開始，逐步走到',
    '從電荷、離子與電場開始，再學矽、PN 接面與 MOS 電容，逐步走到',
    1,
)
html = html.replace(
    '電子電路分析講義的完整自學筆記：半導體、MOS 電容',
    '電子電路分析講義的完整自學筆記：電荷、離子、電場、半導體、MOS 電容',
    1,
)
if 'class="foundation-jump"' not in html:
    section_start = html.index('<section class="chapter" id="silicon">')
    grid = html.index('<div class="grid2">', section_start)
    html = html[:grid] + '<p class="foundation-jump">第一次接觸電荷與電場？先讀 <a href="#foundations">00A 零基礎補課</a>，再看下面的 PN 接面。</p>' + html[grid:]

page.write_text(html, encoding="utf-8")
print("Updated", page)
