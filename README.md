# ATLaS Company Website

A responsive website for ATLaS, an independent digital agency based in Bangladesh and working with local and international teams. It is built with Next.js App Router, React, strict TypeScript, custom CSS, Lucide icons, Zod validation and an optional Resend email integration.

## Implementation checklist

- [x] Inspect the repository and preserve existing work (the supplied workspace was empty).
- [x] Establish the brand system, shared layout and responsive navigation.
- [x] Build the homepage and all seven service pages.
- [x] Add About, Work, Products, Insights, Contact, Privacy, Terms and not-found pages.
- [x] Implement a private admin dashboard for portfolio/products and inquiry review.
- [x] Store inquiries in SQLite and send an email notification when Resend is configured.
- [x] Implement the validated inquiry endpoint, honeypot, request size bound and rate limit.
- [x] Add page metadata, Open Graph image, sitemap, robots and security headers.
- [ ] Configure the production domain and verified email sender.
- [ ] Review the privacy/legal copy against ATLaS's operating practices before launch.

Portfolio, product and article sections intentionally do not invent case studies, product capabilities, customer claims or publications. They are ready for verified content to be added.

## Requirements

- Node.js 20.9 or later
- npm

## Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Visit `/admin/login` to sign in. The inquiry endpoint saves a submission to SQLite even before email settings are configured; configure Resend to also receive a notification in your business inbox.

## Environment variables

Copy `.env.example` to `.env.local` and set the values below.

| Variable               | Required          | Exposure            | Purpose                                                                                                                              |
| ---------------------- | ----------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL` | Production        | Public              | Canonical origin used for metadata and sitemap. Use the verified production domain; the example fallback is not a real ATLaS domain. |
| `RESEND_API_KEY`       | To send inquiries | Secret, server only | Resend API credential. Never prefix this with `NEXT_PUBLIC_`.                                                                        |
| `CONTACT_TO_EMAIL`     | To send inquiries | Server only         | Verified business inbox receiving project inquiries.                                                                                 |
| `CONTACT_FROM_EMAIL`   | To send inquiries | Server only         | Sender identity verified with the email provider.                                                                                    |
| `ADMIN_USERNAME`       | To use admin      | Secret, server only | Private dashboard username.                                                                                                          |
| `ADMIN_PASSWORD`       | To use admin      | Secret, server only | Long, unique admin password.                                                                                                         |
| `ADMIN_SESSION_SECRET` | To use admin      | Secret, server only | At least 32 random characters used to sign admin sessions.                                                                           |
| `DATABASE_PATH`        | Optional          | Server only         | SQLite database path. Defaults to `./data/atlas.sqlite`; keep this file on persistent storage in production.                         |

The site uses SQLite to store portfolio entries and contact inquiries. It does not include analytics or tracking scripts. Email processing is subject to the selected provider's terms and retention settings. Protect the SQLite file with persistent storage and backups in production.

## Contact delivery and spam controls

The `/api/contact` endpoint validates all fields with Zod, limits JSON request size to 12 KB, uses a hidden honeypot field, and applies an in-memory limit of five attempts per IP address per 15 minutes. In-memory rate limits reset when the server restarts and are not shared across serverless instances. For a high-traffic or multi-instance deployment, place a trusted edge/WAF rate limit in front of the endpoint. The app does not claim persistent lead storage or visitor confirmation email.

The endpoint saves each valid inquiry before attempting email delivery, so the admin dashboard remains the source of record if email is not configured or delivery fails. It does not log the full inquiry or expose provider details to the visitor. The dashboard is available at `/admin/login`; configure the admin username, password and session secret before launch.

## Quality commands

```bash
npm run lint
npm run typecheck
npm test
npm run format:check
npm run build
npm start
```

`npm start` serves the production build on port 3000 by default.

## Content updates

- **Services and navigation:** edit the typed definitions in `src/content/site.ts`. The same data drives the service index, home cards, footer, individual service pages and sitemap.
- **Portfolio and products:** sign in at `/admin/login`, add a client project or ATLaS product, select up to five cover/gallery images from the computer and add a project link, then select publish. JPG, PNG, WebP and GIF images up to 5 MB each are stored in SQLite. Draft entries stay private. Public entries appear on `/work` or `/products`.
- **Insights:** add local article content and metadata when there are real articles to publish; the current page is an honest empty state.
- **Company contact:** display an email address or other direct channel only after ATLaS confirms the official contact details.
- **Brand:** the header and footer use the provided ATLaS mark as a transparent image at `public/brand/atlas-symbol.png`; the site name remains editable text beside it.

## SEO and domain

Set `NEXT_PUBLIC_SITE_URL` to the verified canonical HTTPS origin before deploying. The current `https://example.com` fallback is deliberately not represented as an ATLaS domain. Page metadata lives with each route; `src/app/sitemap.ts` and `src/app/robots.ts` generate sitemap and crawler directives. The Open Graph image is generated by `src/app/opengraph-image.tsx`. There are no review or rating claims in structured data.

## Deployment

Deploy as a Node.js Next.js application on a host that supports the installed Next.js version and persistent local disk. Configure all environment variables in the hosting provider and attach a persistent volume for `data/atlas.sqlite`, then run `npm run build` and start with `npm start`. Configure the verified custom domain and HTTPS at the host/DNS provider. Check that the email sender domain is verified with Resend and that a real inquiry reaches the configured inbox before launch.

## Privacy and security notes

The project sets `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and a restrictive `Permissions-Policy` header. HTTPS must be configured by the deployment host. There are no third-party tracking scripts or analytics cookies. Privacy and terms copy is general starter text and should be reviewed against actual business practice and applicable requirements before production use.

## Troubleshooting

- **Admin login says it is not configured:** set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and a random `ADMIN_SESSION_SECRET` (at least 32 characters) in the server environment, then restart/redeploy.
- **Inquiry email is not arriving:** set the three Resend/contact variables, use a verified sender domain, then restart/redeploy. The submission remains available in the admin dashboard.
- **Email delivery fails:** confirm the API key, sender verification, recipient address and provider account status. The visitor will see a failure state rather than a false success.
- **Wrong sitemap/canonical origin:** set `NEXT_PUBLIC_SITE_URL` to the production HTTPS origin and rebuild.
- **Build reports unsupported Node.js:** use Node.js 20.9 or later.
- **Project cards or articles are empty:** add verified, approved content; the current empty states are intentional.
#   A T L a S -  
 