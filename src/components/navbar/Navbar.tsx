import { useState } from 'react';
import logo from '../../assets/logo-web2.svg';
import webLogo from '../../assets/logo-web.svg'
import Search from './Search';
import { Login } from './Login';
import { Cart } from './Cart';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { logout } from '../../redux/authSlice';
import axios from 'axios';


export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const popularSearches: Array<{ id: number; name: string }> = [
    { id: 1, name: 'Canxi' },
    { id: 2, name: 'Sữa rửa mặt' },
    { id: 3, name: 'DHA' },
    { id: 4, name: 'Kem chống nắng' },
    { id: 5, name: 'Dhc' },
    { id: 6, name: 'Thuốc nhỏ mắt' },
  ];
  const [menuOpen, setMenuOpen] = useState(false);
  const backendURL = import.meta.env.VITE_NODEJS_BACKEND_URL;
  const handleGoogleLogin = () => {
    window.location.href = `${backendURL}/auth/google`;
  };
  const { user } = useSelector((state: RootState) => state.auth);
  const handleLogoutClick = async () => {
    if (user?.id) {
      try {
        await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/auth/logout`, {}, {
          withCredentials: true,
        });
        dispatch(logout());
        setMenuOpen(false);
        navigate('/'); // chuyển về trang chủ sau khi logout
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
  };

  return (
    <nav className="text-white pb-5 navbar ">
      <div className="container mx-auto flex tb:flex-col justify-between items-center w-4/5 md-lg:w-11/12 tb:w-11/12 ">
        <div className='flex tb:justify-between items-center tb:w-full tb:mt-2'>
          <div className="items-center gap-4 hidden tb:block">
            <button
              className="text-white"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={28} />
            </button>
          </div>
          <Link to="/" className='flex items-center hover:text-white mt-2 '>
            <img src={webLogo} alt="logo" className='w-[250px]  md-lg:w-[150px] tb:h-[80px]  ml:h-[60px]' loading='lazy' />
            {/* <div className='m-auto ml-2 '>
              <h1 className='text-2xl font-bold md-lg:text-sm ml:text-[17px] '>Health Pharmacy</h1>
              <p className='text-sm md-lg:text-[10px] ml:text-[10px]'>Your Health, Our Priority</p>
            </div> */}
          </Link>
          <div className='tb:block hidden'>
            <Cart />
          </div>
        </div>
        <div className='w-1/2 mt-10 tb:w-full tb:mt-2'>
          <div className='w-full h-12 flex'>
            <Search />
          </div>
          <div className='flex flex-wrap justify-center mt-2 tb:hidden'>
            {popularSearches.map((item: { id: number; name: string }) => (
              <button key={item.id} className='bg-blue-200 text-blue-800 rounded-full px-2 py-1 items-center text-sm font-semibold mr-2 mb-2 md-lg:text-[10px] md-lg:mr-1 md-lg:mb-1'>
                {item.name}
              </button>
            ))}
          </div>
        </div>
        <div className='flex space-x-10 tb:hidden'>
          <Login />
          <Cart />
        </div>

        {/* Sidebar menu cho Mobile */}
        {menuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setMenuOpen(false)}>
            <div
              className="bg-white w-64 h-full shadow-lg transform transition-transform ease-in-out duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className='flex justify-end p-4 py-2  border-b border-gray-200 '>
                <img src={logo} alt="logo" className=' w-[200px]   ] ml:h-[60px]' loading='lazy' />
                <h1 className='text-lg font-bold md-lg:text-sm ml:text-[17px] text-white tb:hidden ml:block '>Viet Mart</h1>
                <button
                  className="text-gray-600 mb-4"
                  onClick={() => setMenuOpen(false)}
                >
                  <X size={28} />
                </button>
              </div>
              <div className='bg-blue-700 px-4 py-2 flex items-center justify-between'>
                {user?.id ? (
                  <Login />
                ) : (
                  <button className="flex items-center justify-center border border-white rounded-full px-2 py-1 " onClick={handleGoogleLogin} >
                    <svg className="h-5 w-5 fill-white mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" /></svg>
                    <span className="text-white font-semibold text-lg">Đăng nhập</span>
                  </button >
                )}

                {user?.id && (
                  <button onClick={handleLogoutClick} className='border border-white rounded-full px-2 py-1 '>Đăng xuất</button>
                )}

              </div>

              <ul className="space-y-4 font-medium text-black px-4 py-2">
                <li className="p-2 hover:bg-gray-200"><Link to="/profile/personal-info">Thông tin cá nhân</Link></li>
                <li className="p-2 hover:bg-gray-200"><Link to="/profile/orders">Đơn hàng của tôi</Link></li>
                <li className="p-2 hover:bg-gray-200"><Link to="/profile/addresses">Quản lý địa chỉ số</Link></li>
                <li className="p-2 hover:bg-gray-200"><Link to="/profile/health-check">Lịch khám</Link></li>
                <li className="p-2 hover:bg-gray-200"><Link to="/profile/chat">Tin nhắn</Link></li>
              </ul>
            </div>
          </div>
        )}
      </div>

    </nav>
  )
}
