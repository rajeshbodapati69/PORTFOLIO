# Premium portfolio README

## Project setup

This repository contains a Vite + React + Tailwind single-page portfolio for Ambati Eswar Reddy.

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Contact form setup

The contact form is ready for EmailJS. Create a `.env` file in the project root using the example below:

```bash
cp .env.example .env
```

Then add your service details:

```bash
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

If those variables are not configured, the form falls back to a `mailto:` link and shows a clear configuration message instead of pretending the message was sent.

## Customizing content

Update portfolio content in:

- `src/data/portfolio.js` — all text, project links, achievements, skills, and sections
- `src/App.jsx` — layout composition and section behavior
- `src/index.css` — global colors, spacing, and styling details

## Replacing images or screenshots

The portfolio uses intentional CSS-based visuals and large hero art to avoid broken asset dependencies. If you add real project assets or a profile image, put them in the `public` directory and reference them from the relevant section.

Suggested structure:

```bash
public/
  favicon.svg
  profile.jpg
  hero-workspace.webp
  placementai-dashboard.webp
  hemoscan-mobile.webp
  beachdelivery-marketplace.webp
```

## Adding links, certificates, and project URLs

- Check `src/data/portfolio.js`
- Replace empty strings with verified URLs only
- Keep placeholders for unverified links instead of inventing URLs
- For certificate previews, use the `link` field only when a verified verification URL exists

## Deployment

This project is ready for deployment on Vercel or Netlify as a Vite app.

Common steps:

1. Push the repository to GitHub.
2. Import the project in Vercel or Netlify.
3. Set the Node version to the current LTS version.
4. Configure any required environment variables for EmailJS in the platform settings.

## Notes

- No fake repository stars or fabricated visitor metrics are included.
- Live demo URLs remain hidden until verified and explicitly added.
- The design is responsive, accessible, and optimized for clean presentation on desktop and mobile devices.
