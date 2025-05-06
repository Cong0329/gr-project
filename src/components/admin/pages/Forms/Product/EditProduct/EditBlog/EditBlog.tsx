import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProductForm } from './ProductForm';
import { Product } from './types';
import { RootState } from '../../../../../../../redux/store';
import { getProductDetailProduct } from '../../../../../../../redux/productAsyncThunk';

// Example usage
const EditBlog: React.FC = () => {
  const dispatch = useDispatch();
  const { detail, product, status } = useSelector((state: RootState) => state.products);
  useEffect(() => {
    if (Object.keys(detail).length === 0) {
       dispatch(getProductDetailProduct(product.id));
    } else if (status === 'succeeded' && Object.keys(detail).length > 0) {
      dispatch(getProductDetailProduct(product.id));
    }
  }, [dispatch, detail, product, status]);
  // Mock product data (this would typically come from an API)
  // const sampleProduct: Product = {
  //   id: 10,
  //   product_id: "df4eea6e-9797-4aff-a666-59055b6c7680",
  //   title: "Nước súc miệng Pearlie White Chlor-Rinse Plus 250ml là gì?",
  //   sections: [
  //     {
  //       id: 14,
  //       product_detail_id: 10,
  //       type: "Product Description",
  //       title: "Mô tả sản phẩm",
  //       image: null,
  //       description: "Nước súc miệng bổ sung thành phần kháng khuẩn\r\nNước súc miệng Pearlie White Chlor-Rinse Plus là sự kết hợp hài hòa giữa thành phần kháng khuẩn và nguyên liệu tự nhiên, hỗ trợ chống lại vi khuẩn gây hôi miệng, mảng bám, sâu răng; giảm và làm dịu cảm giác khó chịu ở miệng.",
  //       descriptions: [],
  //       ingredients: []
  //     },
  //     {
  //       id: 15,
  //       product_detail_id: 10,
  //       type: "Ingredients",
  //       title: "Thành phần của Nước súc miệng Pearlie White Chlor-Rinse Plus 250ml",
  //       image: null,
  //       description: null,
  //       descriptions: [
  //         {
  //           id: 4,
  //           section_id: 15,
  //           text: "Aqua"
  //         }
  //       ],
  //       ingredients: [
  //         {
  //           id: 4,
  //           section_id: 15,
  //           name: "Aqua",
  //           value: "250ml"
  //         }
  //       ]
  //     }
  //   ]
  // };

  const handleSave = (updatedProduct: Product) => {
    console.log("Saving product:", updatedProduct);
    // Here you would typically send the updated product to your API
    alert("Sản phẩm đã được cập nhật thành công!");
  };

  const handleDelete = (id: number) => {
    console.log("Deleting product with ID:", id);
    // Here you would typically send a delete request to your API
    alert("Sản phẩm đã được xóa thành công!");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {detail && detail.id ? (
        <ProductForm
          initialProduct={detail}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      ) : (
        <p className="text-center text-gray-600">Đang tải dữ liệu sản phẩm...</p>
      )}
    </div>
  );
};

export default EditBlog;