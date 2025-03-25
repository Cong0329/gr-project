import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { productData } from "./medicine";
import ProductImageSlider from "./MedicineSlider/MedicineSlider";
import { MedicineDescription } from "./MedicineDescription";
import MedicineTech  from "./medicine_tech/MedicineTech";
import { RelatedMedicines } from "./RelatedProducts";
import ReviewSection from "./medicine_reviews/ReviewSection";
import { MedicineComment } from "./medicine_comment/MedicineComment";





export default function ProductDetail() {
  return (
    <div className="w-4/5 mx-auto container pb-10">
      <div className="bg-white rounded-xl flex p-4 ">
        <div className="w-2/5">
          {/* Image Slider */}
          <ProductImageSlider images={productData[0].images} />
        </div>
        <MedicineDescription medicineData={productData[0]} />

      </div>
      <div className="mt-6 bg-white rounded-xl">
        <MedicineTech />
      </div>
      <div className="">
        <RelatedMedicines/>
      </div>
      <div className="">
        <ReviewSection/>
      </div>
      <div className="">
        <MedicineComment/>
      </div>
    
    </div>

  );
}
