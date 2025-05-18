import { Service } from "./Service";
import { ServiceHoverProps } from "./ServiceHover";
import { CategoryProductProps } from "./CategoryProduct";
import { popularSearches } from "./data";

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
  

export const NavLink = ({setIsServiceHovered}: {setIsServiceHovered: (isHovered: boolean) => void}) => {

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
