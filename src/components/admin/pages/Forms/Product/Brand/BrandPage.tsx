import React, { useEffect, useState } from 'react';
import Header from './Header';
import GenericTable from './GenericTable';
import GenericModal from './GenericModal';
import { useGenericCrud } from './useGenericCrud';
import { brandConfig } from './entityConfigs';
import { Brand } from './types';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrands } from '../../../../../../redux/brandAsyncThunk';
import { RootState } from '../../../../../../redux/store';
import { AppDispatch } from '../../../../../../redux/store';
import SearchBar from './GenericSearch';
import { resetBrand } from '../../../../../../redux/brandSlice';

const BrandPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const { brands, status } = useSelector((state: RootState) => state.brands);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (brands.length == 0) {
            dispatch(fetchBrands());
        } else if (status === 'succeeded') {
            dispatch(fetchBrands());
        }
    }, [dispatch, brands, status]);

    const filteredBrands = brands.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const {
        items: brand,
        isModalOpen,
        currentItem: currentBrand,
        modalType,
        handleCreateClick,
        handleViewClick,
        handleEditClick,
        handleDeleteClick,
        handleCloseModal,
        handleInputChange,
        handleBrandSaveItem: handleSaveBrand,
        handleBrandDeleteItem: handleDeleteBrand
    } = useGenericCrud<Brand>(brands, brandConfig);

    return (
        <>
            <div className="container mx-auto p-6">
                <Header
                    title="Quản lý thương hiệu"
                    onCreateClick={handleCreateClick}
                    entityName={brandConfig.name}
                />

                <SearchBar
                    searchTerm={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Tìm kiếm thương hiệu..."
                />

                <GenericTable
                    items={filteredBrands}
                    config={brandConfig}
                    onReset={() => dispatch(resetBrand())}
                    link="brand"
                    onView={handleViewClick}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                />

                <GenericModal
                    isOpen={isModalOpen}
                    modalType={modalType}
                    item={currentBrand}
                    config={brandConfig}
                    onClose={handleCloseModal}
                    onChange={handleInputChange}
                    onSave={handleSaveBrand}
                    onDelete={handleDeleteBrand}
                />
            </div>
            {status === "loading" &&
                <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-white text-sm">Đang tải...</p>
                    </div>
                </div>
            }
        </>

    );
};

export default BrandPage;