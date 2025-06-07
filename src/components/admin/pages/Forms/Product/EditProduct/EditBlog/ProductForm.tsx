import React, { useState, useEffect } from 'react';
import { Product } from './types';
import { Input } from './Input';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { SectionForm } from './SectionForm';
import { ModalCreatSection } from './ModalCreatSection';
import { DescriptionType } from '../../Blog/type';
import { useDispatch } from 'react-redux';
import { createProductDetailSection, updateProductDetail, createProductDetailSectionIngredient } from '../../../../../../../redux/productAsyncThunk';
import { AppDispatch } from '../../../../../../../redux/store';

interface ProductFormProps {
  initialProduct: Product;
}


export const ProductForm: React.FC<ProductFormProps> = ({
  initialProduct,
}) => {
  const [product, setProduct] = useState<Product>(initialProduct);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(product.title);
  const [modalOpen, setModalOpen] = useState(false);
  const [usedTypes, setUsedTypes] = useState<DescriptionType[]>([]);
  const dispatch:AppDispatch = useDispatch();

  useEffect(() => {
    const allTypes = Object.values(DescriptionType);
    const usedTypes = product.sections
      .map((s) => s.type)
      .filter((type): type is DescriptionType =>
        allTypes.includes(type as DescriptionType)
      );

    const remainingTypes = allTypes.filter(
      (type) => usedTypes.includes(type)
    );

    setUsedTypes(remainingTypes);
  }, [product]);

  const handleSaveTitle = () => {
    setIsEditingTitle(false);
    console.log(editedTitle);
    dispatch(updateProductDetail({ id: product.id.toString(), title: editedTitle }));
  };

  useEffect(() => {
    setProduct(initialProduct);
  }, [initialProduct]);


  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className='flex justify-between items-center'>
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Chỉnh sửa thông tin</h1>
        <button
          type='button'
          onClick={() => setModalOpen(true)}
          className="text-lg font-bold  bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Thêm mục
        </button>
      </div>


      <form>
        {/* Product title */}
        <div className="flex items-center gap-2">
          {isEditingTitle ? (
            <>
              <input className='w-full border border-gray-200 rounded-md p-2'
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                required
              />
              <button
                type='button'
                className="text-sm text-blue-500"
                onClick={handleSaveTitle}
              >
                Lưu
              </button>
              <button
                type='button'
                className="text-sm text-gray-500"
                onClick={() => {
                  setEditedTitle(product.title);
                  setIsEditingTitle(false);
                }}
              >
                Hủy
              </button>
            </>
          ) : (
            <>
              <p className="text-lg font-medium">{product.title}</p>
              <button
                type='button'
                className="text-sm text-blue-500"
                onClick={() => setIsEditingTitle(true)}
              >
                Chỉnh sửa
              </button>
            </>
          )}
        </div>


        {/* Product ID (readonly) */}
        <Input
          label="Product ID"
          value={product.product_id}
          onChange={() => { }}
          readOnly
        />

        {/* Sections */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Các mục</h2>

          {product.sections.map((section, sectionIndex) => (
            <SectionForm
              key={section.id}
              section={section}
              index={sectionIndex}
            />
          ))}
        </div>

        {/* Form actions */}
      </form>

      {/* Delete confirmation modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        itemName={product.title}
      />


      {/* Create Section Modal */}
      {modalOpen && (
        <ModalCreatSection
          usedTypes={usedTypes}
          onClose={() => setModalOpen(false)}
          onSubmit={(desc) => {
            // Cập nhật danh sách loại đã dùng
            setUsedTypes([...usedTypes, desc.type]);

            // Log dữ liệu
            console.log(desc);

            // Gửi request phù hợp theo type
            if (desc.type !== DescriptionType.INGREDIENTS) {
              dispatch(createProductDetailSection({
                product_detail_id: product.id.toString(),
                productDetailSection: desc,
              }));
            } else {
              dispatch(createProductDetailSectionIngredient({
                product_detail_id: product.id.toString(),
                productDetailSection: desc,
              }));
            }
          }}
        />
      )}

    </div>
  );
};