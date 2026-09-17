# Vinverse — React site + Collective Intelligence prototype

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

Open the URL Vite prints. Click **Products → Collective Intelligence Platform → Login → Continue with Google**. The UI now completes sign-in through a placeholder API and opens `/platform`.

## Google authentication — what is already built

- Login page with a Google button
- Optional official Google Identity button if `VITE_GOOGLE_CLIENT_ID` is set
- `POST /api/auth/google` placeholder in `src/api/auth.js`
- Session stored after login
- Protected `/platform` route
- Logout calls `POST /api/auth/logout`

Until your Python auth service exists, `VITE_USE_MOCK_API=true` returns a mock session so the UI can be built end-to-end.

## Google authentication — work still required on your side

1. Google Cloud Console → APIs & Services → Credentials → Create OAuth client ID → Web application
2. Authorized JavaScript origins: `http://localhost:5173` (and later your production domain)
3. Authorized redirect URIs only if you use redirect flow; the current UI uses Google Identity Services (ID token)
4. Put the client ID in `.env` as `VITE_GOOGLE_CLIENT_ID`
5. Implement backend `POST /api/auth/google`:
   - verify the Google ID token
   - allow only invited / approved Fellows
   - create a session or JWT
   - return `{ token, user }`
6. Set `VITE_USE_MOCK_API=false` and `VITE_API_BASE` to your orchestrator URL

## Placeholder APIs already called from the UI

| UI action | Placeholder |
|---|---|
| Register | `POST /api/auth/register` |
| Google login | `POST /api/auth/google` |
| Logout | `POST /api/auth/logout` |
| List access requests | `GET /api/auth/register` |
| Approve access request | `POST /api/auth/register/{id}/approve` |
| Reject access request | `POST /api/auth/register/{id}/reject` |
| Master chat | `POST /api/orchestrator/chat` |
| Create project | `POST /api/projects` |
| Invite fellow | `POST /api/projects/invite` |

Files: `src/api/client.js`, `src/api/auth.js`, `src/api/platform.js`.

## Register and access-request review

`/register` (`src/pages/Register.jsx`) is a real form now — name, email,
phone — that posts to `POST /api/auth/register` on the backend
(`vinverse-mcp`). It used to just show a "email us" message; the backend
call (`registerFellow` in `src/api/auth.js`) already existed but was never
wired to the page.

Any already-approved, signed-in Fellow can review the queue from
**Platform → Access requests**: it lists everyone who has requested access
(`GET /api/auth/register`) and lets you Approve or Reject each one
(`POST /api/auth/register/{id}/approve|reject`). Approving adds that email
to the live Google Sign-In allow-list immediately — no redeploy on the
backend side. There's no separate admin role yet, so this tab is visible to
any signed-in Fellow.
