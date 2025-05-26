import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { FiUpload } from 'react-icons/fi'
import { useLocation } from 'react-router-dom'
import { routesConfig } from '../RoutesConfig'
import Loader from '../components/Loader';
const AddProduct = ({ token }) => {
  const location = useLocation()
  const currentRoute = routesConfig.find(route => route.path === location.pathname)
  const title = currentRoute?.label || 'Page'
  const Icon = currentRoute?.icon || null
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])
  const [loading, setLoading] = useState();
  const [availableCategories, setAvailableCategories] = useState([])
  const [availableSubCategories, setAvailableSubCategories] = useState([])
  const [availableSizes, setAvailableSizes] = useState([])
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/filters`, {
          headers: { token },
        })
        if (response.data.success) {
          const { categories, subCategories, sizes } = response.data.filters
          setAvailableCategories(categories)
          setAvailableSubCategories(subCategories)
          setAvailableSizes(sizes)
        } else {
          toast.error(response.data.message)
        }
      } catch (error) {
        toast.error('Failed to load filter options')
      }
    }
    fetchFilters()
  }, [token])
  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true);
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('category', category)
      formData.append('subCategory', subCategory)
      formData.append('bestseller', bestseller)
      formData.append('sizes', JSON.stringify(sizes))
      image1 && formData.append('image1', image1)
      image2 && formData.append('image2', image2)
      image3 && formData.append('image3', image3)
      image4 && formData.append('image4', image4)
      const response = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: { token },
      })
      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setCategory('')
        setSubCategory('')
        setSizes([])
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }
  if (loading) {
    return <Loader message="Adding Product" />;
  }
  return (
    <div className="px-4 md:p-8 py-4 space-y-10 bg-gradient-to-br from-gray-50 to-white min-h-screen mt-10 sm:mt-0">
      <h1 className="text-4xl font-extrabold text-[#191973] mb-2 flex items-center gap-2 border-b pb-2">
        {Icon && <span className="text-pink-500">{Icon}</span>}
        {title}
      </h1>
      <div className="flex flex-col gap-3">
        <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-4">
          <div className="w-full">
            <p className="mb-2 text-[#101049]">Upload Images</p>
            <div className="grid grid-cols-2 sm:flex gap-3 flex-wrap">
              {[image1, image2, image3, image4].map((image, index) => {
                const setImage = [setImage1, setImage2, setImage3, setImage4][index]
                const inputId = `image${index + 1}`
                return (
                  <label htmlFor={inputId} key={index}>
                    {image ? (
                      <img
                        className="w-20 h-20 border border-[#191973] rounded-md object-contain"
                        src={URL.createObjectURL(image)}
                        alt=""
                      />
                    ) : (
                      <div className="w-20 h-20 flex items-center justify-center border border-[#191973] rounded-md text-[#191973]">
                        <FiUpload className="text-2xl" />
                      </div>
                    )}
                    <input
                      onChange={(e) => setImage(e.target.files[0])}
                      type="file"
                      id={inputId}
                      hidden
                    />
                  </label>
                )
              })}
            </div>
          </div>
          <div className="w-full">
            <p className="mb-2 text-[#101049]">Product name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full max-w-[500px] px-3 py-2 border border-[#191973] rounded-md text-[#101049] bg-white"
              type="text"
              placeholder="Type here"
              required
            />
          </div>
          <div className="w-full">
            <p className="mb-2 text-[#101049]">Product description</p>
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              className="w-full max-w-[500px] px-3 py-2 text-[#101049] border border-[#191973] rounded-md bg-white"
              placeholder="Write content here"
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full">
            <div className="flex-1 min-w-[150px]">
              <p className="mb-2 text-[#101049]">Product category</p>
              <input
                list="category-options"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-[#191973] rounded-md bg-white text-[#101049]"
                placeholder="Type or select category"
              />
              <datalist id="category-options">
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
            <div className="flex-1 min-w-[150px]">
              <p className="mb-2 text-[#101049]">Sub category</p>
              <input
                list="subCategory-options"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full px-3 py-2 border border-[#191973] rounded-md bg-white text-[#101049]"
                placeholder="Type or select subcategory"
              />
              <datalist id="subCategory-options">
                {availableSubCategories.map((sub) => (
                  <option key={sub} value={sub} />
                ))}
              </datalist>
            </div>
            <div className="flex-1 min-w-[100px]">
              <p className="mb-2 text-[#101049]">Product price</p>
              <input
                onChange={(e) => setPrice(e.target.value)}
                value={price}
                className="w-full px-3 py-2 border border-[#191973] rounded-md bg-white text-[#101049]"
                type="text"
                placeholder="25"
              />
            </div>
          </div>
          <div className="w-full">
            <p className="mb-2 text-[#101049]">Product Sizes</p>
            <div className="flex flex-wrap gap-3">
              {availableSizes.map((size) => (
                <div
                  key={size}
                  onClick={() =>
                    setSizes((prev) =>
                      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
                    )
                  }
                >
                  <p
                    className={`${sizes.includes(size) ? 'bg-pink-200' : 'bg-[#ccf2ff]'
                      } border border-[#191973] rounded-md px-3 py-1 cursor-pointer text-[#101049]`}
                  >
                    {size}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              onChange={() => setBestseller((prev) => !prev)}
              checked={bestseller}
              type="checkbox"
              id="bestseller"
            />
            <label htmlFor="bestseller" className="text-[#101049]">Add to Bestseller</label>
          </div>
          <button
            type="submit"
            className="w-32 py-3 mt-4 bg-pink-100 text-[#101049] border border-[#191973] rounded-md font-semibold hover:bg-pink-200 active:bg-pink-300 active:text-white"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  )
}
export default AddProduct
