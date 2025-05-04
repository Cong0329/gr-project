import { useState, useEffect } from "react";
import { PromotionChild } from "./PromotionChild";
import CountdownTimer from "../time/CountTime";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";


export const Promotion = () => {
    const { products } = useSelector((state: RootState) => state.products);
   
  
    const [selectedTypes, setSelectedTypes] = useState({});
    useEffect(() => {
        // Đặt giá trị mặc định cho loại đầu tiên của mỗi sản phẩm
        const defaultTypes: Record<string, string> = {};
        products.forEach(product => {
            defaultTypes[product.id] = product.options[0].label; // Chọn loại đầu tiên
        });
        setSelectedTypes(defaultTypes);
    }, [products]);

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
                {products.slice(0, 6).map((product, index) => (
                    <div key={product.id} className={`
                        ${index >= 4 ? "hidden sm:block" : ""}  
                        ${index >= 8 ? "hidden md:block" : ""}  
                        ${index >= 10 ? "hidden lg:block" : ""}
                      `}>
                        
                            <PromotionChild key={product.id} product={product} handleTypeClick={handleTypeClick} selectedType={selectedTypes} />
                        
                    </div>




                ))}
            </div>
        </div>
    )
}
