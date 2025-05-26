import { useState } from "react";
import { CategoryList } from "./CategoryList";
import { CategoryChild } from "./CategoryChild";
import { CategoryProduct, CategoryProductProps } from "./CategoryProduct";


export interface ServiceHoverProps {
    id: number;
    name: string;
    image: string;
}


export const ServiceHover = ({ items }: { items: { id: number; name: string; image: string; children: ServiceHoverProps[]; products: CategoryProductProps[]; }[] }) => {
   
    const [hoveredCategoryId, setHoveredCategoryId] = useState<number>(items[0].id);

    const currentCategory = items.find((cat) => cat.id === hoveredCategoryId);

    return (
        <div className="absolute left-0 z-20 w-full p-5 bg-gray-100 rounded-b-lg">
            <div className="flex">
                <CategoryList
                    categories={items}
                    onHover={(id) => setHoveredCategoryId(id)}
                />
                <div className="flex flex-col bg-black bg-opacity-5 w-3/4 rounded-r-lg p-5">
                    {currentCategory && (
                        <>
                            <CategoryChild items={currentCategory.children} />
                            <CategoryProduct products={currentCategory.products} parent={currentCategory.name} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
