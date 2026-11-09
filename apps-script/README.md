# Connecting the sign-up form

The form on the site sends each sign-up to a Google Sheet owned by the club's Google account.

1. Signed in to the **club** Google account, create a Google Sheet named **IAI Members**.
2. In the sheet: **Extensions → Apps Script**. Delete the sample code and paste in `Code.gs` from this folder. Save.
3. **Deploy → New deployment → Select type: Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy** and approve the permissions prompt (it only needs access to this sheet).
4. Copy the **Web app URL** (ends in `/exec`).
5. In `index.html`, paste it into `const SIGNUP_ENDPOINT = '';`, then commit and push.

Sign-ups appear in the **Members** tab. If the same email signs up twice, their row is updated instead of duplicated.

**Emailing members:** filter to `Email consent = Yes`. Canada's anti-spam law (CASL) requires that consent and an unsubscribe option in every email, so remove anyone who asks.
