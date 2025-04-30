// components/Sidebar/MenuItem.tsx
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { PageId } from './menuItems';

interface MenuItemProps {
  id: PageId;
  icon: string;
  label: string;
  active: PageId;
  onClick?: (id: string) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ id, icon, label, active, onClick }) => {
  const isActive = active === id;

  if (id === 'logout') {
    return (
      <button
        onClick={() => onClick?.(id)}
        className={`flex items-center w-full px-4 py-4 text-left hover:bg-gray-100 ${
          isActive ? 'text-blue-600 border-l-2 border-blue-600 bg-gray-100' : 'text-gray-700'
        }`}
      >
        <Icon name={icon} />
        <span className={`ml-3 ${isActive ? 'font-medium' : ''}`}>{label}</span>
        <span className="ml-auto">
          <Icon name="chevron-right" />
        </span>
      </button>
    );
  }

  return (
    <Link
      to={`/profile/${id}`}
      className={`flex items-center px-4 py-4 hover:bg-gray-100 ${
        isActive ? 'text-blue-600 border-l-2 border-blue-600 bg-gray-100' : 'text-gray-700'
      }`}
    >
      <Icon name={icon} />
      <span className={`ml-3 ${isActive ? 'font-medium' : ''}`}>{label}</span>
      <span className="ml-auto">
        <Icon name="chevron-right" />
      </span>
    </Link>
  );
};


export default MenuItem;