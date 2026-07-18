# Harsh Vardhan — Portfolio

Personal portfolio site. Plain HTML/CSS/JS — no build step, no dependencies.

## Preview locally

```
python -m http.server 8000
```

Then open http://localhost:8000 (or just double-click `index.html`).

## Deploy to GitHub Pages (your own `<username>.github.io`)

1. Create a new GitHub repository named exactly `<your-username>.github.io` (public).
2. Push this folder:
   ```
   git remote add origin https://github.com/<your-username>/<your-username>.github.io.git
   git push -u origin main
   ```
3. Wait a minute — your site is live at `https://<your-username>.github.io`.

## Editing content

Everything lives in `index.html` — sections are marked with `<!-- ===== NAME ===== -->` comments.
Colors/fonts are CSS variables at the top of `styles.css` (light theme in `:root`, dark theme in `:root[data-theme="dark"]`).
