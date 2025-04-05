// components/MainContent/MainContent.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { PageId } from './menuItems';
import UserProfile from './UserProfile';


const MainContent: React.FC = () => {
  const activePage = useSelector((state: RootState) => state.navigation.activePage);

  const contentMap: Record<PageId, React.ReactNode> = {
    'personal-info': <UserProfile name="NGUYỄN" phone="0362696258" />,
    'orders': <div>Addresses Content</div>,
    'addresses': <div>Addresses Content</div>,
    'vaccinations': <div>Vaccinations Content</div>,
    'vaccination-orders': <div>Vaccination Orders Content</div>,
    'prescriptions': <div>Prescriptions Content</div>,
    'logout': <div>Logout Content</div>,
  };

  return (
    <div className="flex-1 overflow-auto">
      {contentMap[activePage]}
    </div>
  );
};

export default MainContent;