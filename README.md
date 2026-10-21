# Sarabesh Portfolio

Static recruiter-focused portfolio built from resume + GitHub projects.

## Stack

- HTML
- CSS
- Vanilla JavaScript

No build tools required.

Resume download is served from:

- `assets/resume.pdf`

## Run locally

From the repository root:

```powershell
python -m http.server 8080
```

Open `http://localhost:8080`.

## Deploy (GitHub Pages)

1. Push this folder to a repository (for example `sarabesh.github.io`).
2. In GitHub repo settings, enable `Pages`.
3. Set source to `Deploy from a branch` and choose `main` and `/ (root)`.
4. Save. Your site will be available at your GitHub Pages URL.

## Quick content updates

- Edit headline/contact in `index.html`.
- Add or remove projects in the `Selected GitHub Work` section.
- Adjust colors and spacing in `styles.css`.
- Update interactions in `script.js`.
- Replace `assets/resume.pdf` to update the résumé download.
- Bump the `?v=` query on `styles.css` and `script.js` in `index.html` after editing them so browsers fetch the new files.
- `assets/og.jpg` is the link-preview image used by LinkedIn, Slack, etc.
