interface PromotionProps {
    id: string;
    name: string;
    image: string;
    price: number;
    type: string[];
}
import { useState, useEffect } from "react";
import { PromotionChild } from "./PromotionChild";


export const Promotion = () => {

    const medicines: PromotionProps[] = [
        { id: '1', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/v5hrLHF.png', price: 1000000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '2', name: 'Viên uống Glucosamine And Chondroitin Jpanwell hỗ trợ bổ sung chất nhờn dịch khớp (120 viên)', image: 'https://i.imgur.com/HXN77Ev.png', price: 200000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '3', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/VoWEXd6.png', price: 300000, type: ['hộp', 'vỉ'] },
        { id: '4', name: 'Viên uống Glucosamine And Chondroitin Jpanwell hỗ trợ bổ sung chất nhờn dịch khớp (120 viên)', image: 'https://i.imgur.com/v5hrLHF.png', price: 3000000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '5', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/HXN77Ev.png', price: 300000, type: ['hộp', 'vỉ'] },
        { id: '6', name: 'Medicine 3', image: 'medicine3-image.jpg', price: 30, type: ['hộp', 'vỉ', 'viên'] },
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
    return (~~
        <div className="w-full bg-blue-600 mt-10  h-[700px] flex flex-col justify-center items-center">
            <div className="container  grid grid-cols-5 gap-5    mx-auto w-4/5">
                {medicines.slice(0, 5).map((medicine) => (
                    <PromotionChild key={medicine.id} medicine={medicine} handleTypeClick={handleTypeClick} selectedType={selectedTypes} />
                ))}
            </div>
        </div>
    )
}
