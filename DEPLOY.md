# Deploy Guide — AgriAgent Web

Step-by-step migrasi dari WordPress ke Astro+Vercel. Target: `agriagent.co.id`.

---

## 1. Push ke GitHub

```bash
cd /Users/jufri/AgriAgent-web

# (kalau belum di-init)
git init
git add .
git commit -m "init landing page"

# Buat repo baru di github.com/new → nama: agriagent-web (private/public terserah)
git remote add origin git@github.com:USERNAME/agriagent-web.git
git branch -M main
git push -u origin main
```

**Recommendation**: repo **PUBLIC** kalau mau Decap CMS OAuth gampang (pake dekkap default). Repo private boleh tapi butuh token scope `repo`.

---

## 2. Connect ke Vercel

1. Login ke [vercel.com](https://vercel.com) pake GitHub
2. **Add New → Project** → pilih repo `agriagent-web`
3. Framework: **Astro** (auto-detect)
4. Build command: `npm run build` (default)
5. Output: `dist` (default)
6. **Deploy**

Vercel kasih URL default: `agriagent-web-xxx.vercel.app`. Test dulu — pastiin homepage + blog + `/admin/` loading.

---

## 3. Setup Custom Domain `agriagent.co.id`

### Di Vercel:
1. Project → **Settings → Domains**
2. Add `agriagent.co.id` dan `www.agriagent.co.id`
3. Vercel kasih instruksi DNS (biasanya A record atau CNAME)

### Di Hostinger:
1. Login Hostinger → **Domains → agriagent.co.id → DNS Zone Editor**
2. Backup dulu record lama (screenshot)
3. **Hapus record A lama** yang nunjuk ke WP Hostinger (IP lama)
4. Add record sesuai instruksi Vercel:
   - `A @ 76.76.21.21` (Vercel IP)
   - `CNAME www cname.vercel-dns.com.`
5. Tunggu propagate (~5-30 menit). Cek via `dig agriagent.co.id` atau [whatsmydns.net](https://whatsmydns.net)

### Verify:
- `https://agriagent.co.id` → Astro landing
- SSL auto-issue dari Vercel (Let's Encrypt), ~2 menit

---

## 4. Decap CMS OAuth Setup

Decap butuh GitHub OAuth App utk login admin.

### Option A: GitHub OAuth langsung (simple)

1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**
   - App name: `AgriAgent CMS`
   - Homepage URL: `https://agriagent.co.id`
   - Authorization callback URL: `https://api.netlify.com/auth/done` (Decap's public proxy) **← deprecated 2026, skip**

2. **Better: pake Decap-proxy di Vercel**
   - Fork [sterlingwes/decap-cms-oauth-provider](https://github.com/sterlingwes/decap-cms-oauth-provider) ATAU
   - Deploy [decap-proxy](https://github.com/tobua/decap-proxy) ke Vercel sebagai serverless
   - Set OAuth callback: `https://YOUR-PROXY.vercel.app/callback`
   - Update `public/admin/config.yml`:
     ```yaml
     backend:
       name: github
       repo: USERNAME/agriagent-web
       branch: main
       base_url: https://YOUR-PROXY.vercel.app
     ```

### Option B: Skip CMS, edit via VS Code / GitHub web

Cukup edit JSON/markdown langsung di GitHub web UI (pensil icon). Auto-commit → Vercel auto-deploy.

**Saran**: start dengan Option B, setup OAuth pas udah stable.

---

## 5. Environment Variables (optional)

Sekarang belum perlu, tapi kalau nanti mau:
- Vercel Dashboard → Project → Settings → Environment Variables
- `PUBLIC_GA_ID` → update `src/content/settings/site.json` atau bikin env-based

---

## 6. Post-Deploy Checklist

- [ ] Homepage loading full (hero, features, pricing, testimonials, FAQ, CTA)
- [ ] Mobile responsive (test di HP)
- [ ] Nav hamburger jalan
- [ ] `/blog/` list 1 artikel
- [ ] `/blog/selamat-datang/` detail loading
- [ ] `/rss.xml` valid XML
- [ ] `/sitemap-index.xml` accessible (submit ke Google Search Console)
- [ ] `/admin/` loading Decap UI (login kalau OAuth udah)
- [ ] OG image preview di WhatsApp / Facebook debugger
- [ ] SSL lock icon green
- [ ] Redirect `www.agriagent.co.id` → `agriagent.co.id` (atau sebaliknya, pilih satu)
- [ ] Submit sitemap ke [Google Search Console](https://search.google.com/search-console)
- [ ] Update Google Analytics ID di `src/content/settings/site.json` kalau punya

---

## 7. Rollback Plan

Kalau ada masalah pas cutover:
1. Di Hostinger, revert DNS record A/CNAME ke IP WP lama (catetan dari step 3)
2. DNS propagate balik ~5-30 menit
3. WP balik live, debug di staging Vercel

WordPress tetep ada di Hostinger (belum dihapus). Aman.

---

## Common Gotchas

- **Vercel free tier**: 100 GB bandwidth/bulan — harusnya cukup sampai ratusan ribu visitor.
- **Sitemap baru ter-generate saat build** — kalau ubah content via CMS, tunggu rebuild selesai.
- **Decap CMS + private repo**: harus pake OAuth scope `repo` (bukan `public_repo`).
- **`trailingSlash`**: config pakai `"ignore"` — both `/blog` dan `/blog/` jalan.
