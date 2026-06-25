# RentWise - Roommate Compatibility Platform

## Project Structure

```
rentwise/
├── server/                    # Express.js Backend
│   ├── config/db.js           # MongoDB Atlas connection
│   ├── middleware/auth.js     # JWT authentication middleware
│   ├── models/
│   │   ├── User.js            # User schema (name, email, hashed password)
│   │   ├── Profile.js         # Roommate profile + preferences
│   │   └── RoommateRequest.js # Request schema (from, to, status)
│   ├── controllers/
│   │   ├── authController.js  # Register, login, getMe
│   │   ├── profileController.js # CRUD for profiles
│   │   └── requestController.js # Send/respond to requests
│   ├── routes/                # Express routers
│   ├── .env                   # MONGO_URI, JWT_SECRET, PORT
│   └── server.js              # Entry point
├── client/                    # React Frontend
│   ├── public/index.html
│   └── src/
│       ├── components/        # Navbar, ProtectedRoute
│       ├── pages/             # Login, Register, Dashboard, etc.
│       ├── context/           # AuthContext (JWT state management)
│       ├── utils/compatibilityScore.js  # Matching algorithm
│       ├── App.js / App.css   # Routes & styling
│       └── index.js           # Entry point
└── AGENTS.md
```

## Setup Instructions

### 1. MongoDB Atlas
- Create a free cluster at https://cloud.mongodb.com
- Get your connection string, replace `<username>`, `<password>`, and cluster details in `server/.env`

### 2. Backend
```bash
cd server
npm install
npm run dev
```

### 3. Frontend
```bash
cd client
npm install
npm start
```

The app runs at http://localhost:3000 (client) with the API proxy at http://localhost:5000.

## Compatibility Matching Algorithm

Located in `client/src/utils/compatibilityScore.js`:

| Category | Weight | Logic |
|----------|--------|-------|
| Budget | 25 pts | Budgets within $200 = 25pts, $500 = 15pts, else 5pts |
| Sleep Schedule | 20 pts | Exact match = 20pts, one flexible = 10pts, mismatch = 0pts |
| Cleanliness | 20 pts | Difference 0 = 20pts, 1 = 15pts, 2 = 8pts, 3+ = 0pts |
| Smoking | 10 pts | Exact = 10pts, occasional+yes/no = 5pts, no+yes = 0pts |
| Drinking | 10 pts | Same scoring as smoking |
| Shared Interests | 15 pts | Proportional: (shared interests / min count) * 15 |
| **Total** | **100 pts** | Final = round(score) -> percentage |

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/auth/me | Yes | Get current user |
| POST | /api/profile | Yes | Create/update profile |
| GET | /api/profile | Yes | Get my profile |
| GET | /api/profile/all | Yes | Get all profiles (except self) |
| GET | /api/profile/user/:id | Yes | Get profile by user ID |
| POST | /api/requests | Yes | Send roommate request |
| GET | /api/requests | Yes | Get sent & received requests |
| PUT | /api/requests/:id | Yes | Accept/reject request |

## Suggested Enhancements for Resume Value

1. **Real-time Chat** (Socket.io) - Messaging between matched roommates
2. **Photo Upload** (Cloudinary/Multer) - Profile pictures and verification
3. **Advanced Filters** - Location proximity, move-in date, lease duration
4. **Roommate Groups** - Create group listings (3+ people looking together)
5. **Email Verification** - Nodemailer + OTP for account verification
6. **Rate Limiting** - express-rate-limit for security hardening
7. **Dark Mode** - CSS variables toggle
8. **Pagination/Infinite Scroll** - For large roommate databases
9. **User Reviews/Ratings** - Trust system for past roommates
10. **Deployment** - Render (backend) + Vercel/Netlify (frontend)
11. **Google OAuth** - Social login via passport.js
12. **Admin Dashboard** - User management, reported content
13. **Push Notifications** - Web push API for new requests/messages
