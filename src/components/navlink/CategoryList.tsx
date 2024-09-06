import { Link } from "react-router-dom";
import vitamin from '../../assets/category-icons/vitamin.png'
import { ServiceHoverProps } from "./ServiceHover";

export const CategoryList = () => {
    const categorys: ServiceHoverProps[] = [
        { id: 1, name: 'Vitamin & Khoáng chất', image: vitamin },
        { id: 2, name: 'Dược mỹ phẩm', image: vitamin },
        { id: 3, name: 'Chăm sóc cá nhân', image: vitamin },
        { id: 4, name: 'Thuốc', image: vitamin },
        { id: 5, name: 'Thiết bị y tế', image: vitamin },
        { id: 6, name: 'Bệnh', image: vitamin },
        { id: 7, name: 'Góc sức khỏe', image: vitamin }
    ];
    return (
        <div className="flex flex-col w-1/4 text-gray-500">
            {categorys.map((category: ServiceHoverProps) => (
                <div
                    key={category.id}
                    className=' hover:text-black h-[42px] hover:bg-black hover:bg-opacity-5 px-5 rounded-l-lg items-center group w-full text-left'
                    onMouseEnter={() => {
                        const prevElement = document.querySelector(`[data-id="${category.id - 1}"]`);
                        if (prevElement) {
                            prevElement.classList.remove('border-b-2');
                        }
                    }}
                    onMouseLeave={() => {
                        const prevElement = document.querySelector(`[data-id="${category.id - 1}"]`);
                        if (prevElement && category.id !== 1) {
                            prevElement.classList.add('border-b-2');
                        }
                    }}
                    role="menuitem"
                    tabIndex={0}
                >
                    <Link
                        className={` box-border  flex space-x-2 py-2 ${category.id !== categorys.length ? 'border-b-2' : ''}`}
                        to={`/`}
                        data-id={category.id}
                    >
                        <img src={category.image} alt={category.name} />
                        <span>{category.name}</span>
                    </Link>
                </div>

            ))}
        </div>
    )
}
