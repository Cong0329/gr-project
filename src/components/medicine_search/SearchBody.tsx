import { useState } from "react";
import { NavLink } from "../navlink/NavLink";
import SearchBar from "./SearchBar";
import FilterSidebar from "./FilterSidebar";
import ProductGrid from "./ProductGrid";
import {ModalFilter} from "./ModalFilter";
import PriceFilter from "./PriceFilter";


export const SearchBody = () => {
    const [isServiceHovered, setIsServiceHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState<string>("popular");
    return (
        <main className="flex-1 bg-gray-100 ">
            <div className="mx-auto bg-white pt-2">
                <NavLink setIsServiceHovered={setIsServiceHovered} />
            </div>
            <div className='relative'>
                <div className="mx-auto relative pb-4">
                    <div className="bg-gray-100 min-h-screen mt-4 w-4/5 tb:w-11/12 mx-auto container">
                        {/* Thanh tìm kiếm */}
                        <SearchBar />
                        <ModalFilter isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                        <div className="container mx-auto flex gap-4 mt-4">
                            {/* Bộ lọc */}
                            <div className="w-1/4 tb:hidden">
                                <FilterSidebar />
                            </div>

                            {/* Danh sách sản phẩm */}
                            <div className="w-3/4 tb:w-full">
                                <div className="flex justify-between items-center">
                                    <h2 className="font-semibold text-xl tb:hidden">Danh sách sản phẩm</h2>
                                    <PriceFilter onSelect={setSortOrder} onClose={setIsModalOpen} />
                                </div>
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