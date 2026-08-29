#!/usr/bin/env python3
"""
Test MusicBrainz <-> YouTube artist ID mapping via Wikidata SPARQL.
Both directions:
  - MB artist ID  → YouTube channel ID  (P434 → P2397)
  - YouTube channel ID → MB artist ID   (P2397 → P434)
"""

import time
import requests

WIKIDATA_SPARQL = "https://query.wikidata.org/sparql"
HEADERS = {"User-Agent": "MBYTMappingTest/1.0 (test@example.com)"}

# Hardcoded MBIDs to avoid depending on MB search
ARTISTS = [
    {
        "name":    "Los Tres",
        "country": "Chile",
        "mbid":    "0bca46d2-184f-41d0-9abe-37c99d3c023f",
    },
    {
        "name":    "No Te Va Gustar",
        "country": "Uruguay",
        "mbid":    "0b5a4e6a-f623-48af-b9e3-9b71e760d8e3",
    },
    {
        "name":    "La Oreja de Van Gogh",
        "country": "España",
        "mbid":    "d4fdb15e-2a56-4082-9cc2-9b0d5e5b8993",
    },
    {
        "name":    "Tame Impala",
        "country": "Australia",
        "mbid":    "63aa26c3-d59b-4da4-84ac-716b54f1ef4d",
    },
]


def sparql(query: str) -> list[dict]:
    r = requests.get(
        WIKIDATA_SPARQL,
        params={"query": query, "format": "json"},
        headers=HEADERS,
        timeout=15,
    )
    r.raise_for_status()
    return r.json()["results"]["bindings"]


def mb_to_youtube(mbid: str) -> str | None:
    rows = sparql(f"""
        SELECT ?youtubeId WHERE {{
          ?artist wdt:P434 "{mbid}" .
          ?artist wdt:P2397 ?youtubeId .
        }}
    """)
    return rows[0]["youtubeId"]["value"] if rows else None


def youtube_to_mb(yt_id: str) -> str | None:
    rows = sparql(f"""
        SELECT ?mbid WHERE {{
          ?artist wdt:P2397 "{yt_id}" .
          ?artist wdt:P434 ?mbid .
        }}
    """)
    return rows[0]["mbid"]["value"] if rows else None


def run():
    col = dict(name=25, mbid=38, yt=30, mb_rev=38)
    header = (
        f"{'Artist':<{col['name']}} "
        f"{'MB ID (seed)':<{col['mbid']}} "
        f"{'YouTube ID':<{col['yt']}} "
        f"{'MB ID (reverse)':<{col['mb_rev']}} "
        f"Round-trip"
    )
    print(header)
    print("-" * len(header))

    for a in ARTISTS:
        name, mbid = a["name"], a["mbid"]

        # Direction 1: MB → YouTube
        yt_id = mb_to_youtube(mbid)
        time.sleep(0.5)

        # Direction 2: YouTube → MB
        mb_reverse = youtube_to_mb(yt_id) if yt_id else None
        time.sleep(0.5)

        if not yt_id:
            status = "⚠️  no P2397 in Wikidata"
        elif mb_reverse == mbid:
            status = "✅"
        else:
            status = f"❌ got {mb_reverse}"

        print(
            f"{name:<{col['name']}} "
            f"{mbid:<{col['mbid']}} "
            f"{(yt_id or 'NOT FOUND'):<{col['yt']}} "
            f"{(mb_reverse or 'N/A'):<{col['mb_rev']}} "
            f"{status}"
        )

        if yt_id:
            print(f"  {'youtube.com':>18}/channel/{yt_id}")
            print(f"  {'music.youtube.com':>18}/channel/{yt_id}")

        print()


if __name__ == "__main__":
    run()
