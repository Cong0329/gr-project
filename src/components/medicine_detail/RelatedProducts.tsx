import ProductSlider from "../home/product_for_age/MedicineSlider";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
export const RelatedMedicines = () => {
    const { products} = useSelector((state: RootState) => state.products);
    return (
        <div className="mt-5">
            <p className="text-lg font-semibold mb-2 tb:pl-2">Sản phẩm liên quan</p>
            <ProductSlider products={products} show={6} />
        </div>
    )
}