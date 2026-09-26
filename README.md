# themannyverse.com

Adventure awaits beyond the map. Online tabletop RPGs, strange worlds, and stories shaped by the people who sit around the table.

Built with Vite + vanilla HTML/CSS/JS, deployed on GitHub Pages.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:5153` to view the site.

## Deployment

Pushes to `main` trigger the GitHub Actions workflow (`.github/workflows/deploy.yml`), which builds the site and deploys to GitHub Pages.

## Architecture

- **Build**: Vite (static site generation)
- **Hosting**: GitHub Pages (free tier)
- **Domain**: themannyverse.com (DNS → GitHub Pages)
- **Payment**: Stripe Payment Links + PayPal (hosted checkout, no custom payment processing)
- **CI/CD**: GitHub Actions (build + deploy on push to main)
