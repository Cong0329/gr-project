interface Medicine {
  id: string;
  image: string;
  name: string;
  type: string[];
  price: number;
}

interface PromotionChildProps {
  medicine: Medicine;
  handleTypeClick: (type: string, medicineId: string) => void;
  selectedType: { [key: string]: string };
}

export const PromotionChild: React.FC<PromotionChildProps> = ({ medicine, handleTypeClick, selectedType }) => {
    const columns = medicine.type.length;
    return (
        <div key={medicine.id} className="item-box border rounded-lg bg-white flex flex-col items-center p-4 space-y-2">
            <img src={medicine.image} alt={medicine.name} loading="lazy" className="h-40" />
            <div className="w-full mt-2 h-16 text-black font-semibold text-sm overflow-hidden text-ellipsis">
                <p className="line-clamp-3">
                    {medicine.name}
                </p>
            </div>
            <div className={`grid grid-cols-${columns} gap-2 bg-gray-300 rounded-lg w-full h-9`}>
                {medicine.type.map((type) => (
                    <button
                        key={type}
                        onClick={() => handleTypeClick(type, medicine.id)}
                        className={`p-1.5 capitalize text-[13px] font-semibold ${selectedType[medicine.id] === type
                            ? 'text-blue-700 border border-blue-700 rounded-lg' // Thêm border và đổi màu khi được chọn
                            : 'text-gray-600'}`}
                    >
                        {type}
                    </button>
                ))}
            </div>
            <div className='flex items-start  w-full'>
                <span className="mt-1 font-bold text-blue-700 mr-1">{medicine.price.toLocaleString()} đ </span>
                <span className='text-blue-700 mt-1.5 text-sm capitalize'>/ hộp</span>
            </div>
            <div className="w-full flex items-start">
                <p className=" bg-gray-300 p-2 rounded-lg text-[13px] font-semibold text-gray-600">Hộp 3 Hộp lẻ x 5 Gói x 70ml</p>
            </div>
            <button className="bg-blue-700 text-white font-bold py-2 px-10 rounded-full w-full">
                Chọn mua
            </button>
        </div>
    )
}
