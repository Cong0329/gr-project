
import { Product } from "../Product";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../../redux/store";
import { useEffect } from "react";
import { getBrandProduct } from "../../../../../../redux/brandAsyncThunk";
import { useParams } from "react-router-dom";

export const BrandProduct = () => {
    const dispatch = useDispatch();
    const { products, status } = useSelector((state: RootState) => state.brands);
    const { name } = useParams();
    useEffect(() => {
        dispatch(getBrandProduct(name));
    }, [dispatch, name]);
    return (
       <Product products={products} status={status} />
    );
};