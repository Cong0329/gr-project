import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductImageSlider from "./MedicineSlider/MedicineSlider";
import { MedicineDescription } from "./MedicineDescription";
import MedicineTech from "./medicine_tech/MedicineTech";
import { RelatedMedicines } from "./RelatedProducts";
import ReviewSection from "./medicine_reviews/ReviewSection";
import { FaRocketchat } from 'react-icons/fa';
import { motion } from "framer-motion";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";
import { openChatbox } from "../../redux/reviewsSlice";





export default function ProductDetail() {
  const dispatch: AppDispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { product, detail } = useSelector((state: RootState) => state.products);
  return (
    <div className="w-4/5 tb:w-full mx-auto container pb-10">
      <div className="bg-white rounded-xl tb:rounded-none flex p-4 tb:flex-col ">
        <div className="w-2/5 tb:w-full">
          {/* Image Slider */}
          {product.images && <ProductImageSlider images={product.images} />}
        </div>
        {product.name && <MedicineDescription medicineData={product} isOpen={isOpen} setIsOpen={setIsOpen} />}
      </div>
      <div className="mt-6 bg-white rounded-xl tb:rounded-none">
        {detail.product_id && <MedicineTech />}
      </div>
      <div className="">
        <RelatedMedicines />
      </div>
      <div className="">
        <ReviewSection />
      </div>
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 z-30 hidden tb:flex items-center justify-between gap-4">
        {/* Nút Chat */}
        <button className="bg-blue-600 rounded-full w-10 h-10 flex items-center justify-center" onClick={() => dispatch(openChatbox())}>
          <motion.div
            animate={{ y: [0, -10, 0] }} // Hiệu ứng bounce
            transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
            className="cursor-pointer relative"
          >
            <FaRocketchat size={20} color="white" />
          </motion.div>
        </button>

        {/* Nút Chọn Mua */}
        <button onClick={() => setIsOpen(true)} className="flex-1 bg-blue-600 text-white font-semibold px-4 py-2 rounded-full">
          Chọn mua
        </button>
      </div>
    </div>

  );
}
