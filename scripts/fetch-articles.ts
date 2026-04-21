import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';
import { log, error, warn } from './lib/logger';

interface Article {
  title: string;
  url: string;
  summary: string | null;
  image_url: string | null;
  source: string;
  published_at: string;
  status: 'pending_review';
}

const parser = new Parser();

const RSS_FEEDS = [
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
  { name: 'Wired', url: 'https://www.wired.com/feed/rss' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
  { name: 'MIT Technology Review', url: 'https://www.technologyreview.com/feed/' },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index' },
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const newsApiKey = process.env.NEWSAPI_KEY;

if (!supabaseUrl || !supabaseKey) {
  error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchRssFeed(name: string, url: string): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(url);
    const articles: Article[] = (feed.items || []).slice(0, 20).map((item) => {
      let imageUrl: string | null = null;
      
      if (item.enclosure?.url) {
        imageUrl = item.enclosure.url;
      } else if (item['media:content']?.$) {
        imageUrl = item['media:content'].$.url;
      } else if (item['media:thumbnail']?.$) {
        imageUrl = item['media:thumbnail'].$.url;
      } else {
        const contentMatch = item.content?.match(/<img[^>]+src="([^">]+)"/);
        if (contentMatch) {
          imageUrl = contentMatch[1];
        }
      }

      return {
        title: item.title || 'Untitled',
        url: item.link || '',
        summary: item.contentSnippet?.substring(0, 500) || item.content?.substring(0, 500) || null,
        image_url: imageUrl,
        source: name,
        published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        status: 'pending_review' as const,
      };
    }).filter(a => a.url);

    log(`Fetched ${articles.length} articles from ${name}`);
    return articles;
  } catch (err) {
    error(`Failed to fetch RSS feed from ${name}`, err);
    return [];
  }
}

async function fetchNewsApi(): Promise<Article[]> {
  if (!newsApiKey) {
    warn('NEWSAPI_KEY not set, skipping NewsAPI');
    return [];
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=20`,
      {
        headers: {
          'X-Api-Key': newsApiKey,
        },
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      error(`NewsAPI request failed: ${response.status} ${errText}`);
      return [];
    }

    const data = await response.json();
    const articles: Article[] = (data.articles || []).map((item: { title?: string; url?: string; description?: string; source?: { name?: string }; publishedAt?: string; urlToImage?: string }) => ({
      title: item.title || 'Untitled',
      url: item.url || '',
      summary: item.description?.substring(0, 500) || null,
      image_url: item.urlToImage || null,
      source: item.source?.name || 'NewsAPI',
      published_at: item.publishedAt ? new Date(item.publishedAt).toISOString() : new Date().toISOString(),
      status: 'pending_review' as const,
    })).filter((a: Article) => a.url);

    log(`Fetched ${articles.length} articles from NewsAPI`);
    return articles;
  } catch (err) {
    error('Failed to fetch from NewsAPI', err);
    return [];
  }
}

async function checkExistingUrls(urls: string[]): Promise<Set<string>> {
  try {
    const { data, error: err } = await supabase
      .from('articles')
      .select('url')
      .in('url', urls);

    if (err) {
      error('Failed to check existing URLs', err);
      return new Set();
    }

    return new Set((data || []).map((a) => a.url));
  } catch (err) {
    error('Database error while checking URLs', err);
    return new Set();
  }
}

async function insertArticles(articles: Article[]): Promise<number> {
  if (articles.length === 0) return 0;

  try {
    const { data, error: err } = await supabase
      .from('articles')
      .upsert(articles, { onConflict: 'url', ignoreDuplicates: true })
      .select();

    if (err) {
      error('Failed to insert articles', err);
      return 0;
    }

    return data?.length || articles.length;
  } catch (err) {
    error('Database error while inserting articles', err);
    return 0;
  }
}

async function main() {
  log('Starting article fetch process');

  const allArticles: Article[] = [];

  for (const feed of RSS_FEEDS) {
    const articles = await fetchRssFeed(feed.name, feed.url);
    allArticles.push(...articles);
  }

  const newsApiArticles = await fetchNewsApi();
  allArticles.push(...newsApiArticles);

  log(`Total articles collected: ${allArticles.length}`);

  if (allArticles.length === 0) {
    log('No articles to process');
    return;
  }

  const urls = allArticles.map((a) => a.url);
  const existingUrls = await checkExistingUrls(urls);

  const newArticles = allArticles.filter((a) => !existingUrls.has(a.url));
  log(`New articles to insert: ${newArticles.length}`);

  const inserted = await insertArticles(newArticles);
  log(`Successfully inserted ${inserted} articles`);

  log('Article fetch process completed');
}

const fetchArticles = { main };

export { fetchArticles };

main().catch((err) => {
  error('Unhandled error in main', err);
  process.exit(1);
});