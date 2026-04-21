const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  'https://essorqboloappvfwjcbh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzc29ycWJvbG9hcHB2ZndqY2JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1ODg3OTYsImV4cCI6MjA5MjE2NDc5Nn0.Ha3w6lySP5vKbvvzwW0LD6i8eXK2-TBPfEbZ2PYD4aU'
);

const articles = [
  { slug: 'ai-driven-workflows-agentic-uis', title: 'AI-Driven Workflows & Agentic UIs', category: 'Technology', file: '01-ai-driven-workflows-agentic-uis.md' },
  { slug: 'server-first-performance-rsc', title: 'Server-First Performance & React Server Components', category: 'Technology', file: '02-server-first-performance-rsc.md' },
  { slug: 'on-device-ai-multimodal', title: 'On-Device AI and Multimodal Models', category: 'Technology', file: '03-on-device-ai-multimodal.md' },
  { slug: 'nobody-knows-how-to-build-with-ai', title: '"Nobody Knows How To Build With AI Yet"', category: 'Opinion', file: '04-nobody-knows-how-to-build-with-ai.md' },
  { slug: 'mcp-design-to-code', title: 'Model Context Protocol (MCP) for Design-to-Code', category: 'Tutorial', file: '05-mcp-design-to-code.md' },
  { slug: 'end-of-dashboards-design-systems', title: 'The End of Dashboards & Design Systems', category: 'Design', file: '06-end-of-dashboards-design-systems.md' },
  { slug: 'edge-computing-defaults', title: 'Edge Computing Defaults', category: 'Technology', file: '07-edge-computing-defaults.md' },
  { slug: 'legal-accessibility-mandates', title: 'Legal Accessibility Mandates: The New MVP Requirement', category: 'Technology', file: '08-legal-accessibility-mandates.md' },
  { slug: 'fine-tuning-serverless-gpus', title: 'Fine-Tuning Models with Serverless GPUs', category: 'Tutorial', file: '09-fine-tuning-serverless-gpus.md' },
  { slug: 'rise-of-green-coding', title: 'The Rise of "Green Coding" in Modern Software', category: 'Opinion', file: '10-rise-of-green-coding.md' }
];

async function importArticles() {
  console.log('=== XGuard Article Import ===\n');

  const { data: profiles } = await supabase.from('profiles').select('id, name').limit(1);
  
  if (!profiles?.length) {
    console.log('ERROR: No profile found. Please register first at http://localhost:3000/register');
    return;
  }

  const authorId = profiles[0].id;
  console.log(`Author: ${profiles[0].name}\n`);

  const { data: categories } = await supabase.from('categories').select('id, name');
  const categoryMap = {};
  categories?.forEach(cat => { categoryMap[cat.name] = cat.id; });
  console.log(`Categories: ${Object.keys(categoryMap).join(', ')}\n`);

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    const filePath = path.join(__dirname, '..', 'app', 'blog', 'articles', article.file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`SKIP: ${article.title} (file not found)`);
      continue;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const titleMatch = content.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1] : article.title;
    
    content = content
      .replace(/^# .+$/m, '')
      .replace(/^\*Published:.+$/m, '')
      .replace(/^\*Category:.+$/m, '')
      .replace(/^\*Author:.+$/m, '')
      .replace(/^---$/m, '')
      .trim();

    const excerpt = content.substring(0, 160).replace(/[#*`]/g, '').trim() + '...';
    const categoryId = categoryMap[article.category] || null;
    const publishedDate = new Date(2026, i, 15).toISOString();

    console.log(`Importing: ${title}`);

    const { error } = await supabase.from('posts').insert({
      title,
      slug: article.slug,
      content: `<pre style="white-space: pre-wrap; font-family: inherit;">${content}</pre>`,
      excerpt,
      status: 'published',
      author_id: authorId,
      category_id: categoryId,
      published_at: publishedDate,
      read_time: Math.ceil(content.split(' ').length / 200)
    });

    if (error) {
      console.log(`  Error: ${error.message}`);
    } else {
      console.log(`  ✓ Done`);
    }
  }

  console.log('\nImport complete!');
}

importArticles().catch(err => console.error(err));