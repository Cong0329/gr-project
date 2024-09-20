import "./general_ex.css";
import img from "../../../assets/logo.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaStar } from "react-icons/fa";


const GeneralEx = () => {
    const truncateText = (text: string, limit: number) => {
        if (text.length <= limit) {
            return text;
        } else {
            return text.slice(0, limit) + "...";
        }
    };

    const renderCard = (index: number) => {
        const packages = [
            "Gói cơ bản",
            "Gói khám VIP",
            "Gói nâng cao",
            "Gói khám cho nam",
            "Gói khám cho nữ",
            "Gói khám cho trẻ em"
        ];
        const sampleText = packages[index % packages.length];
        const truncatedText = truncateText(sampleText, 41);

        const sampleTextChild = `Phòng khám Bệnh viện Đại học Y Dược NHMC`;
        const truncatedTextChild = truncateText(sampleTextChild, 55);

        return (
            <div key={index} id="general-ex-section" className="w-1/2 px-2 mb-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="flex">
                        <div className="w-1/3">
                            <img src={img} alt="/#" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-2/3 p-4">
                            <a href="#/" className="text-lg font-bold text-gray-800 hover:text-blue-600">
                                {truncatedText}
                            </a>
                            <p className="text-sm text-gray-600 mt-2">{truncatedTextChild}</p>
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-xs text-gray-500">
                                    Giá:
                                </p>
                                <p className="price px-2 py-1 text-xs font-semibold bg-slate-100 rounded-lg float-right">
                                    2.000.000đ
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderCards = () => {
        const numberOfCards = 6;
        return Array.from({ length: numberOfCards }, (_, i) => renderCard(i));
    };

    const featuredPackages = [
        { image: img, name: "Gói khám tổng quát", rating: 4.5 },
        { image: img, name: "Gói khám VIP", rating: 4.8 },
        { image: img, name: "Gói khám nâng cao", rating: 4.6 },
        { image: img, name: "Gói khám sức khoẻ tiền hôn nhân cho nam", rating: 4.7 },
        { image: img, name: "Gói khám sức khoẻ tiền hôn nhân cho nữ", rating: 4.7 },
    ];

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '20%',
        arrows: false,
        autoplay: true,
        autoplaySpeed: 1500,
    };

    return (
        <div className="general-ex w-full">
            <div className="container-lite mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex flex-wrap -mx-4">
                        <div className="w-full md:w-1/3 px-4">
                            <div className="bg-slate-100 rounded-lg shadow-md p-4 h-full">
                                <h3 className="text-xl font-bold mb-4">Gói nổi bật</h3>
                                <div className="relative mb-4">
                                    <Slider {...sliderSettings}>
                                        {featuredPackages.map((pkg, index) => (
                                            <div key={index} className="px-2">
                                                <div className="flex flex-col justify-center items-center">
                                                    <div className="w-full h-48 bg-white flex flex-col items-center justify-center rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                                        <img
                                                            src={pkg.image}
                                                            className="w-20 h-20 rounded-full object-cover mb-2"
                                                            alt={pkg.name}
                                                        />
                                                        <div className="text-sm font-semibold text-center mb-2">
                                                            {pkg.name}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <FaStar className="text-yellow-400 mr-1" />
                                                            <span className="text-sm text-gray-600">{pkg.rating.toFixed(1)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                                <h3 className="text-xl font-bold my-4 mt-8">Gói đề xuất</h3>
                                <div className="relative">
                                    <Slider {...sliderSettings}>
                                        {featuredPackages.map((pkg, index) => (
                                            <div key={index} className="px-2">
                                                <div className="flex flex-col justify-center items-center">
                                                    <div className="w-full h-48 bg-white flex flex-col items-center justify-center rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                                        <img
                                                            src={pkg.image}
                                                            className="w-20 h-20 rounded-full object-cover mb-2"
                                                            alt={pkg.name}
                                                        />
                                                        <div className="text-sm font-semibold text-center mb-2">
                                                            {pkg.name}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <FaStar className="text-yellow-400 mr-1" />
                                                            <span className="text-sm text-gray-600">{pkg.rating.toFixed(1)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-2/3 px-4">
                            <div className="bg-slate-100 rounded-lg shadow-md p-4">
                                <div className="flex mb-4 justify-between items-center">
                                    <h3 className="text-xl font-bold">Danh mục</h3>
                                    <button className="text-[rgb(45,135,243)] font-semibold">Xem tất cả<span className="ml-1">&gt;</span></button>
                                </div>
                                <div className="flex flex-wrap -mx-2">
                                    {renderCards()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneralEx;