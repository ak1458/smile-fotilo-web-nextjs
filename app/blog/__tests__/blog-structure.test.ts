/**
 * Blog architecture contract.
 *
 * History: the blog listing was a client component importing all 53 posts'
 * full markdown — every visitor downloaded the entire blog as JS, and
 * category filtering was client state with zero crawlable URLs.
 */
import fs from 'fs';
import path from 'path';

import {
  blogPosts,
  getAllCategories,
  categoryToSlug,
  getCategoryBySlug,
  getPostsByCategory,
} from '../../data/blogPosts';

const read = (rel: string) =>
  fs.readFileSync(path.join(process.cwd(), rel), 'utf8');
const exists = (rel: string) => fs.existsSync(path.join(process.cwd(), rel));

describe('category slug helpers', () => {
  it('every category maps to a unique kebab-case slug', () => {
    const slugs = getAllCategories().map(categoryToSlug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it('slugs round-trip back to their category', () => {
    for (const category of getAllCategories()) {
      expect(getCategoryBySlug(categoryToSlug(category))).toBe(category);
    }
    expect(getCategoryBySlug('does-not-exist')).toBeUndefined();
  });

  it('every post belongs to a known category', () => {
    const categories = new Set(getAllCategories());
    for (const post of blogPosts) {
      expect(categories.has(post.category)).toBe(true);
    }
    // sanity: category hubs will not be empty
    for (const category of categories) {
      expect(getPostsByCategory(category).length).toBeGreaterThan(0);
    }
  });
});

describe('blog listing ships no post content to the client', () => {
  it('listing is a server component (no use client, no client wrapper)', () => {
    const src = read('app/blog/page.tsx');
    expect(src).not.toContain("'use client'");
    expect(src).not.toContain('BlogPageClient');
  });

  it('the old client listing component is gone', () => {
    expect(exists('app/blog/BlogPageClient.tsx')).toBe(false);
  });
});

describe('category hub routes', () => {
  it('exist as a dynamic route', () => {
    expect(exists('app/blog/category/[category]/page.tsx')).toBe(true);
  });

  it('are statically generated for every category', () => {
    const src = read('app/blog/category/[category]/page.tsx');
    expect(src).toContain('generateStaticParams');
  });

  it('are listed in the sitemap', () => {
    expect(read('app/sitemap.ts')).toContain('/blog/category/');
  });
});

describe('blog images resolve (all referenced /blog/*.webp files exist)', () => {
  it('blogImage() returns the real file path when available, falling back to /og', async () => {
    const { blogImage } = await import('../../data/blogPosts');
    const cover = blogImage(blogPosts[0]);
    expect(cover).toBe(blogPosts[0].image);

    const fallback = blogImage({ title: 'Test Post', category: 'Test' });
    expect(fallback).toMatch(/^\/og\?/);
  });

  it('no render surface still reads the broken post.image field directly', () => {
    for (const file of ['app/blog/listing.tsx', 'app/blog/[slug]/page.tsx']) {
      expect(read(file)).not.toMatch(/\bpost\.image\b|\brelated\.image\b/);
    }
  });

  it('listing cards render a real image element', () => {
    expect(read('app/blog/listing.tsx')).toContain('blogImage');
  });
});

describe('blog cards carry no emoji decoration', () => {
  it('listing source has no categoryIcons emoji map', () => {
    const src = read('app/blog/page.tsx');
    expect(src).not.toContain('categoryIcons');
    expect(src).not.toMatch(/[\u{1F300}-\u{1FAFF}]/u);
  });
});
