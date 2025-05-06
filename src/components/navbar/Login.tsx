// import { Link } from "react-router-dom"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { googleLogin } from "../../redux/authSlice";
import { RootState } from "../../redux/store";
import { Link } from "react-router-dom";
import axiosInstance from "../../auth/axiosInstance";


export const Login = () => {
    const backendURL = import.meta.env.VITE_NODEJS_BACKEND_URL;
    const dispatch = useDispatch();
    const { isUserAuthenticated, user} = useSelector((state: RootState) => state.auth);

    const handleGoogleLogin = () => {
        window.location.href = `${backendURL}/auth/google`;
    };
    

    useEffect(() => {
            const fetchUser = async () => {
                console.log("Fetching user..."); // ✅ log

                try {
                    const res = await axiosInstance.get(`/user/me`, {
                        withCredentials: true
                    });

                    if (res.data) {
                        
                            dispatch(googleLogin(res.data));
                        }
                    
                } catch (error) {
                    console.log("Fetch user failed", error);
                }
            };

            fetchUser();
    }, [dispatch]);


    return (
        <>
            {
                isUserAuthenticated  ? (
                    <Link to="/profile" className="flex items-center gap-2">
                        <img src={user?.avatar_url} alt="" className="h-10 w-10 rounded-full" />
                        <span className="text-white font-semibold text-lg">{user?.name?.split(" ").slice(-1)[0]}</span>
                    </Link>
                ) : (
                    <button className="flex items-center justify-center tb:hidden " onClick={handleGoogleLogin} >
                        <svg className="h-5 w-5 fill-white mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" /></svg>
                        <span className="text-white font-semibold text-lg">Đăng nhập</span>
                    </button >
                )
            }
        </>

    )
}
