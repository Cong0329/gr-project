
import { useState, useEffect } from "react";
import { EditStep } from "./EditStep";
import { EditBasicInfoStep } from "./EditBasicInfo";
import { EditImagesStep } from "./EditImagesStep";
import { EditOptionsStep } from "./EditOptionsStep";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../../redux/store";
import { getProduct } from "../../../../../../redux/productAsyncThunk";
import { useParams } from "react-router-dom";
import EditBlog from "./EditBlog/EditBlog";


const EditProductPage = () => {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const { status, product } = useSelector((state: RootState) => state.products);
  const { id } = useParams();
  // Hiển thị nội dung của bước hiện tại
const renderCurrentStep = () => {
  switch (currentStep) {
    case 1:
        return (
          <EditBasicInfoStep />
        );
      case 2:
        return (
          <EditImagesStep
          />
        );
      case 3:
        return (
          <EditOptionsStep />
        );
      case 4:
        return (
          <EditBlog/>
        );
      default:
        return null;
    }
  };
  useEffect(() => {
    if (Object.keys(product).length === 0) {
      dispatch(getProduct(id))
    } else if (status === 'succeeded' && Object.keys(product).length > 0) {
      dispatch(getProduct(id))
    }
  }, [id, dispatch, product, status]);
  
  return (
    <>
      <div className="w-11/12 mx-auto">
        <h1 className="text-2xl font-bold mb-6">Cập nhật sản phẩm</h1>

        {<EditStep currentStep={currentStep} totalSteps={4} onStepClick={(step) => setCurrentStep(step)} />}

        <div className="bg-white rounded-lg shadow p-6">
          {renderCurrentStep()}

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
              {status === "loading" ? "Đang xử lý..." : "Xử lý thất bại"}
            </p>
          </div>
        </div>
      }
    </>

  );
};

export default EditProductPage;