import React from "react";
import { Title, DescriptionType } from "./description";

interface ProductSectionProps {
  id: DescriptionType;
  section: Title;
}

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
          <ul className="list-disc pl-5 mt-4">
            {section.description.description.map((desc, index) => (
              <li key={index}>{desc}</li>
            ))}
          </ul>
        )}
      </>
    );
  } else if (id === DescriptionType.WARNINGS) {
    content = (
      <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 mt-2">
        <strong>Cảnh báo:</strong>
        <p>{section.description}</p>
      </div>
    );
  } else {
    content = (
      <div className="mt-2">
        {Array.isArray(section.description) ? (
          <ul className="list-disc pl-5">
            {section.description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <div>
            <p>{section.description}</p>
            <div className="flex flex-col items-center">
              <img alt="" src={section.image} className="my-2 rounded-lg" />
            </div>
          </div>
        )}
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
