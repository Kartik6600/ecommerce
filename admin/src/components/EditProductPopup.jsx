import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { backendUrl } from '../App';
import { FiUpload } from 'react-icons/fi'
const EditProductPopup = ({ productId, token, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState({});
    const [available, setAvailable] = useState(true);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Men');
    const [subCategory, setSubCategory] = useState('Topwear');
    const [bestseller, setBestseller] = useState(false);
    const [sizes, setSizes] = useState([]);
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [image4, setImage4] = useState(null);
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${backendUrl}/api/product/${productId}`, {
                    headers: { token },
                });
                if (res.data.success) {
                    const p = res.data.product;
                    setProduct(p);
                    setName(p.name || '');
                    setDescription(p.description || '');
                    setPrice(p.price || '');
                    setCategory(p.category || 'Men');
                    setSubCategory(p.subCategory || 'Topwear');
                    setBestseller(p.bestseller || false);
                    setSizes(p.sizes || []);
                    setAvailable(p.available ?? true);
                } else {
                    toast.error('Failed to load product');
                }
            } catch (err) {
                toast.error('Error fetching product');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId, token]);
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('productId', productId);
            formData.append('name', name);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('category', category);
            formData.append('subCategory', subCategory);
            formData.append('bestseller', bestseller);
            formData.append('sizes', JSON.stringify(sizes));
            formData.append('available', available);
            image1 && formData.append('image1', image1);
            image2 && formData.append('image2', image2);
            image3 && formData.append('image3', image3);
            image4 && formData.append('image4', image4);
            const response = await axios.post(`${backendUrl}/api/product/edit`, formData, {
                headers: { token },
            });
            if (response.data.success) {
                toast.success(response.data.message);
                onClose();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };
    const toggleSize = (size) => {
        setSizes((prev) =>
            prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
        );
    };
    if (loading) {
        return (
            <div className='fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50'>
                <div className='bg-white p-6 rounded-lg'>Loading...</div>
            </div>
        );
    }
    return (
        <div className='fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50'>
            <form
                onSubmit={onSubmitHandler}
                className='bg-white p-6 rounded-lg max-w-2xl w-full overflow-y-auto max-h-[90vh]'
            >
                <h2 className='text-xl font-bold text-[#101049] mb-4'>Edit Product</h2>
                <div className='flex gap-2 mb-3'>
                    {[1, 2, 3, 4].map((num) => {
                        const imageState = eval(`image${num}`);
                        const setImage = eval(`setImage${num}`);
                        return (
                            <label key={num} htmlFor={`image${num}`}>
                                {imageState || product?.image?.[num - 1] ? (
                                    <img
                                        className='w-20 h-24 border border-[#191973] rounded-md object-contain'
                                        src={
                                            imageState
                                                ? URL.createObjectURL(imageState)
                                                : product?.image?.[num - 1]
                                        }
                                        alt=''
                                    />
                                ) : (
                                    <div className='w-20 h-24 flex items-center justify-center border border-[#191973] rounded-md text-[#191973]'>
                                        <FiUpload className='text-[2rem]' />
                                    </div>
                                )}
                                <input
                                    onChange={(e) => setImage(e.target.files[0])}
                                    type='file'
                                    id={`image${num}`}
                                    hidden
                                />
                            </label>
                        );
                    })}
                </div>
                <input
                    className='w-full border p-2 mb-2'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Name'
                    required
                />
                <textarea
                    className='w-full border p-2 mb-2'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder='Description'
                    required
                />
                <input
                    className='w-full border p-2 mb-2'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder='Price'
                    type='number'
                    required
                />
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className='w-full border p-2 mb-2'
                >
                    <option value='Men'>Men</option>
                    <option value='Women'>Women</option>
                    <option value='Kids'>Kids</option>
                </select>
                <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className='w-full border p-2 mb-2'
                >
                    <option value='Topwear'>Topwear</option>
                    <option value='Bottomwear'>Bottomwear</option>
                    <option value='Winterwear'>Winterwear</option>
                </select>
                <div className='flex gap-2 mb-2'>
                    {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                        <span
                            key={size}
                            onClick={() => toggleSize(size)}
                            className={`px-3 py-1 border rounded cursor-pointer ${sizes.includes(size) ? 'bg-pink-200' : 'bg-[#ccf2ff]'
                                }`}
                        >
                            {size}
                        </span>
                    ))}
                </div>
                <label className='flex items-center gap-2 mb-2'>
                    <input
                        type='checkbox'
                        checked={bestseller}
                        onChange={() => setBestseller((prev) => !prev)}
                    />
                    <span>Add to Bestseller</span>
                </label>
                <label className='flex items-center gap-2 mb-2'>
                    <input
                        type='checkbox'
                        checked={available}
                        onChange={() => setAvailable((prev) => !prev)}
                    />
                    <span>Mark as Available</span>
                </label>
                <div className='flex gap-2 justify-end'>
                    <button type='button' onClick={onClose} className='px-4 py-2 border rounded-md'>
                        Cancel
                    </button>
                    <button type='submit' className='px-4 py-2 bg-[#00bfff] text-white rounded-md'>
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};
export default EditProductPopup;