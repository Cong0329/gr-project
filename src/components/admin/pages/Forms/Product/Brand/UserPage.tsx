import React, { useEffect, useState } from 'react';
import Header from './Header';
import GenericTable from './GenericTable';
import GenericModal from './GenericModal';
import { useGenericCrud } from './useGenericCrud';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../../../../redux/store';
import SearchBar from './GenericSearch';
import { fetchUsersAPI } from '../../../../../../redux/userAsyncThunk';
import { userConfig } from './entityConfigs';
import { User } from './types';


const UserPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { users, status } = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {

    dispatch(fetchUsersAPI());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'succeeded') {
      dispatch(fetchUsersAPI());
    }
  }, [dispatch, status]);
  const filteredUsers = users.filter(item =>
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const {
    items: user,
    isModalOpen,
    currentItem: currentUser,
    modalType,
    handleCreateClick,
    handleViewClick,
    handleEditClick,
    handleDeleteClick,
    handleCloseModal,
    handleInputChange,
    handleUserSaveItem: handleSaveUser,
    handleUserDeleteItem: handleDeleteUser,
  } = useGenericCrud<User>(users, userConfig);
  console.log(user);
  const updatedConfig = {
    ...userConfig,
    fields: userConfig.fields.map(field =>
      field.name === 'role'
        ? {
          ...field,
          options: [
            { value: 'ROLE_DOCTOR', label: 'Bác sĩ' },
            { value: 'ROLE_ADMIN', label: 'Quản trị viên' },
          ]
        }
        : field
    )
  };
  return (
    <>
      <div className="container mx-auto p-6">
        <Header
          title="Quản lý người dùng"
          onCreateClick={handleCreateClick}
          entityName={userConfig.name}
        />
        <SearchBar
          searchTerm={searchTerm}
          onChange={setSearchTerm}
          placeholder="Tìm kiếm người dùng..."
        />
        <GenericTable
          items={filteredUsers}
          config={updatedConfig}
          link="user"
          onView={handleViewClick}
          onEdit={handleEditClick}
          onReset={() => {}}
          onDelete={handleDeleteClick}
        />

        <GenericModal
          isOpen={isModalOpen}
          modalType={modalType}
          item={currentUser}
          config={updatedConfig}
          onClose={handleCloseModal}
          onChange={handleInputChange}
          onSave={handleSaveUser}
          onDelete={handleDeleteUser}
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

export default UserPage;