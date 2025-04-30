import { Product } from "../components/medicine_detail/medicine";
import { createSlice } from "@reduxjs/toolkit";
import { createProduct, createProductImage, createProductDetail, createProductOption, createProductDetailSection, createProductDetailSectionIngredient, fetchProducts, deleteProduct, getProduct, updateProduct, deleteProductImage, deleteProductOption, updateProductOption, getProductDetailProduct, updateProductDetail, deleteProductSection, updateProductDetailSection, deleteProductIngredient, deleteProductDescriptionIngredient, addProductDescriptionIngredient, addProductIngredient } from "./productAsyncThunk";
import { DescriptionProduct } from "../components/admin/pages/Forms/Product/EditProduct/EditBlog/types";

interface ProductState {
    products: Product[];
    loading: boolean;
    product: Product;
    detail: DescriptionProduct;
    product_id: string;
    detail_id: string;
    error: string | null;
    status: 'idle' | 'loading' | 'failed' | 'succeeded';
}

const initialState: ProductState = {
    products: [],
    product: {} as Product, 
    detail: {} as DescriptionProduct,
    loading: false,
    product_id: '',
    detail_id: '',
    error: null,
    status: 'idle'
};

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setStatus: (state, action) => {
            state.status = action.payload;
        },
        resetProduct: (state) => {
            state.product = {} as Product;
            state.detail = {} as DescriptionProduct;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createProduct.pending, (state) => {
            state.status = 'loading';
        }).addCase(createProduct.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.product_id = action.payload.product.id;
        }).addCase(createProduct.rejected, (state) => {
            state.status = 'failed';
        }).addCase(createProductImage.pending, (state) => {
            state.status = 'loading';
        }).addCase(createProductImage.fulfilled, (state) => {
            state.status = 'succeeded';
        }).addCase(createProductImage.rejected, (state) => {
            state.status = 'failed';
        }).addCase(createProductOption.pending, (state) => {
            state.status = 'loading';
        }).addCase(createProductOption.fulfilled, (state) => {
            state.status = 'succeeded';
        }).addCase(createProductOption.rejected, (state) => {
            state.status = 'failed';
        }).addCase(createProductDetail.pending, (state) => {
            state.status = 'loading';
        }).addCase(createProductDetail.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.detail_id = action.payload.id;
        }).addCase(createProductDetail.rejected, (state) => {
            state.status = 'failed';
        }).addCase(createProductDetailSection.pending, (state) => {
            state.status = 'loading';
        }).addCase(createProductDetailSection.fulfilled, (state) => {
            state.status = 'succeeded';
        }).addCase(createProductDetailSection.rejected, (state) => {
            state.status = 'failed';
        }).addCase(createProductDetailSectionIngredient.pending, (state) => {
            state.status = 'loading';
        }).addCase(createProductDetailSectionIngredient.fulfilled, (state) => {
            state.status = 'succeeded';
        }).addCase(createProductDetailSectionIngredient.rejected, (state) => {
            state.status = 'failed';
        }).addCase(fetchProducts.pending, (state) => {
            state.status = 'loading';
        }).addCase(fetchProducts.fulfilled, (state, action) => {
            state.status = 'idle';
            state.products = action.payload;
        }).addCase(fetchProducts.rejected, (state) => {
            state.status = 'failed';
        }).addCase(deleteProduct.pending, (state) => {
            state.status = 'loading';
        }).addCase(deleteProduct.fulfilled, (state) => {
            state.status = 'succeeded';
        }).addCase(deleteProduct.rejected, (state) => {
            state.status = 'failed';
        }).addCase(getProduct.pending, (state) => {
            state.status = 'loading';
        }).addCase(getProduct.fulfilled, (state, action) => {
            state.status = 'idle';
            state.product = action.payload;
        }).addCase(getProduct.rejected, (state) => {
            state.status = 'failed';
        }).addCase(updateProduct.pending, (state) => {
            state.status = 'loading';
        }).addCase(updateProduct.fulfilled, (state) => {
            state.status = 'succeeded';
        }).addCase(updateProduct.rejected, (state) => {
            state.status = 'failed';
        }).addCase(deleteProductImage.pending, (state) => {
            state.status = 'loading';
        }).addCase(deleteProductImage.fulfilled, (state) => {
            state.status = 'succeeded';
        }).addCase(deleteProductImage.rejected, (state) => {
            state.status = 'failed';
        }).addCase(deleteProductOption.pending, (state) => {
            state.status = 'loading';
        }).addCase(deleteProductOption.fulfilled, (state) => {
            state.status = 'succeeded';
        }).addCase(deleteProductOption.rejected, (state) => {
            state.status = 'failed';
        }).addCase(updateProductOption.pending, (state) => {
            state.status = 'loading';
        }).addCase(updateProductOption.fulfilled, (state) => {
            state.status = 'succeeded';
        }).addCase(updateProductOption.rejected, (state) => {
            state.status = 'failed';
        }).addCase(getProductDetailProduct.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(getProductDetailProduct.fulfilled, (state, action) => {
            state.status = 'idle';
            state.detail = action.payload;
        })
        .addCase(getProductDetailProduct.rejected, (state) => {
            state.status = 'failed';
        })
        .addCase(updateProductDetail.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(updateProductDetail.fulfilled, (state) => {
            state.status = 'succeeded';
        })
        .addCase(updateProductDetail.rejected, (state) => {
            state.status = 'failed';
        })
        .addCase(deleteProductSection.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(deleteProductSection.fulfilled, (state) => {
            state.status = 'succeeded';
        })
        .addCase(deleteProductSection.rejected, (state) => {
            state.status = 'failed';
        })
        .addCase(updateProductDetailSection.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(updateProductDetailSection.fulfilled, (state) => {
            state.status = 'succeeded';
        })
        .addCase(updateProductDetailSection.rejected, (state) => {
            state.status = 'failed';
        })
        .addCase(addProductIngredient.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(addProductIngredient.fulfilled, (state) => {
            state.status = 'succeeded';
        })
        .addCase(addProductIngredient.rejected, (state) => {
            state.status = 'failed';
        })
        .addCase(addProductDescriptionIngredient.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(addProductDescriptionIngredient.fulfilled, (state) => {
            state.status = 'succeeded';
        })
        .addCase(addProductDescriptionIngredient.rejected, (state) => {
            state.status = 'failed';
        })
        .addCase(deleteProductIngredient.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(deleteProductIngredient.fulfilled, (state) => {
            state.status = 'succeeded';
        })
        .addCase(deleteProductIngredient.rejected, (state) => {
            state.status = 'failed';
        })
        .addCase(deleteProductDescriptionIngredient.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(deleteProductDescriptionIngredient.fulfilled, (state) => {
            state.status = 'succeeded';
        })
        .addCase(deleteProductDescriptionIngredient.rejected, (state) => {
            state.status = 'failed';
        })
    }
});



export default productSlice.reducer;
export const { setStatus, resetProduct } = productSlice.actions;

