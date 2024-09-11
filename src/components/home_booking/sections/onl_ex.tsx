import { useState } from "react";
import "./onl_ex.css";
import imgDt from "../../../assets/sections/doctor.jpg";

const OnlEx = () => {
    const options = [
        "Tất cả",
        "Tư vấn, trị liệu tâm lý",
        "Sức khoẻ tâm thần",
        "Da liễu",
        "Cơ xương khớp",
        "Tiêu hoá",
        "Nội khoa",
        "Tim mạch",
        "Tai mũi họng",
    ];

    const doctors = [
        { name: "Dr. A", department: "Tư vấn, trị liệu tâm lý", avatar: [imgDt], hospital: "Trung tâm Y khoa Nhật Bản T-Matsuoka", address: "Da Nang" },
        { name: "Dr. B", department: "Sức khoẻ tâm thần", avatar: [imgDt], hospital: "Hospital B", address: "Da Nang" },
        { name: "Dr. C", department: "Da liễu", avatar: [imgDt], hospital: "Hospital C", address: "Da Nang" },
        { name: "Dr. D", department: "Cơ xương khớp", avatar: [imgDt], hospital: "Hospital D", address: "Da Nang" },
        { name: "Dr. E", department: "Tiêu hoá", avatar: [imgDt], hospital: "Hospital E", address: "Da Nang" },
        { name: "Dr. F", department: "Tim mạch", avatar: [imgDt], hospital: "Hospital F", address: "Da Nang" },
        { name: "Dr. G", department: "Nội khoa", avatar: [imgDt], hospital: "Hospital G", address: "Da Nang" },
        { name: "Dr. H", department: "Tai mũi họng", avatar: [imgDt], hospital: "Hospital H", address: "Da Nang" },
    ];

    const [activeOption, setActiveOption] = useState(0);

    const filteredDoctors = activeOption === 0 ? doctors : doctors.filter(doctor => doctor.department === options[activeOption]);

    return (
        <div className="w-full full-onl">
            <div className="container-lite mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Tư vấn Online qua Video</h2>
                    <button className="text-[rgb(45,135,243)] font-semibold">Xem tất cả<span className="ml-1">&gt;</span></button>
                </div>
                <div className="flex flex-wrap gap-4">
                    {options.slice(0, 6).map((option, index) => (
                        <button
                            key={index}
                            className={`px-6 py-2 rounded-full transition-colors duration-300 border border-solid ${
                                activeOption === index 
                                    ? "bg-[rgb(227,242,255)] text-[rgb(45,135,243)] border-[rgb(227,242,255)]" 
                                    : "bg-white border-[rgb(228,232,236)] text-[rgb(89,89,89)]"
                            }`}
                            onClick={() => setActiveOption(index)}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                <div className="doctors mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredDoctors.map((doctor, index) => (
                        <div key={index} className="p-4 border rounded-lg flex flex-col bg-white">
                            <div className="flex flex-col items-center mb-4">
                                <img src={doctor.avatar[0]} alt={doctor.name} className="w-16 h-16 rounded-full mb-2" />
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold">{doctor.name}</h3>
                                    <p className="text-sm text-gray-600">{doctor.department}</p>
                                </div>
                            </div>
                            <div className="info-dt w-full bg-slate-100 rounded-xl pt-2 pb-4 px-4 mt-auto">
                                <div className="flex items-start mb-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[17px] h-[17px] mx-2 mt-1 flex-shrink-0">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                    </svg>
                                    <span className="text-sm">{doctor.hospital}</span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[17px] h-[17px] mx-2 flex-shrink-0">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                    </svg>
                                    <span className="text-sm">{doctor.address}</span>
                                </div>
                                <button className="w-full bg-white text-[rgb(89,89,89)] font-semibold py-2 rounded-md hover:bg-[rgb(227,242,255)] transition-colors duration-300 border border-[rgb(153,153,153)]">
                                    Đặt lịch khám
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OnlEx;