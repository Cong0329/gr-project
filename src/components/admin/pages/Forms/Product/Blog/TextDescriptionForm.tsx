import React, { useState } from "react";
import { TextTitle, DescriptionType } from "./type";

interface TextDescriptionFormProps {
  onSubmit: (data: TextTitle) => void;
  type: DescriptionType;
}

export const TextDescriptionForm: React.FC<TextDescriptionFormProps> = ({ onSubmit, type }) => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null); 
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("");
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];  
    setUrl(URL.createObjectURL(e.target.files![0]))
    if (file) {
      setImage(file);
    }
  };


  return (
    <div className="space-y-2">
      <input className="border p-1 w-full" placeholder="Tiêu đề" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className="border p-1 w-full" placeholder="URL hình ảnh (nếu có)" type="file" onChange={handleImageChange} />
      <textarea className="border p-1 w-full" rows={4} placeholder="Mô tả" value={description} onChange={(e) => setDescription(e.target.value)} />
      <button
        className={`bg-green-500 text-white px-4 py-2 rounded`}
        onClick={() => {
          if (!title.trim() || !description.trim()) return;
          onSubmit({ type, title, image, description, url });
        }}
      >
        Thêm mô tả
      </button>
    </div>
  );
};