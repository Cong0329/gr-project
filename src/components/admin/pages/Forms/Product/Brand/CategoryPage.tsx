import React, { useEffect } from 'react';
import Header from './Header';
import GenericTable from './GenericTable';
import GenericModal from './GenericModal';
import { useGenericCrud } from './useGenericCrud';
import { categoryConfig } from './entityConfigs';
import { Category } from './types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../../redux/store';
import { fetchCategories } from '../../../../../../redux/categoryAsyncThunk';

const CategoryPage: React.FC = () => {
  const dispatch = useDispatch();
  const { categories, status } = useSelector((state: RootState) => state.categories);
  useEffect(() => {
    if (categories.length == 0) {
      dispatch(fetchCategories());
    } else if (status === 'succeeded') {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories, status])
  const {
    items: category,
    isModalOpen,
    currentItem: currentCategory,
    modalType,
    handleCreateClick,
    handleViewClick,
    handleEditClick,
    handleDeleteClick,
    handleCloseModal,
    handleInputChange,
    handleCategorySaveItem: handleSaveCategory,
    handleCategoryDeleteItem: handleDeleteCategory
  } = useGenericCrud<Category>(categories, categoryConfig);

  return (
    <>
      <div className="container mx-auto p-6">
        <Header
          title="Quản lý danh mục"
          onCreateClick={handleCreateClick}
          entityName={categoryConfig.name}
        />

        <GenericTable
          items={categories}
          config={categoryConfig}
          onView={handleViewClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />

        <GenericModal
          isOpen={isModalOpen}
          modalType={modalType}
          item={currentCategory}
          config={categoryConfig}
          onClose={handleCloseModal}
          onChange={handleInputChange}
          onSave={handleSaveCategory}
          onDelete={handleDeleteCategory}
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

export default CategoryPage;