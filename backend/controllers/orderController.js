import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js"
import Stripe from 'stripe'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from "cloudinary";
const currency = "inr";
const delivery_Charge = 10;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, amount, address, deliveryCharge, discountPer } = req.body;
        const createdAt = new Date()
        const filteredItems = items.map(item => ({
            productId: item._id,
            price: item.price,
            size: item.size,
            quantity: item.quantity,
            rating: null,
            review: null
        }));
        const orderData = {
            userId,
            items: filteredItems,
            address,
            amount,
            deliveryCharge,
            discountPer,
            status: "Pending",
            statusHistory: [{ status: "Pending", createdAt }],
            paymentMethod: "COD",
            payment: false,
            createdAt
        }
        const newOrder = new orderModel(orderData)
        await newOrder.save()
        await userModel.findByIdAndUpdate(userId, {
            $set: { cartData: [] },
            $push: { orders: { orderId: newOrder._id } }
        });
        for (const item of filteredItems) {
            await productModel.findByIdAndUpdate(
                item.productId,
                { $inc: { purchaseCount: item.quantity } }
            );
        }
        res.json({ success: true, message: "Order Places" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
};
const placeOrderQR = async (req, res) => {
    try {
        const screenshot = req.file;
        const orderData = JSON.parse(req.body.orderData);
        const { items, amount, address, deliveryCharge, discountPer } = orderData;
        const { token } = req.headers;
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        const userId = token_decode.id
        if (!screenshot || !userId || !items || !amount) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }
        const result = await cloudinary.uploader.upload(screenshot.path, {
            resource_type: 'image'
        });
        const filteredItems = items.map(item => ({
            productId: item._id,
            price: item.price,
            size: item.size,
            quantity: item.quantity,
            rating: null,
            review: null
        }));
        const newOrder = new orderModel({
            userId,
            items: filteredItems,
            address,
            amount,
            deliveryCharge,
            discountPer,
            qrimage: result.secure_url,
            status: "Pending",
            statusHistory: [{ status: "Pending", createdAt: new Date() }],
            paymentMethod: "QR",
            payment: false
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, {
            $set: { cartData: [] },
            $push: { orders: { orderId: newOrder._id } }
        });
        for (const item of filteredItems) {
            await productModel.findByIdAndUpdate(
                item.productId,
                { $inc: { purchaseCount: item.quantity } }
            );
        }
        res.json({
            success: true,
            message: "Order placed successfully"
        });
    } catch (error) {
        console.error("QR Order Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address, deliveryCharge, discountPer } = req.body
        const { origin } = req.headers;
        const createdAt = new Date()
        const filteredItems = items.map(item => ({
            productId: item._id,
            price: item.price,
            size: item.size,
            quantity: item.quantity,
            rating: null,
            review: null
        }));
        const orderData = {
            userId,
            items: filteredItems,
            address,
            amount,
            deliveryCharge,
            discountPer,
            status: "Pending",
            statusHistory: [{ status: "Pending", createdAt }],
            paymentMethod: "Stripe",
            payment: false,
            createdAt
        }
        const newOrder = new orderModel(orderData)
        await newOrder.save()
        for (const item of filteredItems) {
            await productModel.findByIdAndUpdate(
                item.productId,
                { $inc: { purchaseCount: item.quantity } }
            );
        }
        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))
        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: delivery_Charge * 100
            },
            quantity: 1
        })
        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })
        res.json({ success: true, session_url: session.url });
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
};
const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body
    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true })
            await userModel.findByIdAndUpdate(userId, {
                $set: { cartData: [] },
                $push: { orders: { orderId: orderId } }
            });
            res.json({ success: true })
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({ success: false })
        }
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
};
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).populate('items.productId');
        res.json({ success: true, orders })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
};
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body
        const orders = await orderModel.find({ userId }).populate('items.productId');
        res.json({ success: true, orders })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
};
const latestOrder = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const order = await orderModel.findOne({ userId }).sort({ createdAt: -1 }).populate('userId');
        if (!order) {
            return res.status(404).json({ success: false, message: "No orders found for this user" });
        }
        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const orderReceipt = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: "Order ID is required" });
        }
        const order = await orderModel.findById(id).select('-statusHistory -qrimage').populate('items.productId');
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        const user = await userModel.findById(order.userId).select('-password -cartData');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, order, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const orderRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { reviews } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "Order ID is required" });
        }
        const order = await orderModel.findById(id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        reviews.forEach(({ productId, rating, review }) => {
            const item = order.items.find(item => item.productId.toString() === productId);
            if (item) {
                item.rating = rating;
                item.review = review;
            }
        });
        await order.save();
        return res.status(200).json({
            success: true,
            message: "Order ratings and reviews updated successfully",
            order
        });
    } catch (error) {
        console.error("Error updating ratings:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, {
            status,
            $push: {
                statusHistory: {
                    status,
                    createdAt: new Date()
                }
            }
        });
        res.json({ success: true, message: "Status Updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
export { verifyStripe, placeOrderCOD, placeOrderStripe, placeOrderQR, orderReceipt, orderRating, allOrders, userOrders, latestOrder, updateStatus }