# Easy Auth (Entra ID / Azure AD) setup notes

This project includes a minimal integration point for App Service Easy Auth / Entra ID.

Files added:
- `app/api/auth/login/route.ts` - redirects to Easy Auth AAD login endpoint (default `/.auth/login/aad`).
- `app/pages/login/page.tsx` - Microsoft sign-in button now points to `/api/auth/login?redirectTo=/`.

Local dev notes:
- Easy Auth (App Service) runs on Azure and is not easily emulated locally. For local testing you can:
  - Use a staging App Service with Easy Auth enabled and test your app against it.
  - Or use a proxy that forwards `/.auth/*` requests to a mocked endpoint.
  - For TLS/SSL issues in local dev you previously set `NODE_TLS_REJECT_UNAUTHORIZED=0` in `.env.local` (development only).

App Service setup outline:
1. Deploy your app to Azure App Service.
2. In the App Service `Authentication` section, enable App Service Authentication (Easy Auth).
3. Add an identity provider: `Microsoft` / `Azure Active Directory`.
   - Configure the application registration in Entra ID, add redirect URIs, and grant required permissions.
4. Configure allowed redirect URLs and post-login redirect URL if necessary.
5. Verify that `/.auth/login/aad` redirects to the Microsoft login and that `/.auth/me` returns user info after authentication.

Notes about response shapes:
- `/.auth/me` might return an array or an object depending on the environment. The app attempts to detect multiple shapes and extract `name`, `email`, and `id`.
- Adjust mapping in `app/pages/login/page.tsx` if your `/.auth/me` response has different claim names.

Security:
- Do NOT disable TLS verification in production. `NODE_TLS_REJECT_UNAUTHORIZED=0` is for local development only.
- Review redirect URIs and allowed origins carefully.

If you'd like, I can:
- Add a dedicated `/api/auth/logout` route that hits `/.auth/logout` and clears client state.
- Implement server-side callback handling for OAuth flows.
- Provide step-by-step Azure Portal instructions with screenshots.
