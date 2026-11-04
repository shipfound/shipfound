# Routine: social

Start the founder's TikTok and Instagram, so slideshows (the shorts routine) and UGC videos (the UGC routine) have an account to go out from. For a website and an app alike. The founder creates each account and presses every create, save and confirm; you open the pages in the browser, fill the profile from the brief and the site, and check it from outside. Free.

Input: `setup`, `tiktok`, `instagram`, or nothing (the same as `setup`). Grow offers it as `SOCIAL:setup` when a slideshow or UGC post would be offered and an account is missing or unfinished. Until one account exists, those posts wait.

## Hard lines here

- One account per platform, the founder's own: the product's, or the founder's personal one when they build in public. Never a second account, never a temp or throwaway email, never an account made for them. An account that exists is finished, not replaced.
- The founder types the email or phone, the password, every code and the birthday, and presses every create, save, switch and confirm button. You never type a password or a code.
- No warm-up automation, no sockpuppets, no follow and unfollow, no bought followers, views or likes, no engagement groups. The first days are the founder using the app by hand.
- A post with AI video in it carries TikTok's AI-generated content label (and Instagram's AI info label), which the founder turns on when posting.
- Never post the same cut twice: each post is new slides or a new cut.
- A Kids category app speaks to the parent: the account is the app's, never a child's, and no child is on the profile photo.

## Procedure

1. **Where they stand.** Call `social_setup`. For an app that is on Android too, pass `playPackage` (the `applicationId` in the repo's `android/app/build.gradle` or `build.gradle.kts`). It returns each account's state (ready, unfinished with what is left, missing, unchecked), the bio link for each platform, and the Meta business portfolio and Page the boost uses.
2. **Check first** when an account is unchecked, or the founder says it changed: read it in the browser as references/access-audit.md, "TikTok and Instagram", says. Ask once whose accounts these are: the product's, or their own if they build in public. Then only the platforms the founder's input names, else every one that is not ready, one at a time.
3. **The profile, drafted.** From the brief, the home page (for an app, its App Store listing) and the audit's assets. Show it all in one message and wait for a yes; change what they say.
   - **Name**: the product's name (the founder's own name for their own account).
   - **Three handles to pick from**: short, the product's name first, then with `app`, `hq` or a word from what it does. Check each by opening `https://www.tiktok.com/@<handle>` and `https://www.instagram.com/<handle>/`: "Couldn't find this account" or "this page isn't available" means it is free. Say which are free on both; the same handle on both is best.
   - **Bio**: 80 characters or fewer. What the buyer gets, in their words, as a stranger who knows nothing reads it (routines/video.md, "The words: the stranger test"). No internal mechanics, no feature list, no hashtags.
   - **Photo**: the logo from the audit's assets, square, at least 400 by 400, the mark in the middle with room around it (both crop it to a circle).
   - **Link**: the `link` `social_setup` gives for that platform, exactly. For an app it is the App Store link; on Instagram add the Google Play link (`playLink`) as a second link when there is one.
   - **Category**: the closest one the platform offers (Software, App Page, Education, and so on).
4. **TikTok.**
   1. Open https://www.tiktok.com/signup and pick "Use phone or email". The founder types the email or phone, the birthday, the password and the code, and presses Sign up. Wait for them.
   2. Open the profile and Edit profile. Fill the name, the picked handle and the bio, and upload the photo (where the browser cannot upload a file, put it on the Desktop and the founder picks it). The founder presses Save.
   3. Switch to a Business account: Settings and privacy, Account, Switch to Business Account (in the app when the website does not offer it), and pick the category. The founder presses each Next and Done.
   4. The Website field shows on a Business account: fill the link; the founder saves. If TikTok does not offer the field yet, it says why on the page: say it in one line and go on.
5. **Instagram.**
   1. Open https://www.instagram.com/accounts/emailsignup/. Fill the name and the picked handle; the founder types the email or phone and the password, then the birthday and the code, and presses each Sign up and Next.
   2. Open https://www.instagram.com/accounts/edit/: the bio and the photo, then the founder presses Submit. Where the website does not let you edit links, the founder adds it in the app (Edit profile, Links, Add external link): give them the link to paste.
   3. Switch to a professional account: Settings, "Account type and tools", Switch to professional account. Business for the product's account, Creator for the founder's own, then the category. The founder presses each Next and Done.
6. **Connect them for ads**, each filled up to its confirm button, which the founder presses.
   - **Instagram to Meta**: when `social_setup` names a Meta business portfolio, open Meta Business Suite's settings for it (https://business.facebook.com/settings), Accounts, Instagram accounts, Add, and the Page's Linked accounts too. The founder signs in to Instagram in the window it opens and presses Connect. With no portfolio yet, leave it: the Meta boost's setup connects it (routines/boost.md).
   - **TikTok to Business Center**: open https://business.tiktok.com, the founder signs in or creates it, then Assets, TikTok accounts, Add, and the request; the founder approves it from TikTok. This is what Spark Ads need later.
7. **Record and check.**
   1. `record_access` with `merge: true` and only the social area, as references/access-audit.md, "TikTok and Instagram", says. The rest of the audit stays as it was.
   2. For each profile: `record_action` with `module` COMMUNITIES, `kind` LISTING, `title` "TikTok profile @<handle>" (or Instagram), `url` the profile (`https://www.tiktok.com/@<handle>`, `https://www.instagram.com/<handle>/`), `liveUrl` the bio link, `meta` `{ type: "social_profile", platform: "tiktok" | "instagram", handle, link, whose: "product" | "founder" }`. Then `verify`: it reads the profile from outside and follows the bio link. Say what it says: Verified, or Claimed with its note. Instagram often refuses outside reads, and then it stays Claimed.
8. **The first days, said plainly.** Tell the founder, in these words or close: "Before your first post, use each app by hand for a few days: follow accounts in your niche, watch, and leave a real comment where you have something to say. It tells TikTok and Instagram who your posts are for. Do this yourself; I will not automate it, and no bought followers or engagement groups." Give the date three days from now for the first post.
9. **The hand-over.** Slideshows and UGC posts are open now. Suggest the first post: three slideshows from the product's own screens (the shorts routine), or a UGC video once that routine is set up, from that date. Then the hand-over (SKILL.md).
