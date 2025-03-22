import { useState, useRef } from "react";
import { Swiper as SwiperType } from "swiper";
import MainSlider from "./MainSlider";
import ThumbnailSlider from "./ThumbnailSlider";
import ImageModal from "./ImageModal";

interface ProductImageSliderProps {
  images: string[];
}

export default function ProductImageSlider({ images }: ProductImageSliderProps) {
  const [showModal, setShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalIndex, setModalIndex] = useState(0);
  const mainSwiperRef = useRef<SwiperType>(null);
  const modalSwiperRef = useRef<SwiperType>(null);

  // Mở modal và thiết lập ảnh đầu tiên hiển thị
  const openModal = (index: number, isFromMainSlider = true) => {
    if (isFromMainSlider) {
      setCurrentIndex(index); // Chỉ cập nhật nếu mở từ slider chính
    }
    
    setModalIndex(index);
    setShowModal(true);
  
    setTimeout(() => {
      if (modalSwiperRef.current) {
        modalSwiperRef.current.slideTo(index, 0);
      }
    }, 100); // Đợi modal render xong mới cập nhật slide
  };
  
  
  

  return (
    <div className="w-full max-w-lg mx-auto sticky top-0">
      {/* Slider ảnh lớn */}
      <MainSlider
        images={images}
        mainSwiperRef={mainSwiperRef}
        onImageClick={openModal}
        setCurrentIndex={setCurrentIndex}
      />

      {/* Thumbnail ảnh */}
      <ThumbnailSlider
        images={images}
        currentIndex={currentIndex}
        onThumbnailClick={(index) => mainSwiperRef.current?.slideTo(index)}
        openModal={openModal}
      />

      {/* Modal hiển thị khi nhấn "Xem thêm" */}
      {showModal && (
        <ImageModal
          images={images}
          indexModal={modalIndex}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
}
