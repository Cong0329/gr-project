import { Service } from "./Service";

interface NavLinkProps {
    id: number;
    name: string;
}

export const NavLink = ({setIsServiceHovered}: {setIsServiceHovered: (isHovered: boolean) => void}) => {
    const popularSearches: NavLinkProps[] = [
        { id: 1, name: 'Thực phẩm chức năng' },
        { id: 2, name: 'Dược mỹ phẩm' },
        { id: 3, name: 'Chăm sóc cá nhân' },
        { id: 4, name: 'Thuốc' },
        { id: 5, name: 'Thiết bị y tế' },
        { id: 6, name: 'Bệnh' },
        { id: 7, name: 'Góc sức khỏe' }
    ];
    return (
        <div className="mx-auto w-full">
            <ul className="flex flex-wrap justify-center mt-2 relative w-[943px] h-9 mx-auto">
                {popularSearches.map((item: { id: number; name: string }) => (
                    <Service item={item} key={item.id} setIsServiceHovered={setIsServiceHovered} />
                ))}
            </ul>
        </div>
    )
}
