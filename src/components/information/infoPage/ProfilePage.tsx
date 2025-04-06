import { useState } from "react";

interface ProfilePageProps {
    name: string;
    phone: string;
    gender: string | null;
    birth: string | null;
}

export const ProfilePage = ({ name, phone, gender, birth }: ProfilePageProps) => {


    const [isEdit, setIsEdit] = useState(false);

    const handleEdit = () => {
        setIsEdit(!isEdit);
    };


    return (
        <div className=" bg-white rounded-xl pb-4">
            <h2 className="text-2xl font-bold mb-2 border-b p-4">Thông tin cá nhân</h2>
            {isEdit ? (
                <form className="grid grid-cols-2 gap-4 px-4">
                    <div className="mb-4">
                        <label className="text-gray-600 mr-2" htmlFor="name">Họ và tên</label>
                        <input className="border px-2 py-1 rounded-md" type="text" id="name" defaultValue={name} />
                    </div>
                    <div className="mb-4">
                        <label className="text-gray-600 mr-2" htmlFor="phone">Số điện thoại</label>
                        <input className="border px-2 py-1 rounded-md" type="text" id="phone" defaultValue={phone} />
                    </div>
                    <div className="mb-4">
                        <label className="text-gray-600 mr-2" htmlFor="gender">Giới tính</label>
                        <select className="border px-2 py-1 rounded-md" id="gender" defaultValue={gender ?? ''}>
                            <option value="">Thêm thông tin</option>
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Khác">Khác</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="text-gray-600 mr-2" htmlFor="birth">Ngày sinh</label>
                        <input className="border px-2 py-1 rounded-md" type="date" id="birth" defaultValue={birth ?? ''} />
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-2 gap-4 px-4">
                    <div className="mb-4">
                        <div className="text-gray-600">Họ và tên</div>
                        <div className="font-bold">{name}</div>
                    </div>
                    <div className="mb-4">
                        <div className="text-gray-600">Số điện thoại</div>
                        <div className="font-bold">{phone}</div>
                    </div>
                    <div className="mb-4">
                        <div className="text-gray-600">Giới tính</div>
                        <div className="text-blue-600">{gender || 'Thêm thông tin'}</div>
                    </div>
                    <div className="mb-4">
                        <div className="text-gray-600">Ngày sinh</div>
                        <div className="text-blue-600">{birth || 'Thêm thông tin'}</div>
                    </div>
                </div>
            )}

            <button className="mx-6 bg-blue-100 font-semibold text-blue-600 px-6 py-2 rounded-full" onClick={handleEdit}>
                {isEdit ? 'Cập nhật thông tin' : 'Chỉnh sửa thông tin'}
            </button>
            {isEdit && (
                <button className="mx-6 bg-blue-100 font-semibold text-blue-600 px-6 py-2 rounded-full" onClick={() => setIsEdit(false)}>
                    Hủy
                </button>
            )}
        </div>
    );
};