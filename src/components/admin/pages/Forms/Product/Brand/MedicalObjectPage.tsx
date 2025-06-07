import React, { useEffect, useState } from 'react';
import Header from './Header';
import GenericTable from './GenericTable';
import GenericModal from './GenericModal';
import { useGenericCrud } from './useGenericCrud';
import { medicalObjectConfig } from './entityConfigs';
import { MedicalObject } from './types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../../redux/store';
import { fetchMedicalObjects } from '../../../../../../redux/medicalObjectAsyncThunk';
import SearchBar from './GenericSearch';
import { resetMedicalObject } from '../../../../../../redux/medicalObjectSlice';

const MedicalObjectPage: React.FC = () => {
  const dispatch:AppDispatch = useDispatch();
  const { medicalObjects, status } = useSelector((state: RootState) => state.medicalObjects);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    if (medicalObjects.length == 0) {
      dispatch(fetchMedicalObjects());
    } else if (status === 'succeeded') {
      dispatch(fetchMedicalObjects());
    }
  }, [dispatch, medicalObjects, status]);
  const filteredMedicalObjects = medicalObjects.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const {
    items: medicalObject,
    isModalOpen,
    currentItem: currentMedicalObject,
    modalType,
    handleCreateClick,
    handleViewClick,
    handleEditClick,
    handleDeleteClick,
    handleCloseModal,
    handleInputChange,
    handleMedicalObjectSaveItem: handleSaveMedicalObject,
    handleMedicalObjectDeleteItem: handleDeleteMedicalObject
  } = useGenericCrud<MedicalObject>(medicalObjects, medicalObjectConfig);
  console.log(medicalObject);

  return (
    <>
      <div className="container mx-auto p-6">
        <Header
          title="Quản lý danh mục"
          onCreateClick={handleCreateClick}
          entityName={medicalObjectConfig.name}
        />
        <SearchBar
            searchTerm={searchTerm}
            onChange={setSearchTerm}
            placeholder="Tìm kiếm danh mục..."
        />
        <GenericTable
          items={filteredMedicalObjects}
          config={medicalObjectConfig}
          onReset={() => dispatch(resetMedicalObject())}
          link='medical-object'
          onView={handleViewClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />

        <GenericModal
          isOpen={isModalOpen}
          modalType={modalType}
          item={currentMedicalObject}
          config={medicalObjectConfig}
          onClose={handleCloseModal}
          onChange={handleInputChange}
          onSave={handleSaveMedicalObject}
          onDelete={handleDeleteMedicalObject}
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

export default MedicalObjectPage;