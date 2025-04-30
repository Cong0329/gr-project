// components/Sidebar/Sidebar.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActivePage } from '../../redux/navigationSlice';
import UserProfile from './UserProfile';
import MenuItem from './MenuItem';
import { menuItems } from './menuItems';
import { RootState } from '../../redux/store';
import axios from 'axios';
import { logout } from '../../redux/authSlice';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const activePage = useSelector((state: RootState) => state.navigation.activePage);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleMenuClick = async (id: string) => {
    if (id === 'logout') {
      try {
        await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/auth/logout`, {}, {
          withCredentials: true,
        });
        dispatch(logout());
        navigate('/'); // chuyển về trang chủ sau khi logout
      } catch (err) {
        console.error('Logout error:', err);
      }
    } else {
      dispatch(setActivePage(id));
    }
  };
  return (
    <div className="w-64">
      <UserProfile name={user?.name?.split(" ").slice(-1)[0]} phone={user?.phone} img={user?.avatar_url} />
      <div className=" mt-5 bg-white rounded-xl">
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            id={item.id}
            icon={item.icon}
            label={item.label}
            active={activePage}
            onClick={() => {
              
                handleMenuClick(item.id);
              
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;