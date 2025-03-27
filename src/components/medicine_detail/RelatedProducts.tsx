import ProductSlider from "../home/product_for_age/MedicineSlider";
import { medicines } from "./medicine";
export const RelatedMedicines = () => {
    return (
        <div className="mt-5">
            <p className="text-lg font-semibold mb-2 tb:pl-2">Sản phẩm liên quan</p>
            <ProductSlider products={medicines} show={5} />
        </div>
    )
}