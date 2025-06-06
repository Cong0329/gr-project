import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { useEffect, useState } from 'react';
import { fetchAddresses, deleteAddressAPI } from '../../../redux/addressAsyncThunk';
import AddAddressModal from '../../cart/AddAddressModal';
import { ModalDelete } from '../../cart/ModalDelete';
import { resetAddress } from '../../../redux/addressSlice';
import Skeleton from 'react-loading-skeleton';

export const AddressPage = () => {

    const dispatch: AppDispatch = useDispatch();
    const { status, addresses } = useSelector((state: RootState) => state.address);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isModal, setIsModal] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState('');
    const [isDelete, setIsDelete] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1000)
    }, [])

    const handleEdit = (id: string) => {
        setIsAddingNew(true);
        setIsEdit(true);
        dispatch(resetAddress());
        setSelectedEdit(id); // Cập nhật ID địa chỉ được chỉnh sửa
    };
    const handleAddNew = () => {
        setIsAddingNew(true);
        setIsEdit(false);
    };
    useEffect(() => {

        dispatch(fetchAddresses());

    }, [dispatch]);

    useEffect(() => {
        if (status === 'succeeded') {
            dispatch(fetchAddresses());
        }
    }, [dispatch, status]);
    const handleOpenDelet = (id: string) => {
        setIsDelete(true);
        setSelectedEdit(id);
    }
    const handleDelete = () => {
        dispatch(deleteAddressAPI(selectedEdit));
        setIsAddingNew(false);
    }
    const addr = [1, 2, 3, 4, 5, 6, 7, 8]

    let content;

    if (isLoading) {
        content = (
            <>
                {addr.map((index) => (
                    <div key={index} className={`p-4 flex justify-between items-center ${index !== 2 ? 'border-b' : ''}`}>
                        <div className=''>
                            <div className="flex gap-2 items-center">
                                <Skeleton className="font-medium h-5 w-36 bg-gray-200 rounded"></Skeleton>
                                <span className="border h-5"></span>
                                <Skeleton className="h-5 w-32 bg-gray-200 rounded"></Skeleton>
                            </div>
                            <div className="text-gray-600 mt-1">
                                <Skeleton className="h-5 w-[500px] bg-gray-200 rounded"></Skeleton>
                            </div>
                            <div className="flex items-center mt-2 gap-4">
                                <Skeleton className="h-5 w-16 bg-gray-200 rounded"></Skeleton>
                                <Skeleton className="h-5 w-16 bg-gray-200 rounded"></Skeleton>

                            </div>
                        </div>
                        <div className="flex justify-end items-center space-x-2">
                            <button className="text-blue-600" disabled>
                                <Skeleton className="h-5 w-12 bg-gray-200 rounded"></Skeleton>
                            </button>
                            <span className='border h-5'></span>
                            <button className="text-red-600" disabled>
                                <Skeleton className="h-5 w-12 bg-gray-200 rounded"></Skeleton>
                            </button>
                        </div>
                    </div>
                ))}</>
        );
    } else if (addresses.length > 0) {
        content = (
            <>
                {addresses.map((address, index) => (
                    <div key={address.id} className={`p-4 flex justify-between items-center ${index !== addresses.length - 1 ? 'border-b' : ''}`}>
                        <div className=''>
                            <div className="flex gap-2 items-center">
                                <div className="font-medium">{address.name}</div>
                                <span className="border h-4"></span>
                                <div>{address.phone}</div>
                            </div>
                            <div className="text-gray-600 mt-1">
                                {address.street}, {address.ward}, {address.district}, {address.province}
                            </div>
                            <div className="flex items-center mt-2">
                                <div className="bg-gray-100 px-2 py-1 rounded text-xs mr-2">
                                    {address.type === "nhà" ? (
                                        <span className="mr-1">🏠</span>
                                    ) : (
                                        <span className="mr-1">🏢</span>
                                    )}
                                    {address.type}
                                </div>
                                {address.default_address && (
                                    <div className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
                                        Mặc định
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end items-center space-x-2">
                            <button className="text-blue-600" onClick={() => handleEdit(address.id)}>Sửa</button>
                            <span className='border h-4'></span>
                            <button className="text-red-600" onClick={() => handleOpenDelet(address.id)}>Xóa</button>
                        </div>
                    </div>
                ))}</>
        );
    } else {
        content = (
            <div className="flex items-center justify-center flex-col p-12">
                <div className="w-96 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <img src="https://imgur.com/wJtkO6K.png" alt="" className="w-full" loading="lazy" />
                </div>
                <div className="text-lg font-medium mb-1">Bạn chưa có đơn hàng nào.</div>
                <div className="text-gray-500">Cùng khám phá hàng ngàn sản phẩm tại Nhà thuốc FPT Long Châu nhé!</div>
                <button className="font-semibold text-white bg-blue-600 px-16 py-2 rounded-full mt-4">Khám phá ngay</button>
            </div>
        );
    }


    return (
        <div className="pt-2 ">
            <div className="flex justify-between mb-6 ms:flex-col gap-2">
                <h2 className="text-2xl font-bold">Quản lý số địa chỉ</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg ms:w-3/4" onClick={handleAddNew}>Thêm địa chỉ mới</button>
            </div>
            <div className="space-y-2 bg-white rounded-xl">
                {content}
            </div>
            {isAddingNew && (
                <AddAddressModal isModal={isModal} isOpen={isAddingNew} onClose={() => setIsAddingNew(false)} isEdit={isEdit} selectedEdit={selectedEdit} />
            )}
            {isDelete && (
                <ModalDelete
                    message="Bạn có chắc chắn muốn xóa địa chỉ này?"
                    onClose={() => setIsDelete(false)}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};