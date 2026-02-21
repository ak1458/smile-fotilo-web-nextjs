# How to Grant Vercel Control to Your AI Agent

To give me "whole control" to fix your SSL issues and manage your deployments, the most secure and effective way is to provide a **Vercel Access Token**.

## Step 1: Generate the Access Token

1. Go to your [Vercel Account Settings - Tokens](https://vercel.com/account/tokens).
2. Click **Create**.
3. Name it `Antigravity-Agent`.
4. Set the Scope to **Full Access** (or your specific team).
5. Set an expiration date (e.g., 30 days) if you prefer.
6. Click **Create Token** and **Copy** the value.

## Step 2: Share it with Me

Once you have the token:

* **Paste it here** in our chat.
* I will then use it to run `npx vercel` commands directly to fix your domains, SSL, and deployment triggers.

---

### **What I will do once I have control:**

1. **Fix SSL:** I will run `vercel domains add www.smilefotilo.com` to trigger the multi-domain SSL certificate.
2. **Redirection:** I will configure the `www` to root redirection natively in Vercel.
3. **Deployment Monitoring:** I will be able to check build logs and fix any deployment failures in real-time.
4. **Edge Config:** If needed, I can setup high-speed redirects at the edge.
