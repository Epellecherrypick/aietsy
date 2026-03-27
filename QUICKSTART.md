# Quick Start Guide - AiEtsy

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies

Open two terminals in the aietsy directory:

**Terminal 1 - Backend:**
```powershell
cd backend
npm install
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm install
```

### Step 2: Configure MongoDB

You have two options:

#### Option A: Local MongoDB
1. Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Start MongoDB (it typically runs automatically)

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Get your connection string
4. Update the MONGODB_URI in backend/.env

### Step 3: Update Environment Variables

Edit `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/aietsy
JWT_SECRET=my_super_secret_key_change_this_later
PORT=5000
NODE_ENV=development
```

### Step 4: Start the Servers

**Terminal 1 - Backend:**
```powershell
npm run dev
```
✅ Backend running at http://localhost:5000

**Terminal 2 - Frontend:**
```powershell
npm run dev
```
✅ Frontend running at http://localhost:3000

### Step 5: Open in Browser

Navigate to `http://localhost:3000` and you're ready to go! 🎉

---

## 📝 Test the Application

### Create a Test Account
1. Click "Register"
2. Fill in username, email, and password
3. Submit

### As a Buyer
1. Click "Browse" to see products
2. Search or filter by category
3. Click on a product to see details
4. Add to cart
5. Go to checkout and place an order

### As a Seller
1. After logging in, click "Become Seller"
2. Go to "Sell" or Seller Dashboard
3. Create a new product
4. Fill in details and submit
5. View your products and orders

---

## 🎨 Theme Colors

All the beautiful blue theme colors are pre-configured:
- Primary: `#1e40af` (Blue)
- Accent: `#0ea5e9` (Sky Blue)
- Light: `#f0f9ff` (Very Light Blue)

All components automatically use these colors!

---

## 📂 Main Files Overview

### Backend
- `server.js` - Main server file
- `config/db.js` - Database connection
- `models/` - Data schemas (User, Product, Order, Cart)
- `controllers/` - Business logic
- `routes/` - API endpoints
- `middleware/` - Auth middleware

### Frontend
- `App.jsx` - Main app component with routing
- `components/` - Reusable components (Header, Footer, ProductCard)
- `pages/` - Full page components (Home, Products, Cart, etc.)
- `context/` - Global state (Auth, Cart)
- `services/api.js` - API client

---

## 🔧 Common Issues & Solutions

### Problem: MongoDB connection failed
**Solution:** 
- Make sure MongoDB is running
- Check MONGODB_URI in .env
- For MongoDB Atlas, check internet connection and IP whitelist

### Problem: Port 5000 already in use
**Solution:** 
- Change PORT in backend/.env
- Update proxy in frontend/vite.config.js

### Problem: npm install fails
**Solution:**
- Delete node_modules and package-lock.json
- Run `npm install` again
- Use `npm install --legacy-peer-deps` if needed

### Problem: CORS errors
**Solution:**
- Make sure backend is running
- Check axios API baseURL in frontend/src/services/api.js

---

## 💡 Tips

1. **Save Data**: All data is saved to MongoDB
2. **Authentication**: Tokens are stored in localStorage
3. **Auto-sync**: Cart automatically syncs when you log in
4. **Hot Reload**: Both frontend and backend support hot reload during development

---

## 🎯 Next Steps

After everything is working:
1. Explore the seller dashboard
2. Create test products
3. Add items to cart and checkout
4. Check the browser's Network tab to see API calls
5. Customize colors in `frontend/src/styles/global.css`

---

## 📖 Full Documentation

See `README.md` in the root directory for complete documentation.

---

## 🆘 Need Help?

1. Check the console for error messages
2. Verify MongoDB is running
3. Check that both servers are running on correct ports
4. Make sure all dependencies are installed

**Happy Shopping! 🛍️💙**
