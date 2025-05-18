
import { Product } from "../Product";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../../../../redux/store";
import { useEffect } from "react";
import { getMedicalObjectProductByName } from "../../../../../../redux/medicalObjectAsyncThunk";
import { useParams } from "react-router-dom";

export const MedicalObjectProduct = () => {
    const dispatch:AppDispatch = useDispatch();
    const { products, status } = useSelector((state: RootState) => state.medicalObjects);
    const { name } = useParams();
    useEffect(() => {
        dispatch(getMedicalObjectProductByName(name as string));
    }, [dispatch, name]);
    return (
       <Product products={products} status={status} />
    );
};