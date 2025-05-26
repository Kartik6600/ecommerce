import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: { type : String, required : true },
    email: { type : String, required : true, unique : true },
    password: { type : String, required : true },
    phone: { type : Number},
    profileImage: { type: String },
    cartData: [{ 
        _id: false,
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
        size: { 
            type: String
        },
        quantity: { type: Number, default:1, min: 1 },}],
    wishlist: [{
        _id: false,
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' }}],
    orders: [{
        _id: false,
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'order' }}],
    loginCount: {
        type: Number,
        default: 0,
    },
},{minimize:false,versionKey: false})
const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export default userModel