import { getCollection, type CollectionEntry } from 'astro:content';

export type PostEntry = CollectionEntry<'posts'>;

export async function getAllPosts(): Promise<PostEntry[]> {
  const posts = await getCollection('posts');

  return posts.sort(
    (left, right) => right.data.date.getTime() - left.data.date.getTime()
  );
}

export function getPostUrl(post: PostEntry): string {
  return `/${post.id}/`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'America/Toronto'
  }).format(date);
}
