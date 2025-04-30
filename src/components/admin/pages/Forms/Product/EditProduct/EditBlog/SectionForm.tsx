import { Section } from './types';
import { Button } from './Button';
import { Input } from './Input';
import { TextArea } from './TextArea';
import { DescriptionItem } from './DescriptionItem';
import { IngredientItem } from './IngredientItem';
import { DescriptionType, descriptionTypeLabels } from '../../Blog/type';
import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { deleteProductIngredient, deleteProductSection, updateProductDetailSection, deleteProductDescriptionIngredient, addProductIngredient, addProductDescriptionIngredient } from '../../../../../../../redux/productAsyncThunk';
import ModalAddIngredient from './InModal';
import ModalAddDescription from './DesModal';

interface SectionFormProps {
  section: Section;
  index: number;
}

export const SectionForm: React.FC<SectionFormProps> = ({
  section,
  index,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [desModalOpen, setDesModalOpen] = useState(false);
  const [ingredientModalOpen, setIngredientModalOpen] = useState(false);
  const [tempSection, setTempSection] = useState({
    title: section.title,
    description: section.description,
    image: section.image,
    url: section.image,
    type: section.type
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  

  const handleDeleteSection = () => {
    dispatch(deleteProductSection(section.id));
  };

  const handleStartEditing = () => {
    setTempSection({
      title: section.title,
      description: section.description,
      image: section.image,
      type: section.type,
      url: section.image
    });
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
  };

  const handleSaveChanges = () => {
    console.log(tempSection);
    dispatch(updateProductDetailSection({ id: section.id, productDetailSection: tempSection }));
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setTempSection({ ...tempSection, image: file, url: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setTempSection({ ...tempSection, image: null, url: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChangeTempTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempSection({ ...tempSection, title: e.target.value });
  };

  const handleChangeTempDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTempSection({ ...tempSection, description: e.target.value });
  };


  const handleRemoveDescription = (descIndex: number) => {
    dispatch(deleteProductDescriptionIngredient(descIndex));
  };



  const handleRemoveIngredient = (ingredientIndex: number) => {
    dispatch(deleteProductIngredient(ingredientIndex));
  };



  return (
    <>
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium text-gray-700">
            Mục {index + 1}: {descriptionTypeLabels[section.type]}
          </h3>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="success"
                  onClick={handleSaveChanges}
                  className="text-sm py-1"
                >
                  Lưu
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleCancelEditing}
                  className="text-sm py-1"
                >
                  Hủy
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                onClick={handleStartEditing}
                className="text-sm py-1"
              >
                Chỉnh sửa
              </Button>
            )}
            <Button
              variant="danger"
              onClick={handleDeleteSection}
              className="text-sm py-1"
            >
              Xóa mục
            </Button>
          </div>
        </div>

        {/* Section title */}
        {isEditing ? (
          <Input
            label="Tiêu đề mục"
            value={tempSection.title}
            onChange={handleChangeTempTitle}
          />
        ) : (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tiêu đề mục
            </label>
            <div className="p-2 bg-gray-50 border border-gray-200 rounded-md">
              {section.title || "Chưa có tiêu đề"}
            </div>
          </div>
        )}

        {/* Image section */}
        {tempSection.type !== DescriptionType.INGREDIENTS && (
          <div className="my-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Hình ảnh
            </label>

            {isEditing ? (
              <div className="space-y-3">
                {tempSection.url && (
                  <div className="relative inline-block">
                    <img
                      src={tempSection.url}
                      alt=""
                      className="w-72 h-72 object-cover border border-gray-200 rounded-md"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      title="Xóa ảnh"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
                    ref={fileInputRef}
                  />
                </div>
              </div>
            ) : (
              section.image ? (
                <img
                  src={section.image}
                  alt=""
                  className="w-72 h-72 object-cover border border-gray-200 rounded-md"
                />
              ) : (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-md text-gray-500 text-center">
                  Chưa có hình ảnh
                </div>
              )
            )}
          </div>
        )}


        {/* Section description */}
        {section.description !== null && section.type !== DescriptionType.INGREDIENTS && (
          isEditing ? (
            <TextArea
              label="Mô tả mục"
              value={tempSection.description}
              onChange={handleChangeTempDescription}
            />
          ) : (
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Mô tả mục
              </label>
              <div className="p-2 bg-gray-50 border border-gray-200 rounded-md whitespace-pre-wrap">
                {section.description || "Chưa có mô tả"}
              </div>
            </div>
          )
        )}

        {/* Descriptions list - only editable if in edit mode */}
        {(section.descriptions.length >  0 || isEditing) && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Danh sách mô tả
            </label>
            {isEditing && section.type === DescriptionType.INGREDIENTS ? (
              <>
                {section.descriptions.map((desc) => (
                  <DescriptionItem
                    key={desc.id}
                    description={desc}
                    onRemove={() => handleRemoveDescription(desc.id)}
                  />
                ))}
                <Button
                  variant="primary"
                  className="mt-2 text-sm py-1"
                  onClick={() => setDesModalOpen(true)}
                >
                  Thêm mô tả
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                {section.descriptions.map((desc) => (
                  <div key={desc.id} className="p-2 bg-gray-50 border border-gray-200 rounded-md">
                    {desc.text || "Chưa có nội dung"}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Ingredients list - only editable if in edit mode */}
        {(section.ingredients.length > 0 || isEditing) && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Danh sách thành phần
            </label>
            {isEditing && section.type === DescriptionType.INGREDIENTS ? (
              <>
                {section.ingredients.map((ingredient) => (
                  <IngredientItem
                    key={ingredient.id}
                    ingredient={ingredient}
                    onRemove={() => handleRemoveIngredient(ingredient.id)}
                  />
                ))}
                <Button
                  variant="primary"
                  className="mt-2 text-sm py-1"
                  onClick={() => setIngredientModalOpen(true)}
                >
                  Thêm thành phần
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                {section.ingredients.map((ingredient) => (
                  <div key={ingredient.id} className="p-2 bg-gray-50 border border-gray-200 rounded-md flex justify-between">
                    <div>{ingredient.name || "Chưa có tên"}</div>
                    <div>{ingredient.value || "Chưa có giá trị"}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {desModalOpen && (
        <ModalAddDescription
          onSubmit={(text) => {
            dispatch(addProductDescriptionIngredient({ section_id: section.id, text }));
            setDesModalOpen(false);
          }}
          onClose={() => setDesModalOpen(false)}
        />
      )}
      {ingredientModalOpen && (
        <ModalAddIngredient
          onSubmit={(ingredient) => {
            dispatch(addProductIngredient({ section_id: section.id, name: ingredient.name, value: ingredient.value }));
            setIngredientModalOpen(false);
          }}
          onClose={() => setIngredientModalOpen(false)}
        />
      )}
    </>

  );
};