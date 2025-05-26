import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import camera from "../../../../assets/camera.png";
import { updateProfileAdminAPI } from "../../../../redux/userAsyncThunk";

export default function UserMetaCard() {
  const { admin } = useSelector((state: RootState) => state.auth);
  const dispatch:AppDispatch = useDispatch();
  return (
      <div className="p-5 border border-gray-200 rounded-2xl lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full relative">
              {admin?.avatar_url ? (
                <img src={admin?.avatar_url} alt="user" className="w-full h-full object-cover" />
              ) : (
                <img src={camera} alt="camera" className="w-16 h-16 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              )}
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append("avatar", file);
                    dispatch(updateProfileAdminAPI(formData));
                  }
                }}
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 xl:text-left">
                {admin?.name}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 ">
                  {admin?.roles?.[0].name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
