
import { Product } from "../Product";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../../../redux/store";
import { useEffect } from "react";
import { getCategoryProduct } from "../../../../../../redux/categoryAsyncThunk";
import { useParams } from "react-router-dom";

export const CategoryProduct = () => {
    const dispatch:AppDispatch = useDispatch();
    const { products, status } = useSelector((state: RootState) => state.categories);
    const { name } = useParams();
    useEffect(() => {
        dispatch(getCategoryProduct(name as string));
    }, [dispatch, name]);
    return (
       <Product products={products} status={status} />
    );
};