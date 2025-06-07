import { useState } from 'react';
import { NavLink } from '../navlink/NavLink';
import { Banner } from "./banner/Banner";
import { Promotion } from './promotion/Promotion';
import { Medicines } from './medicines/medicines';
import ProductSlider from './brand/brand';
import HealthSection from './healthy/healthy';
import CategoriesSection from './feature/Categories';
import ProductForAge from './product_for_age/product_for_age';



export const Body = () => {
    const [isServiceHovered, setIsServiceHovered] = useState(false);

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
        </main>
    )
}
