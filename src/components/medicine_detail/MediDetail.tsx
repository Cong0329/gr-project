import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { productData } from "./medicine";
import ProductImageSlider from "./MedicineSlider/MedicineSlider";
import { MedicineDescription } from "./MedicineDescription";




export default function ProductDetail() {
  return (
    <div className="w-4/5 mx-auto container">
      <div className="bg-white rounded-xl flex p-4 ">
        <div className="w-2/5">
          {/* Image Slider */}
          <ProductImageSlider images={productData[0].images} />
        </div>
        <MedicineDescription medicineData={productData[0]} />
      </div>
    </div>

  );
}
