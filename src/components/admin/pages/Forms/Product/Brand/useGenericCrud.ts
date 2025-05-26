// hooks/useGenericCrud.ts
import { useState } from 'react';
import { BaseEntity, ModalType, EntityConfig } from './types';
import { useDispatch } from 'react-redux';
import { createBrand, updateBrand, deleteBrand } from '../../../../../../redux/brandAsyncThunk';
import { createCategory, updateCategory, deleteCategory } from '../../../../../../redux/categoryAsyncThunk';
import { createMedicalObject, updateMedicalObject, deleteMedicalObject } from '../../../../../../redux/medicalObjectAsyncThunk';
import { createIndication, updateIndication, deleteIndication } from '../../../../../../redux/indicationAsyncThunk';
import { AppDispatch } from '../../../../../../redux/store';

export function useGenericCrud<T extends BaseEntity>(
  initialItems: T[],
  entityConfig: EntityConfig<T>
) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<T>(entityConfig.initialState());
  const [modalType, setModalType] = useState<ModalType>('create');
  const dispatch: AppDispatch = useDispatch();
  // Mở modal tạo mới
  const handleCreateClick = () => {
    setCurrentItem({
      ...entityConfig.initialState(),
      id: items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1,
    });
    setModalType('create');
    setIsModalOpen(true);
  };

  // Mở modal xem chi tiết
  const handleViewClick = (item: T) => {
    setCurrentItem({ ...item });
    setModalType('view');
    setIsModalOpen(true);
  };

  // Mở modal chỉnh sửa
  const handleEditClick = (item: T) => {
    setCurrentItem({ ...item });
    setModalType('edit');
    setIsModalOpen(true);
  };





  // Mở modal xóa
  const handleDeleteClick = (item: T) => {
    setCurrentItem({ ...item });
    setModalType('delete');
    setIsModalOpen(true);
  };

  // Xử lý đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Xử lý thay đổi input từ form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let processedValue: any = value;

    const field = entityConfig.fields.find(f => f.name === name);

    if (field?.type === "file" && e.target instanceof HTMLInputElement && e.target.files) {
      // Nếu là file input
      const files = e.target.files;
      processedValue = files.length === 1 ? files[0] : Array.from(files);
    } else if (field?.type === "number") {
      processedValue = value === "" ? "" : Number(value);
    } else if (name === "parentId" && value === "0") {
      processedValue = null;
    }

    setCurrentItem(prev => ({
      ...prev,
      [name]: processedValue,
    }));
  };




  const validateBrandItem = (item: any) => {
    if (!item.name || item.name.trim() === '') return false;
    if (!item.country || item.country.trim() === '') return false;
    if (!item.logo || (item.logo instanceof FileList && item.logo.length === 0)) return false;
    return true;
  };

  const handleBrandSaveItem = () => {
    if (!validateBrandItem(currentItem)) {
      alert("Thiếu thông tin. Vui lòng kiểm tra lại.");
      return;
    }

    const formData = new FormData();
    Object.entries(currentItem).forEach(([key, value]) => {
      if (key === 'logo' && value instanceof FileList) {
        formData.append(key, value[0]);
      } else {
        formData.append(key, value as string);
      }
    });

    if (modalType === 'create') {
      dispatch(createBrand(formData));
      // for (const [key, value] of formData.entries()) {
      //   console.log(`${key}:`, value);
      // }
    } else {
      dispatch(updateBrand(formData));
    }

    setIsModalOpen(false);
  };


  const handleCategorySaveItem = () => {
    if (!currentItem.name) {
      alert("Thiếu thông tin. Vui lòng kiểm tra lại.");
      return;
    }
    if (modalType === 'create') {
      dispatch(createCategory({ name: currentItem.name, parent_id: currentItem.parent_id }));
    } else {
      dispatch(updateCategory({ id: currentItem.id, name: currentItem.name, parent_id: currentItem.parent_id }));

    }

    setIsModalOpen(false);
  };


  const handleMedicalObjectSaveItem = () => {
    if (!currentItem.name) {
      alert("Thiếu thông tin. Vui lòng kiểm tra lại.");
      return;
    }
    if (modalType === 'create') {
      dispatch(createMedicalObject(currentItem.name));
    } else {
      dispatch(updateMedicalObject({ id: currentItem.id, name: currentItem.name }));
    }

    setIsModalOpen(false);
  };

  const handleIndicationSaveItem = () => {
    if (!currentItem.name) {
      alert("Thiếu thông tin. Vui lòng kiểm tra lại.");
      return;
    }
    if (modalType === 'create') {
      dispatch(createIndication(currentItem.name));
    } else {
      dispatch(updateIndication({ id: currentItem.id, name: currentItem.name }));
    }

    setIsModalOpen(false);
  };


const handleBrandDeleteItem = () => {
  dispatch(deleteBrand(currentItem.id));
  setIsModalOpen(false);
};

const handleCategoryDeleteItem = () => {
  dispatch(deleteCategory(currentItem.id));
  setIsModalOpen(false);
};

const handleMedicalObjectDeleteItem = () => {
  dispatch(deleteMedicalObject(currentItem.id));
  setIsModalOpen(false);
};

const handleIndicationDeleteItem = () => {
  dispatch(deleteIndication(currentItem.id));
  setIsModalOpen(false);
};

const handleUserSaveItem = () => {
  if (!currentItem.name) {
    alert("Thiếu thông tin. Vui lòng kiểm tra lại.");
    return;
  }
  if (modalType === 'create') {
    // dispatch(createUser(currentItem.name));
  } else {
    // dispatch(updateUser({ id: currentItem.id, name: currentItem.name }));
  }

  setIsModalOpen(false);
};

const handleUserDeleteItem = () => {
  // dispatch(deleteUser(currentItem.id));
  setIsModalOpen(false);
};

return {
  items,
  isModalOpen,
  currentItem,
  modalType,
  handleCreateClick,
  handleViewClick,
  handleEditClick,
  handleDeleteClick,
  handleCloseModal,
  handleInputChange,
  handleMedicalObjectSaveItem,
  handleBrandSaveItem,
  handleCategorySaveItem,
  handleIndicationSaveItem,
  handleMedicalObjectDeleteItem,
  handleBrandDeleteItem,
  handleCategoryDeleteItem,
  handleIndicationDeleteItem,
  handleUserSaveItem,
  handleUserDeleteItem,
};
}
