<div align="center">

<img src="logo.jpeg" alt="GoSulawesi Logo" width="120" />

# 🌴 GoSulawesi

### Discover the Hidden Paradise of Sulawesi, Indonesia

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PHP](https://img.shields.io/badge/PHP-8.x-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

**GoSulawesi** is a full-stack tourism platform connecting travelers with local guides, businesses, and hidden destinations across Sulawesi, Indonesia.

[🌐 Live Demo](#) · [📱 Frontend Repo](https://github.com/Moh-Shafi/Go-sulawesi-frontend) · [⚙️ Backend Repo](https://github.com/Moh-Shafi/Go-sulawesi-backend)

</div>

---

## ✨ Features

- 🗺️ **Destination Discovery** — Explore curated destinations with rich media
- 🎬 **Reels / Video Feed** — TikTok-style travel videos from local creators
- 🤝 **Local Guide Marketplace** — Book verified local guides directly
- 🏨 **Business Listings** — Hotels, restaurants, and experiences
- 📅 **AI Itinerary Builder** — Smart trip planning tool
- 💬 **Real-time Chat** — Tourist to Business messaging
- ⭐ **Reviews & Ratings** — Verified post-visit reviews
- 📊 **Multi-role Dashboard** — Tourist, Business Owner, and Admin panels
- 🎯 **Onboarding Quiz** — Personalized travel recommendations

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   GoSulawesi Platform                │
│                                                     │
│  ┌──────────────────┐    ┌──────────────────────┐  │
│  │    Frontend       │    │       Backend         │  │
│  │  React 19 + Vite │◄──►│   PHP REST API        │  │
│  │  TypeScript       │    │   MySQL Database      │  │
│  │  TailwindCSS 4    │    │   Apache / Docker     │  │
│  └──────────────────┘    └──────────────────────┘  │
│                                                     │
│  Roles: Tourist | Local Business | Admin            │
└─────────────────────────────────────────────────────┘
```

---

## 📂 Repository Structure

This project is organized into **3 repositories**:

| Repository | Description | Tech Stack |
|------------|-------------|------------|
| [**Go-sulawesi**](https://github.com/Moh-Shafi/Go-sulawesi) | Main monorepo & documentation | — |
| [**Go-sulawesi-frontend**](https://github.com/Moh-Shafi/Go-sulawesi-frontend) | React SPA — all UI pages & components | React 19, TypeScript, Vite 8, TailwindCSS 4 |
| [**Go-sulawesi-backend**](https://github.com/Moh-Shafi/Go-sulawesi-backend) | PHP REST API & database | PHP, MySQL 8, Apache, Docker |

---

## 🚀 Quick Start (Full Stack with Docker)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js 20+](https://nodejs.org/)

### 1. Clone all repositories

```bash
git clone https://github.com/Moh-Shafi/Go-sulawesi.git
git clone https://github.com/Moh-Shafi/Go-sulawesi-frontend.git
git clone https://github.com/Moh-Shafi/Go-sulawesi-backend.git
```

### 2. Start the Backend (Docker)

```bash
cd Go-sulawesi-backend
cp .env.example.php .env.php
docker-compose up -d
```

Backend: `http://localhost:8082` | phpMyAdmin: `http://localhost:8081`

### 3. Start the Frontend

```bash
cd Go-sulawesi-frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

---

## 👥 User Roles

| Role | Access |
|------|--------|
| 🧑‍💼 **Admin** | Full platform management, analytics, user management |
| 🏢 **Business** | Manage listings, bookings, promotions, earnings |
| 🌏 **Tourist** | Browse, book, review, build itineraries |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite 8** for blazing-fast builds
- **TailwindCSS 4** for styling
- **React Router v7** for routing

### Backend
- **PHP 8** with PDO (MySQL)
- **MySQL 8.0** database
- **Apache** web server
- **Docker Compose** for local development
- **HMAC-SHA256** JWT-like authentication
- **httpOnly Cookies** for XSS-resistant auth

---

## 🔐 Security

- httpOnly cookie-based authentication (XSS-resistant)
- HMAC-SHA256 token signing
- Role-based access control (RBAC)
- CORS restricted to allowed origins
- Prepared statements (SQL injection prevention)
- Sensitive files excluded from version control

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

<div align="center">

Made with ❤️ for the people of Sulawesi, Indonesia 🇮🇩

</div>
