# OWNER GUIDE

## 1. Create a Vercel account
1. Go to https://vercel.com.
2. Click **Sign Up**.
3. Choose GitHub to make deployment easier.

## 2. Create a GitHub repository
1. Log in to GitHub.
2. Click **New repository**.
3. Give it a name.
4. Keep it private if you do not want the source public.

## 3. Upload the code to GitHub
1. Open the project on your computer.
2. Run `git init` if needed.
3. Add the files and commit them.
4. Connect the new GitHub repository.
5. Push your code.

## 4. Import the project into Vercel
1. In Vercel, click **Add New Project**.
2. Choose your GitHub repository.
3. Click **Import**.
4. Leave the framework as Next.js.

## 5. Create a PostgreSQL database
1. Choose Neon, Supabase Postgres, or Vercel Postgres.
2. Create a new PostgreSQL database.
3. Copy the connection string.

## 6. Add `DATABASE_URL`
1. In Vercel, open your project settings.
2. Open **Environment Variables**.
3. Add `DATABASE_URL` and paste the PostgreSQL connection string.

## 7. Run Prisma migrations
1. Open your local terminal or Vercel build environment.
2. Run `npx prisma migrate dev` locally for development.
3. For production, use `npx prisma migrate deploy` in your deployment process.

## 8. Seed products
1. Run `npx prisma db seed`.
2. This adds the product catalog.
3. It also adds starter sample key inventory so you can test the store.
4. Replace sample keys with your own authorized keys before launch.

## 9. Create Google OAuth credentials
1. Go to Google Cloud Console.
2. Create a new project.
3. Open **OAuth consent screen** and configure it.
4. Create an OAuth client.
5. Add this production redirect URI:
   `https://YOUR-DOMAIN.com/api/auth/callback/google`
6. Add this local redirect URI:
   `http://localhost:3000/api/auth/callback/google`
7. Copy the client ID and secret.

## 10. Create PayPal developer credentials
1. Go to the PayPal Developer Dashboard.
2. Create a sandbox app.
3. Copy the client ID and secret.
4. Set `PAYPAL_ENVIRONMENT=sandbox`.
5. Test checkout with sandbox buyer accounts.
6. Switch to live credentials only when you are ready for production.

## 11. Set all environment variables
Set these in Vercel and in your local `.env` file:
1. `NEXTAUTH_URL`
2. `NEXTAUTH_SECRET`
3. `GOOGLE_CLIENT_ID`
4. `GOOGLE_CLIENT_SECRET`
5. `PAYPAL_CLIENT_ID`
6. `PAYPAL_CLIENT_SECRET`
7. `PAYPAL_ENVIRONMENT`
8. `OWNER_EMAILS`
9. `DATABASE_URL`

## 12. Become the owner/admin
1. Add your email address to `OWNER_EMAILS`.
2. Sign in with Google using that same email.
3. You will get owner access to `/admin`.
4. You can also set the role to `OWNER` in the database if needed.

## 13. Add product keys
1. Open `/admin/keys`.
2. Pick the product.
3. Paste one key per line.
4. Save the keys.

## 14. How automatic key delivery works
1. The buyer adds products to the cart.
2. The server checks stock.
3. The server creates a PayPal order.
4. After payment, the server captures and verifies the PayPal order.
5. Only then are keys marked as sold and delivered to the buyer inbox.

## 15. How to manually resend keys
1. Open `/admin/keys`.
2. Find the order ID.
3. Use the resend form.
4. The buyer gets another inbox message with the same keys.

## 16. How to handle failed orders
1. Open `/admin/orders`.
2. Find the failed order.
3. Review PayPal status.
4. If payment did not complete, keep the order failed or cancelled.

## 17. How to handle refunds
1. Process the refund in PayPal.
2. Update the order status to `REFUNDED` in `/admin/orders`.
3. Keep records for accounting and support.

## 18. How to check PayPal sandbox payments
1. Use a sandbox buyer account in PayPal Developer Dashboard.
2. Complete a test purchase.
3. Confirm the order becomes `PAID`.
4. Confirm the buyer inbox receives keys.

## 19. How to connect a custom domain
1. Open your Vercel project.
2. Go to **Domains**.
3. Add your domain.
4. Follow the DNS instructions from Vercel.
5. Update `NEXTAUTH_URL` to the final domain.

## 20. How to launch safely
1. Test in PayPal sandbox first.
2. Test Google login on your final domain.
3. Add real authorized product keys.
4. Verify all legal pages.
5. Confirm support contact details.

## 21. Trademark and legal warning
1. Only sell authorized keys and licenses.
2. Confirm you have resale rights.
3. Confirm you have permission to use each brand logo or trademark.
4. Do not sell stolen accounts.
5. Do not sell cracked licenses.
6. Do not sell shared accounts.
7. Do not sell unauthorized credentials.

## 22. Production launch checklist
1. Database connected.
2. Google login working.
3. PayPal live credentials added.
4. `OWNER_EMAILS` set.
5. Real keys uploaded.
6. Test order completed.
7. Inbox delivery confirmed.
8. Legal copy reviewed.
9. Refund policy reviewed.
10. Support email added.
11. Vercel protection/WAF enabled if available.
12. Secrets stored safely and rotated if exposed.
