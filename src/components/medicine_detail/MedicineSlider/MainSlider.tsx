import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { Swiper as SwiperType } from "swiper";
import "swiper/css/navigation";

interface MainSliderProps {
  images: string[];
  mainSwiperRef: React.MutableRefObject<SwiperType | null>;
  onImageClick: (index: number) => void;
  setCurrentIndex: (index: number) => void;
}

export default function MainSlider({
  images,
  mainSwiperRef,
  onImageClick,
  setCurrentIndex,
}: MainSliderProps) {
  return (
    <Swiper
      spaceBetween={10}
      navigation
      modules={[Navigation]}
      onSwiper={(swiper) => (mainSwiperRef.current = swiper)}
      onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
      className="rounded-lg overflow-hidden"
    >
      {images.map((src, index) => (
        <SwiperSlide key={index}>
          <img
            src={src}
            alt={`Product ${index}`}
            className="w-full cursor-pointer object-cover"
            onClick={() => onImageClick(index)}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
