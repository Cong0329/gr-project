import { useState } from "react";
import ProductSlider from "./MedicineSlider";
import { categories } from "./Medical";
import { medicines } from "./Medical";



export default function ProductForAge() {
    const [selectedCategory, setSelectedCategory] = useState<string>("kids");

    return (
        <div className="w-4/5 md-lg:w-11/12 tb:w-11/12 mx-auto container bg-gray-100 mt-5 rounded-xl relative">
            {/* Tiêu đề */}
            <div className="flex items-center gap-2 mb-4 text-black font-bold text-lg">
                <span className="text-blue-600 text-2xl">👨‍👩‍👧‍👦</span> Sản phẩm theo đối tượng
            </div>
            {/* Tabs chọn danh mục */}
            <div className="flex gap-2 mb-6 tb:flex-wrap ms:text-[10px] ms:font-semibold">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={`px-4 py-2 rounded-full border ${selectedCategory === category.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-black"
                            }`}
                        onClick={() => setSelectedCategory(category.id)}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {/* Hiển thị ảnh danh mục được chọn */}
            <div className="flex tb:flex-col mb-4 h-[475px] tb:h-full">
                <div className="w-1/6 tb:w-full h-full tb:h-[235px] ">
                    {categories.find((c) => c.id === selectedCategory) && (
                        <img
                            src={categories.find((c) => c.id === selectedCategory)?.image}
                            alt={selectedCategory}
                            loading="lazy"
                            className="w-full h-full object-cover rounded-lg"
                        />
                    )}
                </div>

                {/* Slider hiển thị sản phẩm */}
                <div className="w-5/6 tb:w-full tb:mt-5 relative h-full">
                    <ProductSlider products={medicines[selectedCategory] || []} show={5} />
                </div>
            </div>
        </div>
    );
}
