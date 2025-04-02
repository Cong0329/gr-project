import { Header } from "../header/Header"
import { Footer } from "../footer/Footer"
import { Cart } from "../cart/Cart"

export const CartPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <Cart/>
            <Footer />
        </div>
    )
}