import React from "react";
import { Title, DescriptionType } from "./description";

interface ProductSectionProps {
  id: DescriptionType;
  section: Title;
}

// Hàm tách nội dung theo ký tự xuống dòng
const formatDescription = (description: string) => {
  return description.split("/n").map((item) => item.trim());
};

const ProductSection: React.FC<ProductSectionProps> = ({ id, section }) => {
  let content;

  if (id === DescriptionType.INGREDIENTS && typeof section.description !== "string") {
    content = (
      <>
        <table className="w-full border mt-2 mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Thành phần</th>
              <th className="border px-4 py-2">Hàm lượng</th>
            </tr>
          </thead>
          <tbody>
            {section.description.ingredients.map((ing, i) => (
              <tr key={i}>
                <td className="border px-4 py-2">{ing.name}</td>
                <td className="border px-4 py-2">{ing.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {section.description.description && (
          <ul className="list-none pl-5 space-y-2">
            {section.description.description.map((desc, index) => (
              <li key={index}>{desc}</li>
            ))}
          </ul>
        )}
      </>
    );
  } else if (id === DescriptionType.WARNINGS) {
    const formattedDescription = formatDescription(section.description);
    content = (
      <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 mt-2">
        <strong className="block mb-2">⚠️ Cảnh báo:</strong>
        <ul className="list-none pl-5">
          {formattedDescription.map((warn, index) => (
            <li key={index}>{warn}</li>
          ))}
        </ul>
      </div>
    );
  } else {
    // Tách dòng với tất cả type
    const formattedDescription = formatDescription(section.description);

    content = (
      <div className="mt-2">
        <ul className="list-none space-y-2">
          {formattedDescription.map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </ul>
        <div className="flex flex-col items-center">
          <img alt="" src={section.image} className="rounded-lg"/>
        </div>
      </div>
    );
  }

  return (
    <section id={id} className="mt-4">
      <h2 className="text-2xl font-bold">{section.title}</h2>
      {content}
    </section>
  );
};

export default ProductSection;
