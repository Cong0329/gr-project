import { useState } from "react";
import { NavLink } from "../navlink/NavLink";
import SearchBar from "./SearchBar";
import FilterSidebar from "./FilterSidebar";
import ProductGrid from "./ProductGrid";

export const SearchBody = () => {
    const [isServiceHovered, setIsServiceHovered] = useState(false);
    return (
        <main className="flex-1 bg-white ">
            <div className="mx-auto">
                <NavLink setIsServiceHovered={setIsServiceHovered} />
            </div>
            <div className='relative'>
                <div className="mx-auto relative bg-gray-100 pb-4">
                    <div className="bg-gray-100 min-h-screen p-4">
                        {/* Thanh tìm kiếm */}
                        <SearchBar />

                        <div className="container mx-auto flex gap-4 mt-4">
                            {/* Bộ lọc */}
                            <div className="w-1/4">
                                <FilterSidebar />
                            </div>

                            {/* Danh sách sản phẩm */}
                            <div className="w-3/4">
                                <ProductGrid />
                            </div>
                        </div>
                    </div>
                </div>
                {isServiceHovered && (
                    <div className="absolute inset-0 bg-blue-950 bg-opacity-30 z-5">    </div>
                )}
            </div>
        </main>

    )
}