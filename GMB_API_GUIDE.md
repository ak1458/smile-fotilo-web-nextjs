# Step-by-Step Guide: Enabling GMB API for Automation

To make your SEO Autopilot fully autonomous (auto-posting, auto-reviews), follow these steps to enable the **Business Profile API**.

### 1. Enable the API in Google Cloud

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Select the project you used for Search Console (e.g., `captcha-1747281225780`).
3. Go to **APIs & Services > Library**.
4. Search for and **Enable** these two:
    * `Business Profile Management API`
    * `My Business Business Calls API` (Optional)
    * `Business Profile Performance API`

### 2. Grant Access to Your Service Account

Since you already have a service account (`smile-fotilo-bot` or similar), we just need to give it permission to manage your business.

1. Open your [Google Business Profile Manager](https://business.google.com/).
2. Click on **Settings > Managers**.
3. Click **Add Manager**.
4. Paste the **Service Account Email** found in your current JSON key:
    * `smile-fotilo-bot@...iam.gserviceaccount.com`
5. Set the role to **Manager**.

### 3. Share the API Key (Or Update Secret)

Once you've enabled the APIs in the Cloud Console:

1. If you use a new JSON key, send it to me.
2. If you use the same one, just let me know "I've enabled the API and added the manager," and I will update the code to handle **Auto-Posting**.

---

### **What will happen next?**

Once I have this access, I will:
* Update `seo_optimizer.js` to use the `mybusinessbusinesscalls` and `mybusinessaccountmanagement` libraries.
* The **GitHub Action** will then be able to post your daily "Zero Click" strategies directly to Google Search without you lifting a finger.
