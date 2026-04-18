#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fetch 前漢演義 chapters from zh.wikisource.org, convert to zh-cn, write Jekyll posts."""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

from bs4 import BeautifulSoup
import zhconv

UA = "KwanWaiPangBlogBot/1.0 (https://github.com/KwanWaiPang/kwanwaipang.github.io; zhconv+read-only)"

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "_posts" / "前汉演义"


def api_parse(page: str) -> str:
    q = urllib.parse.urlencode(
        {"action": "parse", "page": page, "prop": "text", "format": "json"}
    )
    url = f"https://zh.wikisource.org/w/api.php?{q}"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    if "error" in data:
        raise RuntimeError(data["error"])
    return data["parse"]["text"]["*"]


def _parse_nav_subtitle(nav_text: str) -> str | None:
    """从导航块文字解析副标题；维基文库各回版式略有出入。"""
    flat = re.sub(r"\s+", " ", nav_text.replace("\n", " "))
    patterns = [
        r"前漢演義\s*(第.+?回)\s*(.+?)\s*作者",
        r"前漢演義\s*(第.+?回)\s*(.+?)(?=\s*[◄►])",
        r"前漢演義\s*(第.+?回)\s*(.+?)(?=\s*→|\s*←)",
        r"前漢演義\s*(第.+?回)\s*(.+?)(?=\s*姊妹计划)",
    ]
    for pat in patterns:
        m = re.search(pat, flat)
        if m:
            return m.group(2).strip()
    return None


def extract_title_and_paragraphs(html: str) -> tuple[str, list[str]]:
    soup = BeautifulSoup(html, "lxml")
    po = soup.select_one(".mw-parser-output")
    if not po:
        raise RuntimeError("no .mw-parser-output")

    subtitle = ""
    paragraphs: list[str] = []

    for child in po.children:
        name = getattr(child, "name", None)
        if not name:
            continue
        if name in ("div", "table") and not subtitle:
            nav_text = child.get_text(" ", strip=True)
            if "前漢演義" in nav_text and "回" in nav_text:
                sub = _parse_nav_subtitle(nav_text)
                if sub:
                    subtitle = sub
            continue
        if name == "p":
            t = child.get_text()
            if not t or not t.strip():
                continue
            paragraphs.append(t.strip())

    if not subtitle:
        blob = po.get_text(" ", strip=True)[:1200]
        subtitle = _parse_nav_subtitle(blob) or ""

    if not subtitle:
        raise RuntimeError("subtitle not found")

    return subtitle, paragraphs


def to_cn(s: str) -> str:
    return zhconv.convert(s, "zh-cn")


def cn_num(n: int) -> str:
    """阿拉伯数字转中文数字（用于回目，1–100）。"""
    digits = "零一二三四五六七八九"
    if n < 10:
        return digits[n]
    if n == 10:
        return "十"
    if n < 20:
        return "十" + digits[n - 10]
    if n < 100:
        tens, ones = divmod(n, 10)
        return digits[tens] + "十" + (digits[ones] if ones else "")
    if n == 100:
        return "一百"
    return str(n)


def build_markdown(chapter: int, subtitle_tw: str, paras_tw: list[str]) -> str:
    subtitle = to_cn(subtitle_tw)
    body_lines = []
    for p in paras_tw:
        body_lines.append(to_cn(p))
    body = "\n\n".join("　　" + ln.replace("\n", "") for ln in body_lines)

    title = f'读书笔记之——《前汉演义》第{cn_num(chapter)}回：{subtitle}'
    page_enc = urllib.parse.quote(f"前漢演義/第{chapter:03d}回", safe="")
    wikilink = f"https://zh.wikisource.org/wiki/%E5%89%8D%E6%BC%A2%E6%BC%94%E7%BE%A9/%E7%AC%AC{chapter:03d}%E5%9B%9E"

    return f"""---
layout: post
title: "{title}"
date: 2026-04-18
tags: [Books]
comments: true
author: kwanwaipang
# toc: false
excerpt: ""
---

<!-- * 参考资料：[蔡东藩《前汉演义》](https://zh.wikisource.org/wiki/%E5%89%8D%E6%BC%A2%E6%BC%94%E7%BE%A9) · [维基文库：本回全文]({wikilink}) -->


---

# 原文

{body}

---

# 译文

（译文生成中）
"""


def main(argv: list[str] | None = None) -> None:
    p = argparse.ArgumentParser(description="Fetch 前漢演義 chapters from zh.wikisource.org")
    p.add_argument("--start", type=int, default=26, help="first chapter (inclusive)")
    p.add_argument("--end", type=int, default=67, help="last chapter (inclusive)")
    args = p.parse_args(argv)
    start, end = args.start, args.end
    if start > end:
        print("error: --start must be <= --end", file=sys.stderr)
        sys.exit(1)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for n in range(start, end + 1):
        page = f"前漢演義/第{n:03d}回"
        print("fetch", page)
        html = api_parse(page)
        sub, paras = extract_title_and_paragraphs(html)
        md = build_markdown(n, sub, paras)
        path = OUT_DIR / f"2026-04-18-前汉演义{n:02d}.md"
        path.write_text(md, encoding="utf-8")
        time.sleep(0.35)


if __name__ == "__main__":
    main()
