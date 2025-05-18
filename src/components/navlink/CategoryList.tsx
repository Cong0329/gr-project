import { Link } from "react-router-dom";


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
              to="/"
            >
              <img src={category.image} alt={category.name} className="w-6 h-6" />
              <span>{category.name}</span>
            </Link>
          </div>
        ))}
      </div>
    );
  };
  