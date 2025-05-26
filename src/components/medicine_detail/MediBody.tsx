import { useEffect, useState } from 'react';
import { NavLink } from '../navlink/NavLink';
import { useParams } from 'react-router-dom';
import ProductDetail from './MediDetail';
import Breadcrumb from '../home_booking/details/component_details/BreadCrumb';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { getProductBySlug, getProductDetailProduct, getProductReview } from '../../redux/productAsyncThunk';





export const MedicineBody = () => {
    const dispatch:AppDispatch = useDispatch();
    const [isServiceHovered, setIsServiceHovered] = useState(false);
    const { status, product } = useSelector((state: RootState) => state.products);
    const { slug } = useParams();
    useEffect(() => {
        dispatch(getProductBySlug(slug as string));
    }, [dispatch, slug]);   
    useEffect(() => {
        if (product.id) {
            dispatch(getProductDetailProduct(product.id));
            dispatch(getProductReview(product.id));
        }
    }, [dispatch, product]);
    return (
        <main className="flex-1 bg-gray-100 ">
            <div className="mx-auto bg-white pt-2">
                <NavLink setIsServiceHovered={setIsServiceHovered} />
            </div>
            <div className='relative'>
                <div className="mx-auto relative ">
                    <div className="w-4/5 tb:w-11/12 container mx-auto bg-gray-100  [&>*]:!bg-gray-100">
                        <Breadcrumb current={decodeURIComponent(slug || "Thực phẩm chức năng")} />
                    </div>
                    {product.name ? <ProductDetail /> : <div className='h-[600px] w-full'></div>}
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
