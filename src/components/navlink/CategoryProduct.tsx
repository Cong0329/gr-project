import medicine from '../../assets/category-icons/paracetamol.png';
import { Link } from 'react-router-dom';

interface CategoryProductProps {
    id: number;
    name: string;
    image: string;
    price: number;
}

const medicines: CategoryProductProps[] = [
    {
        id: 1,
        name: "Cetirizine",
        image: medicine,
        price: 100000
    },
    {
        id: 2,
        name: "Cetirizine",
        image: medicine,
        price: 100000
    },
    {
        id: 3,
        name: "Cetirizine",
        image: medicine,
        price: 100000
    },
    {
        id: 4,
        name: "Cetirizine",
        image: medicine,
        price: 100000
    },
    {
        id: 5,
        name: "Cetirizine",
        image: medicine,
        price: 100000
    },
]

export const CategoryProduct = () => {
    return (
        <div className=''>
            <div className='flex items-center'>
                <p className="text-[16px] font-bold my-4">Bán chạy nhất</p>
                <span className='border-l-2 border-gray-300 mx-2 h-4'></span>
                <Link to="/" className="flex">
                    <p className="my-4 text-blue-700">Xem tất cả</p>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 m-auto text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
            <div className="grid grid-cols-5 gap-2 w-full">
                {medicines.map((medicine: CategoryProductProps) => (
                    <div className="flex flex-col items-start" key={medicine.id}>
                        <img src={medicine.image} alt={medicine.name} className="w-32 h-32 bg-white rounded-lg p-4" />
                        <div className="w-full mt-2 h-16 text-sm overflow-hidden text-ellipsis">
                            <p className="line-clamp-3">
                            {medicine.name}
                            </p>
                        </div>

                        <div className='flex'>
                            <span className="mt-1 font-bold text-blue-700">{medicine.price.toLocaleString()} đ</span>
                            <span className='text-blue-700 mt-1 text-sm'>/ hộp</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    )
}
