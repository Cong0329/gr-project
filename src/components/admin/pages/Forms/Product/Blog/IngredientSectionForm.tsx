import  { useState } from "react";
import { IngredientTitle, DescriptionType, Instruction } from "./type";

interface Props {
  onSubmit: (section: IngredientTitle) => void;
}

const IngredientSectionForm = ({ onSubmit }: Props) => {
  const [title, setTitle] = useState("");
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<Instruction[]>([]);
  const [tempDesc, setTempDesc] = useState("");
  const [tempName, setTempName] = useState("");
  const [tempValue, setTempValue] = useState("");

  const addDesc = () => {
    setDescriptions([...descriptions, tempDesc]);
    setTempDesc("");
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: tempName, value: tempValue }]);
    setTempName("");
    setTempValue("");
  };

  const handleSubmit = () => {
    onSubmit({
      type: DescriptionType.INGREDIENTS,
      title,
      image: null,
      description: {
        description: descriptions,
        ingredients: ingredients,
      },
    });
    setTitle("");
    setDescriptions([]);
    setIngredients([]);
  };

  return (
    <div className="border p-4 my-2 rounded">
      <h4 className="font-semibold">Thêm phần Thành phần</h4>
      <input
        className="w-full border p-2 my-2 rounded"
        placeholder="Tiêu đề"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Mô tả thành phần */}
      <div className="my-2">
        <input
          className="border p-2 mr-2 rounded"
          placeholder="Mô tả thành phần"
          value={tempDesc}
          onChange={(e) => setTempDesc(e.target.value)}
        />
        <button onClick={addDesc} className="bg-gray-500 text-white px-2 py-1 rounded">+</button>
      </div>
      <ul className="list-disc pl-5 text-sm">
        {descriptions.map((desc, i) => <li key={i}>{desc}</li>)}
      </ul>

      {/* Thành phần cụ thể */}
      <div className="my-2">
        <input
          className="border p-2 mr-2 rounded"
          placeholder="Tên"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
        />
        <input
          className="border p-2 mr-2 rounded"
          placeholder="Giá trị"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
        />
        <button onClick={addIngredient} className="bg-gray-500 text-white px-2 py-1 rounded">+</button>
      </div>
      <ul className="list-disc pl-5 text-sm">
        {ingredients.map((ing, i) => <li key={i}>{ing.name}: {ing.value}</li>)}
      </ul>

      <button className="bg-green-500 text-white px-3 py-1 mt-2 rounded" onClick={handleSubmit}>
        Thêm
      </button>
    </div>
  );
};

export default IngredientSectionForm;
