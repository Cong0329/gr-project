import { Ingredient } from './types';

interface IngredientItemProps {
  ingredient: Ingredient;
  onRemove: () => void;
}

export const IngredientItem: React.FC<IngredientItemProps> = ({
  ingredient,
  onRemove,
}) => {
  return (
    <div className="flex items-center mb-2">
      <input
        type="text"
        value={ingredient.name}
        placeholder="Tên thành phần"
        className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        value={ingredient.value}
        placeholder="Giá trị"
        className="w-32 px-3 py-2 border-t border-b border-r border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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