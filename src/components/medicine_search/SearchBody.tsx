import { useState, useEffect } from "react";
import { NavLink } from "../navlink/NavLink";
import SearchBar from "./SearchBar";
import FilterSidebar from "./FilterSidebar";
import ProductGrid from "./ProductGrid";
import { ModalFilter } from "./ModalFilter";
import PriceFilter from "./PriceFilter";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { searchMedicine } from "../../redux/sliceAsyncThunk";
import { Product } from "../../redux/searchSlice";
import { getBrandProduct } from "../../redux/brandAsyncThunk";
import { getCategoryProduct } from "../../redux/categoryAsyncThunk";
import Breadcrumb from "../home_booking/details/component_details/BreadCrumb";

export const SearchBody = () => {
    const [isServiceHovered, setIsServiceHovered] = useState(false);
    const dispatch: AppDispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");
    const { products } = useSelector((state: RootState) => state.search);
    const selectedFilters = useSelector((state: RootState) => state.filters.selectedFilters);
    const filterProducts = (products: Product[], filters: Record<string, string[]>) => {
        return products.filter((product) => {
            // 1. Loại sản phẩm
            if (
                filters["Loại sản phẩm"]?.length &&
                !filters["Loại sản phẩm"].includes("Tất cả") &&
                !filters["Loại sản phẩm"].includes(product.category?.name)
            ) {
                return false;
            }

            // 2. Chỉ định
            if (
                filters["Chỉ định"]?.length &&
                !filters["Chỉ định"].includes("Tất cả") &&
                !filters["Chỉ định"].includes(product.indication?.name)
            ) {
                return false;
            }

            // 3. Đối tượng sử dụng
            if (
                filters["Đối tượng sử dụng"]?.length &&
                !filters["Đối tượng sử dụng"].includes("Tất cả") &&
                !filters["Đối tượng sử dụng"].includes(product.medical_object?.name)
            ) {
                return false;
            }

            // 4. Loại thuốc (boolean => string)
            if (
                filters["Loại thuốc"]?.length &&
                !filters["Loại thuốc"].includes("Tất cả")
            ) {
                const typeLabel = product.type ? "Thuốc kê đơn" : "Thuốc không kê đơn";
                if (!filters["Loại thuốc"].includes(typeLabel)) return false;
            }

            // 5. Giá bán (chỉ lọc khi có giá trị cụ thể)
            if (filters["Giá bán"]?.length) {
                const ranges = filters["Giá bán"].map((label) => {
                    if (label.includes("Dưới")) return { min: 0, max: 100000 };
                    if (label.includes("Trên")) return { min: 500000, max: Infinity };

                    const cleanedLabel = label.replace(/\./g, ""); // Xoá dấu . phân cách nghìn
                    const match = cleanedLabel.match(/(\d+)[^\d]+(\d+)/); // Match 2 con số
                    if (match) {
                        return {
                            min: parseInt(match[1], 10),
                            max: parseInt(match[2], 10),
                        };
                    }
                    return null;
                }).filter(Boolean) as { min: number; max: number }[];

                const priceOption = product.options?.[0];
                const productPrice = Number(
                    priceOption?.discounted_price !== 0 && priceOption?.discounted_price
                        ? priceOption?.discounted_price
                        : priceOption?.price || 0
                );

                const inAnyRange = ranges.some(({ min, max }) => productPrice >= min && productPrice <= max);
                if (!inAnyRange) return false;
            }



            // 6. Nước sản xuất
            if (
                filters["Nước sản xuất"]?.length &&
                !filters["Nước sản xuất"].includes("Tất cả") &&
                !filters["Nước sản xuất"].includes(product.brand?.country)
            ) {
                return false;
            }

            // 7. Thương hiệu
            if (
                filters["Thương hiệu"]?.length &&
                !filters["Thương hiệu"].includes("Tất cả") &&
                !filters["Thương hiệu"].includes(product.brand?.name)
            ) {
                return false;
            }

            // 8. Xuất xứ thương hiệu
            if (
                filters["Xuất xứ thương hiệu"]?.length &&
                !filters["Xuất xứ thương hiệu"].includes("Tất cả") &&
                !filters["Xuất xứ thương hiệu"].includes(product.brand?.original)
            ) {
                return false;
            }

            return true;
        });
    };
    const filteredProducts = filterProducts(products, selectedFilters);
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const getPrice = (product: Product) => {
          const option = product.options?.[0];
          const price = Number(option?.discounted_price || option?.price || "0");
          return isNaN(price) ? 0 : price;
        };
      
        const priceA = getPrice(a);
        const priceB = getPrice(b);
      
        if (sortOrder === "asc") return priceA - priceB;
        if (sortOrder === "desc") return priceB - priceA;
        return 0; // Không sắp xếp nếu sortOrder = "none"
      });
      
    const name = searchParams.get("name");
    const brandName = searchParams.get("brand");
    const categoryName = searchParams.get("category");
    const category = [...new Set(products.map((product) => product?.category?.name))];
    const brand = [...new Set(products.map((product) => product?.brand?.name))];
    const country = [...new Set(products.map((product) => product?.brand?.country))];
    const original = [...new Set(products.map((product) => product?.brand?.original))];
    const medical_object = [...new Set(products.map((product) => product?.medical_object?.name))];
    const indication = [...new Set(products.map((product) => product?.indication?.name))];
    

    useEffect(() => {
        if (name) {
            dispatch(searchMedicine(name));
        }
        if (brandName) {
            dispatch(getBrandProduct(brandName));
        }
        if (categoryName) {
            dispatch(getCategoryProduct(categoryName));
        }
    }, [name, brandName, categoryName, dispatch]);
    return (
        <main className="flex-1 bg-gray-100 ">
            <div className="mx-auto bg-white pt-2">
                <NavLink setIsServiceHovered={setIsServiceHovered} />
            </div>
            <div className='relative'>
                <div className="mx-auto relative pb-4">
                    <div className="bg-gray-100 min-h-screen mt-4 w-4/5 tb:w-11/12 mx-auto container">
                        {/* Thanh tìm kiếm */}
                        {name && (
                            <SearchBar name={name ?? ""} find={products.length} />
                        )}
                        {(brandName || categoryName) && (
                            <Breadcrumb />
                        )}
                        <ModalFilter category={category} brand={brand} country={country} original={original} medical_object={medical_object} indication={indication} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                        <div className="container mx-auto flex gap-4 mt-4">
                            {/* Bộ lọc */}
                            <div className="w-1/4 tb:hidden">
                                <FilterSidebar category={category} brand={brand} country={country} original={original} medical_object={medical_object} indication={indication} />
                            </div>

                            {/* Danh sách sản phẩm */}
                            <div className="w-3/4 tb:w-full">
                                <div className="flex justify-between items-center">
                                    <h2 className="font-semibold text-xl tb:hidden">Danh sách sản phẩm</h2>
                                    <PriceFilter onSelect={setSortOrder} onClose={setIsModalOpen} />
                                </div>
                                <ProductGrid products={sortedProducts} />
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