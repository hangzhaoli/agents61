#!/usr/bin/env python3
"""Fetch Wikipedia/Wikimedia portraits for 61 masters and crop to circles."""
from __future__ import annotations

import io
import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFilter
except ImportError:
    raise SystemExit("pip install pillow")

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "assets" / "masters"
PERSONA_DIR = ROOT / "src" / "data" / "personas"
UA = "Agents61Bot/1.0 (https://agents61.com; research@agents61.com) educational-fair-use"

WIKI_TITLES = {
    "cathie-wood": ["Cathie Wood", "Catherine Wood"],
    "philippe-laffont": ["Philippe Laffont", "Coatue Management"],
    "chase-coleman": ["Chase Coleman III", "Tiger Global Management"],
    "ron-baron": ["Ronald Baron", "Ron Baron", "Baron Capital"],
    "t-rowe-price": ["T. Rowe Price", "Thomas Rowe Price Jr."],
    "ken-fisher": ["Ken Fisher", "Kenneth L. Fisher"],
    "mark-mobius": ["Mark Mobius"],
    "ray-dalio": ["Ray Dalio"],
    "howard-marks": ["Howard Marks (investor)", "Howard Marks"],
    "john-templeton": ["John Templeton"],
    "george-soros": ["George Soros"],
    "john-maynard-keynes": ["John Maynard Keynes"],
    "alan-howard": ["Alan Howard (hedge fund manager)", "Alan Howard"],
    "bill-gross": ["Bill Gross", "William H. Gross"],
    "john-paulson": ["John Paulson"],
    "paul-tudor-jones": ["Paul Tudor Jones"],
    "benjamin-graham": ["Benjamin Graham"],
    "warren-buffett": ["Warren Buffett"],
    "walter-schloss": ["Walter Schloss"],
    "john-neff": ["John Neff"],
    "seth-klarman": ["Seth Klarman"],
    "chuck-akre": ["Charles T. Akre", "Chuck Akre"],
    "terry-smith": ["Terry Smith (fund manager)", "Terry Smith Fundsmith"],
    "hetty-green": ["Hetty Green"],
    "duan-yongping": ["Duan Yongping", "段永平"],
    "li-lu": ["Li Lu", "李录"],
    "peter-lynch": ["Peter Lynch"],
    "bill-miller": ["Bill Miller (investor)", "Bill Miller Legg Mason"],
    "julian-robertson": ["Julian Robertson"],
    "andreas-halvorsen": ["Andreas Halvorsen"],
    "stephen-mandel": ["Stephen Mandel", "Stephen Mandel (investor)"],
    "lee-ainslie": ["Lee Ainslie"],
    "bill-ackman": ["Bill Ackman", "William Ackman"],
    "david-tepper": ["David Tepper"],
    "mohnish-pabrai": ["Mohnish Pabrai"],
    "joel-greenblatt": ["Joel Greenblatt"],
    "david-einhorn": ["David Einhorn (hedge fund manager)", "David Einhorn"],
    "michael-burry": ["Michael Burry"],
    "carl-icahn": ["Carl Icahn"],
    "dan-loeb": ["Daniel S. Loeb", "Dan Loeb"],
    "paul-singer": ["Paul Singer (businessman)", "Paul Singer"],
    "michael-steinhardt": ["Michael Steinhardt"],
    "stanley-druckenmiller": ["Stanley Druckenmiller"],
    "charlie-munger": ["Charlie Munger", "Charles Munger"],
    "william-oneil": ["William O'Neil", "William J. O'Neil"],
    "mark-minervini": ["Mark Minervini"],
    "richard-dennis": ["Richard Dennis (trader)", "Richard Dennis"],
    "ed-seykota": ["Ed Seykota"],
    "steve-cohen": ["Steve Cohen (hedge fund manager)", "Steven A. Cohen"],
    "jesse-livermore": ["Jesse Livermore"],
    "bernard-baruch": ["Bernard Baruch"],
    "nicolas-darvas": ["Nicolas Darvas"],
    "philip-fisher": ["Philip Arthur Fisher", "Philip A. Fisher"],
    "john-bogle": ["John C. Bogle", "John Bogle"],
    "ed-thorp": ["Edward O. Thorp", "Ed Thorp"],
    "jim-simons": ["Jim Simons (mathematician)", "James Harris Simons"],
    "ken-griffin": ["Ken Griffin", "Kenneth C. Griffin"],
    "david-shaw": ["David E. Shaw"],
    "cliff-asness": ["Cliff Asness", "Clifford Asness"],
    "two-sigma": ["John Overdeck", "David Siegel (computer scientist)", "Two Sigma"],
    "israel-englander": ["Israel Englander"],
}

