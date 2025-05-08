import { useState, useEffect } from "react";

export default function SuccessAnimation() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
    }, 100);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <div
          className={`w-24 h-24 rounded-full border-4 border-green-500 flex items-center justify-center
          ${animate ? "scale-100 opacity-100" : "scale-0 opacity-0"} 
          transition-all duration-500 ease-out`}
        >
          <svg
            className={`w-12 h-12 text-green-500 stroke-current
              ${animate ? "scale-100 opacity-100" : "scale-0 opacity-0"} 
              transition-all duration-500 delay-300 ease-out`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </div>

      <h2
        className={`mt-6 text-2xl font-semibold text-green-600
        ${animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} 
        transition-all duration-500 delay-500`}
      >
        Đặt lịch thành công!
      </h2>

      <p
        className={`mt-2 text-gray-600
        ${animate ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"} 
        transition-all duration-500 delay-700`}
      >
        Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
      </p>
    </div>
  );
}
