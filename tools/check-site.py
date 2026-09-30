"""Check local links, accessibility identifiers, and offline assets."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re

ROOT = Path(__file__).resolve().parents[1]


class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.duplicates = []
        self.refs = []
        self.aria_refs = []
        self.equations = 0

    def handle_starttag(self, tag, raw_attrs):
        attrs = dict(raw_attrs)
        if "id" in attrs:
            if attrs["id"] in self.ids:
                self.duplicates.append(attrs["id"])
            self.ids.add(attrs["id"])
        if "data-tex" in attrs:
            self.equations += 1
        for key in ("href", "src"):
            if value := attrs.get(key):
                self.refs.append(value)
        if value := attrs.get("aria-labelledby"):
            self.aria_refs.extend(value.split())


page = SiteParser()
page.feed((ROOT / "index.html").read_text(encoding="utf-8"))
errors = [f"Duplicate ID: {value}" for value in page.duplicates]
for ref in page.refs:
    parsed = urlsplit(ref)
    if parsed.scheme or parsed.netloc:
        continue
    if parsed.path:
        target = ROOT / unquote(parsed.path)
        if not target.is_file():
            errors.append(f"Missing local file: {ref}")
    if parsed.fragment and parsed.fragment not in page.ids:
        errors.append(f"Missing anchor: {ref}")
for ref in page.aria_refs:
    if ref not in page.ids:
        errors.append(f"Missing aria-labelledby ID: {ref}")

worker = (ROOT / "service-worker.js").read_text(encoding="utf-8")
for path in re.findall(r"'\./([^']+)'", worker):
    if path and not (ROOT / path).is_file():
        errors.append(f"Missing offline asset: {path}")
for name in re.findall(r"'([A-Za-z0-9-]+)'", worker.split("const FONT_NAMES = [", 1)[1].split("];", 1)[0]):
    path = ROOT / "vendor" / "katex" / "fonts" / f"KaTeX_{name}.woff2"
    if not path.is_file():
        errors.append(f"Missing KaTeX font: {path.name}")

if page.equations != 23:
    errors.append(f"Expected 23 KaTeX expressions, found {page.equations}")
if errors:
    raise SystemExit("\n".join(errors))
print(f"PASS site assets and links: {len(page.ids)} IDs, {page.equations} equations")
