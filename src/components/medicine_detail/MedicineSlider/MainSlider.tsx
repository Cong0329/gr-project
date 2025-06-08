import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { Swiper as SwiperType } from "swiper";
import "swiper/css/navigation";
import { Image } from "./MedicineSlider";

interface MainSliderProps {
  images: Image[];
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
      className="rounded-lg overflow-hidden my-swiper"
    >
      {images.map((src, index) => (
        <SwiperSlide key={index} className="flex justify-center items-center mb-2 ">
            <img
              src={src.image}
              alt={`Product ${index}`}
              className="w-4/5 h-[350px] ml:h-[325px] cursor-pointer object-contain"
              onClick={() => onImageClick(index)}
            />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
