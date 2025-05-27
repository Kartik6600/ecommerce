import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { backendUrl } from '../App';
import { FiUpload } from 'react-icons/fi';

const EditProductPopup = ({ productId, token, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({});
  const [available, setAvailable] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableSubCategories, setAvailableSubCategories] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/filters`, {
          headers: { token },
        });
        if (response.data.success) {
          const { categories, subCategories, sizes } = response.data.filters;
          setAvailableCategories(categories);
          setAvailableSubCategories(subCategories);
          setAvailableSizes(sizes);
        } else {
          toast.error(response.data.message);
        }
      } catch {
        toast.error('Failed to load filter options');
      }
    };
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
          setCategory(p.category || '');
          setSubCategory(p.subCategory || '');
          setBestseller(p.bestseller || false);
          setSizes(p.sizes || []);
          setAvailable(p.available ?? true);
        } else {
          toast.error('Failed to load product');
        }
      } catch {
        toast.error('Error fetching product');
      } finally {
        setLoading(false);
      }
    };
    fetchFilters();
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
      if (image1) formData.append('image1', image1);
      if (image2) formData.append('image2', image2);
      if (image3) formData.append('image3', image3);
      if (image4) formData.append('image4', image4);
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
        <div className='flex gap-2 mb-3 flex-wrap'>
          {[1, 2, 3, 4].map((num) => {
            const imageState = eval(`image${num}`);
            const setImage = eval(`setImage${num}`);
            return (
              <label key={num} htmlFor={`image${num}`}>
                {imageState || product?.image?.[num - 1] ? (
                  <img
                    className='w-20 h-24 border border-[#191973] rounded-md object-contain'
                    src={imageState ? URL.createObjectURL(imageState) : product?.image?.[num - 1]}
                    alt=''
                  />
                ) : (
                  <div className='w-20 h-24 flex items-center justify-center border border-[#191973] rounded-md text-[#191973]'>
                    <FiUpload className='text-2xl' />
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
          placeholder='Product Name'
          required
        />
        <textarea
          className='w-full border p-2 mb-2'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Product Description'
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
        <input
          list='category-options'
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className='w-full border p-2 mb-2'
          placeholder='Category'
        />
        <datalist id='category-options'>
          {availableCategories.map((cat) => (
            <option key={cat} value={cat} />
          ))}
        </datalist>
        <input
          list='subCategory-options'
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          className='w-full border p-2 mb-2'
          placeholder='Subcategory'
        />
        <datalist id='subCategory-options'>
          {availableSubCategories.map((sub) => (
            <option key={sub} value={sub} />
          ))}
        </datalist>
        <div className='flex gap-2 flex-wrap mb-2'>
          {availableSizes.map((size) => (
            <span
              key={size}
              onClick={() => toggleSize(size)}
              className={`px-3 py-1 border rounded cursor-pointer ${sizes.includes(size) ? 'bg-pink-200' : 'bg-[#ccf2ff]'}`}
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
        <label className='flex items-center gap-2 mb-4'>
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
            Update
          </button>
        </div>
      </form>
    </div>
  );
};
export default EditProductPopup;