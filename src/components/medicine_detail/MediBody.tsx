import { useState } from 'react';
import { NavLink } from '../navlink/NavLink';
import { useParams } from 'react-router-dom';
import ProductDetail from './MediDetail';
import Breadcrumb from '../home_booking/details/component_details/BreadCrumb';





export const MedicineBody = () => {
    const [isServiceHovered, setIsServiceHovered] = useState(false);
    const { name } = useParams();
    return (
        <main className="flex-1 bg-gray-100 ">
            <div className="mx-auto bg-white pt-2">
                <NavLink setIsServiceHovered={setIsServiceHovered} />
            </div>
            <div className='relative'>
                <div className="mx-auto relative ">
                    <div className="w-4/5 tb:w-11/12 container mx-auto bg-gray-100  [&>*]:!bg-gray-100">
                        <Breadcrumb current={decodeURIComponent(name || "Thực phẩm chức năng")} />
                    </div>
                    <ProductDetail />
                </div>
                {isServiceHovered && (
                    <div className="absolute inset-0 bg-blue-950 bg-opacity-30 z-5">    </div>
                )}
            
           

            </div>
        </main>
    )
}
