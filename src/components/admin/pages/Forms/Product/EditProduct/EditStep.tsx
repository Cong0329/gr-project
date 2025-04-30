
// Component hiển thị bước
interface EditStepProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

export const EditStep: React.FC<EditStepProps> = ({ currentStep, totalSteps, onStepClick}) => {
  const steps = ["Thông tin cơ bản", "Quản lý ảnh", "Quản lý tùy chọn", "Chi tiết sản phẩm"];
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center w-full mb-4">
        {steps.map((stepTitle, index) => {
          const step = index + 1;
          return (
            <button key={step} type="button"  onClick={() => onStepClick(step)} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                  step === currentStep
                    ? "bg-blue-500 border-blue-600 text-white"
                    : "bg-gray-100 border-gray-300 text-gray-500"
                }`}
              >
                {step < currentStep ? step : step}
              </div>
              <span
                className={`mt-2 text-sm ${
                  step === currentStep
                    ? "text-blue-500 font-medium"
                    : "text-gray-500"
                }`}
              >
                {stepTitle}
              </span>
            </button>
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