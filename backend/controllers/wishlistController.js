import userModel from '../models/userModel.js'
const addToWishlist = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const exists = user.wishlist.some(item => 
            item.productId.toString() === itemId
        );
        if (exists) {
            return res.status(400).json({ success: false, message: 'Already in Wishlist' });
        }
        user.wishlist.push({ productId: itemId });
        await user.save();
        res.json({ success: true, message: 'Added to wishlist' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const getUserWishlist = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userId)
            .populate('wishlist.productId');
        res.json({ success: true, wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const updateWishlist = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        if (!userId || !itemId) {
            return res.status(400).json({ success: false, message: 'userId and itemId are required' });
        }
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const wishlist = user.wishlist || [];
        const itemIndex = wishlist.findIndex(
            (item) => item.productId.toString() === itemId
        );
        if (itemIndex > -1) {
            wishlist.splice(itemIndex, 1);
            await userModel.findByIdAndUpdate(userId, { wishlist });
            return res.json({ success: true, message: 'Product removed from wishlist' });
        } else {
            wishlist.push({ productId: itemId });
            await userModel.findByIdAndUpdate(userId, { wishlist });
            return res.json({ success: true, message: 'Product added to wishlist' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export { addToWishlist, updateWishlist, getUserWishlist }