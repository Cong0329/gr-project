import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { NavLink } from "../../navlink/NavLink";
import { CheckoutItemOrder } from "./CheckoutItemOrder";
import Breadcrumb from "../../home_booking/details/component_details/BreadCrumb";
import OrderSummary from "./OrderSummary";
import { useParams } from "react-router-dom";
import { OrderPending } from "./orderPending";
import { OrderSkeleton } from "./OrderSkeleton";
import { OrderDelivery } from "./OrderDelivery";
import { fetchOrderById } from "../../../redux/orderAsyncThunk";
export const OrderDetailBody = () => {
    const [isServiceHovered, setIsServiceHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams<{ id: string }>();
    const { orderDetail } = useSelector((state: RootState) => state.order);
    const dispatch: AppDispatch = useDispatch();
    const canceled = orderDetail?.status_history?.filter((item) => item.status === 'cancelled');
    const completed = orderDetail?.status_history?.filter((item) => item.status === 'completed');

    useEffect(() => {
        dispatch(fetchOrderById(id as string));
    }, [dispatch, id]);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    }, []);

    let delivery;
    let process;

    if (orderDetail.status === 'cancelled') {
        process = (
            <div className="p-4 border-b">
                <h3 className="text-base font-bold mb-2">Đơn hàng đã hủy lúc {new Date(canceled[0].changed_at).toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    timeZone: 'Asia/Ho_Chi_Minh' // đảm bảo đúng múi giờ
                })}</h3>
                <p className="text-gray-700">Rất mong được phục vụ bạn trong lần tới.</p>
            </div>
        )
    } else if (orderDetail.status === "pending" || orderDetail.status === "confirmed" || orderDetail.status === "shipping") {
        process = (
            <OrderPending status={orderDetail.status} />
        )
    } else if (orderDetail.status === "completed") {
        process = (
            <div className="p-4 border-b">
                <h3 className="text-base font-bold mb-2">Đơn hàng đã giao lúc {new Date(completed[0].changed_at).toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    timeZone: 'Asia/Ho_Chi_Minh' // đảm bảo đúng múi giờ
                })}</h3>
                <p className="text-gray-700">Rất mong được phục vụ bạn trong lần tới.</p>
            </div>
        )
    } else {
        process = (
            <div className="p-4 border-b">
                <h3 className="text-base font-bold mb-2">Đơn hàng đã được trả lúc {new Date(orderDetail.updatedAt).toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    timeZone: 'Asia/Ho_Chi_Minh' // đảm bảo đúng múi giờ
                })}</h3>
                <p className="text-gray-700">Rất mong được phục vụ bạn trong lần tới.</p>
            </div>
        )
    };

    if (isLoading) {
        delivery = (
            <OrderSkeleton />
        )
    } else {
        delivery = (
            orderDetail.shipping_address && (
                <OrderDelivery status={orderDetail.status} process={process} />
            )
        )
    }

    return (
        <main className="flex-1 bg-gray-100 ">
            <div className="mx-auto bg-white pt-2 ">
                <NavLink setIsServiceHovered={setIsServiceHovered} />
            </div>
            <div className='relative'>
                <div className="mx-auto relative w-4/5 bg-gray-100 pb-4 container">
                    <div className="  mx-auto bg-gray-100  [&>*]:!bg-gray-100">
                        <Breadcrumb />
                    </div>
                    <div className="flex w-full  tb:flex-col mt-2">
                        <div className="w-4/6 pr-5  tb:w-full tb:pr-0">
                            <div className="min-h-full">
                                {delivery}
                                <div className="">
                                    <p className="font-semibold text-sm mb-2">Danh sách sản phẩm</p>
                                    <div className=" px-4  bg-white rounded-xl">
                                        {orderDetail.items && orderDetail.items.length > 0 &&
                                            orderDetail.items.
                                                map((item, index) => (
                                                    <CheckoutItemOrder key={item.id} isFirst={index === 0} item={item} isLoading={isLoading} />
                                                ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* CartSummary luôn nằm dưới màn hình */}
                        <div className="tb:fixed tb:bottom-0 tb:left-0 tb:z-10 w-2/6 tb:w-full">
                            {orderDetail.items && orderDetail.items.length > 0 && (
                                <OrderSummary isDetail={true} isLoading={isLoading} status={orderDetail.status} id={orderDetail.id.toString()} />
                            )}
                        </div>
                    </div>
                </div>
                {isServiceHovered && (
                    <div className="absolute inset-0 bg-blue-950 bg-opacity-30 z-5">    </div>
                )}
            </div>

        </main >
    )
}