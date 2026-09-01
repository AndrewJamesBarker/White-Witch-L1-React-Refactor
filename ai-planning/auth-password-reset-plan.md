## Plan: Auth Hardening And Password Reset

Harden the existing cookie-based auth flow before adding password recovery, then implement a secure forgot-password/reset-password flow that matches the current stack. The recommended order is: stop exposing JWTs to frontend JavaScript, add cookie-based session bootstrap, fix password writes to hash exactly once, then add hashed one-time reset tokens and the public reset UI.

**Steps**
1. Phase 1: Harden current auth session handling.
2. In `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/backend/src/controllers/userController.js`, change `issueLoginResponse` to stop returning the JWT in the JSON response and return only a safe user payload needed by the frontend. *blocks steps 3-5*
3. Add an authenticated session bootstrap endpoint such as `GET /api/users/auth/me` in `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/backend/src/controllers/userController.js` and wire it in `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/backend/src/routes/userRoutes.js`. Reuse existing `authenticate` middleware so the endpoint reads the httpOnly cookie rather than any Authorization header. *depends on 2*
4. In `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/frontend/src/context/AuthContext.jsx`, remove JS-readable JWT persistence and Authorization-header bootstrapping: stop writing `token` with `js-cookie`, stop reading it on load, and stop setting Axios default Authorization headers. Replace the current bootstrap effect with a request to `/auth/me` and restore `user`/`isAuthenticated` from that response. *depends on 3*
5. Audit any frontend code that assumes a token exists in cookies or headers and ensure authenticated requests rely on Axios `withCredentials` plus the server cookie. Confirm that current game state hooks and account actions still work with cookie auth only. *depends on 4*
6. Phase 2: Fix password writes so they hash exactly once.
7. In `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/backend/src/controllers/userController.js`, remove manual bcrypt hashing from `updateUserInfo` and assign the plain password so `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/backend/src/models/User.js` `pre('save')` hook remains the single hashing path. *parallel with step 5 once step 2 is understood*
8. Sanitize registration and login responses in `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/backend/src/controllers/userController.js` so hashed passwords are never returned. If needed, add a small helper that shapes safe user payloads consistently for `loginUser`, `createUser`, and the new `auth/me` endpoint. *parallel with step 7*
9. Phase 3: Add secure password reset backend flow.
10. Extend `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/backend/src/models/User.js` with reset-token fields such as `passwordResetTokenHash` and `passwordResetExpiresAt`. Store only the hash of the emailed token, not the raw token. *depends on 7-8*
11. In `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/backend/src/controllers/emailController.js`, add a password-reset email sender alongside the existing verification mail sender. Use `FRONTEND_URL` to build a reset link that includes the raw opaque token in the query string. *depends on 10*
12. In `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/backend/src/controllers/userController.js`, add `requestPasswordReset` and `resetPassword` handlers. `requestPasswordReset` should generate a random token, hash it, store hash + expiry on the user if the account exists, send the email, and always return a generic success message. `resetPassword` should verify the submitted token by hash, check expiry, assign the plain new password, clear reset-token fields, and save. *depends on 10-11*
13. Wire public routes such as `POST /api/users/auth/forgot-password` and `POST /api/users/auth/reset-password` in `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/backend/src/routes/userRoutes.js`. Keep them unauthenticated because account recovery must work for logged-out users. *depends on 12*
14. Phase 4: Add frontend recovery UI.
15. In `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/frontend/src/components/forms/SignInForm.jsx`, add a visible `Forgot Password?` action that routes to a dedicated forgot-password page. *depends on 13*
16. Add a public forgot-password page in the frontend that collects email, optionally uses the existing reCAPTCHA pattern already used in sign-in/register if the team wants that consistency, submits to `/auth/forgot-password`, and always shows a neutral success message rather than account-existence details. *depends on 13*
17. Add a public reset-password page that reads `token` from the URL, similar to `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/frontend/src/components/pages/VerifyEmail.jsx` as a UI pattern, but submits the token plus new password to `POST /auth/reset-password`. Include confirm-password validation and a success redirect back to sign-in. *depends on 13*
18. Add the new frontend routes in `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/frontend/src/App.jsx` and connect navigation from sign-in. *parallel with steps 16-17*
19. Phase 5: Follow-up security hardening after the core flow is working.
20. Add backend rate limiting for login, resend-verification, and forgot-password endpoints to reduce brute force and email abuse. *can follow after step 13*
21. Consider requiring current-password confirmation for authenticated password changes in `updateUserInfo` and forcing reverification on email changes. *can follow after step 7*
22. Review CSRF protection for authenticated cookie-based state-changing routes now that the app relies solely on cookies for browser auth. *can follow after step 5*
23. Tighten reCAPTCHA verification to validate expected action/hostname and, if using v3, a minimum score threshold. *can follow after steps 12-13*

