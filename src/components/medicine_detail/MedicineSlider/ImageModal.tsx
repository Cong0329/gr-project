import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

interface ImageModalProps {
    images: string[];
    indexModal: number;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ImageModal({ images, indexModal, setShowModal }: ImageModalProps) {
    const [modalIndex, setModalIndex] = useState(indexModal);
    const [isZoomed, setIsZoomed] = useState(false);
    const modalSwiperRef = useRef<SwiperType | null>(null);
    const [modalThumbsSwiper, setModalThumbsSwiper] = useState<SwiperType | null>(null);


    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
        >
            <div
                className="bg-white p-4  rounded-lg tb:rounded-none shadow-lg max-w-3xl w-full tb:h-full md-lg:h-auto relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="">
                    {/* Nút Đóng Modal */}
                    <button
                        className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
                        onClick={() => setShowModal(false)}
                    >
                        ✕
                    </button>

                    {/* Số thứ tự ảnh */}
                    <div className="absolute top-4 left-4 bg-gray-800 text-white px-3 py-1 rounded-md text-sm">
                        {modalIndex + 1} / {images.length}
                    </div>

                    {/* Nút Zoom */}
                    <button
                        className="absolute top-4 right-12 bg-gray-800 text-white px-3 py-1 rounded-md text-sm"
                        onClick={() => setIsZoomed(!isZoomed)}
                    >
                        {isZoomed ? "Thu nhỏ" : "Phóng to"}
                    </button>   
                </div>
                {/* Slider trong Modal */}
                <Swiper
                    spaceBetween={10}
                    navigation
                    modules={[Navigation, Thumbs]}
                    onSwiper={(swiper) => {
                        modalSwiperRef.current = swiper;
                        setTimeout(() => {
                            swiper.slideTo(modalIndex, 0); // Đảm bảo Swiper cập nhật vị trí ảnh đúng
                        }, 50);
                    }}
                    onSlideChange={(swiper) => setModalIndex(swiper.activeIndex)}
                    thumbs={{ swiper: modalThumbsSwiper }}
                    className="rounded-lg overflow-hidden relative mt-10 ml:mt-32"
                >
                    {images.map((src, index) => (
                        <SwiperSlide key={index} className="flex justify-center items-center">
                            <img
                                src={src}
                                alt={`Product Full ${index}`}
                                className={`object-cover ${isZoomed ? "w-full h-[500px] ml:h-[325px] " : "w-3/5"}`}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>


                {/* Thumbnail trong Modal */}
                <div className="mt-4 md-lg:mt-0 md-lg:h-[100px] tb:h-[90px]">
                    <Swiper
                        onSwiper={setModalThumbsSwiper}
                        spaceBetween={10}
                        slidesPerView={5}
                        watchSlidesProgress
                        modules={[Thumbs]}
                        className={`max-w-full h-full ${isZoomed ? "hidden" : "block"}`}
                    >
                        {images.map((src, index) => (
                            <SwiperSlide key={index}>
                                <img
                                    src={src}
                                    alt={`Modal Thumbnail ${index}`}
                                    className={`w-full h-full border-2 object-contain rounded-md cursor-pointer transition ${modalIndex === index ? "border-blue-500" : "border-gray-300"
                                        }`}
                                    onClick={() => modalSwiperRef.current?.slideTo(index)}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
}
