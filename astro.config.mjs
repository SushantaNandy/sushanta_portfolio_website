import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// Pages stay static; only /api/chat runs as a server function.
export default defineConfig({ adapter: vercel() });
