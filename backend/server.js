import express from 'express'
import cors from 'cors'
import dotenv from "dotenv";
dotenv.config();
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import passport from './config/passport.js';
import productRouter from './routes/productRoute.js'
import userRouter from './routes/userRoute.js'
import cartRouter from './routes/cartRoute.js'
import wishlistRouter from './routes/wishlistRoute.js'
import orderRouter from './routes/orderRoute.js'
import couponRouter from './routes/couponRoute.js'
import cookieParser from 'cookie-parser'
import morgan from 'morgan';
// App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();
// middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors());
// api endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/order', orderRouter);
app.use('/api/coupon', couponRouter);
app.get("/", (req, res) => {
    res.send("API is running...");
});
app.listen(port, ()=> console.log('🟢 Server started on PORT: '+ port));