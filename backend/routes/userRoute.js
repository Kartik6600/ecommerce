import express from 'express';
import { loginUser, registerUser, listUsers,adminLogin, resetPassword, getUserDetail, updateUserDetail,updateProfileImage,dashboard} from '../controllers/userController.js';
import authUser from '../middleware/auth.js'
import upload from '../middleware/multer.js'
import adminAuth from '../middleware/adminAuth.js';
import passport from '../config/passport.js';
const userRouter = express.Router();
userRouter.get('/auth/google', googleAuthRedirect);
userRouter.get('/auth/google/callback', googleAuthCallback);
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
userRouter.post('/resetpassword',resetPassword)
userRouter.post('/me',authUser,getUserDetail)
userRouter.get('/list',adminAuth,listUsers);
userRouter.get('/dashboard',adminAuth,dashboard);
userRouter.post('/update',authUser,updateUserDetail)
userRouter.post('/update-profile-image',authUser,upload.single('profileImage'),updateProfileImage)
export default userRouter;