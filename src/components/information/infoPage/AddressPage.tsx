import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useEffect, useState } from 'react';
import { fetchAddresses, deleteAddressAPI } from '../../../redux/addressAsyncThunk';
import AddAddressModal from '../../cart/AddAddressModal';
import { ModalDelete } from '../../cart/ModalDelete';
import { resetAddress } from '../../../redux/addressSlice';

export const AddressPage = () => {

    const dispatch = useDispatch();
    const addresses = useSelector((state: RootState) => state.address.addresses);
    const status = useSelector((state: RootState) => state.address.status);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isModal, setIsModal] = useState(true);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedEdit, setSelectedEdit] = useState('');
    const [isDelete, setIsDelete] = useState(false);
    
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
    }, [dispatch, status]);

    const handleOpenDelet = (id: string) => {
        setIsDelete(true);
        setSelectedEdit(id);
    }
    const handleDelete = () => {
        dispatch(deleteAddressAPI(selectedEdit));
        setIsAddingNew(false);
    }
    return (
        <div className="p-6 ">
            <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-bold">Quản lý số địa chỉ</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg" onClick={handleAddNew}>Thêm địa chỉ mới</button>
            </div>
            <div className="space-y-2 bg-white rounded-xl">
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
                                {address.default && (
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
                ))}
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