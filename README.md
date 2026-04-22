# AgriAgent Web — Landing Page

Landing page `agriagent.co.id` pake **Astro** (static SSG) + **Decap CMS** (git-based) + **Vercel** (hosting).

## Stack

- **Astro 6** — static site generator, SEO-first
- **Content Collections** — structured content di `src/content/` (JSON + Markdown)
- **Decap CMS** — admin UI di `/admin` buat edit tanpa sentuh kode
- **Vercel** — auto-deploy dari GitHub, free tier cukup
- **Hostinger DNS** — CNAME ke Vercel

## Dev Setup

```bash
npm install
npm run dev           # http://localhost:4321
npm run build         # output → dist/
npm run preview       # preview production build
```

## Struktur

```
src/
  content/
    settings/site.json        → meta site-wide (title, desc, OG, GA ID)
    landing/                   → semua section landing (hero, features, dll)
    blog/*.md                  → artikel blog (frontmatter + markdown)
  components/                  → section components (Hero, Features, dll)
  layouts/BaseLayout.astro     → HTML shell + SEO meta + GA
  pages/
    index.astro                → homepage
    blog/index.astro           → list artikel
    blog/[...slug].astro       → detail artikel
    rss.xml.js                 → RSS feed

public/
  admin/                       → Decap CMS UI (config.yml + index.html)
  assets/                      → icon, OG image
  uploads/                     → gambar yg diupload dari CMS
```

## Editing Content

### Via CMS (recommended setelah deploy)

1. Deploy dulu ke Vercel (lihat `DEPLOY.md`)
2. Buka `https://agriagent.co.id/admin/`
3. Login pake GitHub
4. Edit section atau tulis artikel → save → auto commit → Vercel rebuild (~1 menit)

### Via dev local (butuh Decap proxy)

```bash
# Terminal 1
npx decap-server              # proxy di port 8081

# Terminal 2
npm run dev                   # buka http://localhost:4321/admin/
```

`local_backend: true` di `public/admin/config.yml` otomatis deteksi proxy.

### Via kode (dev)

Edit langsung:
- `src/content/landing/*.json` — section
- `src/content/blog/*.md` — artikel
- `src/content/settings/site.json` — GA ID, OG image, title

## Deploy

Lihat **[DEPLOY.md](./DEPLOY.md)** untuk step-by-step:
1. Push repo ke GitHub
2. Connect ke Vercel
3. Setup custom domain `agriagent.co.id` di Hostinger
4. (Optional) GitHub OAuth App utk Decap CMS

## Legal & Beta

- Email: `halo@agriagent.co.id` / `beta@agriagent.co.id`
- Halaman `/privacy` dan `/terms` **belum dibuat** — referenced di footer, perlu dibuat manual atau di-remove.
