import couponModel from '../models/couponModel.js';
const createCoupon = async (req, res) => {
    try {
        const { name, code, discount, start, expiry } = req.body;
        const startDate = new Date(start);
        startDate.setHours(0, 0, 0, 0);
        const expiryDate = new Date(expiry);
        expiryDate.setHours(23, 59, 59, 999);
        const couponData = {
            name,
            code,
            discount: Number(discount),
            start: startDate,
            expiry: expiryDate,
        };
        const coupon = new couponModel(couponData);
        await coupon.save();
        res.status(201).json({ success: true, message: "Coupon Added" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
const listCoupons = async (req, res) => {
    try {
        const coupons = await couponModel.find({});
        res.status(200).json(coupons);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
const getCouponByCode = async (req, res) => {
    try {
        console.log('Hi');
        const { code } = req.params;
        const coupon = await couponModel.findOne({
            code: { $regex: new RegExp(`^${code}$`, 'i') }
        });
        console.log(coupon);
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }
        const options = {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        };
        const now = new Date().toLocaleString('en-CA', options);
        const start = new Date(coupon.start).toLocaleString('en-CA', options);
        const expiry = new Date(coupon.expiry).toLocaleString('en-CA', options);
        if (now >= start && now <= expiry) {
            coupon.useCount += 1;
            await coupon.save();
            res.set({
                'Cache-Control': 'no-store',
                'Pragma': 'no-cache',
                'Expires': '0',
            });
            return res.status(200).json({ success: true, coupon });
        } else if (now > expiry) {
            res.set({
                'Cache-Control': 'no-store',
                'Pragma': 'no-cache',
                'Expires': '0',
            });
            return res.status(410).json({ success: false, message: "Expired Coupon" });
        } else {
            // message: "Coupon not yet active"
            return res.status(403).json({ success: false, message: "Coupon Not Found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
const updateCoupon = async (req, res) => {
    try {
        const { id, start, expiry } = req.body;
        const startDate = new Date(start);
        startDate.setHours(0, 0, 0, 0);
        const expiryDate = new Date(expiry);
        expiryDate.setHours(23, 59, 59, 999);
        const updatedCouponData = await couponModel.findByIdAndUpdate(
            id,
            { start: startDate, expiry: expiryDate },
            { new: true }
        );
        if (!updatedCouponData) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }
        res.status(200).json({ success: true, message: "Coupon Updated", coupon: updatedCouponData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
const deleteCoupon = async (req, res) => {
    try {
        await couponModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Coupon Removed" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
export { createCoupon, listCoupons, updateCoupon, deleteCoupon, getCouponByCode }