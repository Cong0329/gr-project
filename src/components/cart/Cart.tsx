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
import { RelatedMedicines } from "../medicine_detail/RelatedProducts";


export const Cart = () => {
    const dispatch = useDispatch();
    const [isServiceHovered, setIsServiceHovered] = useState(false);
    const isCheckout = useSelector((state: RootState) => state.cart.isCheckout);
    const cartItems = useSelector((state: RootState) => state.cart.items);

    useEffect(() => {
        if (cartItems.length) {
            dispatch(fetchProducts());
        }
    }, [dispatch, cartItems.length]);

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
            <div className="mx-auto bg-white pt-2 tb:pt-0">
                <NavLink setIsServiceHovered={setIsServiceHovered} />
            </div>
            <div className='relative'>
                <div className="mx-auto w-4/5 md-lg:w-11/12 tb:w-11/12 relative tb:pt-2  container pb-5">
                    {isCheckout ? (
                        <button onClick={() => dispatch(backToCart())} className="text-blue-700 font-semibold pt-2">
                            <span className="flex items-center gap-1">
                                <FaAngleLeft />
                                Quay lại giỏ hàng
                            </span>
                        </button>
                    ) : (
                        <a href="/" className="text-blue-700 font-semibold">
                            <span className="flex items-center gap-1 pt-2">
                                <FaAngleLeft />
                                Tiếp tục mua sắm
                            </span>
                        </a>
                    )
                    }
                    {cartItems.length > 0 ? (
                        <div className="flex w-full  tb:flex-col mt-2">
                            {/* Cột trái: Cuộn được */}
                            <div className="w-4/6 pr-5  tb:w-full tb:pr-0">
                                <div className="min-h-full">
                                    {isCheckout ? <Checkout /> : <CartOder />}
                                </div>
                            </div>
                            {/* CartSummary luôn nằm dưới màn hình */}
                            <div className="tb:fixed tb:bottom-0 tb:left-0 tb:z-10 w-2/6 tb:w-full">
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
                    <RelatedMedicines />
                </div>
                {isServiceHovered && (
                    <div className="absolute inset-0 bg-blue-950 bg-opacity-30 z-5">    </div>
                )}
            </div>
        </main>
    )
}