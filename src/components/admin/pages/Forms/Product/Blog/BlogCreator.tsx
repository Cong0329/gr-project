import  { useState } from "react";
import { DescriptionType, Description, Title } from "./type";
import { TextDescriptionForm } from "./TextDescriptionForm";
import IngredientSectionForm from "./IngredientSectionForm";

const BlogCreator = () => {
  const [title, setTitle] = useState("");
  const [sections, setSections] = useState<Title[]>([]);
  const [selectedType, setSelectedType] = useState<DescriptionType | null>(null);

  const handleAddSection = (section: Title) => {
    setSections([...sections, section]);
    setSelectedType(null); // reset sau khi thêm
  };

  const handleSubmit = () => {
    const result: Description = {
      title,
      description: sections,
    };
    console.log("Submit result:", result);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h2 className="text-xl font-bold">Tạo Blog Chi Tiết Sản Phẩm</h2>

      {/* Bước 1: Nhập tiêu đề */}
      <input
        className="w-full border p-2 rounded"
        placeholder="Nhập tiêu đề blog"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Bước 2: Chọn loại mô tả */}
      <div>
        <label className="block font-medium">Chọn loại mô tả:</label>
        <select
          className="border p-2 rounded w-full"
          value={selectedType || ""}
          onChange={(e) => setSelectedType(e.target.value as DescriptionType)}
        >
          <option value="">-- Chọn loại --</option>
          {Object.entries(DescriptionType).map(([key, val]) => (
            <option key={key} value={val}>
              {val}
            </option>
          ))}
        </select>
      </div>

      {/* Form tùy thuộc vào type */}
      {selectedType === DescriptionType.INGREDIENTS && (
        <IngredientSectionForm onSubmit={handleAddSection} />
      )}
      {selectedType &&
        selectedType !== DescriptionType.INGREDIENTS && (
          <TextDescriptionForm type={selectedType} onSubmit={handleAddSection} />
        )}

      {/* Danh sách đã thêm */}
      <div className="space-y-2">
        <h3 className="font-semibold">Các phần đã thêm:</h3>
        {sections.map((section, index) => (
          <div key={index} className="p-2 border rounded bg-gray-50">
            <strong>{section.type}</strong>: {("description" in section) ? (typeof section.description === "string" ? section.description.slice(0, 60) + "..." : "Ingredients Section") : ""}
          </div>
        ))}
      </div>

      {/* Bước 3: Hoàn thành */}
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        Hoàn tất tạo Blog
      </button>
    </div>
  );
};

export default BlogCreator;
