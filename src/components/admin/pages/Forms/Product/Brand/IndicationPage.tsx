import React, { useEffect, useState } from 'react';
import Header from './Header';
import GenericTable from './GenericTable';
import GenericModal from './GenericModal';
import { useGenericCrud } from './useGenericCrud';
import { indicationConfig } from './entityConfigs';
import { Indication } from './types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../../redux/store';
import { fetchIndications } from '../../../../../../redux/indicationAsyncThunk';
import { resetIndication } from '../../../../../../redux/indicationSlice';
import SearchBar from './GenericSearch';

const IndicationPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { indications, status } = useSelector((state: RootState) => state.indications);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    if (indications.length == 0) {
      dispatch(fetchIndications());
    } else if (status === 'succeeded') {
      dispatch(fetchIndications());
    }
  }, [dispatch, indications, status]);
  const filteredIndications = indications.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const {
    items: indication,
    isModalOpen,
    currentItem: currentIndication,
    modalType,
    handleCreateClick,
    handleViewClick,
    handleEditClick,
    handleDeleteClick,
    handleCloseModal,
    handleInputChange,
    handleIndicationSaveItem: handleSaveIndication,
    handleIndicationDeleteItem: handleDeleteIndication
  } = useGenericCrud<Indication>(indications, indicationConfig);
  console.log(indication);
  return (
    <>
      <div className="container mx-auto p-6">
        <Header
          title="Quản lý danh mục"
          onCreateClick={handleCreateClick}
          entityName={indicationConfig.name}
        />
        <SearchBar
          searchTerm={searchTerm}
          onChange={setSearchTerm}
          placeholder="Tìm kiếm danh mục..."
        />

        <GenericTable
          items={filteredIndications}
          config={indicationConfig}
          onReset={() => dispatch(resetIndication())}
          link='indication'
          onView={handleViewClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />

        <GenericModal
          isOpen={isModalOpen}
          modalType={modalType}
          item={currentIndication}
          config={indicationConfig}
          onClose={handleCloseModal}
          onChange={handleInputChange}
          onSave={handleSaveIndication}
          onDelete={handleDeleteIndication}
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

export default IndicationPage;