import { useRef } from "react";


export const BrandCard = ({ brand, navigate }: { brand: any; navigate: any })  =>{
    const drag = useRef(false);

    const handleMouseDown = () => {
        drag.current = false;
    };

    const handleMouseMove = () => {
        drag.current = true;
    };

    const handleClick = () => {
        if (!drag.current) {
            navigate(`/medicine-search?brand=${brand.name}`);
        }
    };

    return (
        <div
            className="pr-2"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
        >
            <div className="border-2 border-transparent hover:border-blue-500 rounded-lg transition-all duration-300">
                <div className="flex flex-col justify-center items-center">
                    <div className="w-full pt-2  bg-white flex flex-col items-center justify-center rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <img
                            src={brand.products[0]?.images[0]?.image}
                            className="w-28 h-auto tb:w-24 object-fit"
                            loading="lazy"
                            alt={brand.name}
                        />
                        <div className="border-2 rounded-lg border-gray-200 py-2 px-3 mt-2">
                            <img
                                src={brand.logo}
                                alt="logo"
                                className="w-20 tb:w-16 object-fit "
                                loading="lazy"
                            />
                        </div>
                        <div className="text-lg font-semibold text-blue-700 my-5 tb:text-sm">
                            Giảm đến 20%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
