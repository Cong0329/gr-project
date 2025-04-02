import { useEffect, useState } from "react";
import { NavLink } from "../navlink/NavLink";
import { RootState } from "../../redux/store";
import { backToCart, addToCart } from "../../redux/cartSlice";
import { fetchProducts, addToCartAPI } from "../../redux/cartAsyncThunk";
import { useSelector, useDispatch } from "react-redux";
import Checkout from "./Checkout";
import CartOder from "./CartOder";
import { FaAngleLeft } from "react-icons/fa6";
import CartSummary from "./CartSummary";

export const Cart = () => {
    const dispatch = useDispatch();
    const [isServiceHovered, setIsServiceHovered] = useState(false);
    const isCheckout = useSelector((state: RootState) => state.cart.isCheckout);
    const cartItems = useSelector((state: RootState) => state.cart.items);

    useEffect(() => {
        if (cartItems.length ) {
            dispatch(fetchProducts());
        }
    }, [dispatch,cartItems.length]);

    // const Product = {
    //     id: "3",
    //     name: 'Vitamin C 1000mg',
    //     quantity: 1,
    //     image: 'https://i.imgur.com/HXN77Ev.png',
    //     selectedOption: 'hop',
    //     options: [
    //         {
    //             id: 'hop',
    //             label: 'Hộp',
    //             price: 165000,
    //             discountedPrice: 150000,
    //             isDiscounted: true
    //         },
    //         {
    //             id: 'vi',
    //             label: 'Vỉ',
    //             price: 92000
    //         },
    //         {
    //             id: 'ong',
    //             label: 'Ống',
    //             price: 9200
    //         }
    //     ]
    // }

    // const handleAddToCart = () => {
    //     dispatch(addToCartAPI(Product));
    // }
    return (
        <main className="flex-1 bg-gray-100  ">
            <div className="mx-auto bg-white pt-2">
                <NavLink setIsServiceHovered={setIsServiceHovered} />
            </div>
            <div className='relative'>
                <div className="mx-auto w-4/5 relative pt-4 pb-[200px] container">
                    {isCheckout ? (
                        <button onClick={() => dispatch(backToCart())} className="text-blue-700 font-semibold">
                            <span className="flex items-center gap-1">
                                <FaAngleLeft />
                                Quay lại giỏ hàng
                            </span>
                        </button>
                    ) : (
                        <a href="/" className="text-blue-700 font-semibold">
                            <span className="flex items-center gap-1">
                                <FaAngleLeft />
                                Tiếp tục mua sắm
                            </span>
                        </a>
                    )
                    }
                    {cartItems.length > 0 ? (
                        <div className="flex mx-auto mt-4 ">
                            <div className="w-4/6 pr-5">
                                {isCheckout ?
                                    <Checkout /> :
                                    <CartOder />
                                }
                            </div>
                            <div className="w-2/6">
                                <CartSummary />
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10  flex flex-col justify-center items-center gap-2">
                            <img className="w-1/4" alt="cart" src="https://i.imgur.com/wJtkO6K.png" />
                            <h2 className="text-xl font-semibold">Giỏ hàng của bạn đang trống</h2>
                            <p className="text-gray-500">Hãy thêm sản phẩm để mua sắm nhé!</p>
                            <a className="bg-blue-700 text-white font-semibold px-4 py-2 rounded-full" href="/">
                                Khám phá ngay
                            </a>
                        </div>
                    )}

                    {/* <button onClick={handleAddToCart}>Thêm</button> */}

                </div>
                {isServiceHovered && (
                    <div className="absolute inset-0 bg-blue-950 bg-opacity-30 z-5">    </div>
                )}
            </div>
        </main>
    )
}