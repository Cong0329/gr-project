
import { Product } from "../Product";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../../../redux/store";
import { useEffect } from "react";
import { getIndicationProductByName } from "../../../../../../redux/indicationAsyncThunk";
import { useParams } from "react-router-dom";

export const IndicationProduct = () => {
    const dispatch:AppDispatch = useDispatch();
    const { products, status } = useSelector((state: RootState) => state.indications);
    const { name } = useParams();
    useEffect(() => {
        dispatch(getIndicationProductByName(name as string));
    }, [dispatch, name]);
    return (
       <Product products={products} status={status} />
    );
};