import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
    outDir: './docs',
    site: 'https://www.anilkarasah.com',
    server: {
        port: 4012,
    },
})
