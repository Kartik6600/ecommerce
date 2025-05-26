import React from 'react';
const EditCouponPopup = ({
  editCoupon,
  setEditCoupon,
  originalStartDate,
  handleEditSubmit,
  closeDialog,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <form
        onSubmit={handleEditSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md space-y-4"
      >
        <h2 className="text-lg font-semibold text-[#101049]">Update Coupon</h2>
        <div className="flex justify-between text-[#101049] w-full">
          <span>{editCoupon.name}</span>
          <span>{editCoupon.code}</span>
          <span>{editCoupon.discount}%</span>
        </div>
        <div>
          <label className="block text-sm mb-1 text-[#101049]">Start Date</label>
          <input
            type="date"
            value={editCoupon.start.toLocaleDateString('en-CA')}
            min={originalStartDate?.toLocaleDateString('en-CA')}
            onChange={(e) =>
              setEditCoupon({ ...editCoupon, start: new Date(e.target.value) })
            }
            className="w-full border border-[#191973] rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-[#101049]">Expiry Date</label>
          <input
            type="date"
            value={editCoupon.expiry.toLocaleDateString('en-CA')}
            min={editCoupon.start.toLocaleDateString('en-CA')}
            onChange={(e) =>
              setEditCoupon({ ...editCoupon, expiry: new Date(e.target.value) })
            }
            className="w-full border border-[#191973] rounded px-3 py-2"
            required
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={closeDialog}
            className="px-4 py-2 text-gray-700 border border-gray-400 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#00bfff] text-white rounded hover:bg-[#009acd]"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};
export default EditCouponPopup;