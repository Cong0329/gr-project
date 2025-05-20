import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../../../redux/store";
import { useEffect, useState } from "react";
import { fetchBrands } from "../../../../../../redux/brandAsyncThunk";
import { fetchCategories } from "../../../../../../redux/categoryAsyncThunk";
import { fetchMedicalObjects } from "../../../../../../redux/medicalObjectAsyncThunk";
import { fetchIndications } from "../../../../../../redux/indicationAsyncThunk";
import { updateProduct } from "../../../../../../redux/productAsyncThunk";
import CustomSelect from "../AddProduct/Step/CustomSelect";


// interface EditBasicInfoStepProps {
//     formData: ProductFormData["basicInfo"];
//     onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
// }

export const EditBasicInfoStep = () => {
    const { brands } = useSelector((state: RootState) => state.brands);
    const { categories } = useSelector((state: RootState) => state.categories);
    const { medicalObjects } = useSelector((state: RootState) => state.medicalObjects);
    const { indications } = useSelector((state: RootState) => state.indications);
    const { product } = useSelector((state: RootState) => state.products);
    const [initialFormData, setInitialFormData] = useState({});
    const dispatch: AppDispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        dosage_form: '',
        specification: '',
        ingredients: '',
        registration_number: '',
        manufacturer: '',
        quantity: 0,
        category_id: '',
        brand_id: '',
        indication_id: '',
        medical_object_id: '',
        type: '',
        description: '',
    });

    useEffect(() => {
        if (brands.length === 0 && categories.length === 0 && medicalObjects.length === 0 && indications.length === 0) {
            dispatch(fetchBrands());
            dispatch(fetchCategories());
            dispatch(fetchMedicalObjects());
            dispatch(fetchIndications());
        }
    }, [dispatch, brands, categories, medicalObjects, indications]);


    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                code: product.code || '',
                dosage_form: product.dosage_form || '',
                specification: product.specification || '',
                ingredients: product.ingredients || '',
                registration_number: product.registration_number || '',
                manufacturer: product.manufacturer || '',
                quantity: product.quantity || 0,
                category_id: product.category?.id.toString() || '',
                brand_id: product.brand?.id.toString() || '',
                indication_id: product.indication?.id.toString() || '',
                medical_object_id: product.medical_object?.id.toString() || '',
                type: product.type?.toString() || '',
                description: product.description || '',
            });
        }
    }, [product]);

    useEffect(() => {
        if (product) {
            const initial = {
                name: product.name || '',
                code: product.code || '',
                dosage_form: product.dosage_form || '',
                specification: product.specification || '',
                ingredients: product.ingredients || '',
                registration_number: product.registration_number || '',
                manufacturer: product.manufacturer || '',
                quantity: product.quantity || 0,
                category_id: product.category?.id.toString() || '',
                brand_id: product.brand?.id.toString() || '',
                indication_id: product.indication?.id.toString() || '',
                medical_object_id: product.medical_object?.id.toString() || '',
                type: product.type?.toString() || '',
                description: product.description || '',
            };
            setFormData(initial);
            setInitialFormData(initial);
        }
    }, [product]);

    const handleUpdate = () => {
        const updatedFields: any = {};

        Object.keys(formData).forEach((key) => {
            if (formData[key as keyof typeof formData] !== initialFormData[key]) {
                updatedFields[key] = formData[key as keyof typeof formData];
            }
        });

        if (Object.keys(updatedFields).length === 0) {
            alert('Không có thay đổi nào');
            return;
        }

        dispatch(updateProduct({ id: product.id, product: updatedFields }));
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>
            <div>
                <label className="block mb-1 font-medium">Tên sản phẩm *</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, dosage_form: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập số lượng sản phẩm"
                    min={0}
                    required
                />
            </div>
            <CustomSelect
                name="category_id"
                value={formData.category_id?.toString() || ''}
                options={categories.map((category) => ({ value: String(category.id), label: category.name }))}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                label="Danh mục"
                required
            />
            <CustomSelect
                name="brand_id"
                value={formData.brand_id?.toString() || ''}
                onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                options={brands.map((brand) => ({
                    value: String(brand.id), // đảm bảo là string
                    label: brand.name,
                }))}
                label="Thương hiệu"
                required
                placeholder="Chọn thương hiệu..."
            />
            <CustomSelect
                name="indication_id"
                value={formData.indication_id?.toString() || ''}
                onChange={(e) => setFormData({ ...formData, indication_id: e.target.value })}
                options={indications.map((indication) => ({
                    value: String(indication.id), // đảm bảo là string
                    label: indication.name,
                }))}
                label="Chỉ định"
                required
                placeholder="Chọn chỉ định..."
            />
            <CustomSelect
                name="medical_object_id"
                value={formData.medical_object_id?.toString() || ''}
                onChange={(e) => setFormData({ ...formData, medical_object_id: e.target.value })}
                options={medicalObjects.map((medicalObject) => ({
                    value: String(medicalObject.id), // đảm bảo là string
                    label: medicalObject.name,
                }))}
                label="Đối tượng"
                required
                placeholder="Chọn đối tượng..."
            />
            <div>
                <label className="block mb-1 font-medium">Loại thuốc *</label>
                <select
                    name="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mô tả ngắn về sản phẩm"
                    rows={3}
                    required
                ></textarea>
            </div>
            <button className="bg-blue-600 text-white font-medium hover:bg-blue-500 rounded-lg px-4 py-2" onClick={handleUpdate}>
                Cập nhật sản phẩm
            </button>
        </div>
    );
};