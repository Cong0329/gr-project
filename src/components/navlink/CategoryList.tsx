import { Link } from "react-router-dom";
import { categoriesMapIcon } from "./data";

export const CategoryList = ({
    categories,
    onHover,
  }: {
    categories: {
      id: number;
      name: string;
      image: string;
    }[];
    onHover: (id: number) => void;
  }) => {
    return (
      <div className="flex flex-col w-1/4 text-gray-500">
        {categories.map((category) => (
          <div
            key={category.id}
            onMouseEnter={() => onHover(category.id)}
            className="hover:text-black h-[42px] hover:bg-black hover:bg-opacity-5 px-5 rounded-l-lg items-center group w-full text-left"
          >
            <Link
              className="flex space-x-2 py-2 border-b-2"
              to={`/medicine-search/?category=${category.name}`}
            >
              <span className="w-6 h-6 text-lg">{categoriesMapIcon[category.name]}</span>
              <span>{category.name}</span>
            </Link>
          </div>
        ))}
      </div>
    );
  };
  