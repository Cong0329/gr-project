
import { Check } from "lucide-react";

// Component hiển thị bước
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const steps = ["Thông tin cơ bản", "Thêm ảnh", "Tùy chọn", "Chi tiết sản phẩm"];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center w-full mb-4">
        {steps.map((stepTitle, index) => {
          const step = index + 1;
          return (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                  step === currentStep
                    ? "bg-blue-500 border-blue-600 text-white"
                    : step < currentStep
                    ? "bg-green-500 border-green-600 text-white"
                    : "bg-gray-100 border-gray-300 text-gray-500"
                }`}
              >
                {step < currentStep ? <Check size={16} /> : step}
              </div>
              <span
                className={`mt-2 text-sm ${
                  step === currentStep
                    ? "text-blue-500 font-medium"
                    : step < currentStep
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
              >
                {stepTitle}
              </span>
            </div>
          );
        })}
      </div>
      <div className="w-full bg-gray-200 h-1 rounded-full">
        <div
          className="bg-blue-500 h-1 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};