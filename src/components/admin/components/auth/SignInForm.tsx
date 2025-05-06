import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLoginAPI } from "../../../../redux/userAsyncThunk";
import { lockVerify, vefify } from "../../../../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import { RootState } from "../../../../redux/store";
import logo from "../../../../assets/logo.png";
import Label from "../form/Label";
import Checkbox from "../form/input/Checkbox";

export interface SignInForm {
  email: string;
  password: string;
}




export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, verify } = useSelector((state: RootState) => state.auth);


  const [formData, setFormData] = useState<SignInForm>({
    email: "",
    password: ""
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(adminLoginAPI(formData));
    setFormData({
      email: "",
      password: ""
    });

  };
  const [isChecked, setIsChecked] = useState(false);




  useEffect(() => {
    if (status === "succeeded") {
      navigate('/admin/verify');
    }
  }, [status, navigate, dispatch]);


  return (
    <>
      <div className="flex flex-col h-full w-2/3   border bg-white rounded-r-3xl">

        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm sm:text-title-md">
                Sign In
              </h1>
              <p className="text-sm text-gray-500 ">
                Enter your email and password to sign in!
              </p>
            </div>
            <div>

              <Link to="/" className="flex items-center justify-center gap-2 border rounded-lg p-2 hover:bg-gray-100">
                <img src={logo} alt="logo" className="h-14 w-14" />
                <p className="text-4xl font-semibold text-gray-800">Heathy Pharmacy</p>
              </Link>

              <div className="relative py-3 sm:py-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 "></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="p-2 text-gray-400 bg-white  sm:px-5 sm:py-2">
                    With
                  </span>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <Label>
                      Email <span className="text-error-500">*</span>{" "}
                    </Label>
                    <input type="text" placeholder="info@gmail.com" className="border-2 rounded-lg px-4 py-2 w-full" value={formData.email} onChange={handleChange} name="email" />
                  </div>
                  <div>
                    <Label>
                      Password <span className="text-error-500">*</span>{" "}
                    </Label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} placeholder="********" className="border-2 rounded-lg px-4 py-2 w-full" value={formData.password} onChange={handleChange} name="password" />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showPassword ? (
                          <EyeIcon className="fill-gray-500 size-5" />
                        ) : (
                          <EyeCloseIcon className="fill-gray-500  size-5" />
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Checkbox checked={isChecked} onChange={setIsChecked} />
                      <span className="block font-normal text-gray-700 text-theme-sm ">
                        Keep me logged in
                      </span>
                    </div>
                    <Link
                      to="/reset-password"
                      className="text-sm text-brand-500 hover:text-brand-600 "
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <button type="submit" className="bg-blue-600 text-white w-full px-4 py-2 rounded-lg font-semibold">
                    Login
                  </button>
                </div>

              </form>

              <div className="mt-5">
                <p className="text-sm font-normal text-center text-gray-700  sm:text-start">
                  Don&apos;t have an account? {""}
                  <Link
                    to="/signup"
                    className="text-brand-500 hover:text-brand-600 "
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {status === "loading" &&
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-white text-sm">Đang tải...</p>
          </div>
        </div>
      }
    </>

  );
}