**Relevant files**
- `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/backend/src/controllers/userController.js` — login response shape, authenticated session bootstrap endpoint, password update logic, forgot-password/reset-password handlers, registration response sanitization.
- `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/backend/src/models/User.js` — single password hashing path, reset-token hash and expiry fields.
- `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/backend/src/controllers/emailController.js` — reuse existing Nodemailer transporter for password reset emails.
- `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/backend/src/routes/userRoutes.js` — wire `auth/me`, `forgot-password`, and `reset-password` routes.
- `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/backend/src/middleware/authenticate.js` — continue to enforce cookie-based auth for authenticated endpoints.
- `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/frontend/src/context/AuthContext.jsx` — remove JS token storage, replace bootstrap with `/auth/me`, preserve logged-in UX after reload.
- `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/frontend/src/services/api.jsx` — keep cookie-based requests via `withCredentials` and confirm no header override is still required.
- `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/frontend/src/components/forms/SignInForm.jsx` — entry point for forgot-password navigation.
- `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/frontend/src/components/pages/VerifyEmail.jsx` — reference pattern for token-in-URL public flow, but not for reset-token security semantics.
- `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/frontend/src/App.jsx` — add public routes for forgot-password/reset-password.
- `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/frontend/src/components/pages/AccountPage.jsx` — likely future surface for authenticated password/email change hardening, though not required for the initial recovery flow.
- `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/private.txt` — confirms current deployment/env setup (`FRONTEND_URL`, API base URL, local dev test account) that the email-link flow must respect.

**Verification**
1. Backend auth regression check: sign in, refresh the page, and confirm the user stays authenticated via the new `/auth/me` flow without any JS-readable token cookie.
2. Backend password write check: change a password through the existing authenticated update path, then log in with the new password to confirm single-hash behavior.
3. Registration response check: verify registration no longer returns the password hash or JWT in the response body.
4. Forgot-password request check: submit both an existing email and a non-existent email and confirm the API returns the same generic success message.
5. Reset-password token check: verify expired, invalid, and reused tokens are rejected; verify a valid token works once and is cleared after success.
6. Frontend recovery UX check: forgot-password page submits successfully, reset-password page accepts the token from the URL, validates confirmation, and redirects back to sign-in on success.
7. Full game auth regression check: authenticated users can still reach dashboard/account, progress persists across reloads, and game-state update hooks continue to work with cookie auth only.

**Decisions**
- Included now: JWT exposure removal, cookie-session bootstrap, single-hash password fix, secure forgot-password/reset-password flow.
- Included as immediate backend cleanup: sanitize registration/login/auth bootstrap responses so password hashes and raw JWTs are never returned.
- Excluded from the first implementation pass: broad UI redesign, unrelated account-settings overhaul, and advanced security layers beyond the listed follow-ups.
- Reuse `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/frontend/src/components/pages/VerifyEmail.jsx` only as a public token-page UX pattern, not as the reset-token security implementation model.
- Keep the current cookie-auth backend model in `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/backend/src/middleware/authenticate.js`; remove the redundant frontend-managed JWT path instead of replacing cookies entirely.

**Further Considerations**
1. Workspace plan file target: create `/Users/andrewbarker/developer/personal/White-Witch-L1-React-Refactor/ai-planning/auth-password-reset-plan.md` from this content during handoff or implementation, since planning mode persists the canonical version in session memory.
2. If the team wants lower risk for the first merge, split Phase 5 follow-up hardening into a separate PR after the session bootstrap and password reset flow are stable.
3. If reCAPTCHA is kept on recovery endpoints, verify the operational UX is acceptable for users who are already locked out of their accounts.