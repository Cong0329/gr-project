import { FaAngleRight } from "react-icons/fa6";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { Order, resetAdminOrderDetail, resetOrderDetail } from "../../../../redux/orderSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";

interface OrderTablesChildProps {
    orders: Order[];
    isLoading?: boolean;
}

export const OrderTablesChild = ({ orders, isLoading }: OrderTablesChildProps) => {
    const dispatch: AppDispatch = useDispatch();
    let content;
    const statusColor = {
        confirmed: 'text-orange-500',
        completed: 'text-green-500',
        cancelled: 'text-red-500',
        pending: 'text-yellow-500',
        shipping: 'text-blue-500',
        return: 'text-gray-500'
    };
    const statusBg = {
        confirmed: 'bg-orange-500',
        completed: 'bg-green-500',
        cancelled: 'bg-red-500',
        pending: 'bg-yellow-500',
        shipping: 'bg-blue-500',
        return: 'bg-gray-500'
    };
    const statusText = {
        confirmed: 'Đã xác nhận',
        completed: 'Đã giao',
        cancelled: 'Đã hủy',
        pending: 'Đang xử lý',
        shipping: 'Đang giao',
        return: 'Trả hàng'
    };
    if (isLoading) {
        content = (
            <>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="mt-4 bg-white rounded-lg border animate-pulse">
                        {/* Skeleton UI */}
                        <div className="px-4 pt-4 pb-2">
                            <div className="flex justify-between items-center border-b pb-2">
                                <div className="flex items-center gap-1 font-semibold">
                                    <div className="h-5 w-36 bg-gray-200 rounded-md"><Skeleton /></div>
                                    <div className="mx-1 text-gray-300">•</div>
                                    <div className="h-5 w-32 bg-gray-200 rounded-md"><Skeleton /></div>
                                    <div className="mx-1 text-gray-300">•</div>
                                    <div className="h-5 w-20 bg-gray-200 rounded-md"><Skeleton /></div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-gray-200 rounded-md mr-2"><Skeleton /></div>
                                    <div className="h-5 w-20 bg-gray-200 rounded-md"><Skeleton /></div>
                                </div>
                            </div>

                            <div className="pt-4 pb-2 flex justify-between items-start">
                                <div className="flex items-center">
                                    <div className="h-16 w-16 bg-gray-200 rounded-md p-2"><Skeleton /></div>
                                    <div className="ml-4">
                                        <div className="h-10 w-[500px] bg-gray-200 rounded-md"><Skeleton /></div>
                                        <div className="h-5 w-32 bg-gray-200 rounded-md mt-2"><Skeleton /></div>
                                    </div>
                                </div>
                                <div className="h-5 w-20 bg-gray-200 rounded-md"><Skeleton /></div>
                                <div className="h-5 w-20 bg-gray-200 rounded-md"><Skeleton /></div>
                            </div>

                            <div className="flex justify-between items-center">
                                <div className="h-5 w-28 bg-gray-200 rounded-md"><Skeleton /></div>
                                <div className="h-5 w-36 bg-gray-200 rounded-md mt-2"><Skeleton /></div>
                            </div>

                            <div className="border-t pt-2 mt-2 flex justify-end">
                                <div className="h-10 w-40 bg-gray-200 rounded-full"><Skeleton /></div>
                            </div>
                        </div>

                    </div>
                ))}
            </>
        );
    } else if (orders.length > 0) {
        content = (
            <>
                {orders.map((order) => (
                    <div key={order.id} className="mt-2 bg-white rounded-lg border">
                        <div className="px-4 pt-4 pb-2">
                            <div className="flex justify-between items-center border-b pb-2">
                                <div className="flex items-center gap-1 font-semibold">
                                    <span>Đơn hàng {(new Date(order.createdAt)).toLocaleDateString('vi-VN')}</span>
                                    <span>{(new Date(order.createdAt)).toLocaleTimeString('vi-VN', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    })}</span>
                                    <span className="mx-1 text-gray-300">•</span>
                                    <span className="text-gray-500">Giao hàng tận nơi</span>
                                    <span className="mx-1 text-gray-300">•</span>
                                    <span className="text-gray-600">{order.id}</span>
                                </div>
                                <div className="flex items-center">
                                    <div className={`w-2 h-2 ${statusBg[order.status]} rounded-full mr-2`}></div>
                                    <div className={`${statusColor[order.status]} font-medium`}>{statusText[order.status]}</div>
                                </div>
                            </div>
                            <Link to={`/admin/orders/${order.id}`} onClick={() => dispatch(resetOrderDetail())}>
                                <div className="pt-4 pb-2 flex justify-between">
                                    <div className="flex items-center">
                                        <img
                                            src={order.items[0].product.images[0].image}
                                            alt=""
                                            loading="lazy"
                                            className="w-16 h-16 border rounded-lg p-2"
                                        />
                                        <div className="ml-4">
                                            <div className="font-semibold text-sm w-[500px] line-clamp-2">
                                                {order.items[0].product.name}
                                            </div>
                                            {order.items.length > 1 && (
                                                <div className="text-gray-500 w-full line-clamp-1">+1 sản phẩm khác</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="font-bold">{parseFloat(order.items[0].price as string).toLocaleString()}đ</div>
                                    <div className="text-gray-500">x{order.items[0].quantity} {order.items[0].option}</div>
                                </div>
                            </Link>
                            <Link to={`/admin/orders/${order.id}`} onClick={() => dispatch(resetAdminOrderDetail())}>
                                <div className="flex justify-between items-center">
                                    <div className="text-blue-700 font-medium gap-1 flex items-center">
                                        Xem chi tiết <FaAngleRight />
                                    </div>
                                    <div className="text-right flex gap-2 font-semibold">
                                        <div className="text-gray-500">Thành tiền:</div>
                                        <div className="text-blue-700 ">{parseFloat(order.total_price as string).toLocaleString()}đ</div>
                                    </div>
                                </div>
                            </Link>


                        </div>
                    </div>
                ))}
            </>
        );
    } else {
        content = (
            <div className="flex items-center justify-center flex-col p-12">
                <div className="w-96 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <img src="https://imgur.com/wJtkO6K.png" alt="" className="w-full" loading="lazy" />
                </div>
                <div className="text-lg font-medium mb-1">Bạn chưa có đơn hàng nào.</div>
                <div className="text-gray-500">Cùng khám phá hàng ngàn sản phẩm tại Nhà thuốc FPT Long Châu nhé!</div>
                <button className="font-semibold text-white bg-blue-600 px-16 py-2 rounded-full mt-4">Khám phá ngay</button>
            </div>
        );
    }

    return <div>{content}</div>;
}
