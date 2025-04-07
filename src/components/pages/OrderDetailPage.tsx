import { Header } from "../header/Header";
import { Footer } from "../footer/Footer";
import { OrderDetailBody } from "../information/orderDetail/orderDetailBody";




export const OrderDetailPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <OrderDetailBody/>
            <Footer />
        </div>
    )
}