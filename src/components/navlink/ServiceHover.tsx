import { CategoryList } from "./CategoryList";
import { CategoryChild } from "./CategoryChild";
import { CategoryProduct } from "./CategoryProduct";

export interface ServiceHoverProps {
    id: number;
    name: string;
    image: string;
}

export const ServiceHover = () => {
   
    return (
        <div className="absolute left-0 z-10 w-full p-5 bg-gray-100 rounded-b-lg">
            <div className="flex">
                <CategoryList />
                <div className="flex flex-col bg-black bg-opacity-5 w-3/4 rounded-r-lg p-5">
                    <CategoryChild />
                    <CategoryProduct />
                </div>
            </div>

        </div>

    )
}
