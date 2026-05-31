# 🗂️ Personal Asset Tracker

A production-grade personal asset tracking application built with **FastAPI** (backend) and **React + Vite** (frontend), using **MySQL 8** as the database.

---

## ✨ Features

- JWT-based Signup / Signin (bcrypt + HS256)
- Create custom sections: Car, Kitchen, Electronics, etc.
- Add items per section with photo, buying price, purchase date, brand, condition, serial number
- Photo upload with auto thumbnail generation (Pillow)
- Per-user isolated file storage (`storage/users/{user_id}/items/{item_id}/`)
- Full CRUD on sections and items
- Interactive API docs at `/docs`
- Docker Compose for one-command startup

---

## 🧱 Tech Stack

| Layer     | Technology                                        |
|-----------|---------------------------------------------------|
| Backend   | FastAPI, SQLAlchemy 2, Alembic, Pydantic v2       |
| Database  | MySQL 8                                           |
| Auth      | JWT (python-jose), bcrypt (passlib)               |
| Frontend  | React 18, Vite, Zustand, Axios, React Router v6   |
| Storage   | Local filesystem (per-user folders)               |
| DevOps    | Docker, Docker Compose                            |

---

## 📁 Folder Structure

```
Asset Manager/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # Route handlers (auth, users, sections, items, uploads)
│   │   ├── core/            # Config, security (JWT/bcrypt), dependencies, exceptions
│   │   ├── db/              # SQLAlchemy session, Base model, Alembic migrations
│   │   ├── models/          # ORM models: User, Section, Item
│   │   ├── repositories/    # DB queries (UserRepo, SectionRepo, ItemRepo)
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   ├── services/        # Business logic (AuthService, ItemService, etc.)
│   │   └── main.py          # FastAPI app entry point
│   ├── tests/               # Pytest tests
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios API clients (authApi, sectionsApi, itemsApi)
│   │   ├── components/      # auth/, items/, sections/, shared/
│   │   ├── hooks/           # useAuth, useItems, useSections
│   │   ├── pages/           # SignupPage, SigninPage, DashboardPage, SectionPage, ItemDetailPage
│   │   ├── store/           # Zustand stores (authStore, sectionStore)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── database/
│   ├── schema.sql           # Raw SQL to create all tables
│   └── seed.sql             # Demo user + sample data
├── storage/
│   └── users/               # Auto-created per-user upload folders
├── docker-compose.yml
└── .env.example
```

---

## 🚀 Option A — Run with Docker (Recommended)

> Requires: Docker Desktop installed and running.

### Step 1 — Create your `.env` file

In `D:\Asset Manager\`, copy and edit the env file:

```bash
copy .env.example .env
```

Open `.env` and set your values:

```env
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=asset_tracker
MYSQL_USER=asset_user
MYSQL_PASSWORD=asset_password

SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

STORAGE_ROOT=./storage
```

> ⚠️ Change `SECRET_KEY` to any long random string for security.

### Step 2 — Start everything

```bash
cd "D:\Asset Manager"
docker-compose up --build
```

Docker will automatically:
- Start MySQL and run `schema.sql` + `seed.sql`
- Start the FastAPI backend on port `8000`
- Start the React frontend on port `5173`

### Step 3 — Open the app

| Service       | URL                          |
|---------------|------------------------------|
| Frontend      | http://localhost:5173        |
| API Docs      | http://localhost:8000/docs   |
| Health Check  | http://localhost:8000/health |

---

## 🛠️ Option B — Run Locally (without Docker)

### Prerequisites
- Python 3.11+
- Node.js 18+
- MySQL 8 installed and running locally

---

### MySQL Setup (Local)

Open MySQL as root (via MySQL Workbench or terminal):

```sql
-- 1. Create the database
CREATE DATABASE IF NOT EXISTS asset_tracker
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 2. Create a dedicated app user
CREATE USER 'asset_user'@'localhost' IDENTIFIED BY 'asset_password';

-- 3. Grant full access on the database
GRANT ALL PRIVILEGES ON asset_tracker.* TO 'asset_user'@'localhost';

-- 4. Apply changes
FLUSH PRIVILEGES;

-- 5. Run the schema
USE asset_tracker;
SOURCE D:/Asset Manager/database/schema.sql;

-- 6. (Optional) Load demo data
SOURCE D:/Asset Manager/database/seed.sql;
```

> After running seed.sql, you can log in with:
> - **Email:** `demo@example.com`
> - **Password:** `Demo@1234`

---

### Backend Setup

```bash
cd "D:\Asset Manager\backend"

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create your .env file
copy .env.example .env
```

Edit `backend/.env`:

```env
DATABASE_URL=mysql+pymysql://asset_user:asset_password@localhost:3306/asset_tracker
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
STORAGE_ROOT=./storage
```

Run Alembic migrations (creates all tables):

```bash
alembic upgrade head
```

> If you already ran `schema.sql` manually above, you can skip this step — both do the same thing.

Start the backend:

```bash
uvicorn app.main:app --reload --port 8000
```

API is now live at: http://localhost:8000
Docs at: http://localhost:8000/docs

---

### Frontend Setup

Open a **new terminal**:

```bash
cd "D:\Asset Manager\frontend"

# Install packages
npm install

# Create env file
copy .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

App is now live at: http://localhost:5173

---

## 🔄 App Workflow

```
1. Sign Up   →  POST /api/v1/auth/signup
2. Sign In   →  POST /api/v1/auth/signin   (returns JWT token)
3. Create Section  →  POST /api/v1/sections   (e.g. "Car", "Kitchen")
4. Add Item  →  POST /api/v1/items         (name, price, date, brand, etc.)
5. Upload Photo  →  POST /api/v1/uploads/items/{item_id}/photo
6. View / Edit / Delete sections and items at any time
```

---

## 🗄️ MySQL Tables

| Table      | Description                                          |
|------------|------------------------------------------------------|
| `users`    | Registered accounts (email, hashed password, name)  |
| `sections` | User-created categories (Car, Kitchen, etc.)         |
| `items`    | Assets inside sections (price, photo, date, brand)   |

All tables use `CASCADE` deletes — deleting a user removes all their sections and items automatically.

---

## 📂 File Storage

Uploaded photos are stored at:

```
storage/
└── users/
    └── {user_id}/
        └── items/
            └── {item_id}/
                ├── photo_<uuid>.jpg      ← full size (max 1200×1200)
                └── thumb_<uuid>.jpg      ← thumbnail (300×300)
```

Photos are served as static files at: `http://localhost:8000/storage/users/{user_id}/items/{item_id}/photo_xxx.jpg`

---

## 🧪 Running Tests

```bash
cd "D:\Asset Manager\backend"
venv\Scripts\activate
pytest tests/ -v
```

---

## 🔐 Password Rules (on signup)

- Minimum 8 characters
- At least one uppercase letter
- At least one digit

---

## ❓ Troubleshooting

| Problem | Solution |
|--------|---------|
| `Access denied for user 'asset_user'` | Re-run the MySQL GRANT commands above |
| `Can't connect to MySQL server` | Make sure MySQL service is running |
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` inside your venv |
| `npm: command not found` | Install Node.js 18+ from https://nodejs.org |
| Port 8000 already in use | Change `--port 8000` to another port in uvicorn command |
| Port 5173 already in use | Add `--port 3000` to `npm run dev` |
| Alembic error: table already exists | Skip `alembic upgrade head` — you already ran schema.sql |
