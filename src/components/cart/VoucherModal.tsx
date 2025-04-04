import { FaXmark } from "react-icons/fa6";

interface VoucherModalProps {
    onClose: () => void;
}

export const VoucherModal = ({ onClose }: VoucherModalProps) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-1/3">
                {/* Header */}
                <div className="flex items-center justify-between font-bold text-lg border-b p-4">
                    <p className="text-center grow">Ưu đãi dành cho bạn</p>
                    <button onClick={onClose} className="flex-none self-start"><FaXmark /></button>
                </div>
                <div className="text-center mb-4 overflow-y-auto max-h-64   bg-gray-200 scrollbar-hide">
                    <div className="bg-white p-2">
                        <div className="flex items-center rounded-lg gap-2 w-full border">
                            <input type="text" className="focus:outline-none w-4/5 my-2 ml-2" placeholder="Nhập mã giảm giá" />
                            <button className="w-1/5 py-2 bg-gray-200 cursor-not-allowed rounded-r-lg border">Xác nhận</button>
                        </div>
                    </div>
                    <div className="w-full flex flex-col items-center justify-center h-64">
                        <img src="https://i.imgur.com/NgQWZ8x.png" alt="" />
                        <div className="text-lg font-semibold mb-2">Thông báo</div>
                        <div className="text-gray-600 mb-2">Bạn có muốn áp dụng mã giảm giá không?</div>
                    </div>
                </div>
                <div className="flex flex-col justify-end gap-2 font-semibold px-4 pb-4">
                    <span className="text-sm text-gray-500">Vui lòng chọn ưu đãi</span>
                    <button onClick={onClose} className="px-4 py-2 bg-blue-700 text-white rounded-full w-full">Áp dụng</button>
                </div>
            </div>
        </div>
    )
}
