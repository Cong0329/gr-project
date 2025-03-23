import Slider, { CustomArrowProps } from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Medicine } from "./Medical";

interface ProductSliderProps {
    products: Medicine[];
    show:number
}

// ✅ Component nút Prev
const PrevArrow: React.FC<CustomArrowProps> = ({ onClick, currentSlide }) => {
    return currentSlide !== 0 ? (
        <button
            onClick={onClick}
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white text-blue-500 p-2 rounded-full shadow-md hover:bg-gray-300 transition z-10"
        >
            <ChevronLeft size={24} />
        </button>
    ) : null;
};

// ✅ Component nút Next
const NextArrow: React.FC<CustomArrowProps> = ({ onClick, currentSlide, slideCount }) => {
    return slideCount && currentSlide !== slideCount - 5 ? (
        <button
            onClick={onClick}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white text-blue-500 p-2 rounded-full shadow-md hover:bg-gray-300 transition z-10"
        >
            <ChevronRight size={24} />
        </button>
    ) : null;
};

// ✅ Component Slider sản phẩm
const ProductSlider: React.FC<ProductSliderProps> = ({ products, show }) => {
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: Math.min(show, products.length), // Hiển thị tối đa 5 sản phẩm
        slidesToScroll: 5,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: Math.min(4, products.length),
                    slidesToScroll: 4,
                    arrows: false,
                }
            },
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: Math.min(2.25, products.length),
                    slidesToScroll: 2,
                    arrows: false,
                }
            },
            {
                breakpoint: 400,
                settings: {
                    slidesToShow: Math.min(1.75, products.length),
                    slidesToScroll: 2,
                    arrows: false,
                }
            },
        ]
    };

    return (
        <Slider {...settings}>
            {products.map((product) => (
                <div key={product.id} className="px-2 ms:px-1 h-[475px] ms:h-[400px]">
                    <div className="bg-white p-4 rounded-lg hover:shadow-lg transition-shadow duration-300 h-full">
                        {product.discount && (
                            <span className="absolute bg-red-500 text-white text-xs px-2 py-1 rounded-tl-lg">
                                -{product.discount}%
                            </span>
                        )}
                        <img
                            src={product.image}
                            alt="age"
                            loading="lazy"
                            className="w-full h-44 object-contain"
                        />
                        <div className="w-full mt-2 h-16 ms:h-10 text-black font-semibold text-sm overflow-hidden text-ellipsis">
                            <p className="line-clamp-3">{product.name}</p>
                        </div>
                        <div className="h-36 ms:h-24">
                            <p className="text-blue-600 text-lg font-semibold ms:text-sm">
                                {product.price.toLocaleString()}đ / Hộp
                            </p>
                            {product.oldPrice && (
                                <p className="text-gray-400 line-through text-sm">
                                    {product.oldPrice.toLocaleString()}đ
                                </p>
                            )}
                            <p className="text-gray-500 text-xs bg-gray-200 px-2 py-1 inline-block rounded">
                                {product.package}
                            </p>
                        </div>
                        <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded-full">
                            Chọn mua
                        </button>
                    </div>
                </div>
            ))}
        </Slider>
    );
};

export default ProductSlider;
