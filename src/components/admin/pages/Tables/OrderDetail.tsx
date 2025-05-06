import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useEffect } from "react";
import { fetchAdminOrderById, updateOrderConfirm, updateOrderShipping } from "../../../../redux/orderAsyncThunk";
import { useParams } from "react-router-dom";
import { ItemOrder } from "./OrderItem";

const OrderDetail = () => {
    const { adminOrderDetail, status } = useSelector((state: RootState) => state.order);
    const dispatch = useDispatch();
    const { id } = useParams<{ id: string }>();

    const cancelled = adminOrderDetail?.status_history?.filter((item) => item.status === 'cancelled');
    const completed = adminOrderDetail?.status_history?.filter((item) => item.status === 'completed');
    const confirmed = adminOrderDetail?.status_history?.filter((item) => item.status === 'confirmed');
    const pending = adminOrderDetail?.status_history?.filter((item) => item.status === 'pending');
    const shipping = adminOrderDetail?.status_history?.filter((item) => item.status === 'shipping');
    const none = adminOrderDetail?.status_history?.filter((item) => item.status === '');


    useEffect(() => {
        if (id) {
            dispatch(fetchAdminOrderById(id));
        }
    }, [dispatch, id]);




    const statusColor = {
        completed: 'text-green-500',
        confirmed: 'text-orange-500',
        cancelled: 'text-red-500',
        pending: 'text-yellow-500',
        shipping: 'text-blue-500',
        return: 'text-gray-500'
    };
    const statusBg = {
        completed: 'bg-green-500',
        confirmed: 'bg-orange-500',
        cancelled: 'bg-red-500',
        pending: 'bg-yellow-500',
        shipping: 'bg-blue-500',
        return: 'bg-gray-500'
    };
    const statusText = {
        completed: 'Đã giao',
        confirmed: 'Đã xác nhận',
        cancelled: 'Đã hủy',
        pending: 'Đang xử lý',
        shipping: 'Đang giao',
        return: 'Trả hàng'
    };
    let confirm = '';
    if (adminOrderDetail.status === 'pending') {
        confirm = 'Xác nhận';
    } else if (adminOrderDetail.status === 'confirmed') {
        confirm = 'Giao hàng';
    }

    const handleConfirm = () => {
        if (adminOrderDetail.status === 'pending') {
            dispatch(updateOrderConfirm(id));
        }
        else if (adminOrderDetail.status === 'confirmed') {
            dispatch(updateOrderShipping(id));
        }
    }

    return (
        <>
            <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between  p-4 border-b">
                    <div className="flex items-center space-x-2">
                        <h2 className="text-lg font-semibold">Đơn hàng {new Date(adminOrderDetail.createdAt).toLocaleDateString()}</h2>
                        <span className="text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                        </span>
                        <div className="flex items-center font-semibold space-x-4 text-sm">
                            <span className="text-gray-600">Giao hàng tận nơi</span>
                            <span className="text-gray-600">#{adminOrderDetail.id}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <span className={`w-2 h-2 ${statusBg[adminOrderDetail.status]} rounded-full mr-2`}></span>
                        <span className={`${statusColor[adminOrderDetail.status]} font-medium`}>{statusText[adminOrderDetail.status]}</span>
                    </div>
                </div>
                <div className="px-4 pt-4">
                    <h2 className="text-lg font-semibold">Danh sách sản phẩm</h2>
                    <div>
                        {adminOrderDetail.items && adminOrderDetail.items.length > 0 && adminOrderDetail.items.map((item, index) => (
                            <ItemOrder key={item.id} item={item} isFirst={index === 0} isLoading={false} />
                        ))}
                    </div>
                </div>
                {adminOrderDetail.items && adminOrderDetail.items.length > 0 && (
                    <div>
                        <div className="p-4 border-t">
                            <h2 className="text-lg font-semibold">Thông tin thanh toán</h2>
                            <div className="flex justify-between">
                                <span>Tổng tiền:</span>
                                <span className="text-gray-600">{parseFloat(adminOrderDetail.discout_price).toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Giảm giá:</span>
                                <span className="text-orange-600">{(adminOrderDetail.discout_price - adminOrderDetail.total_price).toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Phí giao hàng:</span>
                                <span className="text-gray-600">Miễn phí vận chuyển</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Phương thức thanh toán:</span>
                                <div className="flex items-center gap-1 text-gray-600">
                                    <span>{adminOrderDetail.payment_method.description}</span>
                                </div>
                            </div>
                            <div className="flex justify-between font-semibold">
                                <span>Tổng thanh toán:</span>
                                <span className="text-gray-600">{parseFloat(adminOrderDetail.total_price).toLocaleString()}đ</span>
                            </div>
                        </div>
                        <div className="p-4 border-t">
                            <h2 className="text-lg font-semibold">Trạng thái đơn hàng</h2>
                            {(pending.length > 0) && (
                                <div className="flex justify-between text-yellow-500">
                                    <span>Đặt hàng:</span>
                                    <span>{new Date(pending[0].changed_at).toLocaleString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                        timeZone: 'Asia/Ho_Chi_Minh' // đảm bảo đúng múi giờ
                                    })}</span>
                                </div>
                            )}
                            {(none.length > 0) && (
                                <div className="flex justify-between text-yellow-500">
                                    <span>Đặt hàng:</span>
                                    <span>{new Date(none[0].changed_at).toLocaleString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                        timeZone: 'Asia/Ho_Chi_Minh' // đảm bảo đúng múi giờ
                                    })}</span>
                                </div>
                            )}



                            {(confirmed.length > 0) &&
                                <div className="flex justify-between text-orange-500">
                                    <span>Xác nhận:</span>
                                    <span>{new Date(confirmed[0].changed_at).toLocaleString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                        timeZone: 'Asia/Ho_Chi_Minh' // đảm bảo đúng múi giờ
                                    })}</span>
                                </div>}
                            {(shipping.length > 0) &&
                                <div className="flex justify-between text-blue-500">
                                    <span>Giao hàng:</span>
                                    <span>{new Date(shipping[0].changed_at).toLocaleString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                        timeZone: 'Asia/Ho_Chi_Minh' // đảm bảo đúng múi giờ
                                    })}</span>
                                </div>}
                            {(completed.length > 0) &&
                                <div className="flex justify-between text-green-500">
                                    <span>Đã giao:</span>
                                    <span>{new Date(completed[0].changed_at).toLocaleString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                        timeZone: 'Asia/Ho_Chi_Minh' // đảm bảo đúng múi giờ
                                    })}</span>
                                </div>}
                            {(cancelled.length > 0) &&
                                <div className="flex justify-between text-red-500">
                                    <span>Đã hủy:</span>
                                    <span>{new Date(cancelled[0].changed_at).toLocaleString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                        timeZone: 'Asia/Ho_Chi_Minh' // đảm bảo đúng múi giờ
                                    })}</span>
                                </div>}

                        </div>
                        <div className="p-4 border-t">
                            <h2 className="text-lg font-semibold">Thông tin giao hàng</h2>
                            <div className="py-2">
                                <span className="font-semibold">Thông tin người đặt</span>
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold">Tên: </span>
                                    <span>{adminOrderDetail.user.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold">Email: </span>
                                    <span>{adminOrderDetail.user.email}</span>
                                </div>
                            </div>
                            <div className="py-2 border-t">
                                <span className="font-semibold">Thông tin người nhận</span>
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold">Tên: </span>
                                    <span>{adminOrderDetail.shipping_address.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold">Số điện thoại: </span>
                                    <span>{adminOrderDetail.shipping_address.phone}</span>
                                </div>


                            </div>

                            <div className="py-2 border-t">
                                <div className="font-semibold flex justify-between">
                                    <span>Địa chỉ giao hàng:</span>
                                    <span className="text-sm"> {adminOrderDetail.shipping_address.street}, {adminOrderDetail.shipping_address.ward}, {adminOrderDetail.shipping_address.district}, {adminOrderDetail.shipping_address.province}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {confirm && (
                    <div className="flex justify-end px-4">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleConfirm}>{confirm}</button>
                    </div>
                )}
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

export default OrderDetail;
