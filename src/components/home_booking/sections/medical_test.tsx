import './medical_test.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import img from "../../../assets/logo.png";


const MedicalTest = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const testOptions = [
        { name: "Xét nghiệm 1"},
        { name: "Xét nghiệm 2"},
        { name: "Xét nghiệm 3"},
        { name: "Xét nghiệm 4"},
    ];

    const regions = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Cần Thơ"];
    const categories = ["Xét nghiệm máu", "Xét nghiệm nước tiểu", "Chẩn đoán hình ảnh", "Xét nghiệm di truyền"];
    const prices = ["Dưới 500.000 VNĐ", "500.000 - 1.000.000 VNĐ", "1.000.000 - 2.000.000 VNĐ", "Trên 2.000.000 VNĐ"];
    const medicalFacilities = ["Bệnh viện công", "Bệnh viện tư", "Phòng khám đa khoa", "Trung tâm xét nghiệm"];

    return (
        <div id="medical-test-section" className="medical-test w-full">
            <div className="container-lite mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold mb-4">Xét nghiệm y học</h3>
                    <div className="flex flex-wrap -mx-4">
                        <div className="w-full lg:w-2/3 px-4 flex-grow">
                            <div className="bg-gray-100 p-4 rounded-lg h-full flex items-center">
                                <Slider {...settings} className="medical-test-slider w-full">
                                    {testOptions.map((option, index) => (
                                        <div key={index} className="px-2">
                                            <div className="flex flex-col justify-center items-center">
                                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md">
                                                    <img src={img} alt={option.name} className="w-16 h-16 object-contain" />
                                                </div>
                                                <div className="text-center mt-2">
                                                    <div className="text-sm font-semibold">
                                                        {option.name}
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/3 px-4 mt-4 lg:mt-0 flex-grow">
                            <div className="bg-gray-100 p-4 rounded-lg h-full">
                                <div className="mb-4 relative">
                                    <div className="absolute inset-y-0 end-0 flex items-center pe-3 cursor-pointer">
                                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                        </svg>
                                    </div>
                                    <input type="text" placeholder="Tìm kiếm xét nghiệm" className="w-full p-2 pl-2 rounded-md border border-gray-300" />
                                </div>
                                <div className="flex flex-wrap -mx-2 mb-4">
                                    <div className="w-1/2 px-2">
                                        <select className="w-full p-2 rounded-md border border-gray-300">
                                            <option>Khu vực</option>
                                            {regions.map((region, index) => (
                                                <option key={index}>{region}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-1/2 px-2">
                                        <select className="w-full p-2 rounded-md border border-gray-300">
                                            <option>Danh mục</option>
                                            {categories.map((category, index) => (
                                                <option key={index}>{category}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-wrap -mx-2">
                                    <div className="w-1/2 px-2">
                                        <select className="w-full p-2 rounded-md border border-gray-300">
                                            <option>Giá cả</option>
                                            {prices.map((price, index) => (
                                                <option key={index}>{price}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-1/2 px-2">
                                        <select className="w-full p-2 rounded-md border border-gray-300">
                                            <option>Cơ sở y tế</option>
                                            {medicalFacilities.map((facility, index) => (
                                                <option key={index}>{facility}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicalTest;
