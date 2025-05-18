import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../../redux/store";
import { useEffect } from "react";
import { fetchProducts } from "../../../../../redux/productAsyncThunk";
import { Product } from "./Product";





const ProductPage = () => {
    const { products, status } = useSelector((state: RootState) => state.products);
    const dispatch: AppDispatch = useDispatch();
    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts());
        } else if (status === 'succeeded') {
            dispatch(fetchProducts());
        }
    }, [dispatch, products.length, status]);

    return (


        <Product products={products} status={status} />

    );
};

export default ProductPage;