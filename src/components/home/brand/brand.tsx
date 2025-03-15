import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
    id: number;
    name: string;
    image: string;
    logo: string;
}

const specialties: Product[] = [
    { id: 1, name: "Sản phẩm 1", image: "https://i.imgur.com/v5hrLHF.png", logo: "https://i.imgur.com/RqChwMC.png" },
    { id: 2, name: "Sản phẩm 2", image: "https://i.imgur.com/v5hrLHF.png", logo: "https://i.imgur.com/RqChwMC.png" },
    { id: 3, name: "Sản phẩm 3", image: "https://i.imgur.com/v5hrLHF.png", logo: "https://i.imgur.com/RqChwMC.png" },
    { id: 4, name: "Sản phẩm 4", image: "https://i.imgur.com/v5hrLHF.png", logo: "https://i.imgur.com/RqChwMC.png" },
    { id: 5, name: "Sản phẩm 5", image: "https://i.imgur.com/v5hrLHF.png", logo: "https://i.imgur.com/RqChwMC.png" },
    { id: 6, name: "Sản phẩm 6", image: "https://i.imgur.com/v5hrLHF.png", logo: "https://i.imgur.com/RqChwMC.png" },
    { id: 7, name: "Sản phẩm 7", image: "https://i.imgur.com/v5hrLHF.png", logo: "https://i.imgur.com/RqChwMC.png" },
    { id: 8, name: "Sản phẩm 8", image: "https://i.imgur.com/v5hrLHF.png", logo: "https://i.imgur.com/RqChwMC.png" },
    { id: 9, name: "Sản phẩm 9", image: "https://i.imgur.com/v5hrLHF.png", logo: "https://i.imgur.com/RqChwMC.png" },
    { id: 10, name: "Sản phẩm 10", image: "https://i.imgur.com/v5hrLHF.png", logo: "https://i.imgur.com/RqChwMC.png" },
];

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
                breakpoint: 800,  // Dưới 768px
                settings: {
                   arrows:false,
                }
            },
        ]
    };

    return (
        <div className="relative container w-4/5 md-lg:w-11/12 m-auto">
            <div className="flex items-center gap-2 mb-4 text-black font-bold text-lg">
                <span className="text-blue-600 text-2xl">💊</span> Thương hiệu yêu thích
            </div>
            <Slider {...settings}>
                {specialties.map((specialty) => (
                    <div key={specialty.id} className="pr-2">
                        <div className="border-2 border-transparent hover:border-blue-500 rounded-lg transition-all duration-300">
                            <div className="flex flex-col justify-center items-center">
                                <div className="w-full  bg-white flex flex-col items-center justify-center rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                    <img
                                        src={specialty.image}
                                        className="w-40 h-auto tb:w-24 object-fit"
                                        loading="lazy"
                                        alt={specialty.name}
                                    />
                                    <div className="border-2 rounded-lg border-gray-200 py-2 px-3">
                                        <img src={specialty.logo} alt="logo" className="w-36 tb:w-20 object-fit" loading="lazy" />
                                    </div>
                                    <div className="text-lg font-semibold text-blue-700 my-5 tb:text-sm">Giảm đến 20%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>

    );
}
