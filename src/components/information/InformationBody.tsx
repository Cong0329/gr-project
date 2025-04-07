import Sidebar from './SiderBar';
import MainContent from './MainContent';
import { useState, useEffect } from 'react';
import { NavLink } from '../navlink/NavLink';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { setActivePage } from '../../redux/navigationSlice';
import { validPageIds } from './menuItems';
import Breadcrumb from '../home_booking/details/component_details/BreadCrumb';


export const InformationBody = () => {
    const [isServiceHovered, setIsServiceHovered] = useState(false);
    const { pageId } = useParams<{ pageId: string }>();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (pageId && validPageIds.includes(pageId as any)) {
            dispatch(setActivePage(pageId));
        } else {
            navigate('/profile/personal-info', { replace: true });
        }
    }, [pageId, dispatch, navigate]);
    return (
        <main className="flex-1 bg-gray-100 ">
            <div className="mx-auto bg-white pt-2 ">
                <NavLink setIsServiceHovered={setIsServiceHovered} />
            </div>
            <div className='relative'>
                <div className="mx-auto relative w-4/5 bg-gray-100 pb-4 container">
                    <div className="  mx-auto bg-gray-100  [&>*]:!bg-gray-100">
                        <Breadcrumb  />
                    </div>
                    <div className="flex  w-full gap-10">
                        <div className='w-1/5'>
                            <Sidebar />

                        </div>
                        <div className='w-4/5'>
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
