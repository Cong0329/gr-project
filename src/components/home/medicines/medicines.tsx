
import { useState, useEffect } from "react";
import { PromotionChild } from "../promotion/PromotionChild";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

export const Medicines = () => {

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
                {products.slice(0, 12).map((product, index) => (
                    <div key={product.id}
                        className={`
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
