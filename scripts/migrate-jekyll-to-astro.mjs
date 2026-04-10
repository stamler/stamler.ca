import fs from 'node:fs/promises';
import path from 'node:path';

import { parse, stringify } from 'yaml';

const projectRoot = process.cwd();
const postsDir = path.join(projectRoot, '_posts');
const outputDir = path.join(projectRoot, 'src/content/posts');
const aboutInput = path.join(projectRoot, 'about.md');
const aboutOutput = path.join(projectRoot, 'src/content/pages/about.md');

function splitFrontmatter(contents) {
  const match = contents.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    throw new Error('Expected frontmatter block.');
  }

  return {
    frontmatter: parse(match[1]) ?? {},
    body: match[2]
  };
}

function normalizeBody(body) {
  return body
    .replace(/\{\{\s*"([^"]+)"\s*\|\s*(?:absolute_url|relative_url)\s*\}\}/g, '$1')
    .replace(/\{%\s*raw\s*%\}\s*\r?\n?/g, '')
    .replace(/\{%\s*endraw\s*%\}\s*\r?\n?/g, '')
    .replace(/<!--more-->/g, '')
    .replace(/https?:\/\/(?:www\.)?stamler\.ca(\/[^\s)"']*)/g, '$1')
    .replace(/^(\$\$.*\$\$)$/gm, '\n$1\n')
    .replace(/\r\n/g, '\n')
    .trim()
    .concat('\n');
}

function stripMarkdown(markdown) {
  return markdown
    .replace(/\{\{\s*"([^"]+)"\s*\|\s*(?:absolute_url|relative_url)\s*\}\}/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/!\[[^\]]*\]\[[^\]]+\]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\[[^\]]+\]/g, '$1')
    .replace(/\[([^\]]+)\]/g, '$1')
    .replace(/^>+\s?/gm, '')
    .replace(/`{1,3}([^`]+)`{1,3}/g, '$1')
    .replace(/[*_~#]/g, '')
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildDescription(frontmatter, body) {
  const source = frontmatter.excerpt ?? body.split('<!--more-->')[0] ?? body;
  const clean = stripMarkdown(source);

  if (clean.length <= 220) {
    return clean;
  }

  const shortened = clean.slice(0, 217);
  const lastSpace = shortened.lastIndexOf(' ');

  return `${shortened.slice(0, lastSpace > 160 ? lastSpace : shortened.length).trimEnd()}...`;
}

function slugFromFilename(filename) {
  return filename
    .replace(/^\d{4}-\d{2}-\d{2}-/, '')
    .replace(/\.markdown$/, '')
    .replace(/\s+/g, '-');
}

function normalizeFrontmatter(frontmatter, slug, body) {
  const next = {
    title: frontmatter.title,
    date: frontmatter.date,
    author: frontmatter.author ?? 'Dean Stamler',
    slug,
    categories: frontmatter.categories ?? [],
    tags: frontmatter.tags ?? [],
    description: buildDescription(frontmatter, body)
  };

  return next;
}

async function migratePosts() {
  const existingFiles = await fs.readdir(outputDir);

  await Promise.all(
    existingFiles
      .filter((name) => name.endsWith('.md'))
      .map((name) => fs.unlink(path.join(outputDir, name)))
  );

  const filenames = (await fs.readdir(postsDir)).filter((name) => name.endsWith('.markdown'));

  for (const filename of filenames) {
    const inputPath = path.join(postsDir, filename);
    const raw = await fs.readFile(inputPath, 'utf8');
    const { frontmatter, body } = splitFrontmatter(raw);
    const slug = slugFromFilename(filename);
    const normalizedFrontmatter = normalizeFrontmatter(frontmatter, slug, body);
    const normalizedBody = normalizeBody(body);
    const nextContents =
      `---\n${stringify(normalizedFrontmatter).trimEnd()}\n---\n\n${normalizedBody}`;

    await fs.writeFile(path.join(outputDir, `${slug}.md`), nextContents);
  }
}

async function migrateAbout() {
  const raw = await fs.readFile(aboutInput, 'utf8');
  const { frontmatter, body } = splitFrontmatter(raw);
  const nextFrontmatter = {
    title: frontmatter.title ?? 'About',
    description: stripMarkdown(body)
  };
  const nextBody = normalizeBody(body);
  const nextContents = `---\n${stringify(nextFrontmatter).trimEnd()}\n---\n\n${nextBody}`;

  await fs.writeFile(aboutOutput, nextContents);
}

await migratePosts();
await migrateAbout();
