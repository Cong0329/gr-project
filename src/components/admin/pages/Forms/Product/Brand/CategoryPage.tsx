import React, { useEffect, useState } from 'react';
import Header from './Header';
import GenericTable from './GenericTable';
import GenericModal from './GenericModal';
import { useGenericCrud } from './useGenericCrud';
import { categoryConfig } from './entityConfigs';
import { Category } from './types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../../redux/store';
import { fetchCategories, getParentCategory } from '../../../../../../redux/categoryAsyncThunk';
import { resetCategory } from '../../../../../../redux/categorySlice';
import SearchBar from './GenericSearch';


const CategoryPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { categories, parent, status } = useSelector((state: RootState) => state.categories);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {

    dispatch(fetchCategories());
    dispatch(getParentCategory());

  }, [dispatch]);

  useEffect(() => {
    if (status === 'succeeded') {
      dispatch(fetchCategories());
      dispatch(getParentCategory());
    }
  }, [dispatch, status]);
  const filteredCategories = categories.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
  const updatedConfig = {
    ...categoryConfig,
    fields: categoryConfig.fields.map(field =>
      field.name === 'parent_id'
        ? {
          ...field,
          options: parent.map(cat => ({
            value: cat.id,
            label: cat.name,
          }))
        }
        : field
    )
  };
  return (
    <>
      <div className="container mx-auto p-6">
        <Header
          title="Quản lý danh mục"
          onCreateClick={handleCreateClick}
          entityName={categoryConfig.name}
        />
        <SearchBar
          searchTerm={searchTerm}
          onChange={setSearchTerm}
          placeholder="Tìm kiếm danh mục..."
        />
        <GenericTable
          items={filteredCategories}
          config={updatedConfig}
          onReset={() => dispatch(resetCategory())}
          link="category"
          onView={handleViewClick}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />

        <GenericModal
          isOpen={isModalOpen}
          modalType={modalType}
          item={currentCategory}
          config={updatedConfig}
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