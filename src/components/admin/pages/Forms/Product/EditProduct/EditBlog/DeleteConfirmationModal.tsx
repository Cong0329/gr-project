import React from 'react';
import { Button } from './Button';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onConfirm: () => void;
  itemName: string;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  // onConfirm,
  itemName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Xác nhận xóa</h3>
        <p className="mb-6">
          Bạn có chắc chắn muốn xóa sản phẩm "{itemName}"? Hành động này không thể hoàn tác.
        </p>
        <div className="flex justify-end space-x-4">
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="danger" onClick={() => {}}>
            Xóa
          </Button>
        </div>
      </div>
    </div>
  );
};