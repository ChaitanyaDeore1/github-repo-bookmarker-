# GitHub Repo Explorer

Small, focused front-end micro app built with **React + TypeScript + Vite**.  
I built this as a micro-project to demonstrate clean component design, API handling, and small performance tweaks that matter in production.

---

## ⚙️ Scope & Key Features

### 🔍 1. Search
- One text input box with **debounced** search (300 ms delay).
- Fetches results from GitHub’s `/search/repositories` endpoint.
- Displays up to 30 repositories with title, description, language, stars, and owner avatar.
- Clear **loading**, **empty**, and **error** messages for better UX.

### ⭐ 2. Bookmarks
- Each card has a “⭐ Bookmark” toggle.
- Bookmarked items persist via **`localStorage`**, even after page reload.
- “Bookmarked Only” filter switch to view saved repositories.

### ⚡ 3. Performance
- Avoids unnecessary re-renders using `React.memo`, `useCallback`, and `useMemo`.
- Optimized rendering when toggling bookmarks or updating filters.

### 🧰 4. Tooling
- Written in **TypeScript** with strict types for all props and API responses.
- **ESLint** + **Prettier** configured — project runs lint-clean (`npm run lint` has 0 warnings).
- Uses modern React hooks only — no external state libraries.

### 🚀 5. Delivery
- Clean, deployable build using Vite.  
- Hosted on **Vercel** for instant access.  
- Detailed README explaining design decisions and next steps.

---


I kept the app intentionally small so the code is easy to read and each file has one responsibility.

---

## Why I built it this way
- **Debounce** to avoid spamming the GitHub API while typing.
- **Memoization** to prevent pointless re-renders when state changes that don’t affect a component occur.
- **localStorage** for persistence — simple and reliable for demo data.
- **TypeScript** to catch mistakes earlier and make the data shapes explicit.

---

## Demo & Repo
- Repo: ` https://github.com/ChaitanyaDeore1/github-repo-bookmarker-.git`  
- Live demo: `github-repo-bookmarker.vercel.app`
  
---

## How to run 
```bash
# clone
git clone https://github.com/ChaitanyaDeore1/github-repo-bookmarker-.git
cd github-repo-explorer

# install
npm install

# dev server
npm run dev

# lint
npm run lint

# build
npm run build
