import { useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { productData } from "./medicine";
import ProductImageSlider from "./MedicineSlider/MedicineSlider";




export default function ProductDetail() {
  const [selectedOption, setSelectedOption] = useState(productData[0].options[0]);
  return (
    <div className="w-4/5 mx-auto container">
      <div className="bg-white rounded-xl flex p-4">
        <div className="w-2/5">
          {/* Image Slider */}
          <ProductImageSlider images={productData[0].images} />
        </div>
        <div className="w-3/5">
          <h2 className="text-xl font-bold">{productData[0].name}</h2>
          <p className="text-gray-500">Thương hiệu: {productData[0].brand}</p>



          {/* Options */}
          <div className="flex gap-4 my-4">
            {productData[0].options.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedOption(option)}
                className={`px-4 py-2 border rounded-md ${selectedOption.id === option.id ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <p className="text-lg font-semibold">{selectedOption.price.toLocaleString()}đ</p>

          <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md">Chọn mua</button>
        </div>
      </div>
    </div>

  );
}
