interface NextButtonProps {
    onNext: () => void;
    disabled: boolean;
    isLastStep: boolean;
  }
  
export const NextButton: React.FC<NextButtonProps> = ({ onNext, disabled, isLastStep }) => {
    return (
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={disabled}
          className={`px-6 py-2 rounded-lg font-medium ${
            disabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isLastStep ? "Hoàn thành" : "Tiếp theo"}
        </button>
      </div>
    );
  };