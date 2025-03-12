interface Category {
    id: number;
    name: string;
    products: number;
    icon: string;
  }
  
  const categories: Category[] = [
    { id: 1, name: "Thần kinh não", products: 91, icon: "🧠" },
    { id: 2, name: "Vitamin & Khoáng chất", products: 173, icon: "💊" },
    { id: 3, name: "Sức khỏe tim mạch", products: 43, icon: "💙" },
    { id: 4, name: "Tăng sức đề kháng, miễn dịch", products: 63, icon: "🛡️" },
    { id: 5, name: "Hỗ trợ tiêu hóa", products: 112, icon: "🌀" },
    { id: 6, name: "Sinh lý - Nội tiết tố", products: 82, icon: "⚕️" },
    { id: 7, name: "Dinh dưỡng", products: 71, icon: "🍎" },
    { id: 8, name: "Hỗ trợ điều trị", products: 183, icon: "🩺" },
    { id: 9, name: "Giải pháp làn da", products: 89, icon: "🧴" },
    { id: 10, name: "Chăm sóc da mặt", products: 181, icon: "🎭" },
    { id: 11, name: "Hỗ trợ làm đẹp", products: 42, icon: "💎" },
    { id: 12, name: "Hỗ trợ tình dục", products: 41, icon: "🔗" },
  ];
  
  export default function CategoriesSection(): JSX.Element {
    return (
      <div className="w-4/5 mx-auto bg-gray-100 mt-5 rounded-xl">
        {/* Tiêu đề */}
        <div className="flex items-center gap-2 mb-4 text-black font-bold text-lg">
          <span className="text-blue-600 text-2xl">🏆</span>
          Danh mục nổi bật
        </div>
  
        {/* Danh sách danh mục */}
        <div className="grid grid-cols-6 gap-4">
          {categories.map((category: Category) => (
            <div
              key={category.id}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-3xl text-blue-600">{category.icon}</div>
              <p className="font-bold text-black">{category.name}</p>
              <p className="text-gray-500 text-sm">{category.products} sản phẩm</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  