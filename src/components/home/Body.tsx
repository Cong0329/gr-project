import { useState } from 'react';
import { NavLink } from '../navlink/NavLink';
import { Banner } from "./banner/Banner";
import { Promotion } from './promotion/Promotion';
import { Medicines } from './medicines/medicines';
import ProductSlider from './brand/brand';
import HealthSection from './healthy/healthy';
import CategoriesSection from './feature/categories';
import ProductForAge from './product_for_age/product_for_age';
import ProductList from './product_for_age/product_section';
import DiseaseList from './sick/sick';

export const Body = () => {
    const [isServiceHovered, setIsServiceHovered] = useState(false);

    return (
        <main className="flex-1 bg-gray-100 ">
            <div className="container mx-auto">
                <NavLink setIsServiceHovered={setIsServiceHovered} />
            </div>
            <div className='relative'>
                <div className="mx-auto relative">
                    <Banner />
                    <Promotion/>
                    <Medicines/>
                    <ProductSlider/>
                    <HealthSection/>
                    <CategoriesSection/>
                    <ProductForAge/>
                    <ProductList/>
                    <DiseaseList/>
                </div>
                {isServiceHovered && (
                    <div className="absolute inset-0 bg-blue-950 bg-opacity-30 z-5">    </div>
                )}
            </div>
        </main>
    )
}
