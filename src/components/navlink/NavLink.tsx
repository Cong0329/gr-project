import { Service } from "./Service";
import { ServiceHoverProps } from "./ServiceHover";
import { CategoryProductProps } from "./CategoryProduct";
import { useDispatch, useSelector } from "react-redux";
import { getParentCategory } from "../../redux/categoryAsyncThunk";
import { AppDispatch, RootState } from "../../redux/store";
import { useEffect, useState } from "react";

export interface CategoryGroup {
    id: number;
    name: string;
    categories: {
        id: number;
        name: string;
        image: string;
        children: ServiceHoverProps[];
        products: CategoryProductProps[];
    }[];
}
const name = [
    "Thực phẩm chức năng",
    "Dược mỹ phẩm",
    "Chăm sóc cá nhân",
];


export const NavLink = ({ setIsServiceHovered }: { setIsServiceHovered: (isHovered: boolean) => void }) => {

    const [popularSearches, setPopularSearches] = useState<CategoryGroup[]>([
        {
            id: 4, name: 'Bệnh', categories: []
        },
        {
            id: 5, name: 'Góc sức khỏe', categories: []
        }
    ]);

    const dispatch: AppDispatch = useDispatch();
    const { parent } = useSelector((state: RootState) => state.categories);
    useEffect(() => {
        if (parent.length === 0) {
            name.forEach((item: string) => {
                dispatch(getParentCategory(item));
            });
        }
    }, [dispatch, parent]);

    useEffect(() => {
        if (parent.length > 0) {
            setPopularSearches(prev => {
                const newGroups = parent.map(group => ({
                    id: group.id,
                    name: group.name,
                    categories: group.categories
                }));
    
                // Tránh thêm trùng
                const existingIds = new Set(prev.map(g => g.id));
                const merged = [
                    ...prev,
                    ...newGroups.filter(g => !existingIds.has(g.id))
                ];
    
                return merged;
            });
        }
    }, [parent]);
    
    return (
        <div className="mx-auto w-4/5 container md-lg:w-11/12 tb:hidden">
            <ul className="flex flex-wrap justify-center relative w-full h-9 mx-auto">
                {popularSearches.map((item: CategoryGroup) => (
                    <Service item={item} key={item.id} setIsServiceHovered={setIsServiceHovered} />
                ))}
            </ul>
        </div>
    )
}
