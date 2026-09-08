# 07 — CMS Setup, Step by Step

This is the click-by-click version of turning on the CMS for the team. You do it **once**.
No prior GitHub-App knowledge is assumed. Total time: about fifteen minutes.

If you only want to edit content on your own machine, you do not need any of this — run
`npm run dev` and open `http://localhost:3220/keystatic`. It works immediately, with no
login. Everything below is only for giving *other people* access through a browser.

---

## First, the idea in one paragraph

The CMS has no database. When someone saves an edit, the change has to be written back into
this project's files, and those files live on GitHub. So the CMS needs GitHub's permission
to write to the repository on the editor's behalf. GitHub grants that permission through a
thing called a **GitHub App** — think of it as an ID card for your website. The five
environment variables are that ID card: where the app lives, who it is, and its password.
You create the app once, and every editor then signs in with their own GitHub account.

---

## What you need before you start

1. The project pushed to a **GitHub repository**.
2. The site **deployed** somewhere that runs Next.js — Vercel is the simplest, and the rest
   of this guide assumes it. Deploy it before doing the CMS setup, because one of the setup
   fields asks for the live address.
3. Admin rights on that repository (or on the GitHub organisation that owns it).

---

## Step 1 — Tell the project which repository to use

In the project folder, create a file called `.env` (the file `.env.example` shows the
shape; `.env` itself is git-ignored, so it never gets committed).

Put one line in it — your repository, exactly as it appears in its GitHub address:

```
NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=your-username/your-repo-name
```

For example, if the repo is at `https://github.com/mahmud886/dot-grey-digital-v1`, the line is:

```
NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO=mahmud886/dot-grey-digital-v1
```

Leave every other variable empty for now.

## Step 2 — Start the site and open the CMS

```bash
npm run dev
```

Open **http://localhost:3220/keystatic**.

Because the repository is set but the app details are not, Keystatic shows a page titled
**"Keystatic Setup"** instead of the usual dashboard. That is expected — it is the wizard.

> This wizard only runs in development. Creating the app from the live site is blocked on
> purpose, so do this step on your own machine.

## Step 3 — Create the GitHub App

On the Keystatic Setup screen:

1. **Deployed URL** — the live address of the site, with no trailing slash. For example
   `https://dotgreydigital.com`, or the Vercel address like
   `https://dot-grey-digital.vercel.app` if the domain is not connected yet.
2. **Organization** — leave this **empty** if the repository sits under your personal
   GitHub account. Fill in the organisation name only if the repo belongs to a GitHub
   organisation.
3. Click the button to continue. You land on GitHub's "Register new GitHub App" page with
   almost everything already filled in.
4. Give it a name — anything recognisable, for example `DotGrey Digital CMS`. GitHub App names
   must be unique across all of GitHub, so add a suffix if the name is taken.
5. Scroll down and click **Create GitHub App**.

GitHub then sends you back to your local site automatically.

## Step 4 — Let Keystatic write the values

You do not copy anything by hand here. On the way back, Keystatic **appends four lines to
your `.env` file for you**:

```
# Keystatic
KEYSTATIC_GITHUB_CLIENT_ID=Iv1.xxxxxxxxxxxx
KEYSTATIC_GITHUB_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
KEYSTATIC_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=dotgrey-cms
```

Open `.env` and confirm they are there. That is your ID card — keep the file private.

You will also see a screen saying **"You've installed Keystatic! 🎉"** with a button to
install the app.

## Step 5 — Install the app on the repository

Click that button (or go to `https://github.com/apps/<your-app-slug>` and choose
**Install**). GitHub asks which repositories the app may access.

Choose **Only select repositories** and pick your repository. Creating the app and
installing it are two different things — skipping this step is the most common reason the
CMS says it cannot find the repo.

## Step 6 — Restart and check it locally

Stop the dev server and start it again, so it picks up the new `.env`:

```bash
npm run dev
```

Open http://localhost:3220/keystatic again. It should now show **Sign in with GitHub**.
Sign in, make a small edit, and save — the change should appear as a commit in the
repository on GitHub.

## Step 7 — Put the same values on the live site

Everything so far only configured your own machine. Now give the deployed site the same
five values.

On **Vercel**: open your project → **Settings** → **Environment Variables**. Add each of
these five, exactly as spelled, with the values from your `.env`:

| Name | Where the value comes from |
| --- | --- |
| `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO` | You typed it in Step 1 |
| `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | Written by Keystatic in Step 4 |
| `KEYSTATIC_GITHUB_CLIENT_ID` | Written by Keystatic in Step 4 |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | Written by Keystatic in Step 4 |
| `KEYSTATIC_SECRET` | Written by Keystatic in Step 4 |

Apply them to the Production environment (Preview too, if you want the CMS on preview
deployments). Then **redeploy** — environment variables only take effect on a new build.

## Step 8 — Give the team access

CMS access *is* repository access. There is no separate user list to manage.

For each team member: GitHub → your repository → **Settings** → **Collaborators** →
**Add people** → their GitHub username → give them **Write** access. They accept the email
invitation, then go to `https://your-domain.com/keystatic`, click **Sign in with GitHub**,
and they are in.

