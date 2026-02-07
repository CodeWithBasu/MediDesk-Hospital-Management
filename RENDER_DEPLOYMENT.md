# 🚀 Deploy MediDesk to Render - Complete Guide

## Step-by-Step Render Deployment

Render is an all-in-one platform that will host your frontend, backend, and database. Let's get started!

---

## 📋 Prerequisites

- ✅ GitHub account with MediDesk repository
- ✅ Render account (free) - [render.com](https://render.com)

---

## 🗄️ Important: Database Choice

Render offers **PostgreSQL** for free, but your app uses **MySQL**. You have two options:

### **Option A: Use External MySQL** (Recommended - No code changes)

- Use a free MySQL service like:
  - **Railway** (Free tier)
  - **PlanetScale** (Free tier)
  - **FreeSQLDatabase** (Free tier)
- Keep your existing code

### **Option B: Migrate to PostgreSQL** (Requires minor code changes)

- Use Render's free PostgreSQL
- Change MySQL-specific queries to PostgreSQL syntax

**We'll use Option A for simplicity.**

---

## 🚀 Deployment Steps

### **Part 1: Set Up MySQL Database on Railway**

1. **Go to [railway.app](https://railway.app)**
2. Click "Start a New Project"
3. Click "Provision MySQL"
4. Copy these credentials (you'll need them):
   - `MYSQL_HOST`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`
   - `MYSQL_PORT` (usually 3306)

**Keep these credentials safe!** ⚠️

---

### **Part 2: Deploy Backend to Render**

1. **Go to [render.com](https://render.com)**
2. Click "New +" → "Web Service"
3. Click "Build and deploy from a Git repository"
4. Connect your GitHub account
5. Select `CodeWithBasu/MediDesk-Hospital-Management`
6. **Configure the service:**

   **Basic Settings:**
   - **Name:** `medidesk-backend`
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node dist/index.js`

   **Environment Variables:**
   Click "Add Environment Variable" and add these:

   ```
   DB_HOST=<your_railway_mysql_host>
   DB_USER=<your_railway_mysql_user>
   DB_PASS=<your_railway_mysql_password>
   DB_NAME=<your_railway_mysql_database>
   DB_PORT=3306
   JWT_SECRET=MediDesk_Super_Secret_Key_2026_Change_This
   PORT=5000
   NODE_ENV=production
   ```

   **Plan:** Free

7. Click "Create Web Service"
8. **Wait for deployment** (5-10 minutes)
9. **Copy your backend URL** (looks like: `https://medidesk-backend.onrender.com`)

---

### **Part 3: Update Frontend Code**

Before deploying the frontend, we need to update the API URL.

**Update `client/src/config.ts`:**

```typescript
// Update this file to use environment variable
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
```

**Commit and push this change:**

```bash
git add client/src/config.ts
git commit -m "Update API config for production deployment"
git push origin main
```

---

### **Part 4: Deploy Frontend to Render**

1. **Back in Render dashboard**
2. Click "New +" → "Static Site"
3. Connect the same GitHub repository
4. **Configure the static site:**

   **Basic Settings:**
   - **Name:** `medidesk-frontend`
   - **Branch:** `main`
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

   **Environment Variables:**

   ```
   VITE_API_BASE_URL=<your_backend_url_from_part2>
   ```

   Example: `https://medidesk-backend.onrender.com`

5. Click "Create Static Site"
6. **Wait for deployment** (5-10 minutes)
7. **Copy your frontend URL** (looks like: `https://medidesk-frontend.onrender.com`)

---

### **Part 5: Update Backend CORS**

Update your backend to allow requests from your frontend URL.

**Update `server/src/index.ts`:**

Find the CORS configuration and update it:

```typescript
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5000",
      process.env.FRONTEND_URL || "https://medidesk-frontend.onrender.com",
    ],
    credentials: true,
  }),
);
```

**Add to your backend environment variables on Render:**

```
FRONTEND_URL=https://medidesk-frontend.onrender.com
```

**Commit and push:**

```bash
git add server/src/index.ts
git commit -m "Update CORS for production"
git push origin main
```

Render will automatically redeploy both services.

---

### **Part 6: Initialize Database**

Once backend is deployed, you need to initialize the database.

**Option 1: Use Render Shell** (Recommended)

1. Go to your backend service on Render
2. Click "Shell" tab
3. Run these commands one by one:
   ```bash
   npx ts-node src/init-db.ts
   npx ts-node src/migrations/migrate-users.ts
   npx ts-node src/migrations/migrate-doctor-details.ts
   npx ts-node src/migrations/migrate-rooms.ts
   npx ts-node src/migrations/migrate-pharmacy.ts
   npx ts-node src/migrations/migrate-emergency.ts
   npx ts-node src/migrations/migrate-payroll.ts
   npx ts-node src/migrations/migrate-machinery.ts
   npx ts-node src/migrations/migrate-laundry.ts
   ```

**Option 2: Use Railway MySQL Console**

1. Go to your Railway MySQL database
2. Open the Query tab
3. Run the SQL from your migration files manually

---

## ✅ Verification

### **Test Your Deployment:**

1. **Visit your frontend URL:** `https://medidesk-frontend.onrender.com`
2. **Try logging in:**
   - Username: `admin`
   - Password: `admin123` (or whatever you set in migrations)
3. **Test features:**
   - Navigate to dashboard
   - Check patient management
   - Verify API connections

---

## 🎯 Final Architecture

```
┌─────────────────────────────────────────┐
│   Render Static Site (Frontend)        │
│   https://medidesk-frontend.onrender.com│
└──────────────┬──────────────────────────┘
               │ API Requests
┌──────────────▼──────────────────────────┐
│   Render Web Service (Backend)         │
│   https://medidesk-backend.onrender.com │
└──────────────┬──────────────────────────┘
               │ Database Queries
┌──────────────▼──────────────────────────┐
│   Railway MySQL Database                │
│   (Private connection)                   │
└─────────────────────────────────────────┘
```

---

## 💰 Cost Breakdown

| Service   | Platform           | Cost                       |
| --------- | ------------------ | -------------------------- |
| Frontend  | Render Static Site | **FREE**                   |
| Backend   | Render Web Service | **FREE** (750 hrs/month)   |
| Database  | Railway MySQL      | **FREE** ($5 credit/month) |
| **TOTAL** |                    | **$0/month** ✅            |

---

## ⚠️ Important Notes

### **Free Tier Limitations:**

1. **Render Free Web Services:**
   - Spin down after 15 minutes of inactivity
   - First request after inactivity takes 30-60 seconds
   - 750 hours/month (enough for learning/portfolio)

2. **Railway Free Tier:**
   - $5 credit per month
   - Unlimited databases
   - Shared CPU

### **Solutions:**

- Upgrade to paid plans when going to production
- Use a service like UptimeRobot to ping your app every 14 minutes
- Or accept the cold start delay

---

## 🔧 Troubleshooting

### **Backend won't deploy:**

- Check build logs on Render
- Ensure `package.json` build script is correct
- Verify all dependencies are in `package.json`

### **Frontend shows CORS error:**

- Update backend CORS to include frontend URL
- Check environment variables are set correctly

### **Database connection fails:**

- Verify Railway MySQL credentials
- Check if Railway database is active
- Test connection with MySQL Workbench

### **Frontend can't reach backend:**

- Verify `VITE_API_BASE_URL` is set correctly
- Check backend URL is correct (no trailing slash)
- Open browser console for errors

---

## 🎉 Success! What's Next?

Once deployed, you can:

1. **Share your live URL** on:
   - LinkedIn
   - Resume/CV
   - GitHub README
   - Portfolio website

2. **Monitor your app:**
   - Render dashboard shows logs and metrics
   - Railway shows database usage

3. **Update your code:**
   - Push to GitHub main branch
   - Render auto-deploys (if enabled)

4. **Upgrade for production:**
   - Render: $7/month for persistent instances
   - Railway: Pay-as-you-go after free tier

---

## 📊 Deployment Checklist

Before going live:

- [ ] Change default admin password
- [ ] Update JWT_SECRET to a strong random value
- [ ] Test all features in production
- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS (automatic on Render)
- [ ] Add monitoring/analytics
- [ ] Set up database backups
- [ ] Document API endpoints
- [ ] Add error tracking (Sentry, etc.)

---

## 🆘 Need Help?

**Common Issues:**

1. **"Build failed" on Render**
   - Check Node version compatibility
   - Review build logs for specific errors

2. **"Service Unavailable"**
   - Backend might be spinning down (free tier)
   - Wait 30-60 seconds and try again

3. **"Cannot connect to database"**
   - Verify Railway credentials
   - Check if DB is whitelisting IPs

---

Would you like me to help you with any specific step? I can:

1. Create the necessary configuration files
2. Update your code for production
3. Guide you through the Railway MySQL setup
4. Help troubleshoot any deployment issues

Let me know which step you'd like to start with! 🚀
