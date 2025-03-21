interface PromotionProps {
    id: string;
    name: string;
    image: string;
    price: number;
    type: string[];
}
import { useState, useEffect } from "react";
import { PromotionChild } from "./PromotionChild";
import CountdownTimer from "../time/CountTime";



export const Promotion = () => {

    const medicines: PromotionProps[] = [
        { id: '1', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/v5hrLHF.png', price: 1000000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '2', name: 'Viên uống Glucosamine And Chondroitin Jpanwell hỗ trợ bổ sung chất nhờn dịch khớp (120 viên)', image: 'https://i.imgur.com/HXN77Ev.png', price: 200000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '3', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/VoWEXd6.png', price: 300000, type: ['hộp', 'vỉ'] },
        { id: '4', name: 'Viên uống Glucosamine And Chondroitin Jpanwell hỗ trợ bổ sung chất nhờn dịch khớp (120 viên)', image: 'https://i.imgur.com/v5hrLHF.png', price: 3000000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '5', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/HXN77Ev.png', price: 300000, type: ['hộp', 'vỉ'] },
        { id: '6', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
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
        <div className="w-4/5 md-lg:w-11/12 tb:w-11/12 container mx-auto bg-blue-600 mt-10 pb-4 flex flex-col rounded-lg">
            <div className="bg-blue-500 h-28 rounded-t-lg relative">
                <div className="w-[150px] h-[150px] ms:w-[100px] ms:h-[100px] absolute top-2 right-5">
                    <img className="w-full h-full object-fit" loading="lazy" src="https://i.imgur.com/s3csRn5.png" alt="sale" />
                </div>
                <div className="bg-blue-600 rounded-t-lg h-16 ms:w-[150px] absolute left-3 bottom-0 w-[200px] font-bold  text-white flex items-center justify-center text-center">
                    <div>
                        <p>16:00 - 22:00, 10/5</p>
                        <p>Đang diễn ra</p>
                    </div>
                </div>

            </div>
            <CountdownTimer />
            <div className="container grid grid-cols-6 gap-5 px-3 tb:grid-cols-2 ms:gap-2">
                {medicines.slice(0, 6).map((medicine) => (
                 
                        <a href="/medicine-detail">
                            <PromotionChild key={medicine.id} medicine={medicine} handleTypeClick={handleTypeClick} selectedType={selectedTypes} />
                        </a>
                  


                ))}
            </div>
        </div>
    )
}
