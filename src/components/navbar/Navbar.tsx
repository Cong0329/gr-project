import { useState } from 'react';
import logo from '../../assets/logo.png';
import { Search } from './Search';
import { Login } from './Login';
import { Cart } from './Cart';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { Menu, X } from "lucide-react";



export const Navbar = () => {

  const popularSearches: Array<{ id: number; name: string }> = [
    { id: 1, name: 'Canxi' },
    { id: 2, name: 'Sữa rửa mặt' },
    { id: 3, name: 'DHA' },
    { id: 4, name: 'Kem chống nắng' },
    { id: 5, name: 'Dhc' },
    { id: 6, name: 'Thuốc nhỏ mắt' },
  ];
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="text-white pb-5 navbar">
      <div className="container mx-auto flex tb:flex-col justify-between items-center w-4/5 md-lg:w-11/12 ">
        <div className='flex tb:justify-between tb:w-full tb:mt-2'>
          <div className="items-center gap-4 hidden tb:block">
            <button
              className="text-white"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={28} />
            </button>
          </div>
          <Link to="/" className='flex items-center hover:text-white'>
            <img src={logo} alt="logo" className='w-14 h-14 md-lg:w-10 md-lg:h-10' loading='lazy' />
            <div className='m-auto ml-2 '>
              <h1 className='text-2xl font-bold md-lg:text-sm '>Health Pharmacy</h1>
              <p className='text-sm md-lg:text-[10px]'>Your Health, Our Priority</p>
            </div>
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
              className="bg-white w-64 h-full p-4 shadow-lg transform transition-transform ease-in-out duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="text-gray-600 mb-4"
                onClick={() => setMenuOpen(false)}
              >
                <X size={28} />
              </button>
              <ul className="space-y-4 font-medium text-black">
                <li className="p-2 hover:bg-gray-200">Thực phẩm chức năng</li>
                <li className="p-2 hover:bg-gray-200">Dược mỹ phẩm</li>
                <li className="p-2 hover:bg-gray-200">Thuốc</li>
                <li className="p-2 hover:bg-gray-200">Chăm sóc cá nhân</li>
                <li className="p-2 hover:bg-gray-200">Thiết bị y tế</li>
                <li className="p-2 hover:bg-gray-200">Tiêm chủng</li>
              </ul>
            </div>
          </div>
        )}
      </div>

    </nav>
  )
}
