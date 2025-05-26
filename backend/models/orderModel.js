import mongoose from 'mongoose'
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
        price: { type: Number, required: true },
        size: { 
            type: String, 
            required: true,
            enum: ['S', 'M', 'L', 'XL', 'XXL']
        },
        quantity: { type: Number, required: true },
        rating: {
            type: Number,
            enum: [1, 2, 3, 4, 5],
            default: null 
        },
        review: { type: String, default: null }
    }],
    amount: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    discountPer: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default: 'Pending' },
    qrimage: { type: String },
    statusHistory: [{
        status: {
            type: String,
            required: true,
            default: 'Pending',
            enum: ['Pending', 'Accepted', 'Packing', 'Shipped', 'Out of delivery', 'Delivered', 'Cancel'],
        },
        createdAt: { type: Date, default: Date.now }
    }],
    paymentMethod: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, default: Date.now }
},{versionKey: false})
const orderModel = mongoose.models.order || mongoose.model('order', orderSchema)
export default orderModel;
