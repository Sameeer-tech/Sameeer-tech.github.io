# Sameer Abdul Basit — Portfolio

React + TypeScript + Vite + React Three Fiber + GSAP. Static build for GitHub Pages.

## Edit content

All copy, links, projects, experience, and education: `src/data/content.ts`.

## Develop / build

```bash
npm install
npm run dev
npm run build
```

## Deploy to GitHub Pages (Sameeer-tech)

Your site URL after deploy: **https://sameeer-tech.github.io/**

### One-time setup

1. Create a **public** GitHub repo named exactly: `Sameeer-tech.github.io`  
   (GitHub treats this as your user site for account [Sameeer-tech](https://github.com/Sameeer-tech).)

2. In the repo: **Settings → Pages → Build and deployment → Source:** choose **GitHub Actions**.

3. From this folder (first time only):

```bash
git init
git add .
git commit -m "Initial portfolio deploy"
git branch -M main
git remote add origin https://github.com/Sameeer-tech/Sameeer-tech.github.io.git
git push -u origin main
```

4. Open **Actions** on GitHub — the workflow **Deploy to GitHub Pages** should build and publish `dist/`.

### Later updates

```bash
git add .
git commit -m "Update portfolio"
git push
```

Each push to `main` redeploys automatically.

### Project site instead of user site?

If you use a repo like `portfolio` (not `username.github.io`), the URL becomes  
`https://sameeer-tech.github.io/portfolio/` — meta URLs in `index.html` / `sitemap.xml` would need updating.

`base: './'` in `vite.config.ts` keeps assets working for both user and project Pages.
