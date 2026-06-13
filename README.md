# CineGPT

An AI-powered movie discovery app. Describe what you want to watch in plain English and get instant recommendations — or browse by language, genre, and trending.

<!-- Add a screenshot or demo GIF here -->
<!-- ![CineGPT Demo](./demo.gif) -->

## Live Demo

[cinegptai.vercel.app](https://cinegptai.vercel.app)

---

## Features

### AI Search

- Describe any mood, genre, actor, or idea — AI returns 5 matched movies
- Powered by **Groq (Llama 3.1)** with **Google Gemini** as automatic fallback
- Two-pass prompting: AI recommends → AI verifies — reduces wrong titles and years
- Results cached in localStorage — same query never hits the AI twice
- Recent searches saved locally with one-click re-run
- 14 example prompt chips to get started

### Browse

- **10 language tabs** — Telugu, Hindi, Tamil, Malayalam, Kannada, Korean, Japanese, Spanish, French, All
- Regional rows (Popular, Top Rated, New) load on demand per language
- 4 default rows: Now Playing, Popular, Top Rated, Upcoming

### Hero Carousel

- Auto-advances through now-playing movies with a dot progress bar
- Pauses on hover, resumes from the same position on leave
- YouTube trailer autoplays muted in the background; poster fades out once loaded

### Movie Cards

- Session-level trailer cache — each movie fetches its trailer once per browser session
- Hover reveals title, rating, year, and a YouTube play button
- Full trailer modal with backdrop blur (click outside to close)
- Long-press on mobile opens the hover state

### Movie Detail Page

- Full info: overview, genres, runtime, budget, revenue, release status
- Cast row with clickable actor/director profiles
- Media tabs: Videos (trailers/teasers/clips), Backdrops, Posters
- User reviews with expandable text
- Streaming providers with direct search links (Netflix, Prime Video, Hotstar, Zee5, JioCinema, SonyLiv, Apple TV, MUBI and more)
- Similar movie recommendations
- Auto-added to Recently Viewed on every visit

### Search

- Real-time search with 400ms debounce
- Infinite scroll pagination
- Language filter chips (Telugu, Hindi, Tamil, English, Malayalam, Korean, Japanese)

### Trending

- Today and This Week tabs, cached per session

### Genre Pages

- Infinite scroll with sort options: Popularity, Top Rated, Newest, Oldest

### Person Pages

- Actor/director profile: photo, bio, birthday, place of birth
- Full filmography grid

### Recently Viewed

- Persisted in localStorage across sessions
- Row in the Browse page with per-card remove and clear all
- Quick-access dropdown in the header

### Authentication

- Sign In, Sign Up, Forgot Password via Firebase Auth
- Inline field validation with readable error messages
- Enter key submits forms; loading and success states on buttons
- Login background fades in smoothly; instant gradient fallback while loading

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| UI | React 19 + Vite |
| Styling | TailwindCSS v4 |
| State | Redux Toolkit |
| Auth | Firebase Authentication |
| Movie Data | TMDB API |
| AI (primary) | Groq API — Llama 3.1 8B Instant |
| AI (fallback) | Google Gemini Flash |
| Routing | React Router v7 |
| Analytics | Vercel Analytics + Speed Insights |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [TMDB](https://www.themoviedb.org) account (free API key)
- A [Firebase](https://firebase.google.com) project with Authentication enabled
- A [Groq](https://console.groq.com) API key (free tier available)
- A [Google AI Studio](https://aistudio.google.com) API key for Gemini (free tier available)

### Installation

```bash
git clone https://github.com/suresh-javvadi/cinegpt.git
cd cinegpt
npm install
```

### Environment Variables

Create a `.env` file in the root of the project:

```env
VITE_TMDB_API_KEY=your_tmdb_bearer_token

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_GROQ_API_KEY=your_groq_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

> **Note:** The TMDB key is a Bearer token (starts with `eyJ...`), not the short API key.

### Run Locally

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## Deployment

The app is configured for **Vercel** (includes `@vercel/analytics` and `@vercel/speed-insights`).

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add all environment variables from `.env` in the Vercel dashboard
4. Deploy

---

## Project Structure

```text
src/
├── assets/              # Images and static files
├── components/          # Shared components (Header, ScreenLoader)
├── firebase/            # Firebase config and error messages
├── hooks/               # Custom hooks (useFetchMovies, useMovieTrailer, useRecentlyViewed)
├── pages/
│   ├── browse/          # Browse page, MovieCard, VideoBackground, carousel
│   ├── genre/           # Genre page with infinite scroll
│   ├── gptSearch/       # AI search page, search bar, suggestions
│   ├── login/           # Login/signup/forgot password
│   ├── movieDetail/     # Full movie detail page
│   ├── notFound/        # 404 page
│   ├── person/          # Actor/director profile page
│   ├── search/          # Search page with filters
│   └── trending/        # Trending movies page
├── routes/              # App routing
├── slices/              # Redux slices (movies, user, gpt, config)
├── store/               # Redux store
└── utils/               # Constants and language config
```

---

## License

MIT
