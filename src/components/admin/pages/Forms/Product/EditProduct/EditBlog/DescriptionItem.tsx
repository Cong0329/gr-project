import { Description } from './types';
import { Input } from './Input';

interface DescriptionItemProps {
  description: Description;
  onRemove: () => void;
}

export const DescriptionItem: React.FC<DescriptionItemProps> = ({
  description,
  onRemove,
}) => {
  return (
    <div className="flex items-center mb-2">
      <Input
        value={description.text}
        onChange={()=> {}}
        className="flex-grow mb-0"
      />
      <button
        type="button"
        onClick={onRemove}
        className="ml-2 p-2 text-red-500 hover:bg-red-100 rounded-md"
      >
        Xóa
      </button>
    </div>
  );
};
