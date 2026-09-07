#!/usr/bin/env python3
"""Second pass: Wikidata P18 portraits + Commons search for missing/wrong avatars."""
from __future__ import annotations

import io
import json
import time
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "assets" / "masters"
UA = "Agents61Bot/1.0 (https://agents61.com; research@agents61.com) educational-fair-use"

# Force better queries for people Wikipedia missed or mismatched.
QUERIES = {
    "cathie-wood": "Cathie Wood ARK",
    "philippe-laffont": "Philippe Laffont Coatue",
    "chase-coleman": "Chase Coleman III Tiger Global",
    "ron-baron": "Ron Baron investor Baron Capital",
    "t-rowe-price": "Thomas Rowe Price Jr",
    "ken-fisher": "Ken Fisher investor",
    "mark-mobius": "Mark Mobius",
    "ray-dalio": "Ray Dalio",
    "howard-marks": "Howard Marks Oaktree",
    "john-templeton": "John Templeton investor",
    "george-soros": "George Soros",
    "john-maynard-keynes": "John Maynard Keynes",
    "alan-howard": "Alan Howard Brevan Howard",
    "bill-gross": "Bill Gross PIMCO",
    "john-paulson": "John Paulson hedge fund",
    "paul-tudor-jones": "Paul Tudor Jones",
    "benjamin-graham": "Benjamin Graham",
    "warren-buffett": "Warren Buffett",
    "walter-schloss": "Walter Schloss",
    "john-neff": "John Neff Windsor Fund",
    "seth-klarman": "Seth Klarman",
    "chuck-akre": "Chuck Akre investor",
    "terry-smith": "Terry Smith Fundsmith",
    "hetty-green": "Hetty Green",
    "duan-yongping": "段永平",
    "li-lu": "Li Lu Himalaya Capital",
    "peter-lynch": "Peter Lynch Magellan",
    "bill-miller": "Bill Miller Legg Mason",
    "julian-robertson": "Julian Robertson Tiger Management",
    "andreas-halvorsen": "Andreas Halvorsen Viking Global",
    "stephen-mandel": "Stephen Mandel Lone Pine",
    "lee-ainslie": "Lee Ainslie Maverick",
    "bill-ackman": "Bill Ackman",
    "david-tepper": "David Tepper",
    "mohnish-pabrai": "Mohnish Pabrai",
    "joel-greenblatt": "Joel Greenblatt",
    "david-einhorn": "David Einhorn Greenlight",
    "michael-burry": "Michael Burry",
    "carl-icahn": "Carl Icahn",
    "dan-loeb": "Dan Loeb Third Point",
    "paul-singer": "Paul Singer Elliott",
    "michael-steinhardt": "Michael Steinhardt",
    "stanley-druckenmiller": "Stanley Druckenmiller",
    "charlie-munger": "Charlie Munger",
    "william-oneil": "William O'Neil investor",
    "mark-minervini": "Mark Minervini trader",
    "richard-dennis": "Richard Dennis turtle trader",
    "ed-seykota": "Ed Seykota",
    "steve-cohen": "Steve Cohen Point72",
    "jesse-livermore": "Jesse Livermore",
    "bernard-baruch": "Bernard Baruch",
    "nicolas-darvas": "Nicolas Darvas",
    "philip-fisher": "Philip Fisher investor",
    "john-bogle": "John Bogle Vanguard",
    "ed-thorp": "Edward Thorp",
    "jim-simons": "Jim Simons Renaissance",
    "ken-griffin": "Ken Griffin Citadel",
    "david-shaw": "David E. Shaw",
    "cliff-asness": "Cliff Asness",
    "two-sigma": "John Overdeck Two Sigma",
    "israel-englander": "Israel Englander",
}

# Always refresh these — previous pass hit the wrong person/logo.
FORCE = {
    "alan-howard",
    "mark-minervini",
    "philippe-laffont",
    "chase-coleman",
    "two-sigma",
    "stephen-mandel",
    "peter-lynch",
    "ron-baron",
    "t-rowe-price",
    "ken-fisher",
    "john-templeton",
    "bill-gross",
    "john-paulson",
    "chuck-akre",
    "terry-smith",
    "duan-yongping",
    "li-lu",
    "bill-miller",
    "julian-robertson",
    "andreas-halvorsen",
    "lee-ainslie",
    "mohnish-pabrai",
    "joel-greenblatt",
    "david-einhorn",
    "michael-burry",
    "dan-loeb",
    "michael-steinhardt",
    "stanley-druckenmiller",
    "richard-dennis",
    "ed-seykota",
    "nicolas-darvas",
    "ed-thorp",
    "david-shaw",
}


