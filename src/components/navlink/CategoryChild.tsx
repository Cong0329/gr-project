import { ServiceHoverProps } from "./ServiceHover";
import { Link } from "react-router-dom";




export const CategoryChild = ({ items }: { items: ServiceHoverProps[] }) => {
    return (
        <div className="flex flex-col gap-2">  
            <p className="text-left">Danh mục</p>
            <div className="grid grid-cols-3 gap-2 w-full border-b-2 border-gray-300 pb-4">

                {items.map((item: ServiceHoverProps) => (
                    <Link to={`/medicine-search/?category=${item.name}`} key={item.id}>
                    <div className="flex items-center bg-white rounded-lg p-4 h-16">
                        <span>{item.name}</span>
                    </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
