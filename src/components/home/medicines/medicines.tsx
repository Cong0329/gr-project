interface PromotionProps {
    id: string;
    name: string;
    image: string;
    price: number;
    type: string[];
}
import { useState, useEffect } from "react";
import { Medicine } from "./Medicine";

export const Medicines = () => {

    const medicines: PromotionProps[] = [
        { id: '1', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/v5hrLHF.png', price: 1000000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '2', name: 'Viên uống Glucosamine And Chondroitin Jpanwell hỗ trợ bổ sung chất nhờn dịch khớp (120 viên)', image: 'https://i.imgur.com/HXN77Ev.png', price: 200000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '3', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/VoWEXd6.png', price: 300000, type: ['hộp', 'vỉ'] },
        { id: '4', name: 'Viên uống Glucosamine And Chondroitin Jpanwell hỗ trợ bổ sung chất nhờn dịch khớp (120 viên)', image: 'https://i.imgur.com/v5hrLHF.png', price: 3000000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '5', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/HXN77Ev.png', price: 300000, type: ['hộp', 'vỉ'] },
        { id: '6', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '7', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '8', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '9', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '10', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '11', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '12', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
    ]
    const [selectedTypes, setSelectedTypes] = useState({});
    useEffect(() => {
        // Đặt giá trị mặc định cho loại đầu tiên của mỗi sản phẩm
        const defaultTypes: Record<string, string> = {};
        medicines.forEach(product => {
            defaultTypes[product.id] = product.type[0]; // Chọn loại đầu tiên
        });
        setSelectedTypes(defaultTypes);
    }, []);

    const handleTypeClick = (type: string, id: string) => {
        // Cập nhật loại được chọn cho sản phẩm tương ứng
        setSelectedTypes((prev) => ({ ...prev, [id]: type }));
    };
    return (
        <div className="w-4/5 md-lg:w-11/12 tb:w-11/12 container mx-auto  mt-5 pb-4 flex flex-col rounded-lg">
            <div className="flex justify-center items-center mb-3">
                <div className="relative">
                    <img
                        src="https://i.imgur.com/SSiYmTR.png"
                        alt="medicines"
                        loading="lazy"
                        className="w-[350px]"
                    />
                    <p className="absolute top-1/2 left-1/2 transform mm:text-sm -translate-x-1/2 -translate-y-1/2 text-white font-bold text-lg ">
                        Sản phẩm bán chạy
                    </p>
                </div>
            </div>

            <div className="container grid grid-cols-6 gap-5 ms:gap-2 tb:grid-cols-2">
                {medicines.slice(0, 12).map((medicine, index) => (
                    <div key={medicine.id}
                        className={`
                      ${index >= 4 ? "hidden sm:block" : ""}  
                      ${index >= 8 ? "hidden md:block" : ""}  
                      ${index >= 10 ? "hidden lg:block" : ""}
                    `}>
                        <Medicine key={medicine.id} medicine={medicine} handleTypeClick={handleTypeClick} selectedType={selectedTypes} />
                    </div>
                ))}
            </div>
        </div>
    )
}
