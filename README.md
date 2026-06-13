# ⭐ AstroConsult — Consultation Manager

An AI-powered consultation management platform built for astrologers. Record sessions, generate AI summaries, and manage your entire workflow in one place.

![Tech Stack](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react) ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js) ![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=flat&logo=mysql) ![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat&logo=jsonwebtokens)

---

## Features

- 🎙️ **Recording Uploads** — Upload audio/video recordings (up to 50MB) for each session
- ✨ **AI Summaries** — Auto-generate consultation summaries using Claude AI
- 👥 **Multi-Role Access** — Separate dashboards for Admin, Astrologer, and Client roles
- 🔍 **Smart Search & Filter** — Search consultations by client, astrologer, topic, or status
- 📊 **Analytics Dashboard** — Track total sessions, completed, upcoming, and recordings
- 🔒 **JWT Authentication** — Secure login with role-based access control

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router v7, Axios, Vite |
| Backend | Node.js, Express 5, Multer |
| Database | MySQL 8 |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Styling | Custom CSS |

---

## Project Structure

```
consultation-manager/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── api/             # Axios API calls
│   │   ├── components/      # Shared components (Layout)
│   │   ├── context/         # Auth context
│   │   └── pages/           # All page components
│   └── package.json
│
├── server/                  # Node.js backend
│   ├── config/              # DB connection & schema
│   ├── controllers/         # Route logic
│   ├── middleware/          # Auth, error handler, upload
│   ├── routes/              # Express routers
│   ├── uploads/             # Stored recordings (gitignored)
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8+

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/consultation-manager.git
cd consultation-manager
```

### 2. Set up the database

Create a MySQL database and run the schema:

```sql
CREATE DATABASE consultation_manager;
```

Then import the schema:

```bash
mysql -u root -p consultation_manager < server/config/schema.sql
```

### 3. Configure the backend

```bash
cd server
cp .env.example .env
```

Edit `.env` with your MySQL credentials and a strong JWT secret.

### 4. Install dependencies and run

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend** (in a new terminal):
```bash
cd client
npm install
npm run dev
```

The app will be running at `http://localhost:3000`

---

## User Roles

| Role | Permissions |
|---|---|
| **Admin** | Full access — manage all consultations, users, recordings |
| **Astrologer** | Create/manage own consultations, upload recordings, generate AI summaries |
| **Client** | View own consultations and summaries |

---

## Environment Variables

Copy `server/.env.example` to `server/.env` and fill in:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=consultation_manager
PORT=5000
CLIENT_URL=http://localhost:3000
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

---

## Deployment

- **Frontend** → [Vercel](https://vercel.com) (set root directory to `client`)
- **Backend** → [Render](https://render.com) (set root directory to `server`)
- **Database** → [Railway](https://railway.app) (MySQL)

---

## Author

**Prabhjot Kaur**  
B.E. Computer Science Engineering — Chitkara University (2023–2027)

---

*Built as part of the Humara Pandit assignment.*