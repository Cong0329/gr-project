import { useState } from "react";
import Slider, { CustomArrowProps } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Disease = {
    id: number;
    name: string;
    description: string;
    image: string;
};

const seasonalDiseases: Disease[] = [
    {
        id: 1,
        name: "Sốt xuất huyết Dengue",
        description: "Sốt xuất huyết Dengue là một bệnh do muỗi truyền xảy ra ở các khu vực nhiệt đới và cận nhiệt đới...",
        image: "https://i.imgur.com/qnn04Xm.png",
    },
    {
        id: 2,
        name: "Ebola",
        description: "Ebola là một căn bệnh truyền nhiễm hiếm gặp nhưng có thể gây nguy cơ tử vong cao...",
        image: "/images/ebola.jpg",
    },
    {
        id: 3,
        name: "Cúm",
        description: "Bệnh cúm là bệnh truyền nhiễm, gây ra do nhiễm virus cúm. Virus có thể gây bệnh từ nhẹ tới nặng...",
        image: "/images/flu.jpg",
    },
    {
        id: 4,
        name: "Bệnh tay, chân, miệng",
        description: "Bệnh tay, chân, miệng là bệnh do virus gây ra, có khả năng lây lan rất nhanh chóng...",
        image: "/images/hand-foot-mouth.jpg",
    },
    {
        id: 5,
        name: "Sốt xuất huyết Dengue",
        description: "Sốt xuất huyết Dengue là một bệnh do muỗi truyền xảy ra ở các khu vực nhiệt đới và cận nhiệt đới...",
        image: "https://i.imgur.com/qnn04Xm.png",
    },
    {
        id: 6,
        name: "Ebola",
        description: "Ebola là một căn bệnh truyền nhiễm hiếm gặp nhưng có thể gây nguy cơ tử vong cao...",
        image: "/images/ebola.jpg",
    },
    {
        id: 7,
        name: "Cúm",
        description: "Bệnh cúm là bệnh truyền nhiễm, gây ra do nhiễm virus cúm. Virus có thể gây bệnh từ nhẹ tới nặng...",
        image: "/images/flu.jpg",
    },
    {
        id: 8,
        name: "Bệnh tay, chân, miệng",
        description: "Bệnh tay, chân, miệng là bệnh do virus gây ra, có khả năng lây lan rất nhanh chóng...",
        image: "/images/hand-foot-mouth.jpg",
    },
];

const targetDiseases: Disease[] = [
    { id: 5, name: "Sởi", description: "Sởi là một bệnh truyền nhiễm cấp tính do virus gây ra...", image: "/images/measles.jpg" },
    { id: 6, name: "Viêm não Nhật Bản", description: "Bệnh viêm não Nhật Bản có thể gây tổn thương hệ thần kinh trung ương...", image: "/images/japanese-encephalitis.jpg" }
];

// ✅ Component nút Prev
const PrevArrow: React.FC<CustomArrowProps> = ({ onClick, currentSlide }) => {
    return currentSlide !== 0 ? (
        <button
            onClick={onClick}
            className="absolute -left-6 top-1/2 transform -translate-y-1/2 bg-white text-blue-500 p-2 rounded-full shadow-md hover:bg-gray-300 transition z-10"
        >
            <ChevronLeft size={24} />
        </button>
    ) : null;
};

// ✅ Component nút Next
const NextArrow: React.FC<CustomArrowProps> = ({ onClick, currentSlide, slideCount }) => {
    return slideCount && currentSlide !== slideCount - Math.min(4, slideCount) ? (
        <button
            onClick={onClick}
            className="absolute -right-6 top-1/2 transform -translate-y-1/2 bg-white text-blue-500 p-2 rounded-full shadow-md hover:bg-gray-300 transition z-10"
        >
            <ChevronRight size={24} />
        </button>
    ) : null;
};

export default function DiseaseList() {
    const [selectedTab, setSelectedTab] = useState("seasonal");
    const diseases = selectedTab === "seasonal" ? seasonalDiseases : targetDiseases;

    // Cấu hình Slider
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: Math.min(4, diseases.length), // Hiển thị tối đa 4 card
        slidesToScroll: 4,
        arrows: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    return (
        <div className="w-4/5 mx-auto my-5 bg-gray-100 rounded-lg">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
                <h2 className="text-xl font-semibold">🩺 Bệnh</h2>
                <button className="text-blue-500 font-medium">Xem tất cả &gt;</button>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
                <button
                    className={`px-4 py-2 rounded-full border transition ${selectedTab === "seasonal" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    onClick={() => setSelectedTab("seasonal")}
                >
                    Bệnh theo mùa
                </button>
                <button
                    className={`px-4 py-2 rounded-full border transition ${selectedTab === "target" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                    onClick={() => setSelectedTab("target")}
                >
                    Bệnh theo đối tượng
                </button>
            </div>

            {/* Danh sách bệnh */}
            <div className="">
                <Slider {...settings}>
                    {diseases.map((disease) => (
                        <div key={disease.id} className=" px-3 h-[335px] ">
                            <div className="p-4 bg-white rounded-lg shadow-md">
                                <img src={disease.image} alt={disease.name} className="w-full h-40 object-cover rounded-lg mb-4" />
                                <h3 className="text-lg font-semibold">{disease.name}</h3>
                                <div className="w-full h-16 text-black font-semibold text-sm overflow-hidden text-ellipsis">
                                    <p className="text-gray-600 text-sm mb-3">{disease.description}</p>
                                </div>
                                <button className="text-blue-500 font-medium">Tìm hiểu thêm &gt;</button>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>

        </div>
    );
}
