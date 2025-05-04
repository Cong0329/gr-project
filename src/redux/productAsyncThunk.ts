import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ProductImage, ProductOptionInt } from "../components/admin/pages/Forms/Product/AddProduct/ProductCreationForm";


// Product

interface Product {
    name: string;
    code: string;
    type: string;
    dosage_form: string;
    specification: string;
    ingredients: string;
    registration_number: string;
    description: string;
    manufacturer: string;
    quantity: number;
    brand_id: number;
    category_id: number;
    medical_object_id: number;
    indication_id: number;
}

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/product`, {
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
);

export const createProduct = createAsyncThunk(
    'products/createProduct',
    async (product: Product, { rejectWithValue }) => {
        console.log(product);
        try {
            const response = await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/product`, product, {
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
);


export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async ({ id, product }: { id: string, product: Product }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/product/${id}`, product, {
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
);


export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/product/${id}`, {
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
);

export const getProduct = createAsyncThunk(
    'products/getProduct',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/product/id/${id}`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
);


export const getProductBySlug = createAsyncThunk(
    'products/getProductBySlug',
    async (slug: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/product/${slug}`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
)


// Product Image

export const createProductImage = createAsyncThunk(
    'products/createProductImage',
    async ({ productId, images }: { productId: string, images: ProductImage[] }, { rejectWithValue }) => {
        const formData = new FormData();
        formData.append("productId", productId);

        images.forEach((image) => {
            formData.append("images", image.file);
        });
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/product-image`, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
)

export const deleteProductImage = createAsyncThunk(
    'products/deleteProductImage',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/product-image/${id}`, {
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
)

// Product Option

export const createProductOption = createAsyncThunk(
    'products/createProductOption',
    async ({ product_id, fullOption }: { product_id: string, fullOption: ProductOptionInt[] }, { rejectWithValue }) => {
        const options = fullOption.map(({ id, ...rest }) => rest);
        console.log(options);
        try {
            const response = await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/product-option`, { options, product_id }, {
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
)

export const updateProductOption = createAsyncThunk(
    'products/updateProductOption',
    async ({ id, updateFields }: { id: string, updateFields: ProductOptionInt }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/product-option/${id}`, updateFields, {
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
)

export const deleteProductOption = createAsyncThunk(
    'products/deleteProductOption',
    async (optionId: string, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/product-option/${optionId}`, {
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
)


// Product Detail

export const createProductDetail = createAsyncThunk(
    'products/createProductDetail',
    async ({ product_id, title }: { product_id: string, title: string }, { rejectWithValue }) => {
        console.log(title);
        try {
            const response = await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/product-detail`, { product_id, title }, {
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
)

export const updateProductDetail = createAsyncThunk(
    'products/updateProductDetail',
    async ({ id, title }: { id: string, title: string }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/product-detail/${id}`, { title }, {
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
)


export const getProductDetail = createAsyncThunk(
    'products/getProductDetail',
    async (product_id: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/product-detail/${product_id}`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
)


export const deleteProductDetail = createAsyncThunk(
    'products/deleteProductDetail',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/product-detail/${id}`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
)

// Detail Section
interface ProductDetailSection {
    product_detail_id: string;
    type: string;
    title: string;
    description: string;
    image: File | FileList | null;
}

interface ProductDetailSectionIngredient extends ProductDetailSection {
    descriptions: string;
}

export const createProductDetailSection = createAsyncThunk(
    'products/createProductDetailSection',
    async ({ product_detail_id, productDetailSection }: { product_detail_id: string, productDetailSection: ProductDetailSection }, { rejectWithValue }) => {
        const formData = new FormData();
        formData.append('product_detail_id', product_detail_id);
        formData.append('type', productDetailSection.type);
        formData.append('title', productDetailSection.title);
        formData.append('description', productDetailSection.description);
        if (productDetailSection.image) {
            formData.append('image', productDetailSection.image as File);
        }
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/detail-section/${product_detail_id}`, formData, {
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
)


export const createProductDetailSectionIngredient = createAsyncThunk(
    'products/createProductDetailSectionIngredient',
    async ({ product_detail_id, productDetailSection }: { product_detail_id: string, productDetailSection: ProductDetailSectionIngredient }, { rejectWithValue }) => {
        console.log(productDetailSection);
        try {
            const response = await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/detail-section/${product_detail_id}/full`, productDetailSection, {
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
)

export const deleteProductDetailSection = createAsyncThunk(
    'products/deleteProductDetailSection',
    async (product_detail_id: string, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/detail-section/${product_detail_id}`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
)

export const getProductDetailProduct = createAsyncThunk(
    'products/getProductDetailProduct',
    async (product_id: string, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/product-detail/${product_id}`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
)

export const deleteProductSection = createAsyncThunk(
    'products/deleteProductSection',
    async (section_id: string, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/detail-section/${section_id}`, {
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
)

export const updateProductDetailSection = createAsyncThunk(
    'products/updateProductDetailSection',
    async ({ id, productDetailSection }: { id: string, productDetailSection: ProductDetailSection }, { rejectWithValue }) => {
        const formData = new FormData();
        formData.append('type', productDetailSection.type);
        formData.append('title', productDetailSection.title);
        formData.append('description', productDetailSection.description);
        if (productDetailSection.image) {
            formData.append('image', productDetailSection.image as File);
        }
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        try {
            const response = await axios.patch(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/detail-section/${id}`, formData, {
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
)

export const addProductIngredient = createAsyncThunk(
    'products/addProductIngredient',
    async ({ section_id, name, value }: { section_id: string, name: string, value: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/detail-section/${section_id}/ingredient`, { name, value }, {
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
)
export const addProductDescriptionIngredient = createAsyncThunk(
    'products/addProductDescriptionIngredient',
    async ({ section_id, text }: { section_id: string, text: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/detail-section/${section_id}/description`, {text}, {
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
)

export const deleteProductIngredient = createAsyncThunk(
    'products/deleteProductIngredient',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/detail-section/${id}/ingredient`, {
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
)

export const deleteProductDescriptionIngredient = createAsyncThunk(
    'products/deleteProductDescriptionIngredient',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_NODEJS_BACKEND_URL}/detail-section/${id}/description`, {
                withCredentials: true
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({ message: 'An unknown error occurred' });
        }
    }
)