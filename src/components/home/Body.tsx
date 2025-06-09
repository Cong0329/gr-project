import { useState } from 'react';
import { NavLink } from '../navlink/NavLink';
import { Banner } from "./banner/Banner";
import { Promotion } from './promotion/Promotion';
import { Medicines } from './medicines/medicines';
import ProductSlider from './brand/brand';
import HealthSection from './healthy/healthy';
import CategoriesSection from './feature/categories';
import ProductForAge from './product_for_age/product_for_age';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';


export const Body = () => {
    const [isServiceHovered, setIsServiceHovered] = useState(false);
    const { status } = useSelector((state: RootState) => state.products);

    return (
        <main className="flex-1 bg-gray-100 ">
            <div className="mx-auto bg-white pt-2 ">
                <NavLink setIsServiceHovered={setIsServiceHovered} />
            </div>
            <div className='relative'>
                <div className="mx-auto relative  pb-4">
                    <Banner />
                    <Promotion />
                    <Medicines />
                    <ProductSlider />
                    <HealthSection />
                    <CategoriesSection />
                    <ProductForAge />
                </div>
                {isServiceHovered && (
                    <div className="absolute inset-0 bg-blue-950 bg-opacity-30 z-5">    </div>
                )}
            </div>
            {status === "loading" &&
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-white text-sm">Đang tải...</p>
                    </div>
                </div>
            }
        </main>
    )
}
