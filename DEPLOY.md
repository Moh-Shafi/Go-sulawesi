# Hostinger Deployment Guide

This guide explains how to deploy GoSulawesi to Hostinger shared hosting.

## What you need

- Hostinger web hosting account
- MySQL database created in hPanel
- Your database credentials ready

## Your production details

| Setting | Value |
|---|---|
| Website URL | `https://goldenrod-sandpiper-589698.hostingersite.com` |
| Database name | `u839644576_go` |
| Database user | `u839644576_go` |
| Database host | `localhost` |

## Step 1 — Build the frontend

Run this on your local computer inside the project folder:

```bash
npm install
npm run build
```

This creates a `dist/` folder containing the static frontend files.

## Step 2 — Upload files to Hostinger

1. Open Hostinger **File Manager**.
2. Navigate to `public_html/`.
3. Delete the default `default.php` file.
4. Upload the contents of the local `dist/` folder into `public_html/`.
5. Upload the backend files into `public_html/`:
   - `backend/api/` → `public_html/api/`
   - `backend/config.php` → `public_html/config.php`
   - `backend/.htaccess` → `public_html/.htaccess`
   - `backend/.env.php` → `public_html/.env.php`

> **Never upload `backend/.env.example.php` or `backend/database/` to production.**

## Step 3 — Verify the credentials file

Make sure `public_html/.env.php` contains your production database password:

```php
<?php
define('ENV_DB_HOST', 'localhost');
define('ENV_DB_NAME', 'u839644576_go');
define('ENV_DB_USER', 'u839644576_go');
define('ENV_DB_PASS', '3fGGCyc>9df');
```

If the password is different, update this file in the File Manager.

## Step 4 — Import the database

1. In Hostinger hPanel, go to **Databases → phpMyAdmin**.
2. Enter phpMyAdmin for `u839644576_go`.
3. Click **Import**.
4. Choose the file `backend/database/init.sql` from your computer.
5. Click **Go**.

This creates the tables and seed data.

## Step 5 — Test the deployment

Open these URLs in your browser:

- Frontend: `https://goldenrod-sandpiper-589698.hostingersite.com`
- API test: `https://goldenrod-sandpiper-589698.hostingersite.com/api/stats`
- API test: `https://goldenrod-sandpiper-589698.hostingersite.com/api/destinations`

If `/api/stats` returns JSON, the backend is working.

## Folder structure on Hostinger

```
public_html/
├── index.html              ← React SPA
├── assets/                 ← JS and CSS bundles
├── api/                    ← PHP REST API
│   ├── auth/
│   ├── users/
│   ├── businesses/
│   ├── destinations/
│   ├── bookings/
│   ├── reviews/
│   ├── dashboard/
│   └── stats.php
├── config.php              ← Shared PHP config
├── .env.php                ← Database credentials
├── .htaccess               ← URL routing (API + SPA)
├── img/                    ← Destination images
├── avatar/                 ← Default avatars
├── logo/                   ← Logo images
└── uploads/                ← User uploads (auto-created)
```

## Troubleshooting

### White screen after login

Clear browser cache or open the site in an incognito window.

### 404 on page refresh

Make sure `.htaccess` was uploaded from `backend/.htaccess`.

### Database connection error

Check that `public_html/.env.php` has the correct password and that the database user is assigned to the database.

### CORS errors

The backend already allows all origins in `config.php`. Make sure `config.php` was uploaded.

## Security note

The file `.env.php` contains your database password. It is ignored by Git (see `.gitignore`). Never commit it to GitHub.
