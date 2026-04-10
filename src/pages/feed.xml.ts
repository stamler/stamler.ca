import type { APIRoute } from 'astro';

import { generateFeed } from '../lib/rss';

export const GET: APIRoute = (context) => generateFeed(context);
