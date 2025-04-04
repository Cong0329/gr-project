import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { addAddressAPI, getAddressById, updateAddressAPI, deleteAddressAPI } from "../../redux/addressAsyncThunk";
import { CustomSelect } from "./CustomSelect";
import {ModalDelete }from "./ModalDelete";

interface Props {
  isOpen: boolean;
  isEdit: boolean;
  selectedEdit: string;
  onClose: () => void;
}

interface Province {
  code: string;
  name: string;
}

interface District extends Province {
  province_code: string;
}

interface Ward extends Province {
  district_code: string;
}

interface Address {
  name: string,
  phone: string,
  province: string,
  ward: string,
  district: string,
  street: string,
  type: string,
  default: boolean
}


const AddAddressModal: React.FC<Props> = ({ isOpen, onClose, isEdit, selectedEdit }) => {
  const dispatch = useDispatch();
  const address = useSelector((state: RootState) => state.address.isEdit);
  const [formData, setFormData] = useState<Address>({
    name: "",
    phone: "",
    street: "",
    province: "",
    district: "",
    ward: "",
    type: "nhà",
    default: false
  });



  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [isDelete, setIsDelete] = useState(false);


  useEffect(() => {
    if (isOpen) {
      // Load provinces khi mở modal
      fetch("https://provinces.open-api.vn/api/p/")
        .then(res => res.json())
        .then(setProvinces);
    }
  }, [isOpen]);

  // Xử lý riêng cho chế độ chỉnh sửa
  useEffect(() => {
    if (isOpen && isEdit && selectedEdit) {
      // Chỉ dispatch khi có selectedEdit hợp lệ
      dispatch(getAddressById(selectedEdit));
    }
  }, [isOpen, isEdit, selectedEdit, dispatch]);

  // Cập nhật form data khi address thay đổi
  useEffect(() => {
    if (isEdit && address) {
      setFormData(address);
      loadInitialData(address);
    }
  }, [address, isEdit]);

  // Reset form khi mở modal thêm mới
  useEffect(() => {
    if (isOpen && !isEdit) {
      setFormData({
        name: "",
        phone: "",
        street: "",
        province: "",
        district: "",
        ward: "",
        type: "nhà",
        default: false
      });
      setDistricts([]);
      setWards([]);
    }
  }, [isOpen, isEdit]);

  const loadInitialData = async (addr: Address) => {
    // Load districts
    const province = provinces.find(p => p.name === addr.province);
    if (province) {
      const districtsRes = await fetch(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`);
      const districtsData = await districtsRes.json();
      setDistricts(districtsData.districts);

      // Load wards
      const district = districtsData.districts.find((d: District) => d.name === addr.district);
      if (district) {
        const wardsRes = await fetch(`https://provinces.open-api.vn/api/d/${district.code}?depth=2`);
        const wardsData = await wardsRes.json();
        setWards(wardsData.wards);
      }
    }
  };

  const handleTypeChange = (type: string) => {
    setFormData(prev => ({ ...prev, type }));
  };

  const handleDefaultChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isDefault = e.target.checked;
    setFormData(prev => ({ ...prev, default: isDefault }));
  };




  const handleProvinceSelect = (province: Province | null) => {
    if (!province) {
      setFormData(prev => ({
        ...prev,
        province: "",
        district: "",
        ward: ""
      }));
      setDistricts([]);
      setWards([]);
      return;
    }
    setFormData(prev => ({
      ...prev,
      province: province?.name || "",
      district: "", // Reset district
      ward: ""      // Reset ward
    }));
    setDistricts(province ? province.districts : []);
    setWards([]);

    fetch(`https://provinces.open-api.vn/api/p/${province.code}?depth=2`)
      .then(res => res.json())
      .then(data => setDistricts(data.districts));
  };

  const handleDistrictSelect = (district: District | null) => {
    if (!district) {
      setFormData(prev => ({ ...prev, district: "", ward: "" }));
      setWards([]);
      return;
    }
    setFormData(prev => ({
      ...prev,
      district: district?.name || "",
      ward: "" // Reset ward
    }));
    setWards(district ? district.wards : []);

    fetch(`https://provinces.open-api.vn/api/d/${district.code}?depth=2`)
      .then(res => res.json())
      .then(data => setWards(data.wards));
  };

  const handleWardSelect = (ward: Ward | null) => {
    if (!ward) {
      setFormData(prev => ({ ...prev, ward: "" }));
      return;
    }
    setFormData(prev => ({
      ...prev,
      ward: ward?.name || ""
    }));
  };

  const handleSubmit = () => {
    if (isEdit && address) {
      // Tạo object chỉ chứa các trường thay đổi
      const updatedFields = getChangedFields(address, formData);
      dispatch(updateAddressAPI({
        id: address.id,
        updatedFields, 
      }));
    } else {
      const newAddress = {
        ...formData,
        id: Date.now().toString()
      };
      dispatch(addAddressAPI(newAddress));
    }
    onClose();
  };

  const getChangedFields = (original: Address, updated: Address) => {
    const changes: Partial<Address> = {};
    (Object.keys(updated) as (keyof Address)[]).forEach(key => {
      if (updated[key] !== original[key]) {
        changes[key] = updated[key];
      }
    });
    return changes;
  };

  const handleDelete = () => {
    dispatch(deleteAddressAPI(selectedEdit));
    onClose();
  }


  if (!isOpen) return null;

  return (
    <div className="px-6  ">


      <div className="space-y-3">
        <label htmlFor="name">Thông tin người nhận</label>
        <input
          type="text"
          placeholder="Họ và tên"
          className="w-full p-2 border rounded"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        />

        <input
          type="tel"
          placeholder="Số điện thoại"
          className="w-full p-2 border rounded"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
        />
        <p>Địa chỉ nhận hàng</p>
        <CustomSelect
          options={provinces}
          placeholder="Chọn tỉnh/thành phố"
          onSelect={handleProvinceSelect}
          value={formData.province}
        />

        {districts.length > 0 && (
          <CustomSelect
            options={districts}
            placeholder="Chọn quận/huyện"
            onSelect={handleDistrictSelect}
            value={formData.district}
          />
        )}

        {wards.length > 0 && (
          <CustomSelect
            options={wards}
            placeholder="Chọn phường/xã"
            onSelect={handleWardSelect}
            value={formData.ward}
          />
        )}

        <input
          type="text"
          placeholder="Số nhà, tên đường *"
          className="w-full p-2 border rounded"
          value={formData.street}
          onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
        />

        <div className="border p-2 rounded">
          <label className="block text-sm font-medium mb-2">Loại địa chỉ</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="addressType"
                value="home"
                checked={formData.type === "nhà"}
                onChange={() => handleTypeChange("nhà")}
              />
              <span>Nhà riêng</span>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="addressType"
                value="office"
                checked={formData.type === "công ty"}
                onChange={() => handleTypeChange("công ty")}
              />
              <span>Công ty</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="defaultAddress"
            checked={formData.default}
            onChange={handleDefaultChange}
            className="w-4 h-4"
          />
          <label htmlFor="defaultAddress" className="text-sm">
            Đặt làm địa chỉ mặc định
          </label>
        </div>
        {isEdit && (
          <button onClick={() => setIsDelete(true)} className="flex justify-center items-center w-full text-red-500">
            Xóa địa chỉ
          </button>
        )}
      
      </div>
      {isDelete && (
          <ModalDelete
            message="Bạn có chắc chắn muốn xóa địa chỉ này?"
            onClose={() => setIsDelete(false)}
            onDelete={handleDelete}
          />
        )}
      <div className="flex justify-end gap-2 my-4 ">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Hủy
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2  bg-blue-500 text-white rounded hover:bg-blue-600
              disabled:opacity-50"
          disabled={!formData.name || !formData.phone || !formData.province ||
            !formData.district || !formData.ward || !formData.street}
        >
          {isEdit ? "Cập nhật" : "Hoàn tất"}
        </button>
      </div>
    </div>
  );
};

export default AddAddressModal;