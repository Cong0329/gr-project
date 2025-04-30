import { useProductCreationForm } from "./useProductCreationForm";
import { BasicInfoStep } from "./Step/BasicInfoStep";
import { ImagesStep } from "./Step/ImagesStep";
import { OptionsStep } from "./Step/OptionsStep";
import { DetailedInfoStep } from "./Step/DetailedInfoStep";
import { CompletionStep } from "./Step/CompletionStep";
import { NextButton } from "./NextButton";
import { StepIndicator } from "./Step/StepIndicator";
import { Description } from "../Blog/type";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { RootState } from "../../../../../../redux/store";
import { setStatus } from "../../../../../../redux/productSlice";

// Định nghĩa kiểu dữ liệu
export interface ProductImage {
  id: string;
  file: File;
  url: string;
}

export interface ProductOptionInt {
  id: string;
  label: string;
  price: number;
  discounted_price: number;
}




export interface ProductFormData {
  basicInfo: {
    name: string;
    code: string;
    dosage_form: string;
    specification: string;
    ingredients: string;
    registration_number: string;
    description: string;
    manufacturer: string;
    quantity: number;
    brand_id: string;
    category_id: string;
    type: string;
    indication_id: string;
    medical_object_id: string;
  };
  images: ProductImage[];
  options: ProductOptionInt[];
  detailedInfo: Description;
}

// Component chính
export default function ProductCreationForm() {
  const { currentStep, formData, isCompleted, canProceed, nextStep, handleBasicInfoChange, addImage, removeImage, addOption, updateOptionField, removeOption, updateDetailedInfo } = useProductCreationForm();
  const { status } = useSelector((state: RootState) => state.products);
  const dispatch = useDispatch();
  useEffect(() => {
    if (status === "failed") {
      const timeout = setTimeout(() => {
        dispatch(setStatus("idle")); // Sau 2 giây tự động tắt thông báo lỗi
      }, 2000);

      return () => clearTimeout(timeout); // Dọn dẹp timeout nếu component unmount
    }
  }, [status, dispatch]);

  // Hiển thị nội dung của bước hiện tại
  const renderCurrentStep = () => {
    if (isCompleted) {
      return <CompletionStep formData={formData} />;
    }

    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            formData={formData.basicInfo}
            onChange={handleBasicInfoChange}
          />
        );
      case 2:
        return (
          <ImagesStep
            images={formData.images}
            onAddImage={addImage}
            onRemoveImage={removeImage}
          />
        );
      case 3:
        return (
          <OptionsStep
            options={formData.options}
            onAddOption={addOption}
            onUpdateOptionField={updateOptionField}
            onRemoveOption={removeOption}
          />
        );
      case 4:
        return (
          <DetailedInfoStep updateDetailedInfo={updateDetailedInfo} />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="w-11/12 mx-auto">
        <h1 className="text-2xl font-bold mb-6">Tạo sản phẩm mới</h1>

        {!isCompleted && <StepIndicator currentStep={currentStep} totalSteps={4} />}

        <div className="bg-white rounded-lg shadow p-6">
          {renderCurrentStep()}

          {!isCompleted && (
            <NextButton
              onNext={nextStep}
              disabled={!canProceed()}
              isLastStep={currentStep === 4}
            />
          )}
        </div>
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
}