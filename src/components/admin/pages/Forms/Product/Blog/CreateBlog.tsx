// components/CreateBlog.tsx
import React, { useEffect, useState } from "react";
import { DescriptionType, Title, TextTitle, IngredientTitle, descriptionTypeLabels } from "./type";
import { StepOne } from "./StepOne";
import { DescriptionTypeSelector } from "./DescriptionTypeSelector";
import { TextDescriptionForm } from "./TextDescriptionForm";
import { IngredientDescriptionForm } from "./IngredientDescriptionForm";
import { useDispatch, useSelector } from "react-redux";
import { createProductDetail, createProductDetailSection, createProductDetailSectionIngredient } from "../../../../../../redux/productAsyncThunk";
import { setStatus } from "../../../../../../redux/productSlice";
import { RootState } from "../../../../../../redux/store";

interface CreateBlogProps {
  updateDetailedInfo: (title: string, descriptions: Title[]) => void;
}

const CreateBlog: React.FC<CreateBlogProps> = ({ updateDetailedInfo }) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [blogTitle, setBlogTitle] = useState("");
  const [descriptions, setDescriptions] = useState<Title[]>([]);
  const [selectedType, setSelectedType] = useState<DescriptionType | null>(null);
  const { status, product_id, detail_id } = useSelector((state: RootState) => state.products);


  useEffect(() => {
    if (status === "failed") {
      const timeout = setTimeout(() => {
        dispatch(setStatus("idle")); // Sau 2 giây tự động tắt thông báo lỗi
      }, 2000);

      return () => clearTimeout(timeout); // Dọn dẹp timeout nếu component unmount
    }
  }, [status, dispatch]);

  const handleAddTextDescription = (newDesc: TextTitle) => {
    setDescriptions((prev) => [...prev, newDesc]);
    dispatch(createProductDetailSection({ product_detail_id: detail_id, productDetailSection: newDesc }));
    setSelectedType(null);
  };

  const handleAddIngredientDescription = (newDesc: IngredientTitle) => {
    setDescriptions((prev) => [...prev, newDesc]);
    dispatch(createProductDetailSectionIngredient({ product_detail_id: detail_id, productDetailSection: newDesc }));
    console.log(newDesc.descriptions);
    setSelectedType(null);
  };


  const handleNextStep = () => {
    if (step === 1 && blogTitle.trim()) {
      dispatch(createProductDetail({ product_id: product_id, title: blogTitle }));
      setStep(2);
    } else if (step === 2) {
      updateDetailedInfo(blogTitle, descriptions);
      setStep(3);
      console.log(descriptions);
    }
  };

  return (
    <>
      <div className="p-4 space-y-6 w-full mx-auto">
        {step === 1 && (
          <StepOne title={blogTitle} setTitle={setBlogTitle} onCreateBlog={handleNextStep} />
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Thêm mô tả cho blog</h2>
            <DescriptionTypeSelector
              onSelect={setSelectedType}
              disabledTypes={descriptions.map(desc => desc.type)}
            />
            {selectedType && selectedType !== DescriptionType.INGREDIENTS && (
              <TextDescriptionForm
                type={selectedType}
                onSubmit={handleAddTextDescription}
              />
            )}

            {selectedType === DescriptionType.INGREDIENTS && (
              <IngredientDescriptionForm
                onSubmit={handleAddIngredientDescription}
              />
            )}

            <div className="mt-6">
              <h3 className="font-medium">Mô tả đã thêm:</h3>
              <ul className="list-disc pl-6">
                {descriptions.map((desc, idx) => (
                  <li key={idx} className="flex items-start justify-between py-1">
                    <div>
                      <strong>{desc.title}</strong> – {descriptionTypeLabels[desc.type]}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleNextStep}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Tiếp tục
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Xem trước Blog</h2>
            <p className="text-lg font-semibold">Tiêu đề: {blogTitle}</p>
            {descriptions.map((desc, index) => (
              <div key={index} className="border-t mt-4 pt-2">
                <h4 className="font-medium text-blue-700">{desc.title}</h4>
                {desc.type === DescriptionType.INGREDIENTS ? (
                  <div>
                    <ul className="list-disc pl-4">
                      {desc.descriptions.description?.map((line, idx) => (
                        <li key={idx}>{line}</li>
                      ))}
                    </ul>
                    <table className="mt-2 border text-sm">
                      <thead>
                        <tr>
                          <th className="border px-2">Thành phần</th>
                          <th className="border px-2">Giá trị</th>
                        </tr>
                      </thead>
                      <tbody>
                        {desc.descriptions.ingredients.map((ing, idx) => (
                          <tr key={idx}>
                            <td className="border px-2">{ing.name}</td>
                            <td className="border px-2">{ing.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div>
                    <p>{desc.description}</p>
                    {desc.url && (
                      <img src={desc.url} alt="desc" className="mt-2 w-64 h-auto rounded" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {(status === "loading" || status === "failed") &&
        <div className="fixed inset-0 z-[1000000] flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center">
            {status === "loading" ? (
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            )}
            <p className="mt-4 text-white text-sm">
              {status === "loading" ? "Đang thêm..." : "Thêm thất bại"}
            </p>
          </div>
        </div>
      }
    </>

  );
};

export default CreateBlog;
