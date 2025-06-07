import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { Link } from "react-router-dom";

interface Category {
  id: number;
  name: string;
  products: number;
  icon: string;
}

const categoriesMapIcon: Record<string, string> = {
  "Thần kinh não": "🧠",
  "Vitamin & Khoáng chất": "💊",
  "Sức khỏe tim mạch": "💙",
  "Cải thiện tăng cường sức khỏe": "🛡️",
  "Hỗ trợ tiêu hóa": "🌀",
  "Sinh lý - Nội tiết tố": "⚕️",
  "Dinh dưỡng": "🍎",
  "Hỗ trợ điều trị": "🩺",
  "Giải pháp làn da": "🧴",
  "Chăm sóc da mặt": "🎭",
  "Hỗ trợ làm đẹp": "💎",
  "Hỗ trợ tình dục": "🔗",
  "Thực phẩm - Đồ uống": "🍹",
  "Chăm sóc răng miệng": "🦷",
  "Vệ sinh cá nhân": "🧼"
};

export default function CategoriesSection(): JSX.Element {
  const { parent } = useSelector((state: RootState) => state.categories);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const map: Record<string, Category> = {};

    parent?.forEach((group: any) => {
      group.categories.forEach((cat: any) => {
        const total = cat.products?.length || 0;
        const name = cat.name;
        if (!map[name]) {
          map[name] = {
            id: cat.id,
            name: name,
            products: total,
            icon: categoriesMapIcon[name] ?? "📦"
          };
        } else {
          map[name].products += total;
        }
      });
    });

    setCategories(Object.values(map));
  }, [parent]);

  return (
    <div className="w-4/5 md-lg:w-11/12 container mx-auto bg-gray-100 mt-5 rounded-xl">
      <div className="flex items-center gap-2 mb-4 text-black font-bold text-lg">
        <span className="text-blue-600 text-2xl">🏆</span> Danh mục nổi bật
      </div>

      <div className="grid grid-cols-6 tb:grid-cols-2 gap-4">
        {categories.slice(0, 12).map((category) => (
          <Link
            key={category.id}
            to={`/medicine-search/?category=${category.name}`}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transition-shadow duration-300"
          >
            <div className="text-3xl text-blue-600">{category.icon}</div>
            <p className="font-bold text-black text-center">{category.name}</p>
            <p className="text-gray-500 text-sm">{category.products} sản phẩm</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
