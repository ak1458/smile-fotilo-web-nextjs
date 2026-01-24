// Main blog posts aggregator - combines all blog categories
import { webDesignPosts } from './blogs/webDesignPosts';
import { seoPosts } from './blogs/seoPosts';
import { businessPosts } from './blogs/businessPosts';
import { ecommerceBrandingPosts } from './blogs/ecommerceBrandingPosts';
import { techTrendsPosts } from './blogs/techTrendsPosts';

export interface BlogPost {
    slug: string;
    title: string;
    description: string;
    content: string;
    author: string;
    date: string;
    readTime: string;
    category: string;
    tags: string[];
    image: string;
    featured?: boolean;
}

// Combine all blog posts
export const blogPosts: BlogPost[] = [
    ...webDesignPosts,
    ...seoPosts,
    ...businessPosts,
    ...ecommerceBrandingPosts,
    ...techTrendsPosts,
];

export function getBlogPost(slug: string): BlogPost | undefined {
    return blogPosts.find(post => post.slug === slug);
}

export function getFeaturedPosts(): BlogPost[] {
    return blogPosts.filter(post => post.featured);
}

export function getRecentPosts(count: number = 10): BlogPost[] {
    return [...blogPosts]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, count);
}

export function getPostsByCategory(category: string): BlogPost[] {
    return blogPosts.filter(post => post.category === category);
}

export function getPostsByTag(tag: string): BlogPost[] {
    return blogPosts.filter(post => post.tags.includes(tag));
}

export function getAllCategories(): string[] {
    return [...new Set(blogPosts.map(post => post.category))];
}

export function getAllTags(): string[] {
    return [...new Set(blogPosts.flatMap(post => post.tags))];
}

export function searchPosts(query: string): BlogPost[] {
    const lowerQuery = query.toLowerCase();
    return blogPosts.filter(post =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.description.toLowerCase().includes(lowerQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
}
