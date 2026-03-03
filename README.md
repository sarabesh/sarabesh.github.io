# Sarabesh Portfolio

Static recruiter-focused portfolio built from resume + GitHub projects.

## Stack

- HTML
- CSS
- Vanilla JavaScript

No build tools required.

Resume download is served from:

- `assets/Sarabesh_Ravindranath_Resume.pdf`

## Run locally

From `z:\projects\profile`:

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
- Footer includes a `Built with OpenAI Codex` note.
