import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { useEffect } from "react";
import { fetchProducts } from "../../../../../redux/productAsyncThunk";

import { Product } from "./Product";

interface Product {
    id: string;
    name: string;
    images: Images[];
    quantity: number;
    brand: Brand;
    options: Options[];
}

interface Brand {
    id: string;
    name: string;
}

interface Options {
    id: string;
    label: string;
    price: number;
    discounted_pricet: number;
}

interface Images {
    id: string;
    image: string;
}


// interface ProductPageProps {
//     products: Product[];
// }


const ProductPage = () => {
    const { products, status } = useSelector((state: RootState) => state.products);
    const dispatch = useDispatch();
    useEffect(() => {
        if (products.length === 0 ) {
            dispatch(fetchProducts());
        } else if (status === 'succeeded') {
            dispatch(fetchProducts());
        }
    }, [dispatch, products.length, status]);

    return (
    <Product products={products}  status={status}/>
    );
};

export default ProductPage;