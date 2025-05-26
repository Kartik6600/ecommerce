import express from 'express'
import { createCoupon, listCoupons, updateCoupon, deleteCoupon ,getCouponByCode} from '../controllers/couponController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'
const couponRouter = express.Router();
couponRouter.post('/create', adminAuth, createCoupon);
couponRouter.get('/list',  adminAuth, listCoupons);
couponRouter.post('/update',  adminAuth, updateCoupon);
couponRouter.delete('/remove',  adminAuth, deleteCoupon);
couponRouter.get('/apply/:code',  authUser, getCouponByCode);
export default couponRouter;