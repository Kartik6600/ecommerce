import userModel from '../models/userModel.js'
const addToCart = async (req, res) => {
    try {
        const { userId, itemId, size } = req.body;
        if (!userId || !itemId || !size) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const existingCartItem = user.cartData.find(item =>
            item.productId?.toString() === itemId && item.size === size
        );
        if (existingCartItem) {
            existingCartItem.quantity += 1;
        } else {
            user.cartData.push({ productId: itemId, size, quantity: 1 });
        }
        await user.save();
        res.json({ success: true, message: 'Added to cart', cartData: user.cartData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    const user = await userModel.findById(userId);
    if (!user) throw new Error("User not found");
    const cartIndex = user.cartData.findIndex(item =>
      item.productId.toString() === itemId && item.size === size
    );
    if (cartIndex === -1) throw new Error("Item not found");
    if (quantity === 0) {
      user.cartData.splice(cartIndex, 1);
    } else {
      user.cartData[cartIndex].quantity = quantity;
    }
    await user.save();
    await user.populate('cartData.productId');
    res.json({
      success: true,
      message: quantity === 0 ? 'Item removed from cart' : 'Cart updated',
      cartData: user.cartData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getUserCart = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userId)
            .populate('cartData.productId');
        const filteredCart = user.cartData.filter(item => item.productId?.available !== false);
        res.json({ success: true, cartData: filteredCart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const getUserCart2 = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userId)
            .populate('cartData.productId');
        res.json({ success: true, cartData: user.cartData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export { addToCart, updateCart, getUserCart }