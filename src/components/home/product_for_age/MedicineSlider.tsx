import Slider, { CustomArrowProps } from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PromotionChild } from "../promotion/PromotionChild";
import { useEffect, useState } from "react";
import { Product } from "../../admin/pages/Forms/Product/Product";

interface ProductSliderProps {
    products: Product[];
    show: number
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
const NextArrow: React.FC<CustomArrowProps> = ({ onClick, currentSlide, slideCount, show }) => {
    return slideCount && currentSlide !== slideCount - show ? (
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
    const [selectedTypes, setSelectedTypes] = useState({});
    useEffect(() => {
        // Đặt giá trị mặc định cho loại đầu tiên của mỗi sản phẩm
        const defaultTypes: Record<string, string> = {};
        products.forEach(product => {
            defaultTypes[product.id] = product.options[0].label; // Chọn loại đầu tiên
        });
        setSelectedTypes(defaultTypes);
    }, [products]);

    const handleTypeClick = (type: string, id: string) => {
        // Cập nhật loại được chọn cho sản phẩm tương ứng
        setSelectedTypes((prev) => ({ ...prev, [id]: type }));
    };
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: Math.min(show, products.length), // Hiển thị tối đa 5 sản phẩm
        slidesToScroll: 6,
        arrows: true,
        nextArrow: <NextArrow show={show} />,
        prevArrow: <PrevArrow show={show} />,
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
            {products.slice(0, 12).map((product) => (
                <PromotionChild key={product.id} product={product} handleTypeClick={handleTypeClick} selectedType={selectedTypes} />
            ))}
        </Slider>
    );
};

export default ProductSlider;
