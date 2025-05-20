import React from 'react';
import { Description } from './EditBlog';

interface Props {
  descriptions: Description[];
  onChange: (index: number, text: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

const DescriptionList: React.FC<Props> = ({ descriptions, onChange, onAdd, onRemove }) => (
  <div className="mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2">Danh sách mô tả</label>
    {descriptions.map((desc, index) => (
      <div key={desc.id} className="flex items-center mb-2">
        <input
          type="text"
          value={desc.text}
          onChange={(e) => onChange(index, e.target.value)}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
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
      Thêm mô tả
    </button>
  </div>
);

export default DescriptionList;
