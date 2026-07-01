# ProfileHub

**Professional Career Portfolio Platform**

ProfileHub is a full-stack SaaS application that helps developers build, manage, and showcase their professional journey — projects, skills, certifications, and career progress — in one unified dashboard.

---

## Features

- **Secure Authentication** — Register, login, JWT-based session management, and protected routes
- **Developer Dashboard** — Real-time profile metrics, completion tracking, and career insights
- **Profile Management** — Headline, bio, skills, projects, certifications, and social links
- **Responsive UI** — Modern dark-themed interface optimized for desktop and mobile
- **RESTful API** — Structured Express backend with MongoDB persistence

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, React Router, Axios |
| **Backend** | Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs |
| **Dev Tools** | ESLint, PostCSS, Nodemon |

---

## Project Structure

```
ProfileHub/
│
├── backend/                  # Express REST API
│   ├── src/
│   │   ├── config/           # Database & JWT configuration
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/       # Auth, error handling
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API route definitions
│   │   ├── services/         # Business logic
│   │   ├── utils/            # Helper utilities
│   │   └── validators/       # Request validation
│   ├── server.js             # Application entry point
│   ├── .env.example          # Environment variable template
│   └── package.json
│
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/       # Shared UI & layout components
│   │   ├── context/          # React Context (Auth)
│   │   ├── features/         # Feature modules (auth, dashboard)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── routes/           # Routing configuration
│   │   └── services/         # API service layer
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB instance)
- Git

### Clone the Repository

```bash
git clone https://github.com/tamilselvam5884771-alt/Profile_Hub.git
cd Profile_Hub
```

---

## Backend Setup

```bash
cd backend
npm install
```

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Update `backend/.env` with your values:

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: `5000`) |
| `NODE_ENV` | Environment (`development` / `production`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |
| `JWT_EXPIRE` | Token expiry (e.g. `24h`) |

3. Start the development server:

```bash
npm run dev
```

API health check: [http://localhost:5000/](http://localhost:5000/)

---

## Frontend Setup

```bash
cd frontend
npm install
```

1. Start the development server:

```bash
npm run dev
```

2. Open the application: [http://localhost:3000/](http://localhost:3000/)

> The frontend proxies `/api` requests to `http://localhost:5000` via Vite (see `vite.config.js`).
> Optionally set `VITE_API_URL` in a `frontend/.env` file for custom API endpoints.

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=24h
```

### Frontend (`frontend/.env`) — Optional

```env
VITE_API_URL=http://localhost:5000/api
```

> **Never commit `.env` files.** Use `.env.example` as a reference template.

---

## Screenshots

<!-- Add screenshots here after deployment -->
| Login | Dashboard |
|-------|-----------|
| _Coming soon_ | _Coming soon_ |

---

## Roadmap

- [ ] Profile creation onboarding wizard
- [ ] GitHub & LeetCode integration (live stats)
- [ ] Public portfolio page (`/profile/:username`)
- [ ] Resume/CV export
- [ ] Analytics & profile view tracking
- [ ] Admin panel

---

## Future Features

- OAuth login (Google, GitHub)
- AI-powered profile suggestions
- Job application tracker
- Skill endorsement system
- Dark / light theme toggle

---

## License

This project is open source. Add your preferred license file (e.g. MIT) before publishing.

---

## Contribution

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "feat: describe your change"`)
4. Push to your branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## Author

**Tamilselvam** — [GitHub](https://github.com/tamilselvam5884771-alt)
