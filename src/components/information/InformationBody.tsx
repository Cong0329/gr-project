import Sidebar from './SiderBar';
import MainContent from './MainContent';
import { useState, useEffect } from 'react';
import { NavLink } from '../navlink/NavLink';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setActivePage } from '../../redux/navigationSlice';
import { validPageIds } from './menuItems';
import Breadcrumb from '../home_booking/details/component_details/BreadCrumb';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchCarts } from '../../redux/cartAsyncThunk';
import { resetOrder } from '../../redux/orderSlice';


export const InformationBody = () => {
    const [isServiceHovered, setIsServiceHovered] = useState(false);
    const { pageId } = useParams<{ pageId: string }>();
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const { reset } = useSelector((state: RootState) => state.order);
    useEffect(() => {
        if (reset) {
            dispatch(fetchCarts());
            dispatch(resetOrder());
        }
    }, [dispatch, reset]);

    useEffect(() => {
        if (pageId && validPageIds.includes(pageId as any)) {
            dispatch(setActivePage(pageId as any));
        } else {
            navigate('/profile/personal-info', { replace: true });
        }
    }, [pageId, dispatch, navigate]);
    return (
        <main className="flex-1 bg-gray-100  ">
            <div className="mx-auto bg-white pt-2 ">
                <NavLink setIsServiceHovered={setIsServiceHovered} />
            </div>
            <div className='relative'>
                <div className="mx-auto relative w-4/5 md-lg:w-11/12 bg-gray-100 pb-4 container tb:w-full">
                    <div className="  mx-auto bg-gray-100  [&>*]:!bg-gray-100 tb:px-2">
                        <Breadcrumb />
                    </div>
                    <div className="flex  w-full gap-10 md-lg:gap-5">
                        <div className='w-1/5 tb:hidden md-lg:w-1/4'>
                            <Sidebar />

                        </div>
                        <div className='w-4/5 h-full tb:w-full tb:px-2 md-lg:w-3/4'>
                            <MainContent />

                        </div>
                    </div>
                </div>
                {isServiceHovered && (
                    <div className="absolute inset-0 bg-blue-950 bg-opacity-30 z-5">    </div>
                )}
            </div>
        </main>

    );
};
