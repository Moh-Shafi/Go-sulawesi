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

## ✨ System Modules & Features

- 🗺️ **Destination Discovery** — Explore curated destinations with rich media.
- 🎬 **Reels / Video Feed** — Short-form travel videos from local creators.
- 🤝 **Local Guide Marketplace** — Book verified local guides directly.
- 🏨 **Business Listings** — Hotels, restaurants, and local experiences.
- 📅 **Itinerary Builder** — Custom travel planning tool.
- 💬 **Messaging System** — Tourist ↔ Business direct communication.
- ⭐ **Reviews & Ratings** — Verified post-visit review submissions.
- 📊 **Multi-Role Portals** — Specialized dashboards for Tourists, Local Businesses, and System Admins.

---

## 🏗️ Repository Ecosystem

| Repository | Description | Tech Stack |
|------------|-------------|------------|
| [**Go-sulawesi**](https://github.com/Moh-Shafi/Go-sulawesi) | Main Monorepo & Overview | — |
| [**Go-sulawesi-frontend**](https://github.com/Moh-Shafi/Go-sulawesi-frontend) | Client Single Page Application | React 19, TypeScript, Vite 8, TailwindCSS 4 |
| [**Go-sulawesi-backend**](https://github.com/Moh-Shafi/Go-sulawesi-backend) | REST API & Database Engine | PHP 8, MySQL 8, Apache, Docker |

---

## 🛡️ Production Security Architecture

- **HttpOnly Cookies**: Session tokens are signed using HMAC-SHA256 and stored via secure `httpOnly` browser cookies.
- **Role-Based Authorization**: Strict server-side RBAC validation (`tourist`, `local`, `admin`) on all endpoints.
- **Parameterized Queries**: 100% PDO prepared statements preventing SQL injection attacks.
- **CORS Whitelisting**: Restricted strictly to authorized frontend origins.
- **Rate Limiting**: Automated protection on sensitive API routes.

---

## 🚀 Development Setup (Docker)

```bash
git clone https://github.com/Moh-Shafi/Go-sulawesi.git
cd Go-sulawesi
docker-compose up -d
```

- **Frontend App**: `http://localhost:5173`
- **Backend REST API**: `http://localhost:8082`

---

<div align="center">

Made with ❤️ for **Sulawesi, Indonesia** 🇮🇩 · Managed by [Moh-Shafi](https://github.com/Moh-Shafi)

</div>