
import { BaseEntity, EntityConfig, ModalType } from './types';
import GenericForm from './GenericForm';
import { User } from './types';

interface GenericModalProps<T extends BaseEntity> {
  isOpen: boolean;
  modalType: ModalType;
  item: T;
  config: EntityConfig<T>;
  onClose: () => void;
  onSave: () => void;
  onDelete: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

function GenericModal<T extends BaseEntity>({
  isOpen,
  modalType,
  item,
  config,
  onClose,
  onSave,
  onDelete,
  onChange
}: GenericModalProps<T>) {
  if (!isOpen) return null;

  const getModalTitle = () => {
    switch (modalType) {
      case 'create': return `Thêm ${config.name} mới`;
      case 'edit': return `Chỉnh sửa ${config.name}`;
      case 'delete': return `Xóa ${config.name}`;
      case 'view': return `Chi tiết ${config.name}`;
      default: return '';
    }
  };
  const userConfig: EntityConfig<T> = {
    name: 'người dùng',
    pluralName: 'người dùng',
    fields: [
      { name: 'id', label: 'ID', type: 'text', required: true },
      { name: 'name', label: 'Tên người dùng', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'text', required: true },
      { name: 'roles', label: 'Vai trò', type: 'text', required: true },
      { name: 'phone', label: 'Số điện thoại', type: 'text', required: true },
      { name: 'gender', label: 'Giới tính', type: 'text', required: true },
    ]
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center z-[100000] justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium">{getModalTitle()}</h3>
        </div>

        <div className="px-6 py-4">
          {(modalType === 'create' || modalType === 'edit' || modalType === 'view') && (
            item.roles?.[0].code ? (
              modalType === 'create' ? (
                <GenericForm
                  item={item}
                  config={config}
                  onChange={onChange}
                  readOnly={modalType === 'create'}
                />
              ) : modalType === 'edit' ? (
                <GenericForm
                  item={item}
                  config={config}
                  onChange={onChange}
                  readOnly={modalType === 'edit'}
                />
              ) : (
                <GenericForm
                  item={item}
                  config={userConfig}
                  onChange={onChange}
                  readOnly={modalType === 'view'}
                />
              )
            ) : (
              <GenericForm
                item={item}
                config={config}
                onChange={onChange}
                readOnly={modalType === 'view'}
              />
            )
          )}
          {modalType === 'delete' && (
            <p className="text-center">
              Bạn có chắc chắn muốn xóa {config.name} <span className="font-semibold">{item.name}</span>?
            </p>
          )}
        </div>



        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            {modalType === 'view' ? 'Đóng' : 'Hủy'}
          </button>

          {modalType === 'create' || modalType === 'edit' ? (
            <button
              onClick={onSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {modalType === 'create' ? 'Thêm' : 'Cập nhật'}
            </button>
          ) : modalType === 'delete' ? (
            <button
              onClick={onDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Xóa
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default GenericModal;
