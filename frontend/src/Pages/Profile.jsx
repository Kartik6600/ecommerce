import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import { ShopContext } from "../context/ShopContext.jsx";
const Profile = () => {
    const { backendUrl, token } = useContext(ShopContext);
    const [userData, setUserData] = useState(null);
    const [selectedImage, setSelectedImage] = useState();
    const [showImagePopup, setShowImagePopup] = useState(false);
    const superheroImages = [
        assets.superhero_1,
        assets.superhero_2,
        assets.superhero_3,
        assets.superhero_4,
        assets.superhero_5,
        assets.superhero_6,
        assets.superhero_7,
        assets.superhero_8,
        assets.superhero_9,
        assets.superhero_10,
        assets.superhero_11,
        assets.superhero_12,
        assets.superhero_13,
        assets.superhero_14,
        assets.superhero_15,
        assets.superhero_16,
        assets.superhero_17,
        assets.superhero_18,
        assets.superhero_19,
    ];
    const loadUserData = async () => {
        try {
            if (!token) return;
            const response = await axios.post(`${backendUrl}/api/user/me`, {}, {
                headers: { token }
            });
            if (response.data.success) {
                setUserData(response.data.data);
                if (response.data.data.profileImage) {
                    setSelectedImage(response.data.data.profileImage);
                }
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
        }
    }
    useEffect(() => {
        loadUserData();
    }, [token]);
    const handleImageSelect = async (imageUrl) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const file = new File([blob], 'profile-image.png', { type: blob.type });
            await updateProfileImage(file);
            setSelectedImage(URL.createObjectURL(blob));
            setShowImagePopup(false);
        } catch (error) {
            console.error("Error handling image selection:", error);
        }
    };
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            await updateProfileImage(file);
            setSelectedImage(URL.createObjectURL(file));
            setShowImagePopup(false);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };
    const updateProfileImage = async (imageFile) => {
        try {
            setShowSuccessDialog(true);
            const formData = new FormData();
            formData.append('profileImage', imageFile);
            const response = await axios.post(`${backendUrl}/api/user/update-profile-image`, formData, {
                headers: {
                    token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                loadUserData();
                setTimeout(() => {
                    setShowSuccessDialog(false);
                }, 2000);
            }
        } catch (error) {
            console.error("Failed to update profile image:", error);
        } 
    };
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    const openEditDialog = () => {
        if (!userData) return;
        const [firstName, ...lastParts] = userData.name.split(' ');
        setEditForm({
            firstName: firstName || '',
            lastName: lastParts.join(' ') || '',
            email: userData.email || '',
            phone: userData.phone || ''
        });
        setEditDialogOpen(true);
    };
    const [loading, setLoading] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedName = `${editForm.firstName} ${editForm.lastName}`.trim();
            const response = await axios.post(`${backendUrl}/api/user/update`, {
                name: updatedName,
                email: editForm.email,
                phone: editForm.phone
            }, {
                headers: { token }
            });
            if (response.data.success) {
                setEditDialogOpen(false);
                setShowSuccessDialog(true);
                loadUserData();
                setTimeout(() => {
                    setShowSuccessDialog(false);
                }, 2000);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Update failed!");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className='border-t-2 border-[#FBCFE8] py-10'>
            <div className='flex-1'>
                <div className="flex justify-between text-base sm:text-2xl mb-4">
                    <Title text1={'MY'} text2={'PROFILE'} />
                </div>
                <div className='bg-sky-50 rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6 border-2 border-[#FBCFE8]'>
                    <div className="relative">
                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                className='bg-sky-100 w-28 h-28 rounded-full border-4 border-[#191973] shadow-md cursor-pointer'
                                alt="User"
                                onClick={() => setShowImagePopup(true)}
                            />
                        ) : (
                            <div
                                onClick={() => setShowImagePopup(true)}
                                className="w-28 h-28 flex items-center justify-center rounded-full bg-sky-200 text-[#191973] text-lg font-bold border-2 border-[#191973] mx-auto md:mx-0 cursor-pointer"
                            >
                                {userData?.name?.[0] || 'U'}
                            </div>
                        )}
                        <div className="absolute bottom-0 right-0 bg-[#191973] rounded-full p-1 cursor-pointer" onClick={() => setShowImagePopup(true)}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="white"
                                className="w-5 h-5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                            </svg>
                        </div>
                    </div>
                    {userData ? (
                        <div className='w-full text-center space-y-4'>
                            <div>
                                <p className='text-sm text-gray-500 uppercase'>Name</p>
                                <p className='text-xl font-semibold text-[#191973] '>{userData.name}</p>
                            </div>
                            <div>
                                <p className='text-sm text-gray-500 uppercase'>Email</p>
                                <p className='text-xl text-[#191973]'>{userData.email}</p>
                            </div>
                            <div>
                                <p className='text-sm text-gray-500 uppercase'>Phone</p>
                                <p className='text-xl text-[#191973]'>{userData?.phone ?? "None"}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-lg">Loading user data...</p>
                    )}
                    <button onClick={openEditDialog} className="text-[#191973] hover:text-pink-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            {showImagePopup && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={() => setShowImagePopup(false)}>
                    <div className="p-6 rounded-lg shadow-lg w-[90%] " onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-semibold mb-4 text-yellow-500">Choose Your Avatar</h2>
                        {/* <div className="overflow-x-auto whitespace-nowrap flex gap-4 px-1"> */}
                        <div className="overflow-x-auto whitespace-nowrap flex gap-4 px-1 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                            {superheroImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    className="w-28 h-28 object-cover rounded-full cursor-pointer bg-zinc-100 hover:border-4 hover:border-yellow-500"
                                    alt={`Superhero ${index + 1}`}
                                    onClick={() => handleImageSelect(image)}
                                />
                            ))}
                            <div className="flex-shrink-0">
                                <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center gap-2 text-white hover:text-yellow-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        strokeWidth={1.5} stroke="currentColor" className="size-28">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setShowImagePopup(false)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {editDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <form
                        onSubmit={handleProfileUpdate}
                        className="bg-sky-50 p-6 rounded-lg shadow-lg w-[90%] max-w-md space-y-4"
                    >
                        <h2 className="text-lg font-semibold text-[#101049]">Edit Profile</h2>
                        <div>
                            <label className="block text-sm mb-1 text-[#101049]">First Name</label>
                            <input
                                type="text"
                                value={editForm.firstName}
                                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                className="bg-zinc-100 w-full border border-[#191973] rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1 text-[#101049]">Last Name</label>
                            <input
                                type="text"
                                value={editForm.lastName}
                                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                className="bg-zinc-100 w-full border border-[#191973] rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1 text-[#101049]">Email</label>
                            <input
                                type="email"
                                readOnly
                                value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                className="bg-zinc-300 w-full border border-[#191973] rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1 text-[#101049]">Phone</label>
                            <input
                                type="tel"
                                value={editForm.phone}
                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                className="bg-zinc-100 w-full border border-[#191973] rounded px-3 py-2"
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setEditDialogOpen(false)}
                                className="px-4 py-2 text-gray-700 border border-gray-400 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-sky-300 rounded hover:bg-pink-200 flex items-center justify-center min-w-[100px] border border-[#191973]"
                                disabled={loading}
                            >
                                {loading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8z"></path>
                                    </svg>
                                ) : "Update"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {showSuccessDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-zinc-100 px-6 py-4 rounded-lg shadow-lg text-center space-y-2 max-w-sm w-full">
                        <h3 className="text-green-600 text-lg font-semibold">User updated successfully!</h3>
                        <p className="text-sm text-gray-600">Redirecting to profile...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Profile;