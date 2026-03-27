# AiEtsy - Etsy-like Marketplace

A fully functional marketplace web application built with the MERN stack (MongoDB, Express, React, Node.js) featuring a beautiful blue theme.

## Features

- ✅ **User Authentication** - Register, login, and profile management
- ✅ **Product Catalog** - Browse and search products
- ✅ **Shopping Cart** - Add/remove products and manage quantities
- ✅ **Checkout** - Complete orders with shipping information
- ✅ **Seller Dashboard** - Create and manage products
- ✅ **Orders Management** - Track orders and status
- ✅ **Product Reviews** - Rate and review products
- ✅ **Responsive Design** - Works on desktop and mobile
- ✅ **Blue Theme** - Modern color scheme throughout

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS Modules** - Component styling

## Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

### 1. Clone the repository

```bash
cd aietsy
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Configure your environment variables in `.env`:
```
MONGODB_URI=mongodb://localhost:27017/aietsy
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## Running the Application

### Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Windows
mongod

# On macOS/Linux
brew services start mongodb-community
```

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

### Start Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
aietsy/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   └── orderController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Cart.js
│   ├── routes/
│   │   ├── userRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   └── orderRoutes.js
│   ├── middleware/
│   │   └── authenticate.js
│   ├── .env
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── Footer.jsx
    │   │   └── ProductCard.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Products.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── Orders.jsx
    │   │   ├── Profile.jsx
    │   │   ├── Seller.jsx
    │   │   └── SellerSignup.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── styles/
    │   │   └── global.css
    │   ├── App.jsx
    │   └── main.jsx
    └── vite.config.js
```

## API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (authenticated)
- `PUT /api/users/profile` - Update user profile (authenticated)
- `POST /api/users/become-seller` - Become a seller (authenticated)

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (authenticated, seller only)
- `PUT /api/products/:id` - Update product (authenticated, seller only)
- `DELETE /api/products/:id` - Delete product (authenticated, seller only)
- `GET /api/products/seller/my-products` - Get seller's products (authenticated)
- `POST /api/products/:id/review` - Add review (authenticated)

### Cart
- `GET /api/cart` - Get cart (authenticated)
- `POST /api/cart/add` - Add to cart (authenticated)
- `POST /api/cart/remove` - Remove from cart (authenticated)
- `PUT /api/cart/update` - Update cart item (authenticated)
- `DELETE /api/cart/clear` - Clear cart (authenticated)

### Orders
- `POST /api/orders` - Create order (authenticated)
- `GET /api/orders` - Get user's orders (authenticated)
- `GET /api/orders/:id` - Get order details (authenticated)
- `PUT /api/orders/:id` - Update order status (authenticated)
- `GET /api/orders/seller/my-orders` - Get seller's orders (authenticated)

## Default Theme Colors

- Primary Blue: `#1e40af`
- Dark Blue: `#1e3a8a`
- Light Blue: `#3b82f6`
- Sky Blue: `#0ea5e9`
- Cyan: `#06b6d4`

## Usage Guide

### As a Buyer
1. Register/Login to create an account
2. Browse products using the search or categories
3. Click on a product to view details and reviews
4. Add products to your cart
5. Go to checkout to place an order
6. Track your orders in the Orders page

### As a Seller
1. Register an account
2. Click "Become Seller" to upgrade your account
3. Go to Seller Dashboard
4. Create and manage your products
5. Monitor orders from customers

## Future Enhancements

- Payment gateway integration (Stripe, PayPal)
- Advanced analytics and reports
- Email notifications
- Product recommendations
- Seller ratings and reviews
- Wish list functionality
- Multiple payment methods
- Admin dashboard
- Image upload functionality

## Contributing

Feel free to fork and submit pull requests!

## License

MIT License

## Support

For support, please create an issue or contact the development team.

---

**Happy Selling! 🛍️💙**
