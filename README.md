# Vinverse website

Navy / cream / gold / teal system matching the vision deck. Same constellation hero.

Two equivalent versions live in this folder:

## 1. Static site (open immediately)

`static/`

- `index.html` Home
- `services.html` Services
- `products.html` Products
- `careers.html` Careers
- `contact.html` Contact → ideas@vinverse.ai
- `styles.css` shared design tokens
- `images/` constellation, flywheel, progression, team

Open `static/index.html` or serve the folder:

```bash
python3 -m http.server 8765 --directory static
```

## 2. React + Vite (for your existing frontend)

`src/` is structured to copy into an existing React app:

- `src/index.css` — tokens and layout
- `src/pages/Home.jsx`, `Services.jsx`, `Products.jsx`, `Careers.jsx`, `Contact.jsx`
- `src/components/Nav.jsx`, `Footer.jsx`, `PageHero.jsx`
- `src/App.jsx` routes
- `public/images/` same art as the static site

```bash
npm install
npm run dev
```

Copy the CSS variables in `:root` first so the look stays identical.

## Contact

- Ideas: ideas@vinverse.ai
- Careers: careers@vinverse.ai
