# 🖤 Lucifur E-commerce — Complete Setup Guide

> Follow this guide step-by-step to get the entire project (frontend + backend) running on your local machine.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure Overview](#project-structure)
3. [Step 1 — MongoDB Atlas Setup](#step-1--mongodb-atlas-setup)
4. [Step 2 — Cloudinary Setup](#step-2--cloudinary-setup)
5. [Step 3 — Backend Setup](#step-3--backend-setup)
6. [Step 4 — Frontend Setup](#step-4--frontend-setup)
7. [Step 5 — Seed the Database](#step-5--seed-the-database)
8. [Step 6 — Running the Project](#step-6--running-the-project)
9. [Default Login Credentials](#default-login-credentials)
10. [All Available Routes](#all-available-routes)
11. [Common Errors & Fixes](#common-errors--fixes)

---

## Prerequisites

Before starting, make sure the following are installed on your machine:

| Tool | Version | Download |
|------|---------|----------|
| **Node.js** | v18 or higher | https://nodejs.org (download LTS) |
| **npm** | Comes with Node.js | — |
| **Git** *(optional)* | Any | https://git-scm.com |

### ✅ Verify Installation

Open a terminal (Command Prompt or PowerShell) and run:

```bash
node -v
# Should print: v18.x.x or higher

npm -v
# Should print: 9.x.x or higher
```

> **If Node.js is not installed:** Go to https://nodejs.org, download the **LTS** version, run the installer, then restart your terminal and check again.

---

## Project Structure

After extracting the zip, you should see this structure:

```
lucifur/                    ← Root folder (Frontend)
├── src/
│   ├── components/         ← Navbar, Footer, ProductCard, AuthModal, etc.
│   ├── context/            ← AuthContext, CartContext, WishlistContext
│   ├── pages/              ← Home, Shop, Cart, Checkout, Admin pages, etc.
│   └── utils/              ← adminApi.js helper
├── server/                 ← Backend (Node.js + Express)
│   ├── config/             ← DB connection
│   ├── middleware/         ← Auth, Error handlers
│   ├── models/             ← Mongoose schemas
│   ├── routes/             ← All API routes
│   ├── seed/               ← Seed script (dummy data)
│   ├── .env.example        ← Template for your .env file
│   └── server.js           ← Backend entry point
├── .env                    ← Frontend environment variable (already created)
├── package.json            ← Frontend dependencies
└── vite.config.js
```

---

## Step 1 — MongoDB Atlas Setup

MongoDB Atlas is a **free cloud database**. You need it to store products, orders, users, etc.

### 1.1 Create a Free Account
1. Go to **https://www.mongodb.com/cloud/atlas**
2. Click **"Try Free"** → Sign up with Google or email
3. Choose **Free Tier (M0)** → Select any region close to you (e.g., AWS Mumbai)
4. Click **"Create Deployment"**

### 1.2 Create a Database User
1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** as the auth method
4. Set a username (e.g., `lucifur_user`) and a strong password
5. Under **"Database User Privileges"** → select **"Atlas admin"**
6. Click **"Add User"**

> ⚠️ **Save the username and password — you'll need them in Step 3.**

### 1.3 Allow Network Access
1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** → This sets it to `0.0.0.0/0`
4. Click **"Confirm"**

### 1.4 Get Your Connection String
1. In the left sidebar, click **"Database"**
2. Click **"Connect"** on your cluster
3. Choose **"Drivers"**
4. Select Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string. It looks like:
   ```
   mongodb+srv://lucifur_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password from Step 1.2
7. Add the database name before `?`. Final result:
   ```
   mongodb+srv://lucifur_user:yourpassword@cluster0.xxxxx.mongodb.net/lucifur?retryWrites=true&w=majority
   ```

> ✅ Keep this string ready — you will paste it in Step 3.

---

## Step 2 — Cloudinary Setup

Cloudinary is used for **uploading and hosting product images** from the Admin Panel. It has a free plan.

### 2.1 Create a Free Account
1. Go to **https://cloudinary.com**
2. Click **"Sign Up for Free"**
3. Complete registration

### 2.2 Get Your API Credentials
1. After logging in, go to your **Dashboard**
2. You will see 3 values on the screen:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. Copy all three — you will need them in Step 3.

> ✅ Keep these 3 values ready.

---

## Step 3 — Backend Setup

Open a terminal. Navigate inside the **`server`** folder:

```bash
cd lucifur/server
```

### 3.1 Install Backend Packages

```bash
npm install
```

> This installs: express, mongoose, jsonwebtoken, bcryptjs, cloudinary, multer, dotenv, cors, nodemon, and more.
> Wait for it to finish (you'll see `added X packages`).

### 3.2 Create the `.env` File

The `.env` file holds your **secret configuration**. You must create it manually.

Inside the `server` folder, create a new file called **`.env`** (note the dot at the start).

> **On Windows:** Open the `server` folder, right-click → New → Text Document → rename it to `.env` (make sure it doesn't save as `.env.txt`).
> Or use Notepad / VS Code to create it.

Paste the following content into `.env` and fill in your values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=lucifur_super_secret_key_2024_change_this
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
NODE_ENV=development
```

**Replace the following:**

| Placeholder | Replace With |
|-------------|-------------|
| `your_mongodb_connection_string_here` | The full MongoDB URI from Step 1.4 |
| `lucifur_super_secret_key_2024_change_this` | Any long random string (e.g., `abc123xyz!@#lucifur2024`) |
| `your_cloud_name_here` | Cloudinary Cloud Name from Step 2.2 |
| `your_api_key_here` | Cloudinary API Key from Step 2.2 |
| `your_api_secret_here` | Cloudinary API Secret from Step 2.2 |

**Example of a filled `.env`:**
```env
PORT=5000
MONGO_URI=mongodb+srv://lucifur_user:mypassword@cluster0.abc123.mongodb.net/lucifur?retryWrites=true&w=majority
JWT_SECRET=lucifur_super_secret_key_2024_abc!xyz
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=dxyz1234
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=AbCdEfGhIjKlMnOpQrStUvWx
NODE_ENV=development
```

> ⚠️ **Never share this file with anyone or upload it to GitHub.**

---

## Step 4 — Frontend Setup

Open a **new terminal window**. Navigate to the **root project folder** (not `server`):

```bash
cd lucifur
```

### 4.1 Install Frontend Packages

```bash
npm install
```

> This installs: React, React Router, Framer Motion, Lucide React, Bootstrap, and more.

### 4.2 Verify the Frontend `.env` File

A `.env` file already exists in the root folder with this content:

```env
VITE_API_URL=http://localhost:5000/api
```

This tells the frontend where to find the backend API. **No changes needed** unless you deploy to a server (then update the URL).

---

## Step 5 — Seed the Database

Seeding loads **dummy data** into MongoDB so you have products, collections, and users ready to use immediately.

Go to the `server` folder in your terminal:

```bash
cd lucifur/server
```

Run the seed command:

```bash
npm run seed
```

**Expected output:**
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🗑️  Cleared existing data
✅ Seeded 3 collections
✅ Seeded 8 products
✅ Seeded admin user: admin@lucifer.com / Admin@1234
✅ Seeded test user: user@lucifer.com / User@1234
✅ Seeded 2 coupons: WELCOME20 (20% off), FLAT100 (₹100 off)

🎉 Database seeded successfully!
```

> ⚠️ **If you see an error:** Double-check that your `MONGO_URI` in `.env` is correct and that you allowed network access in Atlas (Step 1.3).

---

## Step 6 — Running the Project

You need **two terminal windows** running simultaneously.

### Terminal 1 — Start the Backend

```bash
cd lucifur/server
npm run dev
```

**Expected output:**
```
🚀 Lucifur Server running on http://localhost:5000
📊 Environment: development
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
```

> The backend uses `nodemon`, so it will **auto-restart** whenever you change a file.

### Terminal 2 — Start the Frontend

```bash
cd lucifur
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in 300ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 🎉 Open the App

| URL | Page |
|-----|------|
| http://localhost:5173 | Customer Storefront |
| http://localhost:5173/admin/login | Admin Panel Login |

---

## Default Login Credentials

These are created by the seed script. Change passwords after first login.

### Admin Account
```
Email:    admin@lucifer.com
Password: Admin@1234
URL:      http://localhost:5173/admin/login
```

### Test Customer Account
```
Email:    user@lucifer.com
Password: User@1234
URL:      http://localhost:5173 (click the User icon in navbar)
```

### Test Coupon Codes
| Code | Discount | Min Order |
|------|----------|-----------|
| `WELCOME20` | 20% off | ₹500 |
| `FLAT100` | ₹100 off | ₹1000 |

---

## All Available Routes

### Customer Store
| URL | Page |
|-----|------|
| `/` | Home |
| `/shop` | All Products |
| `/product/:id` | Product Detail |
| `/cart` | Shopping Cart |
| `/wishlist` | Wishlist (login required) |
| `/checkout` | Checkout |
| `/order-confirmation/:id` | Order Confirmation |
| `/orders` | My Order History (login required) |
| `/about` | About Page |
| `/contact` | Contact Page |

### Admin Panel
| URL | Page |
|-----|------|
| `/admin/login` | Admin Login |
| `/admin/dashboard` | Stats & Overview |
| `/admin/products` | Manage Products |
| `/admin/products/add` | Add New Product |
| `/admin/products/edit/:id` | Edit Product |
| `/admin/collections` | Manage Collections |
| `/admin/orders` | Manage Orders |
| `/admin/users` | View All Users |
| `/admin/coupons` | Manage Coupons |

### Backend API (runs on port 5000)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| POST | `/api/auth/register` | Customer signup |
| POST | `/api/auth/login` | Login (customer or admin) |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/products` | Get all products (filterable) |
| GET | `/api/products/featured` | Featured products |
| GET | `/api/products/:id` | Single product |
| GET | `/api/collections` | All collections |
| POST | `/api/orders` | Place an order |
| GET | `/api/orders/myorders` | My order history |
| GET/POST | `/api/wishlist` | Get or toggle wishlist |
| GET | `/api/admin/stats` | Dashboard stats (admin) |
| GET | `/api/admin/orders` | All orders (admin) |
| PUT | `/api/admin/orders/:id` | Update order status (admin) |
| GET | `/api/admin/users` | All users (admin) |
| POST | `/api/admin/coupons` | Create coupon (admin) |

---

## Common Errors & Fixes

### ❌ `Cannot connect to MongoDB`
- Open your `.env` file and check `MONGO_URI`
- Make sure you replaced `<password>` with your actual password
- Make sure Network Access in Atlas is set to `0.0.0.0/0` (Step 1.3)
- Test your URI in MongoDB Compass if available

### ❌ `Module not found` / `Cannot find package`
- You forgot to run `npm install`
- Run it in the correct folder: **root** for frontend, **`server/`** for backend

### ❌ `.env` file not working
- Make sure the file is named `.env` and NOT `.env.txt`
- There should be no spaces around `=` (e.g., `PORT=5000` not `PORT = 5000`)
- The file must be inside the `server/` folder for backend, and root folder for frontend

### ❌ `Port 5000 already in use`
- Another program is using port 5000
- Change `PORT=5001` in your `server/.env` file
- Also update the frontend `.env`: `VITE_API_URL=http://localhost:5001/api`

### ❌ Frontend shows "Cannot fetch products"
- The backend server is not running → open Terminal 1 and run `npm run dev` in `/server`
- Check that backend is on port 5000 and frontend `.env` has `VITE_API_URL=http://localhost:5000/api`

### ❌ Images not uploading in Admin Panel
- Your Cloudinary credentials in `server/.env` are incorrect
- Re-check `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### ❌ `Seed script fails`
- Check your MongoDB connection string
- Make sure you are running `npm run seed` from inside the `server/` folder, not the root

---

## Quick Checklist Before Starting

Use this as a final check before you open the browser:

- [ ] Node.js v18+ is installed (`node -v`)
- [ ] MongoDB Atlas cluster is created and running
- [ ] MongoDB Atlas Network Access allows `0.0.0.0/0`
- [ ] `server/.env` file exists and all 8 variables are filled in
- [ ] `npm install` run in the **root** folder (frontend)
- [ ] `npm install` run in the **`server/`** folder (backend)
- [ ] `npm run seed` executed from `server/` — shows "🎉 Database seeded"
- [ ] Backend running in Terminal 1: `npm run dev` inside `server/`
- [ ] Frontend running in Terminal 2: `npm run dev` in root
- [ ] Browser open at http://localhost:5173

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6, Framer Motion |
| Styling | CSS Modules, Bootstrap Grid, Google Fonts |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB (via Mongoose) |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| Image Storage | Cloudinary |
| Dev Server | Nodemon (backend), Vite HMR (frontend) |

---

*Made with 🖤 for Lucifur Streetwear*
