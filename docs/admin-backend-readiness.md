# Admin Backend Readiness

The admin settings and product management screens currently use local React state only.
No credentials, secrets, or external services are connected.

## Future integration checklist

- **Supabase:** persist store settings, catalog data, orders, users, and audit history.
- **Prisma:** define typed models and migrations after the database ownership model is approved.
- **Cloudinary:** upload and transform product images, homepage banners, and other managed media.
- **Resend:** send order confirmations and administrative order notifications.
- **Auth roles:** protect admin routes and actions with explicit `USER` and `ADMIN` roles.

## Implementation boundaries

- Keep service-role keys and provider secrets server-only.
- Validate and authorize every admin mutation on the server.
- Do not trust client-side role checks or form validation as security controls.
- Add optimistic UI only after mutations return stable identifiers and error contracts.
