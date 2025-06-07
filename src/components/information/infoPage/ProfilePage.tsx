import { useState } from "react";
import { updateProfileAPI, Profile } from "../../../redux/userAsyncThunk";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
interface ProfilePageProps {
    name: string | null;
    phone: string | null;
    gender: string | null;
}

export const ProfilePage = ({ name, phone, gender }: ProfilePageProps) => {
    const dispatch: AppDispatch = useDispatch();
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState({
        name: name ?? '',
        phone: phone ?? '',
        gender: gender ?? '',
    });

    // Store the original data to compare changes
    const [originalData] = useState({
        name: name ?? '',
        phone: phone ?? '',
        gender: gender ?? '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleEditToggle = () => setIsEdit(!isEdit);

    const handleSubmit = () => {
        // Create an object to hold only changed fields
        const changedFields: Partial<typeof formData> = {};

        // Compare each field with original data
        Object.keys(formData).forEach((key) => {
            const typedKey = key as keyof typeof formData;
            if (formData[typedKey] !== originalData[typedKey]) {
                changedFields[typedKey] = formData[typedKey];
            }
        });

        // Only send data if there are changes
        if (Object.keys(changedFields).length > 0) {
            const sanitizedFields: Profile = {
                name: changedFields.name ?? null,
                phone: changedFields.phone ?? null,
                gender: changedFields.gender ?? null,
              };              
              dispatch(updateProfileAPI(sanitizedFields));
        } else {
            console.log("No changes detected");
        }
        setIsEdit(false);
    };
    const mapGenderToLabel = (gender: string | null | undefined) => {
        switch (gender) {
            case 'MALE':
                return 'Nam';
            case 'FEMALE':
                return 'Nữ';
            case 'OTHER':
                return 'Khác';
            default:
                return 'Thêm thông tin';
        }
    };

    return (
        <div className="bg-white rounded-xl pb-4">
            <h2 className="text-2xl font-bold mb-2 border-b p-4">Thông tin cá nhân</h2>
            {isEdit ? (
                <form className="grid grid-cols-2 mm:grid-cols-1 gap-4 px-4">
                    <div className="mb-4">
                        <label className="text-gray-600 mr-2" htmlFor="name">Họ và tên</label>
                        <input
                            className="border px-2 py-1 rounded-md w-full"
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-gray-600 mr-2" htmlFor="phone">Số điện thoại</label>
                        <input
                            className="border px-2 py-1 rounded-md w-full"
                            type="text"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="text-gray-600 mr-2" htmlFor="gender">Giới tính</label>
                        <select
                            className="border px-2 py-1 rounded-md w-full"
                            id="gender"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="OTHER">Khác</option>
                            <option value="MALE">Nam</option>
                            <option value="FEMALE">Nữ</option>
                        </select>
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-2 gap-4 px-4 mm:grid-cols-1">
                    <div className="mb-4">
                        <div className="text-gray-600">Họ và tên</div>
                        <div className="font-bold">{formData.name}</div>
                    </div>
                    <div className="mb-4">
                        <div className="text-gray-600">Số điện thoại</div>
                        <div className="text-blue-600">{formData.phone || 'Thêm thông tin'}</div>
                    </div>
                    <div className="mb-4">
                        <div className="text-gray-600">Giới tính</div>
                        <div className="text-blue-600">
                            {mapGenderToLabel(formData.gender)}
                        </div>
                    </div>
                </div>
            )}
            <div className="flex gap-4 px-6 mt-4">
                <button
                    className="bg-blue-100 font-semibold text-blue-600 px-6 py-2 rounded-full mm:text-[13px]"
                    onClick={isEdit ? handleSubmit : handleEditToggle}
                >
                    {isEdit ? 'Cập nhật thông tin' : 'Chỉnh sửa thông tin'}
                </button>
                {isEdit && (
                    <button
                        className="bg-gray-100 font-semibold text-gray-600 px-6 py-2 rounded-full mm:text-[13px]"
                        onClick={() => setIsEdit(false)}
                    >
                        Hủy
                    </button>
                )}
            </div>
        </div>
    );
};