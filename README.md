<div align="center">

<img src="./public/logo/logo-256.png" alt="GoSulawesi Logo" width="320" />

# React JS Real-Time API · Full Stack Web Application

### GoSulawesi — Hidden Experiences Platform

A modern, bilingual (EN/ID) full-stack travel platform connecting tourists with authentic hidden destinations and local businesses across Sulawesi, Indonesia. Includes a TikTok-style Reels video feed with background music, advanced analytics, real-time chat, promotional campaigns, and a cancellation policy system with refund calculation.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PHP](https://img.shields.io/badge/PHP-8.3-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)

</div>

---

## Screenshots — Desktop

<table>
  <tr>
    <td align="center"><b>Landing Page — Hero</b></td>
    <td align="center"><b>Traveler Stories</b></td>
  </tr>
  <tr>
    <td><img src="./Foto/1-pc.png" alt="Landing Page" /></td>
    <td><img src="./Foto/2-pc.png" alt="Testimonials" /></td>
  </tr>
  <tr>
    <td align="center"><b>Sign Up — Dual Role</b></td>
    <td align="center"><b>Admin Dashboard</b></td>
  </tr>
  <tr>
    <td><img src="./Foto/3-pc.png" alt="Sign Up" /></td>
    <td><img src="./Foto/4-pc.png" alt="Admin Dashboard" /></td>
  </tr>
  <tr>
    <td align="center"><b>Tourist Dashboard</b></td>
    <td align="center"><b>Business Dashboard</b></td>
  </tr>
  <tr>
    <td><img src="./Foto/5-pc.png" alt="Tourist Dashboard" /></td>
    <td><img src="./Foto/6-pc.png" alt="Business Dashboard" /></td>
  </tr>
</table>

---

## Screenshots — Mobile

<p align="center">
  <img src="./Foto/1-app.png" width="18%" alt="Landing Mobile" />
  <img src="./Foto/2-app.png" width="18%" alt="Testimonials Mobile" />
  <img src="./Foto/3-app.png" width="18%" alt="SignUp Mobile" />
  <img src="./Foto/8-app.png" width="18%" alt="Tourist Dashboard Mobile" />
  <img src="./Foto/9-app.png" width="18%" alt="Explore Mobile" />
</p>
<p align="center">
  <img src="./Foto/4-app.png" width="18%" alt="Admin Dashboard Mobile" />
  <img src="./Foto/5-app.png" width="18%" alt="Admin Users Mobile" />
  <img src="./Foto/6-app.png" width="18%" alt="Admin Listings Mobile" />
  <img src="./Foto/10-app.png" width="18%" alt="Business Dashboard Mobile" />
  <img src="./Foto/11-app.png" width="18%" alt="Business Listings Mobile" />
</p>

---

## Architecture Overview

```

                     GoSulawesi Platform                      

   Frontend (Vite)             Backend (PHP + MySQL)        
   localhost:5173                localhost:8082             
                                                            
  React 19 + TS 6        RESTful API (PHP 8.3 + Apache)    
  Tailwind CSS 4         MySQL 8.0 Database                 
  React Router 7         JWT-like Auth Tokens               
  Custom Hooks           Docker Compose                     

```

---

## Tech Stack — Full Detail

### Frontend
| Technology | Version | Usage |
|---|---|---|
| **React** | 19 | UI framework with functional components & hooks |
| **TypeScript** | 6 | Static typing across all components and API calls |
| **Vite** | 8 | Lightning-fast dev server and production build |
| **Tailwind CSS** | 4 | Utility-first responsive styling |
| **React Router DOM** | 7 | Client-side routing with protected routes |
| **Custom Hooks** | — | `useLang` for EN/ID language switching |
| **localStorage API** | — | Token, user session, preferences, saved places |

### Backend
| Technology | Version | Usage |
|---|---|---|
| **PHP** | 8.3 | REST API with PDO and prepared statements |
| **Apache** | 2.4 | Web server with `.htaccess` URL rewriting |
| **MySQL** | 8.0 | Relational database (15 core tables) |
| **PDO** | — | Secure parameterized queries |
| **Custom JWT** | — | HMAC-SHA256 token auth (7-day expiry) |

### Infrastructure
| Technology | Usage |
|---|---|
| **Docker Compose** | Orchestrates PHP, MySQL, phpMyAdmin containers |
| **phpMyAdmin** | Database management UI at `localhost:8081` |
| **Python (Pillow)** | Logo resizing and background removal scripts |

---

## Project Structure

```
Go-sulawesi/
  backend/
    api/
       auth/          → login · register · me
       bookings/      → CRUD bookings
       cancellations/ → cancellation policies + requests
       businesses/    → CRUD local businesses
       chat/          → real-time messaging (tourist ↔ business)
       dashboard/     → platform stats
       destinations/  → CRUD destinations
       promotions/    → CRUD promotional campaigns
       reviews/       → reviews & ratings
       users/         → CRUD users + avatar upload
       videos/        → Reels feed · upload · sounds · stats · likes · comments
       stats.php      → public stats (live counters)
    config.php         → DB config, CORS, auth helpers
    database/
       init.sql       → schema + seed destinations
       videos.sql     → video tables schema
       videos-v2.sql  → sounds + daily stats migration
       migrate-*.php  → migration runners
    sounds/            → 8 royalty-free MP3 tracks for Reels
    Dockerfile

  src/
    components/
       TouristLayout.tsx     → tourist sidebar + top bar
       BusinessLayout.tsx    → business sidebar + top bar
       AdminLayout.tsx       → admin sidebar + top bar
       TouristBottomNav.tsx  → mobile nav (tourist)
       BusinessBottomNav.tsx → mobile nav (business)
       ReelsNavIcon.tsx      → animated Reels video icon
       VideoUploadModal.tsx  → video upload + sound picker with preview
       ChatWidget.tsx        → floating chat widget
       BusinessHoursEditor.tsx → business hours editor
       CancellationPolicyEditor.tsx → cancellation policy editor
       RequireRole.tsx       → role-based access guard
   
    pages/
       LandingPage.tsx / LandingPageV2.tsx
       LoginPage.tsx / SignUpPage.tsx
       OnboardingQuiz.tsx         → travel preference quiz
       TouristDashboard.tsx       → explore + bookings
       ItineraryBuilder.tsx       → multi-day trip planner
       DestinationDetailPage.tsx
       BusinessDashboard.tsx      → earnings + listings
       BusinessListingsPage.tsx
       BusinessBookingsPage.tsx
       BusinessEarningsPage.tsx
       BusinessReviewsPage.tsx
       BusinessSettingsPage.tsx
       BusinessMessagesPage.tsx   → business chat inbox
       BusinessPromotionsPage.tsx → manage promotions
       TouristMessagesPage.tsx    → tourist chat inbox
       ChatPage.tsx               → full chat interface
       VideoFeedPage.tsx          → TikTok-style Reels feed
       AdminDashboard.tsx
       AdminPromotionsPage.tsx    → admin promotion management
   
    hooks/
       useLang.ts    → EN / ID language state
   
    lib/
       api.ts        → all REST API calls with auth
       saved.ts      → localStorage saved destinations
   
    App.tsx           → all routes + role-based guards

  public/
    logo/             → logo-64/128/256.png (transparent)
    img/              → destination images
    avatar/           → user avatar images

  Foto/              → app screenshots (desktop + mobile)
 docker-compose.yml
 package.json
 vite.config.ts
```

---

## Database Schema

```sql
users           → id · name · email · password · role · avatar
businesses      → id · user_id · business_name · type · city · status
destinations    → id · name · city · category · price · rating · lat/lng
bookings        → id · user_id · destination_id · business_id · status · price
reviews         → id · user_id · destination_id · business_id · rating · comment
videos          → id · user_id · video_url · thumbnail · caption · sound_id · shares · views
video_sounds    → id · title · artist · audio_url · duration_sec · category · usage_count
video_likes     → id · video_id · user_id
video_saves     → id · video_id · user_id
video_comments  → id · video_id · user_id · comment_text
video_daily_stats → id · video_id · stat_date · views · likes · comments · shares
conversations   → id · tourist_id · business_id · status
messages        → id · conversation_id · sender_id · message_text
promotions      → id · business_id · title · description · discount · start/end_date
cancellation_policies  → id · business_id · deadline_hours · refund_before/after · requires_approval · notes
cancellation_requests  → id · booking_id · user_id · reason · status · refund_percent · refund_amount · handled_by · handler_notes
```

**Cancellation Request Status:** `pending` → `approved` / `rejected` / `auto`

**User Roles:** `admin` · `tourist` · `local`  
**Business Status:** `pending` → `approved` / `rejected`  
**Booking Status:** `pending` → `confirmed` → `completed` / `cancelled`

---

## Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Node.js 20+](https://nodejs.org)
- [Python 3.x](https://www.python.org) *(optional, for logo tools)*

### 1 — Start Backend (Docker)
```bash
docker-compose up -d --build
```
| Service | URL |
|---|---|
| PHP REST API | http://localhost:8082 |
| phpMyAdmin | http://localhost:8081 |

### 2 — Start Frontend
```bash
npm install
npm run dev
```
App runs at → **http://localhost:5173**

---

## User Roles & Access Architecture

Access levels are partitioned into three dedicated roles:
- **Admin**: Full platform governance, guide accreditation, platform reports, and destination management.
- **Local Business**: Provider dashboard, listings management, booking handling, promotions, and earnings.
- **Tourist**: Exploration, booking tours, submitting verified reviews, and building custom itineraries.

> [!NOTE]
> For development testing, mock seed data can be populated via `php database/seed.php`. In production environments, all accounts are registered securely via the `/signup` onboarding workflow with unique salted password hashes.

---

## API Endpoints

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me

GET    /api/destinations
POST   /api/destinations        [admin]
PUT    /api/destinations/:id    [admin]
DELETE /api/destinations/:id    [admin]

GET    /api/businesses
POST   /api/businesses          [local]
PUT    /api/businesses/:id      [local/admin]

GET    /api/bookings
POST   /api/bookings            [tourist]
PUT    /api/bookings/:id/update   [tourist/local/admin]
DELETE /api/bookings/:id/delete   [tourist/local/admin]

GET    /api/cancellations/policy?business_id=:id
POST   /api/cancellations/policy          [local] — create/update policy
GET    /api/cancellations/requests        [tourist sees own · local sees business · admin sees all]
POST   /api/cancellations/requests        [tourist] — create cancellation request
PUT    /api/cancellations/requests/:id    [local/admin] — approve/reject request

GET    /api/reviews
POST   /api/reviews             [tourist]

GET    /api/users               [admin]
PUT    /api/users/:id/update
POST   /api/users/:id/avatar

GET    /api/stats               (public — live counters)
GET    /api/dashboard           [admin]

GET    /api/videos              (public feed · mine · saved)
POST   /api/videos              [tourist/local] — upload with sound_id
GET    /api/videos/:id          — single video + sound info
DELETE /api/videos/:id          [owner]
POST   /api/videos/:id/like     — toggle like
POST   /api/videos/:id/save     — toggle save
POST   /api/videos/:id/view     — count view
POST   /api/videos/:id/share    — count share
GET    /api/videos/:id/comments — list comments
POST   /api/videos/:id/comments — add comment
GET    /api/videos/sounds       — list sound library
GET    /api/videos/stats        — analytics (mine · single video)

GET    /api/chat/:conversationId  — list messages
POST   /api/chat/:conversationId  — send message
DELETE /api/chat/:conversationId  — delete message
PUT    /api/chat/:conversationId  — close conversation

GET    /api/promotions           — list promotions
POST   /api/promotions           [local] — create promotion
PUT    /api/promotions/:id       [local/admin] — update
DELETE /api/promotions/:id       [local/admin] — delete
```

---

## Key Features

### Reels — TikTok-style Video Feed (Premium)
- Full-screen vertical video feed with scroll-snap navigation
- Upload short clips (MP4/MOV/WebM, max 25MB, 60s) with auto-generated thumbnails
- **Sound Library** — 8 royalty-free background music tracks (Creative Commons)
- Sound picker with live audio preview (play/stop, spinning disc, equalizer bars)
- Background music plays in sync with video in the feed
- Sound attribution overlay with spinning disc (like TikTok)
- Like, comment, save, and share videos
- **Advanced Analytics** — daily stats (views, likes, comments, shares)
- Analytics dashboard with stat cards, 14-day bar chart, and Top 5 videos leaderboard
- Desktop layout: centered 450px column with keyboard navigation (arrow up/down)

### For Tourists
- Personalized destination recommendations via **onboarding quiz**
- Filter by category: Nature · Culture · Adventure · Village · Coastal
- **Itinerary Builder** — plan multi-day trips with price estimation
- Save favorite destinations (localStorage)
- Book directly and track booking status
- **Cancellation Requests** — request booking cancellations with automatic refund calculation
- Leave reviews and ratings
- **Reels** — watch and upload short travel videos with music
- **Chat** — real-time messaging with local businesses
- Bilingual UI (English / Bahasa Indonesia)

### For Local Businesses
- Create and manage business listings
- Real-time booking dashboard with revenue charts
- Manage incoming bookings (confirm / complete / cancel)
- **Cancellation Requests** — approve or reject tourist cancellation requests with refund calculation
- **Cancellation Policy Editor** — set deadline hours, refund percentages, and approval requirements
- View and respond to customer reviews
- Weekly earnings analytics
- **Business Hours Editor** — set operating hours
- **Promotions** — create and manage promotional campaigns
- **Chat** — real-time messaging with tourists

### For Admins
- Full platform overview (users · bookings · destinations)
- Approve or reject pending businesses
- Manage all users, listings, and bookings
- Weekly booking statistics chart
- **Promotions Management** — oversee all promotional campaigns

---

## Complete Feature Suite & Capabilities

GoSulawesi provides an end-to-end digital ecosystem connecting travelers, local tourism operators, and platform administrators. Below is a detailed breakdown of the complete feature set:

### 1. Destination Discovery & Explorer
* **Interactive Destination Catalog**: Browse Sulawesi's hidden beaches, dive sites, cultural landmarks, and mountain trails.
* **Smart Filtering & Search**: Filter destinations by category (*Nature*, *Culture*, *Adventure*, *Village*, *Coastal*) and location across Sulawesi.
* **Rich Destination Profiles**: High-resolution imagery, geographical coordinates, entrance fee pricing, average ratings, and localized descriptions.
* **Favorites & Bookmarks**: Save destinations to a personal wishlist synced locally for quick access.
* **Bilingual Interface**: Seamless one-click switching between English and Bahasa Indonesia across all views.

### 2. Reels Video Feed (TikTok-Style Social Travel)
* **Vertical Video Feed**: Immersive, full-screen vertical feed with scroll-snap navigation and keyboard controls (Arrow Up/Down).
* **Built-in Sound Library**: 8 curated, royalty-free Indonesian cultural and modern background music tracks.
* **Interactive Audio Player**: Sound preview with spinning vinyl disc animation and synchronized audio playback.
* **Social Engagement**: Like, comment, save to favorites, and share videos with real-time counter updates.
* **Video Creator Studio**: Video upload modal with live sound picker, duration check, and thumbnail generation.
* **Creator Analytics**: Dedicated analytics dashboard displaying 14-day performance trends, daily views, likes, comments, shares, and a top-performing video leaderboard.

### 3. Smart Itinerary Builder
* **Multi-Day Trip Planning**: Curate custom travel itineraries day-by-day.
* **Automated Cost Estimation**: Live calculation of total trip estimated costs based on destination entry fees and activities.
* **Custom Route Scheduling**: Organize stops chronologically to optimize travel times across Sulawesi's provinces.

### 4. Real-Time Messaging & In-App Chat
* **Direct Communication**: Instant messaging connecting tourists with local business owners and guides before or after booking.
* **Dedicated Inboxes**: Customized conversation list for Tourists (`/tourist/messages`) and Businesses (`/business/messages`).
* **Floating Chat Widget**: Quick-access floating widget on listing pages to instantly initiate inquiries.
* **Conversation Management**: Message history, unread badges, and conversation closure controls.

### 5. Local Business & Guide Directory
* **Provider Listings**: Local operators can list guided tours, dive excursions, homestays, vehicle rentals, and culinary experiences.
* **Business Verification**: Strict accreditation workflow requiring admin approval before listings go live.
* **Operating Hours Editor**: Interactive visual weekly schedule editor to set daily opening and closing hours.
* **Earnings & Performance Dashboard**: Visual revenue charts, total completed bookings, and payout tracking.

### 6. End-to-End Booking & Reservation Engine
* **Instant Booking Workflow**: Select dates, number of guests, add custom notes, and book directly.
* **Booking State Machine**: Full lifecycle tracking (`pending` → `confirmed` → `completed` / `cancelled`).
* **Role-Restricted Permissions**: Strict state protection ensuring only authorized businesses and admins can confirm or finalize reservations.

### 7. Dynamic Cancellation & Refund Management
* **Flexible Cancellation Policies**: Business owners can customize cancellation rules (e.g. deadline hours before trip, refund percentage before/after deadline).
* **Automated Refund Calculation**: Dynamic computation of eligible refund amounts based on policy thresholds and request timestamp.
* **Transparent Dispute Workflow**: Tourist cancellation request submission with reason tracking, business/admin approval queue, and automated resolution logging.

### 8. Promotional Campaigns & Discounts Engine
* **Discount Management**: Businesses can launch seasonal promotions, flash sales, and percentage-based discounts.
* **Campaign Scheduling**: Set start and end dates with automated promotional badge displays on listings.
* **Platform-Wide Governance**: Administrators can monitor, review, and manage promotional campaigns across all merchants.

### 9. Verified Reviews & Community Feedback
* **Booking-Verified Reviews**: Only tourists with completed bookings can leave ratings and feedback, eliminating spam.
* **Multi-Criteria Scoring**: 1 to 5-star ratings accompanied by detailed written traveler experiences.
* **Business Responses**: Local businesses can publicly reply to reviews to maintain customer trust and engagement.

### 10. Personalized Onboarding Travel Quiz
* **Preference Discovery**: Interactive onboarding quiz assessing travel style (Nature, Adventure, Culture, Relaxation), trip length, and budget.
* **Personalized Recommendations**: Automatically matches traveler profiles with the best hidden gems and destinations across Sulawesi.

### 11. Governance & Administrative Control Center
* **Executive Metrics Dashboard**: Real-time KPI counters (active users, confirmed bookings, platform GMV, active listings).
* **Accreditation Queue**: Review and verify business registrations and guide licenses.
* **User & Content Moderation**: Role management, user status toggles, avatar moderation, and listing oversight.
* **Export & Reports**: Weekly booking statistics, platform volume, and system auditing logs.

---

## Security Hardening & Compliance

GoSulawesi is engineered with defense-in-depth principles adhering to the **OWASP Top 10** standards:

### Applied Defensive Controls

| Security Domain | Implemented Control | Status |
| :--- | :--- | :---: |
| **Authentication & Session** | Signed tokens via HMAC-SHA256 with 7-day expiration, delivered strictly via `HttpOnly`, `SameSite=Lax`, and `Secure` cookies. Zero exposure to client-side JavaScript. | **Hardened** |
| **Access Control (RBAC)** | Strict server-side role verification (`tourist`, `local`, `admin`) on every mutation endpoint. | **Hardened** |
| **Injection Defense** | 100% parameter-bound queries via PHP PDO (`PDO::ATTR_EMULATE_PREPARES => false`) with `utf8mb4` charset. | **Hardened** |
| **API & Cross-Origin** | Origin-whitelisted CORS policy matching authorized client domains only. | **Hardened** |
| **Brute-Force Mitigation** | IP and account-based rate limiting on sensitive authentication routes. | **Hardened** |
| **Secure File Handling** | MIME-type validation via `finfo`, strict file extension checks, randomized server-side filenames, and script execution prevention in upload paths. | **Hardened** |
| **Data Protection** | Database connection errors filtered server-side (`error_log`); environment secrets stored in server-level `.env.php` outside the public web root. | **Hardened** |

## Build for Production

```bash
npm run build
```
Output → `dist/` (static files, ready for deployment)

---

<div align="center">

Made with  for South Sulawesi, Indonesia

**GoSulawesi** · *Hidden Experiences*

</div>


