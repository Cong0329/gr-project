
interface HeaderProps {
  title: string;
  onCreateClick: () => void;
  entityName: string;
}

const Header: React.FC<HeaderProps> = ({ title, onCreateClick, entityName }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <button 
        onClick={onCreateClick}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Thêm {entityName}
      </button>
    </div>
  );
};

export default Header;