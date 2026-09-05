# TechForKids — Production Launch Requirements

To officially take the TechForKids platform live to the public, the architecture
and security is fully ready. However, we still need a few real-world
credentials, assets, and decisions from you.

Please provide the information below whenever you are ready.

---

### 1. Payment Gateway Configuration (Razorpay / Stripe)

To securely process real financial donations and trigger our backend webhooks,
we need your live payment gateway keys.

- **Payment Provider Choice**: (Are you using Razorpay, Stripe, or another
  provider?)
- **Key ID / Publishable Key**: `...`
- **Secret Key**: `...`
- **Webhook Secret**: `...` (We need this to securely verify payment
  completions)

### 2. Branding & Visual Assets

- **Official Logo**: (Link to an image or upload it to the repository)
- **Favicon**: (The small icon that appears in the browser tab)
- **Primary Contact Email**: (e.g., `support@techforkids.org`)
- **Legal Details**: Do you have a registered entity name or physical address
  you want listed in the footer/Terms of Service?

### 3. Production Environment & Hosting

- **Custom Domain Name**: What is the URL this platform will live on? (e.g.,
  `www.techforkids.org`)
- **Hosting Platform**: Will we be deploying this to Vercel, Netlify, or AWS?
  (If Vercel, we can connect it directly to this GitHub repository).

### 4. Root Administrator Account

Because of our zero-trust security model, users cannot become administrators
through the UI. We need to manually inject the first `admin` into the database.

- **Admin Email Address**: Please sign up for an account on your live platform
  with your email, and then give me that exact email address. I will run a SQL
  command to elevate you to `admin`.

### 5. Email Provider (Optional but Recommended)

For sending transactional emails (like "Device Donation Received" or "NGO
Application Approved"), we should integrate an email service.

- **Provider Options**: Resend, SendGrid, or AWS SES? Do you have an API key for
  one of these?

---

**How to provide this:** You can either paste all the answers directly in our
chat, or update the `.env.local` file with the keys and answer the remaining
questions in chat. Once you provide this, I can finalize the deployment!