To remove someone, remove them from the repository. Their CMS access disappears with it.

---

## What happens when an editor saves

1. They edit a field in the CMS and press **Save**.
2. Keystatic commits the changed JSON (and any uploaded image) to the repository, under
   their own GitHub account.
3. Vercel sees the commit and rebuilds the site.
4. A minute or two later the change is live.

Because every change is a commit, the full history is on GitHub: who changed what, when,
and one click to revert.

---

## Where each value actually comes from

Only three of the five live on GitHub. The other two do not exist there at all, which is
worth knowing before you go looking.

| Variable | Where you get it |
| --- | --- |
| `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO` | **Not a GitHub setting.** It is just the repository path from its web address: `github.com/mahmud886/brothers-ltd` → `mahmud886/brothers-ltd` |
| `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | GitHub, on the app's settings page — it is also the last part of the app's public address, `github.com/apps/<slug>` |
| `KEYSTATIC_GITHUB_CLIENT_ID` | GitHub, on the app's settings page |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | GitHub, on the app's settings page — **shown once**, at the moment you generate it |
| `KEYSTATIC_SECRET` | **Not on GitHub.** A random string belonging to your site. Keystatic generates it in Step 4, or run `openssl rand -hex 40` |

### Finding the app's settings page

For an app owned by your personal account:

> GitHub → your avatar, top right → **Settings** → scroll to the bottom of the left
> sidebar → **Developer settings** → **GitHub Apps** → click your app

Direct link: **https://github.com/settings/apps**

For an app owned by an organisation:

> GitHub → the organisation → **Settings** → **Developer settings** → **GitHub Apps**

On that app's **General** tab you will find **Client ID**, and a **Client secrets**
section. Note that GitHub shows a client secret exactly once. If you did not save it, you
cannot look it up — press **Generate a new client secret**, then update `.env` and your
host's environment variables with the new value and redeploy. The old one stops working.

Do not confuse **App ID** (a short number, also on that page) with **Client ID** — Keystatic
wants the Client ID.

## Creating the app by hand (only if the wizard will not run)

Step 3's wizard fills in this form for you, and getting it right by hand is fiddly. If you
must, go to **https://github.com/settings/apps/new** and set:

| Field | Value |
| --- | --- |
| **GitHub App name** | Anything unique, e.g. `DotGrey Digital CMS` |
| **Homepage URL** | `https://your-domain.com/keystatic` |
| **Callback URL** | `https://your-domain.com/api/keystatic/github/oauth/callback` |
| **Add a second callback URL** | `http://localhost:3220/api/keystatic/github/oauth/callback` — so the CMS also works on your machine |
| **Request user authorization (OAuth) during installation** | ticked |
| **Webhook → Active** | unticked |
| **Repository permissions → Contents** | Read and write |
| **Repository permissions → Metadata** | Read-only |
| **Repository permissions → Pull requests** | Read-only |
| **Where can this app be installed?** | Only on this account |

Create it, then generate a client secret and copy it immediately. Generate
`KEYSTATIC_SECRET` yourself with `openssl rand -hex 40`. Then install the app on the
repository, as in Step 5.

## Troubleshooting

**`/keystatic` shows a 404 on the live site.**
`NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO` is not set in the host's environment variables, or the
site has not been redeployed since it was added. This 404 is deliberate — see
`src/proxy.ts`. Without a configured repo the CMS would fall back to local mode with no
login at all, so it is blocked rather than shipped open.

**"Repo not found" after signing in.**
The app was created but never installed on the repository (Step 5), or it was installed on a
different repository than the one in `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO`.

**Sign-in loops back to the sign-in screen.**
Usually `KEYSTATIC_SECRET` differs between environments, or the app's callback URL does not
match the deployed URL. Check that the **Deployed URL** you entered in Step 3 is exactly the
address people actually visit, including `https://` and no trailing slash. You can correct
it later at GitHub → **Settings** → **Developer settings** → **GitHub Apps** → your app →
**Callback URL**.

**An editor can sign in but cannot save.**
They have Read access to the repository, not Write.

**You need to start over.**
Delete the app at GitHub → **Settings** → **Developer settings** → **GitHub Apps**, remove
the four generated lines from `.env`, and repeat from Step 2.

---

## Security notes

- `KEYSTATIC_GITHUB_CLIENT_SECRET` and `KEYSTATIC_SECRET` are passwords. They belong in
  `.env` locally and in the host's environment variables — never in the repository, a
  screenshot, or a chat message. `.env` is already git-ignored.
- The two `NEXT_PUBLIC_` variables are visible in the browser by design. That is fine: they
  identify the app, they do not grant anything.
- Anyone can *open* `/keystatic` on the live site, but without a GitHub account that has
  write access to the repository they cannot load or save content.
- If a secret ever leaks, go to the app's settings on GitHub, generate a new client secret,
  update it in `.env` and on the host, and redeploy.
