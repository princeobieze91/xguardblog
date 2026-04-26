#!/usr/bin/env python3
"""
XGuard Trend Bot - European Trends Portal Automation
Fetches IT/Cyber/Web3/FX trends → AI writes posts → Blogger → Supabase
"""

import os
import json
import hashlib
import logging
import time
import re
from datetime import datetime
from typing import Optional

import requests
from supabase import create_client, Client
import google.genai as genai
from google.genai import types

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# Secrets
SUPABASE_URL = os.getenv("SUPABASE_URL") or "https://essorqboloappvfwjcbh.supabase.co"
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
BLOGGER_BLOG_ID = os.getenv("BLOGGER_BLOG_ID")
BLOGGER_API_KEY = os.getenv("BLOGGER_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
ALPHA_VANTAGE_KEY = os.getenv("ALPHA_VANTAGE_KEY")
UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY", "")
BLOGGER_ACCESS_TOKEN = os.getenv("BLOGGER_ACCESS_TOKEN", "")

CATEGORIES = ["technology", "business", "science", "health"]


class TrendBot:
    def __init__(self):
        self.supabase = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_KEY else None
        self.genai = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None
        self.session = requests.Session()
        self.session.headers = {"User-Agent": "XGuardBot/2.0"}
        self.existing_urls: set = set()
        self._load_cache()

    def _load_cache(self):
        if not self.supabase:
            return
        try:
            data = self.supabase.table("posts").select("url").execute()
            self.existing_urls = {r.get("url") for r in (data.data or []) if r.get("url")}
            logger.info(f"Loaded {len(self.existing_urls)} existing URLs")
        except Exception as e:
            logger.warning(f"Cache load failed: {e}")

    def is_duplicate(self, url: str) -> bool:
        return url in self.existing_urls

    # ======================
    # DATA FETCHERS
    # ======================
    
    def fetch_european_news(self) -> list:
        """Fetch European-focused tech/business news"""
        articles = []
        
        # NewsData.io with European focus
        if NEWS_API_KEY:
            for cat in CATEGORIES[:2]:  # technology, business
                try:
                    url = "https://newsdata.io/api/1/news"
                    params = {
                        "apikey": NEWS_API_KEY,
                        "category": cat,
                        "language": "en",
                        "size": 15,
                        "q": "Europe OR EU OR UK OR Germany OR France OR tech"
                    }
                    resp = self.session.get(url, params=params, timeout=30).json()
                    for a in resp.get("results", []):
                        if a.get("link") and a.get("title"):
                            articles.append({
                                "title": a["title"],
                                "url": a["link"],
                                "summary": a.get("description", "")[:300],
                                "pubDate": a.get("pubDate"),
                                "source": a.get("source_id", "NewsData"),
                                "country": a.get("country", [""])[0] if isinstance(a.get("country"), list) else a.get("country", "")
                            })
                    time.sleep(1)
                except Exception as e:
                    logger.error(f"NewsData error: {e}")

        # RSS feeds (Europe-focused)
        rss_feeds = [
            ("ENISA", "https://www.enisa.europa.eu/rss/rss.xml"),
            ("Tech.eu", "https://tech.eu/feed/"),
            ("EUStartup", "https://www.eu-startups.org/feed/"),
        ]
        
        for name, url in rss_feeds:
            try:
                resp = self.session.get(url, timeout=15).text
                items = resp.split("<item>")[1:8]  # Latest 7
                
                for item in items:
                    title_match = re.search(r"<title><!\[CDATA\[(.*?)\]\]></title>", item)
                    if not title_match:
                        title_match = re.search(r"<title>(.*?)</title>", item)
                    link_match = re.search(r"<link>(.*?)</link>", item)
                    
                    if title_match and link_match:
                        title = title_match.group(1).strip()
                        link = link_match.group(1).strip()
                        
                        if link.startswith("http") and not self.is_duplicate(link):
                            articles.append({
                                "title": title,
                                "url": link,
                                "summary": f"Latest from {name}"[:200],
                                "pubDate": datetime.now().isoformat(),
                                "source": name,
                                "country": "EU"
                            })
            except Exception as e:
                logger.warning(f"RSS {name}: {e}")

        logger.info(f"Fetched {len(articles)} articles")
        return [a for a in articles if not self.is_duplicate(a.get("url", ""))][:10]

    def fetch_fx_rates(self) -> list:
        """Fetch FX rates affecting Europe"""
        rates = []
        
        if ALPHA_VANTAGE_KEY:
            pairs = [("EUR", "USD"), ("GBP", "USD"), ("USD", "JPY"), ("EUR", "GBP")]
            for base, target in pairs:
                try:
                    url = "https://www.alphavantage.co/query"
                    params = {"function": "CURRENCY_EXCHANGE_RATE", "from_currency": base, "to_currency": target, "apikey": ALPHA_VANTAGE_KEY}
                    data = self.session.get(url, params=params, timeout=10).json()
                    
                    rate = data.get("Realtime Currency Exchange Rate", {})
                    rate_val = rate.get("5. Exchange Rate")
                    
                    if rate_val:
                        rates.append({
                            "title": f"FX: {base}/{target} = {rate_val}",
                            "url": f"https://xguardblog.vercel.app/fx",
                            "summary": f"European market impact: {base}/{target} trading at {rate_val}",
                            "pubDate": datetime.now().isoformat(),
                            "source": "Alpha Vantage",
                            "category": "finance"
                        })
                    time.sleep(0.5)
                except Exception as e:
                    logger.warning(f"FX {base}: {e}")
        
        return rates

    # ======================
    # AI CONTENT GENERATION
    # ======================

    def ai_write_post(self, article: dict) -> dict:
        """Use Gemini to write SEO-optimized content"""
        if not self.genai:
            return article
        
        prompt = f"""Write a compelling, SEO-friendly blog post snippet about:

Title: {article.get('title', '')}
Source: {article.get('source', '')}
Summary: {article.get('summary', '')}

Requirements:
- 150-200 words
- Professional but engaging tone
- Include 2-3 relevant hashtags at the end
- Make it link-worthy for European tech readers
- Include the original source link naturally

Return as JSON: {{"title": "...", "excerpt": "...", "content": "..."}}"""

        try:
            resp = self.genai.models.generate_content(
                model="gemini-2.0-flash",
                contents=[types.Content(role="user", parts=[types.Part(text=prompt)])]
            )
            
            text = resp.candidates[0].content.parts[0].text
            if "{" in text and "}" in text:
                json_start = text.find("{")
                json_end = text.rfind("}") + 1
                result = json.loads(text[json_start:json_end])
                
                return {
                    "title": result.get("title", article["title"]),
                    "excerpt": result.get("excerpt", "")[:300],
                    "content": result.get("content", article.get("summary", "")),
                    "url": article.get("url"),
                    "source": article.get("source"),
                    "category": article.get("category")
                }
        except Exception as e:
            logger.warning(f"AI failed: {e}")
        
        return article

    def get_thumbnail(self, title: str) -> Optional[str]:
        """Fetch thumbnail from Unsplash"""
        if not UNSPLASH_ACCESS_KEY:
            return None
        
        try:
            url = "https://api.unsplash.com/photos/random"
            params = {"query": title, "orientation": "landscape", "client_id": UNSPLASH_ACCESS_KEY}
            resp = self.session.get(url, params=params, timeout=10)
            
            if resp.status_code == 200:
                data = resp.json()
                return data.get("urls", {}).get("regular") or data.get("urls", {}).get("full")
        except Exception:
            pass
        return None

    # ======================
    # BLOGGER PUBLISHING
    # ======================

    def publish_to_blogger(self, article: dict) -> Optional[str]:
        """Post to Blogger via JSON API"""
        if not (BLOGGER_ACCESS_TOKEN or BLOGGER_API_KEY) or not BLOGGER_BLOG_ID:
            logger.warning("Blogger not configured - skipping")
            return None
        
        html = f"""
<div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2>{article.get('title', '')}</h2>
    <p style="color: #666;"><strong>Source:</strong> {article.get('source', '')}</p>
    <div style="margin: 20px 0;">{article.get('content', '')}</div>
    <hr/>
    <p style="font-size: 12px; color: #999;">
        Auto-published by <a href="https://xguardblog.vercel.app">XGuard</a> | 
        <a href="{article.get('url', '')}">Read original</a>
    </p>
</div>
"""
        
        try:
            url = f"https://www.googleapis.com/blogger/v3/blogs/{BLOGGER_BLOG_ID}/posts/"
            
            # Use API Key or OAuth Token
            if BLOGGER_API_KEY:
                params = {"key": BLOGGER_API_KEY}
                headers = {"Content-Type": "application/json"}
            else:
                params = {}
                headers = {"Authorization": f"Bearer {BLOGGER_ACCESS_TOKEN}", "Content-Type": "application/json"}
            
            resp = self.session.post(url, json={"title": article.get("title"), "content": html}, headers=headers, params=params, timeout=30)
            
            if resp.status_code in (200, 201):
                data = resp.json()
                logger.info(f"Posted to Blogger: {data.get('id')}")
                return data.get("id")
            elif resp.status_code == 409:
                logger.info("Already exists in Blogger")
            else:
                logger.error(f"Blogger error: {resp.status_code} - {resp.text[:200]}")
        except Exception as e:
            logger.error(f"Blogger publish: {e}")
        
        return None

    # ======================
    # SUPABASE SYNC
    # ======================

    def sync_to_supabase(self, article: dict, blogger_id: str, thumbnail: str):
        if not self.supabase:
            return
        
        # Normalize content for database
        title = article.get("title", "Untitled")
        slug = title.lower()[:50].replace(" ", "-").replace(".", "").replace(",", "")
        slug = re.sub(r"[^a-z0-9-]", "", slug)
        slug = f"{slug}-{datetime.now().strftime('%Y%m%d')}"
        
        payload = {
            "title": title,
            "slug": slug,
            "content": article.get("content", article.get("summary", "")),
            "excerpt": article.get("excerpt", "")[:500] or article.get("summary", "")[:500],
            "cover_image": thumbnail,
            "status": "published",
            "author_id": "auto-bot",
            "published_at": datetime.now().isoformat(),
            "view_count": 0,
            "read_time": 3,
            "url": article.get("url"),
            "blogger_post_id": blogger_id,
            "source": article.get("source", "XGuard Bot")
        }
        
        try:
            result = self.supabase.table("posts").insert(payload).execute()
            if result.data:
                self.existing_urls.add(article.get("url"))
                logger.info(f"Saved to Supabase: {slug}")
        except Exception as e:
            logger.error(f"Supabase sync: {e}")

    # ======================
    # MAIN PIPELINE
    # ======================

    def run(self):
        logger.info("=" * 50)
        logger.info("XGUARD TREND BOT STARTING")
        logger.info("=" * 50)
        
        # Step 1: Fetch
        articles = self.fetch_european_news()
        articles.extend(self.fetch_fx_rates())
        
        logger.info(f"Processing {len(articles)} articles")
        
        # Step 2: Process
        for i, article in enumerate(articles[:8]):  # Max 8
            try:
                logger.info(f"[{i+1}] {article.get('title', '')[:50]}")
                
                if self.is_duplicate(article.get("url", "")):
                    logger.info("  → Duplicate, skip")
                    continue
                
                # AI write
                content = self.ai_write_post(article)
                
                # Get image
                thumb = self.get_thumbnail(content.get("title", ""))
                
                # Publish to Blogger
                blogger_id = self.publish_to_blogger(content)
                
                if blogger_id:
                    self.sync_to_supabase(content, blogger_id, thumb)
                    logger.info(f"  → Complete!")
                else:
                    logger.info(f"  → Skipped")
                
                time.sleep(2)
                
            except Exception as e:
                logger.error(f"Error: {e}")
                continue
        
        logger.info("=" * 50)
        logger.info("BOT COMPLETE")
        logger.info("=" * 50)


if __name__ == "__main__":
    TrendBot().run()