import { Product } from "../../../redux/searchSlice";



interface PromotionChildProps {
    medicine: Product;
    handleTypeClick: (type: string, medicineId: string) => void;
    selectedType: { [key: string]: string };
}

export const Medicine: React.FC<PromotionChildProps> = ({ medicine, handleTypeClick, selectedType }) => {
    const columns = medicine.options?.length;
    return (
        <div key={medicine.id} className="item-box border-2 rounded-lg bg-white flex flex-col items-center p-4 space-y-2 order-transparent hover:border-blue-500  transition-all duration-300">
            <a href="/medicine-detail/" className="flex flex-col items-center">
                <img src={medicine?.images?.[0]?.image || ''} alt={medicine.name} loading="lazy" className="h-40" />
                <div className="w-full mt-2 h-16 tb:h-11 text-black font-semibold text-sm overflow-hidden text-ellipsis">
                    <p className="line-clamp-3">
                        {medicine.name}
                    </p>
                </div>
            </a>
            <div className={`grid grid-cols-${columns}  bg-gray-300 rounded-lg w-full h-9`}>
                {medicine?.options?.map((type) => (
                    <button
                        key={type.label}
                        onClick={() => handleTypeClick(type.label, medicine.id)}
                        className={`p-1.5 capitalize text-[13px] font-semibold ${selectedType[medicine.id] === type.label
                            ? 'text-blue-700 border border-blue-700 rounded-lg' // Thêm border và đổi màu khi được chọn
                            : 'text-gray-600'}`}
                    >
                        {type.label}
                    </button>
                ))}
            </div>
            <div className='flex items-start  w-full'>
                <span className="md-lg:text-[10px] font-bold text-blue-700 mr-1 ms:text-[12px]">{medicine?.options?.[0].price.toLocaleString()} đ </span>
                <span className='text-blue-700 md-lg:text-[10px] text-sm capitalize ms:text-[12px]'>/ hộp</span>
            </div>
            <div className="w-full flex items-start">
                <p className=" bg-gray-300 p-2 rounded-lg text-[13px] font-semibold text-gray-600 ">{medicine?.specification}</p>
            </div>
            <button className="bg-blue-700 text-white font-bold py-2 items-center rounded-full w-full text-sm">
                Chọn mua
            </button>
        </div>
    )
}
