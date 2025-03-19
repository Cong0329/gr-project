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
  const mainSwiperRef = useRef<SwiperType>(null);

  // Mở modal và thiết lập ảnh đầu tiên hiển thị
  const openModal = (index: number) => {
    setShowModal(true);
    setCurrentIndex(index);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
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
          currentIndex={currentIndex}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
}
