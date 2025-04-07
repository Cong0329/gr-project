import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { NavLink } from "../../navlink/NavLink";
import { CheckoutItem } from "../../cart/CheckoutItem";
import Breadcrumb from "../../home_booking/details/component_details/BreadCrumb";
import CartSummary from "../../cart/CartSummary";
import { useParams } from "react-router-dom";
import { OrderPending } from "./orderPending";
import { OrderSkeleton } from "./OrderSkeleton";
import { OrderDelivery } from "./OrderDelivery";
export const OrderDetailBody = () => {
    const [isServiceHovered, setIsServiceHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const { status } = useParams<{ status: string }>();

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    let delivery;
    let process;

    if (status === 'canceled') {
        process = (
            <div className="p-4 border-b">
                <h3 className="text-base font-bold mb-2">Đơn hàng đã hủy lúc 15:51 ngày 1/04/2025</h3>
                <p className="text-gray-700">Rất mong được phục vụ bạn trong lần tới.</p>
            </div>
        )
    } else if (status === "pending" || status === "delivering") {
        process = (
            <OrderPending status={status}/>
        )
    } else if (status === "delivered") {
        process = (
            <div className="p-4 border-b">
                <h3 className="text-base font-bold mb-2">Đơn hàng đã giao lúc 15:51 ngày 1/04/2025</h3>
                <p className="text-gray-700">Rất mong được phục vụ bạn trong lần tới.</p>
            </div>
        )
    } else {
        process = (
            <div className="p-4 border-b">
                <h3 className="text-base font-bold mb-2">Đơn hàng đã được trả lúc 15:51 ngày 1/04/2025</h3>
                <p className="text-gray-700">Rất mong được phục vụ bạn trong lần tới.</p>
            </div>
        )
    };

    if (isLoading) {
        delivery = (
            <OrderSkeleton/>
        )
    } else {
        delivery = (
            <OrderDelivery status={status} process={process}/>
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
                                        {cartItems.
                                            filter((item) => item.selected).
                                            map((item, index) => (
                                                <CheckoutItem key={item.id} isFirst={index === 1} item={item} isLoading={isLoading} />
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* CartSummary luôn nằm dưới màn hình */}
                        <div className="tb:fixed tb:bottom-0 tb:left-0 tb:z-10 w-2/6 tb:w-full">
                            <CartSummary isDetail={true} isLoading={isLoading} status={status}/>
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