
import logo from '../../../assets/logo.png';
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";

interface OrderDeliveryProps {
    status?: string;
    process?: JSX.Element;
}

export const OrderDelivery: React.FC<OrderDeliveryProps> = ({ status, process }) => {
    const { orderDetail } = useSelector((state: RootState) => state.order);
    const statusColor: Record<string, string> = {
        completed: 'text-green-500',
        confirmed: 'text-orange-500',
        cancelled: 'text-red-500',
        pending: 'text-yellow-500',
        shipping: 'text-blue-500',
        return: 'text-gray-500'
    };
    const statusBg: Record<string, string> = {
        completed: 'bg-green-500',
        confirmed: 'bg-orange-500',
        cancelled: 'bg-red-500',
        pending: 'bg-yellow-500',
        shipping: 'bg-blue-500',
        return: 'bg-gray-500'
    };
    const statusText: Record<string, string> = {
        completed: 'Đã giao',
        confirmed: 'Đã xác nhận',
        cancelled: 'Đã hủy',
        pending: 'Đang xử lý',
        shipping: 'Đang giao',
        return: 'Trả hàng'
    };

    return (
        <div className="w-full bg-white rounded-xl  mb-2">
            {/* Header */}
            <div className="flex items-center justify-between  p-4 border-b">
                <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-semibold">Đơn hàng {new Date(orderDetail.createdAt).toLocaleDateString()}</h2>
                    <span className="text-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </span>
                    <div className="flex items-center font-semibold space-x-4 text-sm">
                        <span className="text-gray-600">Giao hàng tận nơi</span>
                        <span className="text-gray-600">{orderDetail.id}</span>
                    </div>
                </div>

                {status && (
                    <div className="flex items-center gap-1">
                        <span className={`w-2 h-2 ${statusBg[status]} rounded-full mr-2`}></span>
                        <span className={`${statusColor[status]} font-medium`}>{statusText[status]}</span>
                    </div>
                )}
            </div>

            {/* Cancellation Message */}
            {process}

            {/* Delivery Info */}
            <div className="p-4 border-y flex items-center">
                <img src={logo} alt="Long Châu Logo" className="h-8 w-8 mr-2" />
                <span className="font-medium">Đơn hàng được vận chuyển bởi Health Pharmacy Delivery</span>
            </div>

            {/* Customer Info Grid */}
            <div className={`grid ${status === 'pending' ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {/* Recipient Info */}
                <div className="p-4 border-r">
                    <div className="flex items-center mb-2">
                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h4 className="text-gray-600">Thông tin người nhận</h4>
                    </div>
                    <p className="font-medium">{orderDetail.shipping_address.name}</p>
                    <p className="text-gray-600">{orderDetail.shipping_address.phone}</p>
                </div>

                {/* Delivery Location */}
                <div className="p-4">
                    <div className="flex items-center mb-2">
                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h4 className="text-gray-600">Nhận hàng tại</h4>
                    </div>
                    <p className="font-medium">{orderDetail.shipping_address.street}, {orderDetail.shipping_address.ward}, {orderDetail.shipping_address.district}, {orderDetail.shipping_address.province}</p>
                </div>

                {/* Pharmacy Info */}
                {status === 'pending' && (
                    <div className="p-4 border-l">
                        <div className="flex items-center mb-2">
                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm8 8V7H5v6h10z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h4 className="text-gray-600">Nhà thuốc xử lý đơn</h4>
                        </div>
                        <p className="font-medium">Nhà thuốc Long Châu 1239</p>
                        <p className="text-gray-600">Quang Trung, Tổ 6, P. Tây Sơn, TX. An Khê, Tỉnh Gia Lai</p>
                    </div>
                )}
            </div>
        </div>
    );
};