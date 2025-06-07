import React from 'react';
import { Ingredient } from './types';

interface Props {
  ingredients: Ingredient[];
  onChange: (index: number, field: keyof Ingredient, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

const IngredientList: React.FC<Props> = ({ ingredients, onChange, onAdd, onRemove }) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">Danh sách thành phần</label>
    {ingredients.map((item, index) => (
      <div key={item.id} className="flex items-center mb-2">
        <input
          type="text"
          value={item.name}
          onChange={(e) => onChange(index, 'name', e.target.value)}
          placeholder="Tên thành phần"
          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md"
        />
        <input
          type="text"
          value={item.value}
          onChange={(e) => onChange(index, 'value', e.target.value)}
          placeholder="Giá trị"
          className="w-32 px-3 py-2 border border-gray-300 rounded-r-md"
        />
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="ml-2 p-2 text-red-500 hover:bg-red-100 rounded-md"
        >
          Xóa
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={onAdd}
      className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
    >
      Thêm thành phần
    </button>
  </div>
);

export default IngredientList;
