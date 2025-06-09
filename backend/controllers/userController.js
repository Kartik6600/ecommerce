import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js"
import couponModel from '../models/couponModel.js';
import passport from '../config/passport.js';
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {v2 as cloudinary} from "cloudinary";
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
    // return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1m' })
} 
const loginUser = async (req,res) => {
    try {
        const {email,password} = req.body;
        const user = await userModel.findOne({email});
        user.loginCount += 1;
        await user.save();
        if (!user) {
            return res.json({success:false, message:"User doesn't exists"});
        }
         if (user.googleId) {
            return res.json({
                success: false,
                message: "Please login using Google"
            });
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if (isMatch) {
            const token = createToken(user._id)
            res.json({success:true,token})
        }
        else {
            res.json({success:false, message:"Invalid credentials"})
        }
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}
const registerUser = async (req,res) => {
    try {
        const {name, email, password, phonenumber} = req.body;
        const exists = await userModel.findOne({email});
        if (exists){
            return res.json({success:false, message:"User already exists"});
        }
        if (!validator.isEmail(email)) {
            return res.json({success:false, message:"Please enter a valid email"}); 
        }
        if (password.length < 8) {
            return res.json({success:false, message:"Please enter a strong password"}); 
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = new userModel({
            name,
            email,
            password:hashedPassword,
        })
        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true, message:"User created successfully", token})
    } catch (error) {
        res.json({success:false, message:error.message})
    }
};
const adminLogin = async (req,res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else {
            res.json({success:false,message:"Invalid email or password"})
        }
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}
const listUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select('-password');
        res.json({success:true,users})
    } catch (error) {
        res.json({success:false, message: error.message})
    }
}
const getUserDetail = async (req, res) => {
    try {
        const userId=req.body.userId;
        const user = await userModel.findById(userId);
        res.status(200).json({ success: true, data:user});
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid token' });
    }
};
const updateUserDetail = async (req, res) => {
    try {
        const { userId, name, email, phone } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }
        const updateFields = { name, email };
        if (phone !== undefined) {
            updateFields.phone = phone;
        }
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: updatedUser, message: 'User Updated Successfully' });
    } catch (error) {
        console.error("Error updating user details:", error);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
};
const updateProfileImage = async (req, res) => {
    try {
        console.log(req.body)
        const profileImage = req.file;
        const {token} = req.headers;
            const token_decode = jwt.verify(token, process.env.JWT_SECRET)
            const userId = token_decode.id
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }
        const result = await cloudinary.uploader.upload(profileImage.path, {
              resource_type: 'image'
        });
        const updateFields = { profileImage:result.secure_url, };
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateFields,
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, data: updatedUser, message: 'User Updated Successfully' });
    } catch (error) {
        console.error("Error updating user details:", error);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
};
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const newpassword = hashedPassword;
        createToken(newpassword)
        user.password = newpassword;
        await user.save();
        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        res.json({success:false, message:error.message})
    }
};
const dashboard = async (req, res) => {
    try {
        const users = await userModel.find({}).select('-password').populate('cartData.productId wishlist.productId orders.orderId');
        const products = await productModel.find({});
        const coupons = await couponModel.find({});
        res.json({success:true,users,products,coupons})
    } catch (error) {
        res.json({success:false, message: error.message})
    }
}
const googleAuthRedirect = (req, res, next) => {
  const options = {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  };
  passport.authenticate('google', options)(req, res, next);
};
const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { session: false, failureRedirect: '/login' }, (err, user) => {
    if (err || !user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=oauth_failed`);
    }
    const token = createToken(user._id);
    res.redirect(`${process.env.FRONTEND_URL}/oauth-redirect?token=${token}`);
  })(req, res, next);
};
export { loginUser, registerUser,listUsers, adminLogin, googleAuthCallback, googleAuthRedirect, resetPassword ,getUserDetail, updateProfileImage, updateUserDetail,dashboard};