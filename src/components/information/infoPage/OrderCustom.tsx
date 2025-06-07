import { FaAngleRight } from "react-icons/fa6";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { Order, resetOrderDetail } from "../../../redux/orderSlice";
import { useDispatch } from "react-redux";
import { repurchaseOrderAPI } from "../../../redux/cartAsyncThunk";
import { AppDispatch } from "../../../redux/store";
import { toast } from "react-hot-toast";
interface OrderCustomProps {
    orders: Order[];
    isLoading?: boolean;
}

export const OrderCustom = ({ orders, isLoading }: OrderCustomProps) => {
    const dispatch: AppDispatch = useDispatch();
    let content;
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
    const handleRepurchaseOrder = (order_id: string) => {
        console.log(order_id);
        toast.success('Sản phẩm đã được thêm lại vào giỏ hàng của bạn');
        dispatch(repurchaseOrderAPI(order_id));
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
                                    <Skeleton className="h-5 w-36 bg-gray-200 rounded-md"></Skeleton>
                                    <div className="mx-1 text-gray-300">•</div>
                                    <Skeleton className="h-5 w-32 bg-gray-200 rounded-md"></Skeleton>
                                    <div className="mx-1 text-gray-300 ml:hidden">•</div>
                                    <Skeleton className="h-5 w-20 bg-gray-200 rounded-md ml:hidden"></Skeleton>
                                </div>
                                <div className="flex items-center">
                                    <Skeleton className="w-2 h-2 bg-gray-200 rounded-md mr-2 ml:hidden"></Skeleton>
                                    <Skeleton className="h-5 w-20 bg-gray-200 rounded-md ml:hidden"></Skeleton>
                                </div>
                            </div>
                            <div className="pt-4 pb-2 flex justify-between items-start">
                                <div className="flex items-center">
                                    <Skeleton className="h-16 w-16 bg-gray-200 rounded-md p-2"></Skeleton>
                                    <div className="ml-4">
                                        <Skeleton className="h-10 w-[500px] md:w-[300px] tb:w-[300px] bg-gray-200 rounded-md"></Skeleton>
                                        <Skeleton className="h-5 w-32 bg-gray-200 rounded-md mt-2"></Skeleton>
                                    </div>
                                </div>
                                <Skeleton className="h-5 w-20 bg-gray-200 rounded-md ml:hidden"></Skeleton>
                                <Skeleton className="h-5 w-20 bg-gray-200 rounded-md ml:hidden"></Skeleton>
                            </div>
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-5 w-28 bg-gray-200 rounded-md"></Skeleton>
                                <Skeleton className="h-5 w-36 bg-gray-200 rounded-md mt-2"></Skeleton>
                            </div>
                            <div className="border-t pt-2 mt-2 flex justify-end">
                                <Skeleton className="h-10 w-40 bg-gray-200 rounded-full"></Skeleton>
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
                                    <span className="ml:hidden">Đơn hàng {(new Date(order.createdAt)).toLocaleDateString('vi-VN')}</span>
                                    <span className="ml:hidden">{(new Date(order.createdAt)).toLocaleTimeString('vi-VN', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    })}</span>
                                    <div className=" hidden  ml:flex ml:flex-col ml:items-start ">
                                        <span className="">Đơn hàng {(new Date(order.createdAt)).toLocaleDateString('vi-VN')}</span>
                                        <span className="text-gray-500 md-lg:w-20">Giao hàng tận nơi</span>

                                    </div>
                                    <span className="mx-1 text-gray-300 ml:hidden">•</span>
                                    <span className="text-gray-500 md-lg:w-20 ml:hidden">Giao hàng tận nơi</span>
                                    <span className="mx-1 text-gray-300 ml:hidden">•</span>
                                    <span className="text-gray-600 md-lg:w-56 tb:hidden">{order.id}</span>
                                </div>
                                <div className="flex items-center">
                                    <div className={`w-2 h-2 ${statusBg[order.status]} rounded-full mr-2`}></div>
                                    <div className={`${statusColor[order.status]} font-medium`}>{statusText[order.status]}</div>
                                </div>
                            </div>
                            <Link to={`/profile/orders/order-detail/${order.id}`} onClick={() => dispatch(resetOrderDetail())}>
                                <div className="pt-4 pb-2 flex justify-between">
                                    <div className="flex items-center">
                                        <img
                                            src={order.items[0].product.images[0].image}
                                            alt=""
                                            loading="lazy"
                                            className="w-16 h-16 border rounded-lg p-2"
                                        />
                                        <div className="ml-4">
                                            <div className="font-semibold text-sm w-[500px] md:w-[450px] tb:w-[400px] ml:w-[300px] ms:w-[250px] mm:w-[200px] line-clamp-2">
                                                {order.items[0].product.name}
                                            </div>

                                            {order.items.length > 1 ? (
                                                <div className="text-gray-500 w-full line-clamp-1">+{order.items.length - 1} sản phẩm khác</div>
                                            ) : (

                                                <div className=" w-full line-clamp-1 text-white">g</div>
                                            )
                                            }
                                        </div>
                                    </div>
                                    <div className="font-bold tb:hidden">{parseFloat(order.items[0].price.toString()).toLocaleString()}đ</div>
                                    <div className="text-gray-500 tb:hidden">x{order.items[0].quantity} {order.items[0].option}</div>
                                </div>
                            </Link>
                            <Link to={`/profile/orders/order-detail/${order.id}`} onClick={() => dispatch(resetOrderDetail())}>
                                <div className="flex justify-between items-center">
                                    <div className="text-blue-700 font-medium gap-1 flex items-center">
                                        Xem chi tiết <FaAngleRight />
                                    </div>
                                    <div className="text-right flex gap-2 font-semibold">
                                        <div className="text-gray-500">Thành tiền:</div>
                                        <div className="text-blue-700 ">{parseFloat(order.total_price.toString()).toLocaleString()}đ</div>
                                    </div>
                                </div>
                            </Link>

                            <div className="border-t pt-2 mt-2 flex justify-end">
                                {(order.status === 'completed' || order.status === 'cancelled' || order.status === 'return') && (
                                    <button onClick={() => handleRepurchaseOrder(order.id.toString())} className="text-white bg-blue-700 px-16 py-2 font-medium gap-1 flex items-center rounded-full">
                                        Mua lại
                                    </button>
                                )}
                            </div>
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
