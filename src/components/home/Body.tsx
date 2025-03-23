import { useState } from 'react';
import { NavLink } from '../navlink/NavLink';
import { Banner } from "./banner/Banner";
import { Promotion } from './promotion/Promotion';
import { Medicines } from './medicines/Medicines';
import ProductSlider from './brand/Brand';
import HealthSection from './healthy/Healthy';
import CategoriesSection from './feature/Categories';
import ProductForAge from './product_for_age/Product_for_age';
import ProductList from './product_for_age/Product_section';
import DiseaseList from './sick/Sick';


export const Body = () => {
    const [isServiceHovered, setIsServiceHovered] = useState(false);

    return (
        <main className="flex-1 bg-white ">
            <div className="mx-auto">
                <NavLink setIsServiceHovered={setIsServiceHovered} />
            </div>
            <div className='relative'>
                <div className="mx-auto relative bg-gray-100">
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
