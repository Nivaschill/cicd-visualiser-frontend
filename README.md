# CI/CD Pipeline Visualiser — Frontend

React/TypeScript dashboard for visualising GitHub Actions pipeline health. Connects to the [backend API](https://github.com/Nivaschill/cicd-visualiser-backend) to surface real-time pipeline status, historical pass rates, build durations, and per-job step detail.

## Features

- **Repository selector** — lists only repos with active GitHub Actions workflows
- **Stats bar** — pass rate, average build duration, success/failure/cancelled counts
- **Daily trend chart** — stacked bar chart of passed vs failed runs over 7/14/30/90 days
- **Runs table** — paginated list of workflow runs with status, branch, trigger, commit, and duration
- **Job drawer** — click any run to see per-job and per-step breakdown in a slide-in panel
- **Workflow filter** — filter by specific workflow when a repo has multiple
- **Live refresh** — manual refresh button; in-progress runs show animated status indicator

## Screenshots

> Add screenshots here once running locally — recruiters and interviewers will look at this.

## Getting Started

### Prerequisites

- Node.js 18+
- The [backend](https://github.com/Nivaschill/cicd-visualiser-backend) running on `http://localhost:4000`

### Setup

```bash
# Clone and install
git clone https://github.com/Nivaschill/cicd-visualiser-frontend.git
cd cicd-visualiser-frontend
npm install

# Configure environment
cp .env.example .env.local
# Default points to http://localhost:4000/api — change if needed

# Start development server
npm start
```

The app opens at `http://localhost:3000`.

### Production build

```bash
npm run build
```

Outputs a static bundle to `build/` — deploy to any static host (Vercel, Netlify, GitHub Pages).

## Tech Stack

- **React 18** — UI framework
- **TypeScript** — type safety across components and API layer
- **Recharts** — bar charts for trend visualisation
- **Create React App** — zero-config build tooling (Webpack under the hood)

## Project Structure

```
src/
├── App.tsx                  # Root component — layout, state, data fetching
├── index.tsx                # React entry point
├── services/
│   └── api.ts               # Typed API client for all backend endpoints
├── components/
│   ├── StatsBar.tsx         # Pass rate, duration, and count tiles
│   ├── TrendChart.tsx       # Daily success/failure bar chart (Recharts)
│   ├── RunsTable.tsx        # Paginated workflow runs list
│   └── JobDrawer.tsx        # Slide-in panel with job + step detail
└── utils/
    └── format.ts            # Duration, date, and status colour helpers
```

## Backend

The backend repo lives at: https://github.com/Nivaschill/cicd-visualiser-backend
