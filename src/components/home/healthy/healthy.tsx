import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const doctors = [
    {
        id: 1,
        name: "Nguyễn Văn My",
        title: "Bác sĩ",
        specialty: "Truyền nhiễm",
        image: "https://via.placeholder.com/80", // Thay bằng ảnh thật
    },
    {
        id: 2,
        name: "Nguyễn Anh Tuấn",
        title: "Bác sĩ Chuyên khoa 1",
        specialty: "Chẩn đoán hình ảnh",
        image: "https://via.placeholder.com/80",
    },
    {
        id: 3,
        name: "Nguyễn Minh Hồng",
        title: "Thạc sĩ - Bác sĩ",
        specialty: "Y tế công cộng",
        image: "https://via.placeholder.com/80",
    },
    {
        id: 4,
        name: "Nguyễn Minh Hồng",
        title: "Thạc sĩ - Bác sĩ",
        specialty: "Y tế công cộng",
        image: "https://via.placeholder.com/80",
    },
    {
        id: 5,
        name: "Nguyễn Minh Hồng",
        title: "Thạc sĩ - Bác sĩ",
        specialty: "Y tế công cộng",
        image: "https://via.placeholder.com/80",
    },
    {
        id: 6,
        name: "Nguyễn Minh Hồng",
        title: "Thạc sĩ - Bác sĩ",
        specialty: "Y tế công cộng",
        image: "https://via.placeholder.com/80",
    },
    {
        id: 7,
        name: "Nguyễn Minh Hồng",
        title: "Thạc sĩ - Bác sĩ",
        specialty: "Y tế công cộng",
        image: "https://via.placeholder.com/80",
    },
    {
        id: 8,
        name: "Nguyễn Minh Hồng",
        title: "Thạc sĩ - Bác sĩ",
        specialty: "Y tế công cộng",
        image: "https://via.placeholder.com/80",
    },
    {
        id: 9,
        name: "Nguyễn Minh Hồng",
        title: "Thạc sĩ - Bác sĩ",
        specialty: "Y tế công cộng",
        image: "https://via.placeholder.com/80",
    },
    // Thêm các bác sĩ khác...
];


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



export default function HealthSection() {
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,  // Mặc định hiển thị 3 slide
        slidesToScroll: 3,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 800,  // Khi màn hình dưới 768px
                settings: {
                    slidesToShow: 2,  // Giảm xuống còn 2 slide
                    slidesToScroll: 2,
                    arrows:false,
                }
            }
        ]
    };
    

    return (
        <div className="w-4/5 md-lg:w-11/12 container mx-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 rounded-xl relative mt-7">
            <div>
                <h2 className="text-2xl font-bold">Chuyên trang bệnh & sức khỏe</h2>
                <p className="text-sm opacity-80">
                    Tổng hợp thông tin và kiến thức chuyên sâu về các lĩnh vực sức khỏe
                </p>
                <button className="mt-4 px-4 py-2 bg-white text-blue-600 rounded-full font-semibold">
                    Tìm hiểu thêm
                </button>
            </div>
            <div className="">
                
            </div>
            {/* Slider danh sách bác sĩ */}
            <div className="mt-6">
                <Slider {...settings}>
                    {doctors.map((doctor) => (
                        <div key={doctor.id} className="p-2">
                            <div className="bg-white rounded-xl p-4 shadow-md flex items-center gap-3 tb:h-32">
                                <img
                                    src='https://i.imgur.com/TamqnIu.png'
                                    alt={doctor.name}
                                    loading="lazy"
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div>
                                    <p className="text-xs text-gray-600">{doctor.title}</p>
                                    <p className="font-bold text-black">{doctor.name}</p>
                                    <p className="text-gray-500 text-sm">{doctor.specialty}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
}

