# Step-by-Step Guide: Enabling GMB API for Automation (2026 Update)

To make your SEO Autopilot fully autonomous, we need to connect it to your Google Business Profiles.
**Important 2026 Update:** Google now hides these APIs by default to prevent spam. You must request access before they appear in your Cloud Console.

## 1. Request API Access (Crucial First Step)

Before searching in the console, you must tell Google you are a developer for Smile Fotilo.

1. Go to the [Google Business Profile API Contact Form](https://support.google.com/business/contact/api_default).
2. For the **Issue** field, select **"Application for Basic API Access"**.
3. Fill it out with your project details (your cloud project ID is `captcha-1747281225780`).
4. Google will review and approve your project (this usually takes 1-3 days).

## 2. Enable the APIs in Google Cloud

**Only after you receive the approval email:**

1. Go to the [Google Cloud Console: API Library](https://console.cloud.google.com/apis/library).
2. Ensure you are in project `captcha-1747281225780`.
3. Now search for and **Enable** these specific APIs:
   * `Google My Business API`
   * `My Business Account Management API`
   * `My Business Business Information API`

## 3. Grant Access to Your Service Account (Via Google Search)

The traditional dashboard is now retired. Use this "Manage on Search" method:

1. Go to Google and search for your business name (e.g., "Smile Fotilo Gonda").
2. Above the search results, you will see a "Your business on Google" menu.
3. Click the **Three Dots (⋮ or ⋮⋮⋮)** on the right side of the menu.
4. Select **Business Profile settings**.
5. Click **People and access**.
6. Click **Add** (the plus icon).
7. Paste the **Service Account Email** found in your current JSON key:
   * `smile-fotilo-bot@...iam.gserviceaccount.com`
8. Set the role to **Manager** and click **Invite**.

## 4. Let Me Know

Once the APIs are active and the Service Account is a manager, just let me know here. I will immediately update the GitHub Action to start auto-publishing your SEO strategies directly to Google Search.
