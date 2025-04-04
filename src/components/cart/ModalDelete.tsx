


interface ModalDeleteProps {
    message: string
    onClose: () => void;
    onDelete: () => void;
}

export const ModalDelete = ({ message, onClose, onDelete }: ModalDeleteProps) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-96">
                <div className="text-center mb-4">
                    <img src="https://i.imgur.com/Zg05teh.png" alt="" />
                    <div className="text-lg font-semibold mb-2">Thông báo</div>
                    <div className="text-gray-600 mb-2">{message}</div>
                </div>
                <div className="flex justify-end gap-2 font-semibold">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-full text-blue-700 w-1/2 bg-blue-100"
                    >Đóng</button>
                    <button
                        onClick={() => {
                            onClose();
                            onDelete();
                        }}
                        className="px-4 py-2 bg-blue-700 text-white rounded-full w-1/2"
                    >Xóa</button>
                </div>
            </div>
        </div>
    );
};
