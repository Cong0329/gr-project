import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AddAddressModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [detail, setDetail] = useState("");

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Thêm địa chỉ mới</h2>

          <input type="text" placeholder="Họ và tên" className="w-full p-2 border mb-2"
                 value={name} onChange={(e) => setName(e.target.value)} />
          <input type="text" placeholder="Số điện thoại" className="w-full p-2 border mb-2"
                 value={phone} onChange={(e) => setPhone(e.target.value)} />
          
          <select className="w-full p-2 border mb-2" onChange={(e) => setProvince(e.target.value)}>
            <option>Chọn tỉnh/thành phố</option>
            <option>Gia Lai</option>
            <option>Hồ Chí Minh</option>
          </select>

          <select className="w-full p-2 border mb-2" onChange={(e) => setDistrict(e.target.value)}>
            <option>Chọn quận/huyện</option>
            <option>An Khê</option>
            <option>Chư Sê</option>
          </select>

          <select className="w-full p-2 border mb-2" onChange={(e) => setWard(e.target.value)}>
            <option>Chọn phường/xã</option>
            <option>Phường Tây Sơn</option>
            <option>Phường Ngô Mây</option>
          </select>

          <input type="text" placeholder="Nhập địa chỉ cụ thể" className="w-full p-2 border mb-2"
                 value={detail} onChange={(e) => setDetail(e.target.value)} />

          <div className="flex justify-end mt-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md mr-2">Hủy</button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
              Hoàn tất
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddAddressModal;
