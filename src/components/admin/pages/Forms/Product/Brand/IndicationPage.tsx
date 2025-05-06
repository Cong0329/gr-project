import React, { useEffect } from 'react';
import Header from './Header';
import GenericTable from './GenericTable';
import GenericModal from './GenericModal';
import { useGenericCrud } from './useGenericCrud';
import { indicationConfig } from './entityConfigs';
import { Indication } from './types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../redux/store';
import { fetchIndications } from '../../../../../../redux/indicationAsyncThunk';

const IndicationPage: React.FC = () => {
  const dispatch = useDispatch();
  const { indications, status } = useSelector((state: RootState) => state.indications);
  useEffect(() => {
    if (indications.length == 0) {
      dispatch(fetchIndications());
    } else if (status === 'succeeded') {
      dispatch(fetchIndications());
    }
  }, [dispatch, indications, status])
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

  return (
    <>
      <div className="container mx-auto p-6">
        <Header
          title="Quản lý danh mục"
          onCreateClick={handleCreateClick}
          entityName={indicationConfig.name}
        />

        <GenericTable
          items={indications}
          config={indicationConfig}
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