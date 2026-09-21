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

The app starts out **private**, which is fine while you are the only editor. Before anyone
else can sign in you will need to make it public — see Step 8a.

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

Open http://localhost:3220/keystatic again. It moves itself to `127.0.0.1` — that is expected — and should now show **Log in with GitHub**.
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

CMS access *is* repository access. There is no separate user list to manage: whoever can
push to the repository can sign in to the CMS, and nobody else can.

### 8a. Make the app public (once)

GitHub creates apps as **private**, and a private app owned by a personal account can only
be signed into by its owner. Until you change this, your teammates will be stopped by GitHub
at the sign-in step, however the rest is set up.

GitHub → **Settings** → **Developer settings** → **GitHub Apps** → your app → **Advanced**
→ **Make public**.

"Public" sounds more alarming than it is. It means anyone *may install the app on their own
account* — which gives them access to their own repositories, not to yours. Access to this
repository is decided entirely by 8b. The alternative is moving the repository and the app
into a GitHub organisation, which also works but is a much bigger change.

### 8b. Invite someone

1. Open the repository on GitHub → **Settings**.
2. In the left sidebar, under **Access**, click **Collaborators**. GitHub may ask for your
   password again.
3. Click **Add people**.
4. Type their GitHub username, full name or email, and pick them from the list.
5. Click **Add *name* to this repository**.

GitHub emails them an invitation. **Nothing works for them until they accept it.**

There is no role to pick. On a repository owned by a personal account, every collaborator
gets the same access: they can read and push to the repository, but cannot change its
settings or invite anyone else.

> **Know what you are giving.** That access is not limited to content. A collaborator can
> push code, not just edit through the CMS. Invite people you would trust with the codebase.
> If you ever need content-only access, the repository has to move to a GitHub organisation,
> where roles can be set per person.

### 8c. What the person you invited does

Send them this.

**Once, the first time:**

1. If you do not have a GitHub account, make one at **github.com/signup** (free).
2. Open the invitation email from GitHub and click **Accept invitation**. It also appears
   at **github.com/notifications**.
3. Go to **https://your-domain.com/keystatic**.
4. Click **Log in with GitHub**, then **Authorize** on the screen GitHub shows.

**Every time after that:**

1. Go to **https://your-domain.com/keystatic**.
2. Pick what you want to change from the left-hand menu.
3. Edit, then click **Save**.
4. The live site updates about a minute or two later.

There is nothing to install and no code to run — only a browser. The editing rules (what is
safe to change, what is not) are in `docs/06-cms.md`, readable on the site at `/docs`.

Two things to tell them plainly:

- **Save publishes.** There is no draft or approval step; saved changes go live on the next
  build.
- **Nothing is permanent.** Every save is a commit with their name on it, so any change can
  be seen and undone from the repository's history.

### 8d. Removing someone

Repository → **Settings** → **Collaborators** → **Remove** next to their name. Their CMS
access disappears at the same moment.

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
| **Add a second callback URL** | `http://127.0.0.1:3220/api/keystatic/github/oauth/callback` — so the CMS also works on your machine. It must be `127.0.0.1`, not `localhost`: in GitHub mode Keystatic redirects `localhost` to `127.0.0.1` and sends that address to GitHub, which compares it character for character |
| **Request user authorization (OAuth) during installation** | ticked |
| **Webhook → Active** | unticked |
| **Repository permissions → Contents** | Read and write |
| **Repository permissions → Metadata** | Read-only |
| **Repository permissions → Pull requests** | Read-only |
| **Where can this app be installed?** | **Any account** — otherwise only you can sign in; see Step 8a for why this is safe |

Create it, then generate a client secret and copy it immediately. Generate
`KEYSTATIC_SECRET` yourself with `openssl rand -hex 40`. Then install the app on the
repository, as in Step 5.

## Troubleshooting

**`/keystatic` is a blank page on your machine, with nothing in the console.**
The dev server is refusing the browser. In GitHub mode Keystatic moves you from `localhost`
to `127.0.0.1`, and the Next 16 dev server blocks dev resources from origins it does not
recognise — so the page's JavaScript never starts. The dev server's terminal says so:
`Blocked cross-origin request to Next.js dev resource /_next/hmr from "127.0.0.1"`. The fix
is `allowedDevOrigins: ["127.0.0.1"]` in `next.config.ts`, which is already there; if you
see this, check it has not been removed, then restart the dev server. Live sites are not
affected.

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

**A teammate cannot sign in, but you can.**
Nearly always one of two things. Either the app is still private (Step 8a), or they have not
accepted the invitation yet (Step 8b) — a pending invite grants nothing. They can find it at
**github.com/notifications**.

**An editor can sign in but cannot save.**
They are not a collaborator on this repository — check that the invitation was accepted and
that it was for this repository and not another one.


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
