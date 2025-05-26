import { Navbar } from "../navbar/Navbar"
import { RootState, AppDispatch } from "../../redux/store";
import { useEffect } from "react";
import { fetchProducts } from "../../redux/productAsyncThunk";
import { useSelector, useDispatch } from "react-redux";
export const Header = () => {
    const { products } = useSelector((state: RootState) => state.products);
    const dispatch: AppDispatch = useDispatch();
    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, products.length]);
    return (
        <header>
            <Navbar />
        </header>
    )
}

