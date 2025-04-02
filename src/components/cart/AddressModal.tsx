import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import AddAddressModal from "./AddAddressModal";

interface Address {
  name: string;
  phone: string;
  address: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (address: Address) => void;
}

const AddressModal: React.FC<Props> = ({ isOpen, onClose, onSelect }) => {
  const [selected, setSelected] = useState(0);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const addresses: Address[] = [
    { name: "Phạm Quốc Nguyên", phone: "0362696258", address: "18/27 Nguyễn Trãi, Phường Tây Sơn, Thị Xã An Khê, Tỉnh Gia Lai" },
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Chọn địa chỉ nhận hàng</h2>
            
            {addresses.map((addr, index) => (
              <div key={index} className="flex items-center p-2 border-b cursor-pointer"
                   onClick={() => setSelected(index)}>
                <FaCheckCircle className={`mr-2 ${selected === index ? "text-blue-500" : "text-gray-300"}`} />
                <div>
                  <p className="font-semibold">{addr.name}</p>
                  <p className="text-sm">{addr.phone}</p>
                  <p className="text-gray-500">{addr.address}</p>
                </div>
              </div>
            ))}

            <button onClick={() => setIsAddingNew(true)} className="text-blue-500 mt-4 block w-full">
              Thêm địa chỉ mới
            </button>

            <div className="flex justify-end mt-4">
              <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md mr-2">Hủy</button>
              <button
                onClick={() => {
                  onSelect(addresses[selected]);
                  onClose();
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddingNew && <AddAddressModal isOpen={isAddingNew} onClose={() => setIsAddingNew(false)} />}
    </>
  );
};

export default AddressModal;
