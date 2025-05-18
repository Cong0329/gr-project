import { useDispatch, useSelector } from "react-redux";
import { ProductFormData } from "../ProductCreationForm";
import { RootState, AppDispatch } from "../../../../../../../redux/store";
import { useEffect } from "react";
import { fetchBrands } from "../../../../../../../redux/brandAsyncThunk";
import { fetchCategories } from "../../../../../../../redux/categoryAsyncThunk";
import { fetchMedicalObjects } from "../../../../../../../redux/medicalObjectAsyncThunk";
import { fetchIndications } from "../../../../../../../redux/indicationAsyncThunk";
import Select from "react-select";
import CustomSelect from "./CustomSelect";

interface BasicInfoStepProps {
  formData: ProductFormData["basicInfo"];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ formData, onChange }) => {
  const { brands } = useSelector((state: RootState) => state.brands);
  const { categories } = useSelector((state: RootState) => state.categories);
  const { medicalObjects } = useSelector((state: RootState) => state.medicalObjects);
  const { indications } = useSelector((state: RootState) => state.indications);
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchBrands());
    dispatch(fetchCategories());
    dispatch(fetchMedicalObjects());
    dispatch(fetchIndications());
  }, [dispatch]);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>
      <div>
        <label className="block mb-1 font-medium">Tên sản phẩm *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onChange}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập tên sản phẩm"
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Mã sản phẩm *</label>
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={onChange}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập mã sản phẩm"
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Dạng bào chế *</label>
        <input
          type="text"
          name="dosage_form"
          value={formData.dosage_form}
          onChange={onChange}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập dạng bào chế"
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Quy cách *</label>
        <input
          type="text"
          name="specification"
          value={formData.specification}
          onChange={onChange}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập quy cách sản phẩm"
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Thành phần *</label>
        <input
          type="text"
          name="ingredients"
          value={formData.ingredients}
          onChange={onChange}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập thành phần sản phẩm"
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Mã số đăng ký *</label>
        <input
          type="text"
          name="registration_number"
          value={formData.registration_number}
          onChange={onChange}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập mã số đăng ký"
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Nhà máy sản xuất *</label>
        <input
          type="text"
          name="manufacturer"
          value={formData.manufacturer}
          onChange={onChange}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập nhà máy sản xuất"
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Số lượng *</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={onChange}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập số lượng sản phẩm"
          min={0}
          required
        />
      </div>
      <CustomSelect
        name="category_id"
        value={formData.category_id}
        options={categories.map((category) => ({ value: category.id, label: category.name }))}
        onChange={onChange}
        label="Danh mục"
        required
      />
      <CustomSelect
        name="brand_id"
        value={formData.brand_id}
        options={brands.map((brand) => ({ value: brand.id, label: brand.name }))}
        onChange={onChange}
        label="Thương hiệu"
        required
      />
      <CustomSelect
        name="indication_id"
        value={formData.indication_id}
        options={indications.map((indication) => ({ value: indication.id, label: indication.name }))}
        onChange={onChange}
        label="Chỉ định"
        required
      />
      <CustomSelect
        name="medical_object_id"
        value={formData.medical_object_id}
        options={medicalObjects.map((medicalObject) => ({ value: medicalObject.id, label: medicalObject.name }))}
        onChange={onChange}
        label="Đối tượng"
        required
      />
      <div>
        <label className="block mb-1 font-medium">Loại thuốc *</label>
        <select
          name="type"
          value={formData.type}
          onChange={onChange}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Chọn danh mục</option>
          <option value="true">Thuốc kê đơn</option>
          <option value="false">Thực phẩm chức năng</option>
        </select>
      </div>
      <div>
        <label className="block mb-1 font-medium">Mô tả ngắn *</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập mô tả ngắn về sản phẩm"
          rows={3}
          required
        ></textarea>
      </div>
    </div>
  );
};