def request_json(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def download_bytes(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=25) as resp:
        return resp.read()


def circle_crop(raw: bytes, size: int = 160) -> Image.Image:
    img = Image.open(io.BytesIO(raw)).convert("RGB")
    w, h = img.size
    side = min(w, h)
    left = (w - side) // 2
    top = max(0, (h - side) // 5)  # bias toward face (upper third)
    if top + side > h:
        top = h - side
    img = img.crop((left, top, left + side, top + side)).resize((size, size), Image.Resampling.LANCZOS)
    img = img.filter(ImageFilter.UnsharpMask(radius=1, percent=80, threshold=2))
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((1, 1, size - 2, size - 2), fill=255)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(img, (0, 0), mask)
    return out


def wikidata_image(query: str) -> str | None:
    params = urllib.parse.urlencode(
        {
            "action": "wbsearchentities",
            "search": query,
            "language": "en",
            "format": "json",
            "limit": 5,
            "type": "item",
        }
    )
    data = request_json(f"https://www.wikidata.org/w/api.php?{params}")
    for hit in data.get("search", []):
        qid = hit.get("id")
        if not qid:
            continue
        entity = request_json(
            f"https://www.wikidata.org/wiki/Special:EntityData/{qid}.json"
        )
        claims = entity.get("entities", {}).get(qid, {}).get("claims", {})
        p18 = claims.get("P18")
        if not p18:
            continue
        filename = p18[0]["mainsnak"]["datavalue"]["value"]
        encoded = urllib.parse.quote(filename.replace(" ", "_"))
        return f"https://commons.wikimedia.org/wiki/Special:FilePath/{encoded}?width=400"
    return None


def commons_search(query: str) -> str | None:
    params = urllib.parse.urlencode(
        {
            "action": "query",
            "format": "json",
            "generator": "search",
            "gsrsearch": f"{query} portrait",
            "gsrnamespace": 6,
            "gsrlimit": 5,
            "prop": "imageinfo",
            "iiprop": "url|mime|size",
            "iiurlwidth": 400,
        }
    )
    try:
        data = request_json(f"https://commons.wikimedia.org/w/api.php?{params}")
    except Exception:
        return None
    pages = (data.get("query") or {}).get("pages") or {}
    for page in pages.values():
        info = (page.get("imageinfo") or [None])[0]
        if not info:
            continue
        mime = info.get("mime", "")
        if mime not in ("image/jpeg", "image/png", "image/webp"):
            continue
        return info.get("thumburl") or info.get("url")
    return None


def wiki_pageimage(title: str) -> str | None:
    params = urllib.parse.urlencode(
        {
            "action": "query",
            "titles": title,
            "prop": "pageimages",
            "pithumbsize": 400,
            "format": "json",
            "redirects": 1,
        }
    )
    try:
        data = request_json(f"https://en.wikipedia.org/w/api.php?{params}")
        pages = (data.get("query") or {}).get("pages") or {}
        for page in pages.values():
            thumb = (page.get("thumbnail") or {}).get("source")
            if thumb:
                return thumb
    except Exception:
        return None
    return None


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    report = []
    for i, (slug, query) in enumerate(QUERIES.items()):
        dest = OUT_DIR / f"{slug}.png"
        need = slug in FORCE or not dest.exists() or dest.stat().st_size < 4000
        if not need:
            report.append({"slug": slug, "source": "keep"})
            print(f"[{i+1:02d}] keep {slug}")
            continue

        url = None
        source = None
        try:
            url = wikidata_image(query)
            source = "wikidata" if url else None
        except Exception:
            url = None
        if not url:
            url = commons_search(query)
            source = "commons" if url else source
        if not url:
            url = wiki_pageimage(query.split()[0] + " " + query.split()[1] if len(query.split()) > 1 else query)
            source = "wikipedia" if url else source

        if url:
            try:
                raw = download_bytes(url)
                circle_crop(raw).save(dest, "PNG")
                print(f"[{i+1:02d}] {source:10s} {slug:24s} {url[:80]}")
                report.append({"slug": slug, "source": source, "url": url})
                time.sleep(0.2)
                continue
            except Exception as exc:
                print(f"[{i+1:02d}] fail-download {slug}: {exc}")

        print(f"[{i+1:02d}] MISS {slug}")
        report.append({"slug": slug, "source": "miss"})
        time.sleep(0.15)

    (OUT_DIR / "_pass2.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    got = sum(1 for r in report if r["source"] not in ("miss",))
    print(f"\nCovered this pass: {got}/61")


if __name__ == "__main__":
    main()
