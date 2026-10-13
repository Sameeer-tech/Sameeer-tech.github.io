# Google Search Console — submit your portfolio sitemap

Your live site: **https://sameeer-tech.github.io/**  
Sitemap URL: **https://sameeer-tech.github.io/sitemap.xml**

## 1. Add your property

1. Open [Google Search Console](https://search.google.com/search-console).
2. Click **Add property**.
3. Choose **URL prefix** and enter: `https://sameeer-tech.github.io/`
4. Verify ownership (pick one method):
   - **HTML tag** — copy the meta tag Google gives you into `index.html` `<head>`, push to GitHub, then click **Verify**.
   - **HTML file upload** — download Google’s file, put it in `public/`, push, verify.

## 2. Submit the sitemap

1. In Search Console, open your property.
2. Left menu → **Sitemaps**.
3. Under **Add a new sitemap**, enter: `sitemap.xml`
4. Click **Submit**.

Status should change to **Success** within a few days (sometimes hours).

## 3. Request indexing (optional, once)

1. Top search bar in Search Console → enter: `https://sameeer-tech.github.io/`
2. Click **Request indexing** if the button appears.

## 4. Link your site elsewhere (helps Google trust you)

- **LinkedIn** → Featured or Website: `https://sameeer-tech.github.io/`
- **GitHub** profile → Website: same URL
- Same link on resume PDF and email signature

## 5. Check if Google indexed you

After 3–14 days, search:

```
site:sameeer-tech.github.io
```

You should see your homepage. Also try:

```
Sameer Abdul Basit full stack developer Karachi
```

Ranking takes time; LinkedIn may still appear above your site — that is normal.

## Keywords already on your site

Title, description, and structured data in `index.html` include phrases like **Sameer Abdul Basit**, **full-stack developer Karachi**, **web developer Pakistan**, **Flutter**, **PHP**, **accounting software**. Update those strings if you change focus — do not stuff unrelated keywords.
