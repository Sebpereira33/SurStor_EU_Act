# Enable personal usage on surstor.net

1. Use a dedicated Supabase project for the pilot, connected to the correct Vercel project/environment. For previews use a separate test database. In Vercel confirm the names SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY (or SUPABASE_ANON_KEY), and SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY). Never add a VITE_ prefix to privileged keys. Only the URL and a verified public key are returned to browsers.
2. In Supabase SQL Editor, run supabase/migrations/202611100001_usage_pilot.sql once. It creates new isolated tables and RPCs. Confirm no pre-existing objects use these names. Row access is through constrained functions; public callers cannot query tables or choose a workspace. There is one personal workspace and one replaceable device key per invited user.
3. In Authentication → URL Configuration set Site URL to https://www.surstor.net and allow exactly https://www.surstor.net/dashboard/personal for the pilot redirect. Enable email login; disable open signups. Configure your email sender for external pilot recipients. Configure Supabase email rate limits and a Vercel rate limit for POST /api/events before public rollout.
4. In Authentication → Users invite the first tester and copy their **User UID**. In SQL Editor, replace the placeholder inside the quotes and run:

   `insert into surstor_private.pilot(owner) values ('PASTE-USER-UID-HERE'::uuid) on conflict do nothing;`

5. Deploy the website commit to the Vercel project. At /dashboard click **Sign in to see my usage**. Request the email link and open it in the same browser. An enrolled account with no events should see an empty workspace; it never shows sample stats. A signed-in but unenrolled account is denied.
6. Create an upload key in the personal dashboard. Set SURSTOR_USAGE_DEVICE_TOKEN in the local reporting bridge and SURSTOR_USAGE_URL to https://www.surstor.net (canonical host; the bridge refuses redirects). Send one consented usage event via the bridge, then refresh the page. The bridge reports supplied metadata only; installing it does not automatically measure model usage.
7. Check with a second enrolled account: the first user's record must not appear there. Repeat delivery, check totals remain unchanged, revoke the device, and confirm uploads are denied. Verify after redeployment. Only then invite additional users. For removal of all pilot records for one user, deleting their pilot membership cascades to their usage events. Plan retention/backups before collecting real usage.

Run the local isolation test with `node --test tests/usage-pilot.test.mjs`. This uses an isolated PostgreSQL engine; it cannot verify hosted email delivery, Vercel routing, or your account configuration.
