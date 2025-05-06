import React, { useState } from "react";
import { IngredientTitle, DescriptionType, Instruction } from "./type";

interface IngredientDescriptionFormProps {
  onSubmit: (data: IngredientTitle) => void;
}

export const IngredientDescriptionForm: React.FC<IngredientDescriptionFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [descLines, setDescLines] = useState<string[]>([]);
  const [newDesc, setNewDesc] = useState("");
  const [ingredients, setIngredients] = useState<Instruction[]>([]);
  const [newName, setNewName] = useState("");
  const [newValue, setNewValue] = useState("");

  const addDesc = () => {
    if (newDesc.trim()) {
      setDescLines([...descLines, newDesc]);
      setNewDesc("");
    }
  };

  const removeDesc = (i: number) => {
    setDescLines(descLines.filter((_, idx) => idx !== i));
  };

  const addIngredient = () => {
    if (newName && newValue) {
      setIngredients([...ingredients, { name: newName, value: newValue }]);
      setNewName("");
      setNewValue("");
    }
  };

  const removeIngredient = (i: number) => {
    setIngredients(ingredients.filter((_, idx) => idx !== i));
  };

  return (
    <div className="space-y-2">
      <input className="border p-1 w-full" placeholder="Tiêu đề" value={title} onChange={(e) => setTitle(e.target.value)} />

      <div className="space-y-1">
        <label className="font-medium">Mô tả dòng:</label>
        <div className="flex space-x-2">
          <input className="border p-1 flex-1" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
          <button className="bg-blue-500 text-white px-2 rounded" onClick={addDesc}>Thêm</button>
        </div>
        <ul className="list-disc pl-5">
          {descLines.map((line, i) => (
            <li key={i} className="flex justify-between items-center">
              {line}
              <button className="text-red-500" onClick={() => removeDesc(i)}>X</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-1">
        <label className="font-medium">Thành phần:</label>
        <div className="flex space-x-2">
          <input className="border p-1 flex-1" placeholder="Tên" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <input className="border p-1 flex-1" placeholder="Giá trị" value={newValue} onChange={(e) => setNewValue(e.target.value)} />
          <button className="bg-blue-500 text-white px-2 rounded" onClick={addIngredient}>Thêm</button>
        </div>
        <ul className="list-disc pl-5">
          {ingredients.map((item, i) => (
            <li key={i} className="flex justify-between items-center">
              {item.name}: {item.value}
              <button className="text-red-500" onClick={() => removeIngredient(i)}>X</button>
            </li>
          ))}
        </ul>
      </div>

      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={() => {
          if (!title.trim() || !Array.isArray(ingredients) || ingredients.length === 0 || !Array.isArray(descLines) || descLines.length === 0) {
            return;
          }
          onSubmit({
            type: DescriptionType.INGREDIENTS,
            title,
            image: null,
            url: null,
            descriptions: { description: descLines, ingredients },
          });
        }}
      >
        Thêm Thành phần
      </button>
    </div>
  );
};