import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import AddAddressModal from "./AddAddressModal"; // Import interface Address từ slice
import { RootState } from "../../redux/store"; // Import RootState
import { selectAddress } from "../../redux/addressSlice"; // Import action từ slice

interface Props {
  isOpen: boolean;
  isEdit: boolean;
  onClose: () => void;
}

const AddressModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const addresses = useSelector((state: RootState) => state.address.addresses);
  const defaultAddress = useSelector((state: RootState) => state.address.selectedAddress);

  const [selectedId, setSelectedId] = useState(defaultAddress?.id || "");
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleSelect = () => {
    if (selectedId) {
      dispatch(selectAddress(selectedId));
    }
    onClose();
  };

  const handleEdit = () => {
    setIsAddingNew(true);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50  flex items-center justify-center">
      <div className="bg-white  rounded-lg shadow-lg w-2/5">
        <div className="border-b mb-2">
          <h2 className="px-6 pt-6 text-lg font-semibold mb-2">{isAddingNew ? "Thêm điểm giao hàng" : "Chọn địa điểm giao hàng"}</h2>
        </div>
        <div className={`${isAddingNew ? "" : "overflow-y-auto max-h-96"}  w-full `}>
          {isAddingNew ? (
            <AddAddressModal
              isOpen={isAddingNew}
              onClose={() => setIsAddingNew(false)}
            />
          ) : (
            addresses.map((address) => (
              <div
                key={address.id}
                className="flex items-center border-b pb-2 px-6 cursor-pointer space-y-1 hover:bg-gray-50"
                onClick={() => setSelectedId(address.id)}
              >
                <FaCheckCircle
                  className={`mr-2 flex-none ${selectedId === address.id ? "text-blue-500" : "text-gray-300"
                    }`}
                />

                {/* Nội dung địa chỉ + Button sửa */}
                <div className="w-full">
                  {/* Nội dung bên trái */}

                  <div className="flex items-center  justify-between">
                    <div className=" space-x-2 ">
                      <span className="font-semibold truncate">{address.name}</span>
                      {address.default && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Mặc định
                        </span>
                      )}
                    </div>
                    {/* Button "Sửa" ở góc phải */}
                    <button className="text-blue-700 hover:underline">Sửa</button>
                  </div>

                  <p className="text-sm">{address.phone}</p>
                  <div className="flex">
                    <p className="text-gray-500 text-sm truncate">
                      {address.street}, {address.ward}, {address.district}, {address.province}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}

        </div>

        {!isAddingNew && (
          <>
            <button
              onClick={() => setIsAddingNew(true)}
              className="text-blue-500 mt-2 px-6 block w-full text-left hover:underline"
            >
              + Thêm địa chỉ mới
            </button>

            <div className="flex justify-end mt-4 gap-2 pr-6 pb-6">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSelect}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                disabled={!selectedId}
              >
                Xác nhận
              </button>
            </div>
          </>
        )}

      </div>

      {
      }
    </div >
  );
};

export default AddressModal;