# 🛒 ECommerce Web App

A full-stack ECommerce web application with separate user and admin panels, built using modern technologies and scalable architecture.

## 🌐 Live Demo
**👉 User App: https://forever-ebon.vercel.app/**

**👉 Admin Panel: https://forever-admin-plum-seven.vercel.app/**

## 📌 Architecture Overview
This project follows a modern 3-tier distributed architecture:
<img width="1536" height="1024" alt="Architecture diagram" src="https://github.com/user-attachments/assets/ca0f4fce-4817-409e-8165-307e8717d6e6" />
🔹 Key Points

Frontend & Admin deployed on Vercel

Backend acts as centralized API

MongoDB for data storage

Cloudinary for image handling

Fully decoupled architecture

## 🗂️ Database Schema Design
**🧑 Users Collection**
```shell
{
  "_id": "ObjectId",
  "name": "String (required)",
  "email": "String (required, unique)",
  "password": "String",
  "phone": "Number",
  "profileImage": "String",
  "cartData": [
    {
      "productId": "ObjectId",
      "size": "String",
      "quantity": "Number"
    }
  ]
}
```
**📦 Products Collection**
```shell
{
  "_id": "ObjectId",
  "name": "String",
  "description": "String",
  "price": "Number",
  "image": ["Array"],
  "category": "String",
  "subCategory": "String",
  "sizes": ["Array"],
  "bestseller": "Boolean",
  "available": "Boolean",
  "viewCount": "Number"
}
```
**🛍️ Orders Collection**
```shell
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "items": [
    {
      "productId": "ObjectId",
      "price": "Number",
      "size": "String",
      "quantity": "Number"
    }
  ],
  "totalAmount": "Number",
  "status": "pending | shipped | delivered",
  "createdAt": "Date"
}
```
**🎟️ Coupons Collection**
```shell
{
  "_id": "ObjectId",
  "name": "String",
  "code": "String",
  "discount": "Number",
  "start": "Date",
  "expiry": "Date",
  "useCount": "Number"
}
```
## Steps to Run the Application

1. **Download the Zip File**  
   **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ecommerce.git
   cd ecommerce
   ```
2. **Run the Backend**  
   - Open the `backend` folder in the terminal.  
     ```bash
     cd path/ecommerce/backend
     ```
   - Install backend Dependencies.
     ```bash
     npm Install
     ```
   - Start the backend server:  
     ```bash
     npm run dev
     ```

3. **Run the Frontend**  
   - Open the `frontend` folder in the terminal.  
     ```bash
     cd path/ecommerce/frontend
     ```
   - Install frontend Dependencies.
     ```bash
     npm Install
     ```  
   - Start the frontend development server:  
     ```bash
     npm run dev
     ```

4. **Run the Admin**  
   - Open the `admin` folder in the terminal.  
     ```bash
     cd path/ecommerce/admin
     ```
   - Install admin Dependencies.
     ```bash
     npm Install
     ``` 
   - Start the admin development server:  
     ```bash
     npm run dev
     ```
## 🚀 Features
✅ User Authentication (JWT)

✅ Product Filtering & Search

✅ Cart & Wishlist Checkout System

✅ Order Management

✅ Admin Dashboard

✅ Image Upload (Cloudinary)

✅ Responsive Design

✅ Payment Gateway Integration (Razorpay/Stripe)

✅ Product Reviews & Ratings

✅ Product Bill Download
## 📂 Project Structure
```shell
ecommerce/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│
├── frontend/
│   ├── components/
│   ├── pages/
│
├── admin/
│   ├── dashboard/
│   ├── components/
│
└── README.md
```
## 👨‍💻 Author

**Kartik Patel**

**🌐 Portfolio: https://kartik-patel-portfolio-pi.vercel.app/**

**💼 LinkedIn: www.linkedin.com/in/kartik-patel-2b6374268**
