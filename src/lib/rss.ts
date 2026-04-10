import rss from '@astrojs/rss';

import { getAllPosts, getPostUrl } from './posts';
import { siteConfig } from './site';

export async function generateFeed(context: { site?: URL }) {
  const posts = await getAllPosts();

  return rss({
    title: siteConfig.title,
    description: siteConfig.description,
    site: context.site ?? siteConfig.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      author: post.data.author,
      link: getPostUrl(post)
    })),
    customData: '<language>en-ca</language>'
  });
}
