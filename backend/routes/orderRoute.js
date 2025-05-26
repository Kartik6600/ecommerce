import express from 'express'
import {verifyStripe, placeOrderCOD,placeOrderQR, orderReceipt,orderRating,placeOrderStripe, allOrders, userOrders,latestOrder, updateStatus} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'
import upload from '../middleware/multer.js'
const orderRouter = express.Router()
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)
orderRouter.post('/cod',authUser,placeOrderCOD)
orderRouter.post('/qr', authUser, upload.single('screenshot'), placeOrderQR)
orderRouter.post('/stripe',authUser,placeOrderStripe)
orderRouter.post('/userorders',authUser,userOrders)
orderRouter.get('/latestorder',authUser,latestOrder)
orderRouter.post('/receipt/:id',authUser,orderReceipt)
orderRouter.post('/rating/:id',authUser,orderRating)
orderRouter.post('/verifyStripe',authUser,verifyStripe)
export default orderRouter