ZH_TITLES = {
    "duan-yongping": ["段永平"],
    "li-lu": ["李录"],
    "cathie-wood": ["凯瑟琳·伍德"],
    "ray-dalio": ["瑞·达利欧"],
    "warren-buffett": ["沃伦·巴菲特"],
    "charlie-munger": ["查理·芒格"],
    "george-soros": ["乔治·索罗斯"],
    "peter-lynch": ["彼得·林奇"],
    "benjamin-graham": ["本杰明·格雷厄姆"],
}


def request_json(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def download_bytes(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=25) as resp:
        return resp.read()


def wiki_summary(lang: str, title: str) -> dict | None:
    encoded = urllib.parse.quote(title.replace(" ", "_"))
    url = f"https://{lang}.wikipedia.org/api/rest_v1/page/summary/{encoded}"
    try:
        data = request_json(url)
        if data.get("type") == "disambiguation":
            return None
        return data
    except Exception:
        return None


def wiki_search(lang: str, query: str) -> str | None:
    params = urllib.parse.urlencode(
        {
            "action": "query",
            "list": "search",
            "srsearch": query,
            "srlimit": 1,
            "format": "json",
            "origin": "*",
        }
    )
    url = f"https://{lang}.wikipedia.org/w/api.php?{params}"
    try:
        data = request_json(url)
        hits = data.get("query", {}).get("search", [])
        if hits:
            return hits[0]["title"]
    except Exception:
        return None
    return None


def circle_crop(raw: bytes, size: int = 160) -> Image.Image:
    img = Image.open(io.BytesIO(raw)).convert("RGB")
    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = (h - side) // 2
    img = img.crop((left, top, left + side, top + side)).resize((size, size), Image.Resampling.LANCZOS)
    # slight unsharp for small display
    img = img.filter(ImageFilter.UnsharpMask(radius=1, percent=80, threshold=2))
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((1, 1, size - 2, size - 2), fill=255)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(img, (0, 0), mask)
    return out


def initials_fallback(name: str, color: str, size: int = 160) -> Image.Image:
    from PIL import ImageFont

    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.ellipse((1, 1, size - 2, size - 2), fill=color)
    letters = "".join(p[0] for p in name.replace("&", " ").split() if p[0].isalpha())[:2].upper()
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 52)
    except Exception:
        font = ImageFont.load_default()
    bbox = draw.textbbox((0, 0), letters, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((size - tw) / 2, (size - th) / 2 - 6), letters, fill="white", font=font)
    return img


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    PERSONA_DIR.mkdir(parents=True, exist_ok=True)
    report = []

    colors = [
        "#0052d9", "#0891b2", "#059669", "#d97706", "#7c3aed",
        "#dc2626", "#0d9488", "#2563eb", "#64748b",
    ]

    for i, (slug, titles) in enumerate(WIKI_TITLES.items()):
        summary = None
        thumb = None
        used_title = None

        langs_and_titles = [("en", t) for t in titles]
        if slug in ZH_TITLES:
            langs_and_titles += [("zh", t) for t in ZH_TITLES[slug]]

        for lang, title in langs_and_titles:
            data = wiki_summary(lang, title)
            if not data:
                found = wiki_search(lang, title)
                if found:
                    data = wiki_summary(lang, found)
            if not data:
                continue
            used_title = data.get("title") or title
            summary = data
            original = (data.get("originalimage") or {}).get("source")
            thumb = original or (data.get("thumbnail") or {}).get("source")
            if thumb:
                break

        avatar_path = OUT_DIR / f"{slug}.png"
        source = "fallback"
        try:
            if thumb:
                raw = download_bytes(thumb)
                circle_crop(raw).save(avatar_path, "PNG")
                source = "wikipedia"
            else:
                raise RuntimeError("no thumbnail")
        except Exception as exc:
            color = colors[i % len(colors)]
            display = titles[0]
            initials_fallback(display, color).save(avatar_path, "PNG")
            source = f"fallback:{exc}"

        persona = {
            "slug": slug,
            "wikiTitle": used_title,
            "extract": (summary or {}).get("extract"),
            "description": (summary or {}).get("description"),
            "wikiUrl": ((summary or {}).get("content_urls") or {}).get("desktop", {}).get("page"),
            "avatarSource": source,
        }
        (PERSONA_DIR / f"{slug}.json").write_text(json.dumps(persona, ensure_ascii=False, indent=2), encoding="utf-8")
        report.append({"slug": slug, "source": source, "title": used_title})
        print(f"[{i+1:02d}/61] {slug:24s} {source:16s} {used_title or ''}")
        time.sleep(0.15)

    (OUT_DIR / "_report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    found = sum(1 for r in report if r["source"] == "wikipedia")
    print(f"\nDone. Wikipedia portraits: {found}/61")


if __name__ == "__main__":
    main()
