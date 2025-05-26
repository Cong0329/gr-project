import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../redux/store";
import { fetchBrands } from "../../../redux/brandAsyncThunk";
import { BrandCard } from "./brandCard";


// Định nghĩa kiểu dữ liệu cho nút Prev & Next
interface ArrowProps {
    onClick?: () => void;
    currentSlide?: number;
    slideCount?: number;
}

// Nút Next (Ẩn nếu ở cuối danh sách)
const NextArrow: React.FC<ArrowProps> = ({ onClick, currentSlide, slideCount }) => {
    return currentSlide !== undefined && slideCount !== undefined && currentSlide < slideCount - 5 ? (
        <button
            onClick={onClick}
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white text-blue-500 p-2 rounded-full shadow-md hover:bg-gray-700 transition"
        >
            <ChevronRight size={24} />
        </button>
    ) : null;
};

// Nút Prev (Ẩn nếu ở đầu danh sách)
const PrevArrow: React.FC<ArrowProps> = ({ onClick, currentSlide }) => {
    return currentSlide !== undefined && currentSlide > 0 ? (
        <button
            onClick={onClick}
            className="z-10 absolute -left-3 top-1/2 transform -translate-y-1/2 bg-white text-blue-500 p-2 rounded-full shadow-md hover:bg-gray-700 transition"
        >
            <ChevronLeft size={24} />
        </button>
    ) : null;
};

export default function ProductSlider() {
    const dispatch: AppDispatch = useDispatch();
    const { brands } = useSelector((state: RootState) => state.brands);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchBrands());
    }, [dispatch])




    const settings = {
        dots: false, // Không hiện dots phía dưới
        infinite: false, // Không lặp vô hạn
        speed: 500, // Tốc độ chuyển slide
        slidesToShow: 5, // Hiển thị 5 sản phẩm mỗi lần
        slidesToScroll: 5, // Cuộn 5 sản phẩm mỗi lần
        nextArrow: <NextArrow />, // Custom nút next
        prevArrow: <PrevArrow />, // Custom nút prev
        responsive: [
            {
                breakpoint: 800,
                settings: {
                    arrows: false,
                }
            },
            {
                breakpoint: 500,
                settings: {
                    arrows: false,
                    slidesToShow: 2.25,
                    slidesToScroll: 2,
                }
            },
        ]
    };

    return (
        <div className="relative container w-4/5 md-lg:w-11/12 tb:w-11/12 m-auto">
            <div className="flex items-center gap-2 mb-4 text-black font-bold text-lg">
                <span className="text-blue-600 text-2xl">💊</span> Thương hiệu yêu thích
            </div>
            <Slider {...settings}>
                {brands.slice(0, 10).map((brand) => (
                    <BrandCard brand={brand} key={brand.id} navigate={navigate} />
                ))}
            </Slider>
        </div>

    );
}
