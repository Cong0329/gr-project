// components/Sidebar/Sidebar.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActivePage } from '../../redux/navigationSlice';
import UserProfile from './UserProfile';
import MenuItem from './MenuItem';
import { menuItems } from './menuItems';
import { RootState } from '../../redux/store';

const Sidebar: React.FC = () => {
  const activePage = useSelector((state:RootState) => state.navigation.activePage);
  const dispatch = useDispatch();

  return (
    <div className="w-64">
      <UserProfile name="NGUYỄN" phone="0362696258" />
      <div className=" mt-5 bg-white rounded-xl">
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            id={item.id}
            icon={item.icon}
            label={item.label}
            active={activePage}
            onClick={(id) => dispatch(setActivePage(id))}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;