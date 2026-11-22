# Itahari Citizen Service Portal

A JavaScript project with a Next.js public website in `client` and an Express + MongoDB API in `server`.

## Requirements

- Node.js 20.9 or newer
- MongoDB running locally, or a MongoDB connection string

## Setup

1. In `server`, install dependencies and create `.env` from `.env.example`.
2. Set `MONGODB_URI` and choose a non-default `ADMIN_PASSWORD` in `server/.env`.
3. In `client`, install dependencies. Set `NEXT_PUBLIC_API_URL` in `client/.env.local` if the API is not at `http://localhost:5000/api`.
4. Start the API and website in separate terminals:

```powershell
cd server
npm install
npm run dev
```

```powershell
cd client
npm install
npm run dev
```

Open `http://localhost:3000`. The API health check is at `http://localhost:5000/api/health`.

## Features

- Nepali public home page, news, complaint form, and municipality information pages
- Responsive layout and persisted light/dark theme preference
- Complaint form supports an optional JPG, PNG, or WEBP image (up to 5 MB)
- Citizens can track complaints by reference number; administrators can set pending, completed, or cancelled status
- Administrators can add, edit, and delete tourist places displayed alongside the curated destinations
- Admin passphrase gate, news create/edit/delete, complaint review/delete, and mayor photo upload
- Current running programs can be added in admin Portal Settings and shown on the homepage
- News can be marked as an important notice and shown in a centered popup on the homepage
- Uploaded images are stored under `server/uploads`; record data is stored in MongoDB

Administrator API requests require a short-lived token issued after passphrase verification. Complaint records and news write operations are restricted to administrators; public complaint submission and public news/settings reads remain available.

The news page shows clearly labeled sample items when the API is unavailable. Admin operations and complaint submissions require both the API and MongoDB to be running.

## Deploy to Render with MongoDB Atlas

MongoDB Atlas hosts the database, not this application. The root `render.yaml` configures a private Express API and a public Next.js site; the site proxies API and uploaded-image requests to the API over Render's private network. The API's uploads use a persistent disk mounted at `/var/data`, with `UPLOADS_DIR` set to `/var/data/uploads`.

1. Rotate any credentials shared in chat. In Atlas, create a database user with only the required database permissions, configure Atlas Network Access for the Render API's outbound IPs, and copy a fresh connection string for the `itahari_municipality` database. Percent-encode special characters in the connection-string username and password.
2. Push this repository to a Git provider connected to Render, then create a Blueprint from the repository and review the services and costs before applying it. The API service and persistent disk require paid Render resources.
3. In the API service's Render environment, set `MONGODB_URI` to the fresh Atlas connection string, `ADMIN_PASSWORD` to a new strong passphrase that has not been shared in chat, and `CLIENT_ORIGIN` to the exact HTTPS URL of the deployed frontend. These values are marked `sync: false` in the Blueprint so secrets are entered in Render rather than committed to source control.
4. Confirm the frontend service's `INTERNAL_API_HOSTPORT` is populated from the private API service. `NEXT_PUBLIC_API_URL` is `/api`; do not put database credentials or private API addresses in `NEXT_PUBLIC_*` variables.
5. After deployment, verify the frontend and `/api/health`. Keep the API private; the public frontend exposes only the intended API paths, with complaint records and administrative writes protected by the administrator token.

Atlas is configured separately from Render: its IP access list must permit the API service's outbound connection, and the URI must contain the selected database name. Do not use `0.0.0.0/0` for Atlas Network Access as a shortcut.
