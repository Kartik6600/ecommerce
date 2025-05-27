import {v2 as cloudinary} from "cloudinary";
import productModel from "../models/productModel.js"
import orderModel from "../models/orderModel.js";
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body 
        const image1 = req.files.image1 &&  req.files.image1[0]
        const image2 = req.files.image2 &&  req.files.image2[0] 
        const image3 = req.files.image3 &&  req.files.image3[0]
        const image4 = req.files.image4 &&  req.files.image4[0]
        const image = [image1,image2,image3,image4].filter((item) => item !== undefined)
        let imagesUrl = await Promise.all(
            image.map(async (item) => { 
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url
            })
        );
        const createdAt = new Date()
        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            available : true,
            createdAt, 
        }
        const product = new productModel(productData);
        await product.save();
        res.status(201).json({ success: true, message: "Product Added" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
const editProduct = async (req, res) => {
    try {
        const {
            productId,
            name,
            description,
            price,
            category,
            subCategory,
            sizes,
            bestseller,
            available
        } = req.body;
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];
        const newImages = [image1, image2, image3, image4].filter(Boolean);
        let imagesUrl = product.image;
        if (newImages.length > 0) {
            imagesUrl = await Promise.all(
                newImages.map(async (file) => {
                    const result = await cloudinary.uploader.upload(file.path, {
                        resource_type: 'image',
                    });
                    return result.secure_url;
                })
            );
        }
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price ? Number(price) : product.price;
        product.category = category || product.category;
        product.subCategory = subCategory || product.subCategory;
        product.bestseller= bestseller === "true" ? true : false,
        product.available= available === "true" ? true : false,
        product.sizes = sizes ? JSON.parse(sizes) : product.sizes;
        product.image = imagesUrl;
        await product.save();
        res.status(200).json({ success: true, message: "Product updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const listProduct = async (req, res) => {
    try {
        const products = await productModel
            .find({ available: { $ne: false } })
            .select('-description -purchaseCount');
        res.json({ success: true, products });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
const listProductAdmin = async (req, res) => {
    try {
        const products = await productModel.find({}).select('-description -createdAt');
        res.json({success:true,products})
    } catch (error) {
        res.json({success:false, message: error.message})
    }
}
const listFilters = async (req, res) => {
    try {
        const [filters] = await productModel.aggregate([
            { $project: { category: 1, subCategory: 1, sizes: 1 } },
            {
                $group: {
                    _id: null,
                    categories: { $addToSet: "$category" },
                    subCategories: { $addToSet: "$subCategory" },
                    sizes: { $push: "$sizes" }
                }
            },
            {
                $project: {
                    _id: 0,
                    categories: 1,
                    subCategories: 1,
                    sizes: { $reduce: { input: "$sizes", initialValue: [], in: { $setUnion: ["$$value", "$$this"] } } }
                }
            }
        ]);
        res.json({ success: true, filters: filters || { categories: [], subCategories: [], sizes: [] } });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
const getProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await productModel.findById(productId).lean();
        if (!product) return res.status(404).json({ error: "Product not found" });
        await productModel.findByIdAndUpdate(productId, { $inc: { viewCount: 1 } });
        const ordersWithProduct = await orderModel.find({ 'items.productId': productId });
        const analysis = [];
        ordersWithProduct.forEach(order => {
            order.items.forEach(item => {
                if (item.productId.toString() === productId) {
                    if (item.rating || item.review) {
                        analysis.push({
                            rating: item.rating ?? null,
                            review: item.review ?? null
                        });
                    }
                }
            });
        });
        product.analysis = analysis;
        res.json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export {addProduct, editProduct, listProduct,listProductAdmin, getProduct, listFilters};