import express from 'express'
import { addToWishlist, updateWishlist, getUserWishlist } from '../controllers/wishlistController.js'
import authUser from '../middleware/auth.js'
const wishlistRouter = express.Router()
wishlistRouter.post('/get',authUser, getUserWishlist)
wishlistRouter.post('/add',authUser, addToWishlist)
wishlistRouter.post('/update',authUser, updateWishlist)
export default wishlistRouter