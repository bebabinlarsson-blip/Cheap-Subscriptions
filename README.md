# Premium Tools Mega List

## Project overview
Premium Tools Mega List is a futuristic e-commerce marketplace for selling **authorized** digital software licenses, subscriptions, and redemption keys. It uses a dark neon storefront, Google login, PayPal checkout, secure server-side verification, inbox delivery, and owner-only admin tools.

## Tech stack
- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- NextAuth/Auth.js with Google login
- PayPal Checkout
- lucide-react icons
- simple-icons logo support

## Install
```bash
npm install
```

## Environment setup
Copy `.env.example` to `.env` and fill in:
- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_ENVIRONMENT`
- `OWNER_EMAILS`

## Database setup
Generate Prisma client and create your schema:
```bash
npx prisma generate
npx prisma migrate dev
```

## Seed data
Seed products and starter key inventory:
```bash
npx prisma db seed
```

## Local development
```bash
npm run dev
```

## Production build
```bash
npm run build
```

## Helpful commands
```bash
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
npm run build
```

## Vercel deployment
1. Push the repo to GitHub.
2. Import it into Vercel.
3. Add all environment variables from `.env.example`.
4. Provision a PostgreSQL database.
5. Run Prisma migration and seed commands.
6. Update Google OAuth redirect URLs.
7. Add PayPal sandbox or live credentials.

## Common troubleshooting
- **Build works but login does not:** verify `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, and Google redirect URIs.
- **Checkout fails:** confirm PayPal credentials, environment mode, and return URLs.
- **No products show from database:** run Prisma migrations and seed.
- **Orders do not deliver keys:** confirm keys exist for the purchased product and PayPal capture completed.
- **Admin page blocked:** add your address to `OWNER_EMAILS` or set the user role to `OWNER`.

## Security notes
- Prices are calculated on the server only.
- Stock is validated before checkout.
- Keys are delivered only after verified PayPal capture.
- Keep secrets in environment variables only.
- Enable Vercel protection/WAF if available.
- Monitor PayPal disputes and rotate secrets if exposed.
- Only sell authorized licenses and confirm brand/logo usage rights.
