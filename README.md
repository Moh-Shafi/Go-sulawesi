<div align="center">

<img src="logo.jpeg" alt="GoSulawesi Logo" width="120" />

# 🌴 GoSulawesi

### Discover the Hidden Paradise of Sulawesi, Indonesia

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge\&logo=react\&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)](https://www.typescriptlang.org)
[![PHP](https://img.shields.io/badge/PHP-8.x-777BB4?style=for-the-badge\&logo=php\&logoColor=white)](https://www.php.net)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge\&logo=mysql\&logoColor=white)](https://www.mysql.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)](https://www.docker.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.x-38BDF8?style=for-the-badge\&logo=tailwindcss\&logoColor=white)](https://tailwindcss.com)

**GoSulawesi** is a full-stack tourism marketplace connecting travelers with local businesses, guides, and destinations across Sulawesi, Indonesia.

The platform combines destination discovery, local business listings, bookings, reviews, messaging, travel planning, and role-based management into a single web application.

[🌐 Live Platform](#) · [🎨 Frontend Repository](https://github.com/Moh-Shafi/Go-sulawesi-frontend) · [⚙️ Backend Repository](https://github.com/Moh-Shafi/Go-sulawesi-backend)

</div>

---

# 📋 Table of Contents

* [About GoSulawesi](#-about-gosulawesi)
* [Platform Features](#-platform-features)
* [System Architecture](#-system-architecture)
* [Repository Ecosystem](#-repository-ecosystem)
* [User Roles](#-user-roles)
* [Security Architecture](#-production-security-architecture)
* [White-Hat Security Audit](#-white-hat-security-audit)
* [Technology Stack](#-technology-stack)
* [Development Setup](#-development-setup)
* [Production Deployment](#-production-deployment)
* [Roadmap](#-roadmap)
* [Project Background](#-project-background)
* [Developer](#-developer)

---

# 🌴 About GoSulawesi

GoSulawesi is a tourism technology platform designed to make it easier for travelers to discover destinations and connect with local businesses across Sulawesi.

Instead of separating destination discovery, business discovery, communication, and booking across different services, GoSulawesi brings these experiences together in one platform.

### The platform connects:

```text
┌──────────────────┐
│     Tourists     │
│                  │
│ Discover • Plan  │
│ Book • Review    │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────┐
│        GoSulawesi           │
│                             │
│ Discovery • Marketplace     │
│ Booking • Messaging         │
│ Reviews • Travel Planning   │
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│ Local Businesses & Guides   │
│                             │
│ Listings • Bookings         │
│ Customers • Content         │
└─────────────────────────────┘
```

---

# ✨ Platform Features

### 🗺️ Destination Discovery

Explore tourism destinations across Sulawesi with:

* Destination information
* Rich media
* Videos
* Travel-related content
* Location information

### 🎬 Reels & Video Feed

A short-form travel content experience for discovering:

* Destinations
* Local experiences
* Tourism content
* Local creators

### 🤝 Local Business Marketplace

Local businesses can create and manage their presence on the platform.

Examples include:

* Hotels
* Restaurants
* Tour operators
* Local experiences
* Tourism services

### 📅 Booking System

Tourists can:

* Create bookings
* Manage reservations
* Track booking status
* Communicate with businesses

Businesses can:

* View bookings
* Manage reservation status
* Manage customer interactions

### 🧭 Itinerary Builder

Users can organize destinations and activities into personalized travel plans.

### 💬 Messaging

Direct communication between tourists and local businesses.

### ⭐ Reviews & Ratings

The review system supports authenticated user reviews with eligibility checks based on completed bookings.

### 📊 Multi-Role Portals

Dedicated experiences for:

* 🧳 Tourists
* 🏪 Local Businesses
* 🛡️ Administrators

---

# 🏗️ System Architecture

GoSulawesi follows a separated frontend/backend architecture.

```text
                         GoSulawesi Platform
                                │
                ┌───────────────┴───────────────┐
                │                               │
                ▼                               ▼
       React + TypeScript                PHP REST API
       Vite + TailwindCSS                Authentication
                │                         Business Logic
                │                         Authorization
                │                               │
                │                               ▼
                │                          MySQL 8
                │
                └──────── HTTPS / REST ─────────┘
```

### Frontend

* React 19
* TypeScript
* Vite
* TailwindCSS
* Responsive web interface
* Role-specific dashboards

### Backend

* PHP 8
* Custom REST API
* Apache
* PDO
* Server-side authorization
* Authentication middleware

### Database

* MySQL 8
* Relational data model
* Prepared SQL statements
* Transaction-oriented booking workflows

---

# 📦 Repository Ecosystem

| Repository                                                                    | Description                           | Technology                              |
| :---------------------------------------------------------------------------- | :------------------------------------ | :-------------------------------------- |
| [**Go-sulawesi**](https://github.com/Moh-Shafi/Go-sulawesi)                   | Main project overview & documentation | Full Stack                              |
| [**Go-sulawesi-frontend**](https://github.com/Moh-Shafi/Go-sulawesi-frontend) | Client-side web application           | React 19, TypeScript, Vite, TailwindCSS |
| [**Go-sulawesi-backend**](https://github.com/Moh-Shafi/Go-sulawesi-backend)   | REST API & database engine            | PHP 8, MySQL 8, Apache, Docker          |

---

# 👥 User Roles

## 🧳 Tourist

* Discover destinations
* Browse businesses
* Create bookings
* Manage reservations
* Send messages
* Submit eligible reviews
* Build travel itineraries
* Follow other users

## 🏪 Local Business

* Create business listings
* Manage business information
* Manage bookings
* Manage media
* Communicate with tourists
* Manage tourism-related content

## 🛡️ Administrator

* Manage users
* Manage businesses
* Approve business listings
* Manage platform content
* Monitor bookings
* Access protected statistics
* Perform administrative operations

---

# 🛡️ Production Security Architecture

Security is a core part of the GoSulawesi architecture.

### 🔐 Authentication

Authentication uses signed tokens and secure cookie-based session handling.

* HMAC-SHA256 signed tokens
* `HttpOnly` cookies
* `Secure` cookie protection
* `SameSite` cookie policy
* Logout/session invalidation

### 🔑 Role-Based Authorization

Sensitive operations are protected by server-side authorization.

Supported roles:

```text
tourist
local
admin
```

Frontend role guards are treated as an interface-level protection layer; actual authorization is enforced by the backend API.

### 🗄️ SQL Injection Protection

Database queries use PHP PDO prepared statements with parameter binding.

### 🌐 CORS Protection

Cross-origin requests are restricted through an origin allowlist rather than unrestricted wildcard access.

### 🚦 Rate Limiting

Sensitive authentication routes include rate-limiting protection against repeated failed login attempts.

### 📁 Secure File Handling

Uploaded files are validated using:

* MIME-type verification
* File-size restrictions
* Extension validation
* Server-generated filenames

### 🔒 Privacy & Business Logic

Additional protections include:

* Ownership verification
* Booking authorization
* Review eligibility checks
* Protected administrative statistics
* Restricted private user/business information
* Production-safe error responses

---

# 🧪 White-Hat Security Audit

GoSulawesi underwent a **White-Hat security audit** covering authentication, authorization, SQL injection, XSS, file uploads, CORS, IDOR, privacy, and business-logic security.

The audit identified **15 findings**, which were subsequently remediated according to the project's security audit and verification records.

| Severity    | Findings |    Status    |
| :---------- | :------: | :----------: |
| 🔴 Critical |     3    | ✅ Remediated |
| 🟠 High     |     4    | ✅ Remediated |
| 🟡 Medium   |     5    | ✅ Remediated |
| 🟢 Low      |     3    | ✅ Remediated |

### Key Remediation Areas

The security remediation process included:

* Server-side authorization for business status changes
* Environment-based authentication secrets
* Migration from browser storage to `HttpOnly` authentication cookies
* Private business-owner information protection
* Booking-status authorization
* Production-safe handling of demo accounts
* CORS origin allowlisting
* Backend role enforcement
* Login rate limiting
* Completed-booking verification for reviews
* Production-safe database error handling
* Removal of duplicate backend files
* Protected platform statistics
* Follow-list privacy controls
* Removal of unused frontend template code

### Security Verification

Additional checks included:

* SQL Injection
* File Upload Security
* Password Hashing
* XSS Protection
* Open Redirects
* Token Exposure in URLs
* Chat Access Control
* Resource Ownership Verification
* Booking Authorization

> **Security principle:** Security-sensitive operations are enforced at the backend/API layer and are not dependent solely on frontend restrictions.

---

# 🧰 Technology Stack

| Category         | Technology                   |
| :--------------- | :--------------------------- |
| Frontend         | React 19                     |
| Language         | TypeScript                   |
| Build Tool       | Vite                         |
| Styling          | TailwindCSS 4                |
| Backend          | PHP 8                        |
| API              | REST                         |
| Database         | MySQL 8                      |
| Database Access  | PDO                          |
| Web Server       | Apache 2.4                   |
| Containerization | Docker / Docker Compose      |
| Authentication   | HMAC-SHA256 + Secure Cookies |
| Authorization    | Server-side RBAC             |
| Version Control  | Git / GitHub                 |
| Production       | Hostinger VPS                |

---

# 🚀 Development Setup

## Requirements

* Docker
* Docker Compose
* Git

### Clone the Project

```bash
git clone https://github.com/Moh-Shafi/Go-sulawesi.git
cd Go-sulawesi
```

### Start Development Environment

```bash
docker compose up -d
```

### Local Services

```text
Frontend
http://localhost:5173

Backend API
http://localhost:8082
```

For detailed frontend and backend setup instructions, see their respective repositories.

---

# 🌐 Production Deployment

GoSulawesi has been deployed using a **Hostinger VPS** environment.

```text
                    Internet
                       │
                       ▼
                Hostinger VPS
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
        React Frontend       PHP REST API
                                 │
                                 ▼
                             MySQL 8
```

The production environment uses:

* VPS hosting
* Apache
* PHP
* MySQL
* Environment-based secrets
* Git/GitHub workflow
* Secure API communication

---

# 🗺️ Roadmap

### 💳 Payment Integration

Planned payment integrations include:

* Midtrans
* Xendit

These integrations are intended to support secure booking payments and transaction processing.

### 📍 Maps & Location

Planned mapping integrations include:

* Google Maps API
* Leaflet
* OpenStreetMap

Potential use cases:

* Destination maps
* Business locations
* Travel planning
* Location-based discovery

### 📱 Mobile Application

A Flutter mobile application is planned to consume the same REST API.

```text
                  GoSulawesi API
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
        React Web App        Flutter Mobile
```

---

# 🌴 Project Background

GoSulawesi was developed as a tourism marketplace concept focused on promoting local destinations and businesses across Sulawesi.

The platform aims to make local tourism more accessible by connecting travelers directly with local businesses and experiences.

The project combines:

* Tourism discovery
* Local business digitization
* Online booking
* Communication
* Reviews
* Travel planning
* Secure API infrastructure

---

# 👨‍💻 Developer

## Abdul Shafi Afzal Ehrari

Full-Stack Software Developer & Informatics Student

* GitHub: [Moh-Shafi](https://github.com/Moh-Shafi)
* LinkedIn: [Abdul Shafi Afzal Ehrari](https://linkedin.com/in/shafi-afzalehrari)

---

<div align="center">

### 🌴 GoSulawesi

**Connecting travelers with local experiences across Sulawesi, Indonesia 🇮🇩**

Built with ❤️ using React, TypeScript, PHP, MySQL, Docker, and modern web technologies.

</div>
