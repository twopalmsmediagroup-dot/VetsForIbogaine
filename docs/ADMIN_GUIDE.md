# Vets for Ibogaine — Website Dashboard Guide

This guide is for whoever updates the website. No coding needed.

## 1. Signing in
- Go to **yourwebsite/admin** (on the private staging site for now; later **vetsforibogaine.org/admin**).
- Enter your email and password. Forgot it? Click **Forgot password?** and follow the email link.
- To change your password: **My Account** in the left menu.

## 2. The golden rule: Draft vs. Published
Every item has a **Visibility** setting:
- **Draft** — saved, but hidden from the public. Use this while you're writing or reviewing.
- **Published** — live on the website within seconds of clicking **Save**.

To take something down without losing it, set it to **Draft** and save.

## 3. What you can edit

| Menu item | What it controls | Where it shows up |
|---|---|---|
| **Articles & News** | Your editorial articles, research summaries, announcements and links to outside news coverage | News page (homepage “In the News” button), focus area pages |
| **Resources** | Studies, reports, guides, policy documents | Resources page and focus area pages |
| **Organizations** | Confirmed partners and informational listings | Partners page, homepage, focus area pages |
| **Timeline** | Historical milestones | Timeline page |
| **Pages & Focus Areas** | About Ibogaine, Why Veterans, the seven consortium focus areas, legal pages | Their own pages |
| **Homepage & Site Settings** | Homepage headlines, photos, tagline, pillar descriptions, footer, social links, donate button | Homepage and footer |
| **Inbox & Subscribers** | Contact-form messages and newsletter sign-ups | Dashboard only |
| **Team Access** | Who can edit the site | Dashboard only |

## 4. Common tasks

### Add an article you wrote
1. **Articles & News → + Add article**
2. Headline, Type = *Editorial article*, Visibility = *Draft*.
3. Write in **Article text**. Use the toolbar for headings, bold, lists and links, and **Preview** to check it.
4. Add a **Short summary** (shows on cards and Google), a **Cover image**, and **References** for any medical or research claims.
5. Pick a **Consortium focus area** so it also appears on that area's page.
6. When it's ready, set Visibility to **Published** and **Save**.

### Share a news story from another outlet
1. **Articles & News → + Add article**, Type = **In the News**.
2. Fill in Headline, Short summary, **Source name** (e.g. *Reuters*) and **Source link**.
3. Leave Article text empty. The card links straight to the original story.

### Add an organization
1. **Organizations → + Add organization**.
2. **Relationship** is important:
   - **Confirmed partner** — only when the organization has formally agreed to partner. Shows a gold “Confirmed Partner” badge.
   - **Informational listing** — everyone else. Shows “Informational Listing” and the page explains it's not an endorsement.
3. Only upload a logo with the organization's permission.

### Change a homepage photo or headline
**Homepage & Site Settings** → find the section → click **Upload image** or edit the text → **Save all settings** at the bottom. If no photo is set, the site shows an elegant navy panel with the brain mark, so nothing ever looks broken.

Photo tips: landscape, at least 1600 px wide, under 10 MB. Use photos you own or have licensed.

### Edit a consortium focus area
**Pages & Focus Areas** → click the area (e.g. *Clinical Safety*). Edit the summary or page content. Its articles, resources and organizations are pulled in automatically from items tagged with that area.

### Add a timeline milestone
**Timeline → + Add timeline entry**. Enter the **Year** (used for ordering) and optionally a **Date as displayed** like “January 2024”. Add a source link whenever possible.

### Respond to messages
**Inbox & Subscribers** shows contact-form messages (join, partner, media, general). Click the email to reply, then **Mark as handled**. Download newsletter subscribers as a CSV to import into Mailchimp or another email tool.

### Give someone else access
1. **Team Access** → enter their email → choose **Editor** (can create, edit and publish, but not delete) or **Administrator** (everything).
2. Create their login: in Supabase, open the **Vets For Ibogaine** project → **Authentication → Users → Add user → Create new user**, enter their email and a temporary password, and tick **Auto Confirm User**.
3. Send them the dashboard link and ask them to change their password under **My Account**.

## 5. Writing guidelines (positioning)
Vets for Ibogaine **does not** conduct clinical research, provide medical treatment, arrange treatment access, or endorse specific providers. When writing:
- Describe what the consortium does: educate, connect organizations and amplify veteran voices.
- Avoid words that suggest services: “book”, “access treatment”, “our clinic”, “our trial”, “we refer”.
- Back medical and research claims with a source, and mention risks alongside benefits.
- Remember ibogaine is Schedule I in the U.S. and not FDA-approved.

## 6. Deleting
Only Administrators can delete. Click **Delete** at the bottom of an item, then click again to confirm. Deleting is permanent, so if you might want it back later, set it to **Draft** instead.

## 7. Getting help
For anything the dashboard can't do (new page layouts, new features), open the project in Claude Code. The `CLAUDE.md` file in the repository explains the setup.
