import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../redux/store";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { updateProfileAdminAPI } from "../../../../redux/userAsyncThunk";


export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [showPassword, setShowPassword] = useState(false);
  const { admin } = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: admin?.name || '',
    phone: admin?.phone || '',
    password: '',
    gender: admin?.gender || '',
  });

  // Đồng bộ lại khi admin thay đổi
  useEffect(() => {
    setFormData({
      name: admin?.name || '',
      phone: admin?.phone || '',
      password: '',
      gender: admin?.gender || '',
    });
  }, [admin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle save logic here
    if (formData.name.trim() && formData.phone.trim()) {
      const formDataUpdate = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key as keyof typeof formData]) {
          formDataUpdate.append(key, formData[key as keyof typeof formData]);
        }
      });

      dispatch(updateProfileAdminAPI(formDataUpdate));
      closeModal();
    }
  };
  return (
    <div className="p-5 border border-gray-200 rounded-2xl  lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 ">
                Tên
              </p>
              <p className="text-sm font-medium text-gray-800 ">
                {admin?.name}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 ">
                Địa chỉ email
              </p>
              <p className="text-sm font-medium text-gray-800 ">
                {admin?.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500">
                Số điện thoại
              </p>
              <p className="text-sm font-medium text-gray-800 ">
                {admin?.phone}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 ">
                Giới tính
              </p>
              <p className="text-sm font-medium text-gray-800 ">
                {admin?.gender === "MALE" ? "Nam" : "Nữ"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Chỉnh sửa
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 ">
              Chỉnh sửa thông tin
            </h4>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[320px]  px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800  lg:mb-6">
                  Thông tin cá nhân
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Tên</Label>
                    <Input type="text" value={formData.name} onChange={handleChange} name="name" />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Mật khẩu</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>


                  <div className="col-span-2 lg:col-span-1">
                    <Label>Số điện thoại</Label>
                    <Input type="text" value={formData.phone} onChange={handleChange} name="phone" />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Giới tính</Label>
                    <select
                      value={formData?.gender}
                      onChange={handleChange}
                      name="gender"
                      className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2  justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Đóng
              </Button>
              <Button size="sm" onClick={handleSave} variant="primary">
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
