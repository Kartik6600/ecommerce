import mongoose from "mongoose"
const couponSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
    },
    code: {
        type: String,
        required: true,
        unique: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    start: {
        type: Date,
        required: true,
    },
    expiry: {
        type: Date,
        required: true,
    },
    useCount: {
        type: Number,
        default: 0,
    },
},{versionKey: false})
const couponModel = mongoose.models.coupon || mongoose.model('coupon', couponSchema)
export default couponModel;