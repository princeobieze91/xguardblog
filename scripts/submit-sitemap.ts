#!/usr/bin/env tsx

import { execSync } from 'child_process';

// Function to submit sitemap to search engines
async function submitSitemap() {
  const sitemapUrl = 'https://xguardblog.vercel.app/sitemap.xml';
  
  // Submit to Google (requires API key and verification in Search Console)
  console.log('To submit to Google Search Console:');
  console.log('1. Go to https://search.google.com/search-console');
  console.log('2. Verify your site ownership');
  console.log('3. Go to Sitemaps section');
  console.log(`4. Submit: ${sitemapUrl}`);
  
  // Submit to Bing
  console.log('\nTo submit to Bing Webmaster Tools:');
  console.log('1. Go to https://www.bing.com/webmaster');
  console.log('2. Verify your site ownership');
  console.log('3. Go to Sitemaps section');
  console.log(`4. Submit: ${sitemapUrl}`);
  
  console.log('\nSitemap is ready at:', sitemapUrl);
  console.log('You can also add this to your robots.txt file.');
}

// Run the function
submitSitemap().catch(console.error);