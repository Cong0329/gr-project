import { Navbar } from "../navbar/Navbar"
import { RootState, AppDispatch } from "../../redux/store";
import { useEffect } from "react";
import { fetchProducts } from "../../redux/productAsyncThunk";
import { fetchDoctors } from "../../redux/doctorSlice";
import { fetchDepartments } from "../../redux/departmentSlice";
import { useSelector, useDispatch } from "react-redux";
export const Header = () => {
    const { products } = useSelector((state: RootState) => state.products);
    const {doctors} = useSelector((state: RootState) => state.doctors);
    const {departments} = useSelector((state: RootState) => state.departments);
    const dispatch: AppDispatch = useDispatch();
    useEffect(() => {
        if (products.length === 0 || doctors.length === 0 || departments.length === 0) {
            dispatch(fetchProducts());
            dispatch(fetchDoctors());
           dispatch(fetchDepartments());
        }
    }, [dispatch, products.length, doctors.length, departments.length]);
    return (
        <header>
            <Navbar />
        </header>
    )
}

