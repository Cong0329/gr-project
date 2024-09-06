import React, { useState, useEffect } from 'react';
import "./booking.css";



const HomeBooking = () => { 
  const placeholders = React.useMemo(() => [
    "Tìm chuyên khoa khám bệnh...",
    "Tìm bác sĩ...",
    "Tìm bệnh viện gần nhất...",
    "Tìm dịch vụ y tế tốt nhất...",
    "Tìm gói khám tổng quát...",
    "Tìm gói phẫu thuật...",
    "Tìm gói xét nghiệm...",
  ], []);

  const [placeholder, setPlaceholder] = useState(placeholders[0]);
  const indexRef = React.useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % placeholders.length;
      setPlaceholder(placeholders[indexRef.current]);
    }, 3000);

    return () => clearInterval(interval);
  },[placeholders]);

  const options = [
    {
      icon: "fa-hospital",
      text: "Khám Chuyên Khoa",
    },
    {
      icon: "fa-mobile-alt",
      text: "Khám Online",
    },
    {
      icon: "fa-procedures",
      text: "Khám Tổng Quát",
    },
    {
      icon: "fa-vial",
      text: "Xét Nghiệm Y Học",
    },
  ];

  return (
    <>
      <div className="main-container w-full">
        <div className="background flex justify-center items-center relative">
          <div className="content text-center text-[30px] text-white mb-[5px] relative bottom-[15%]">
              <div className="text-3xl font-semibold">NỀN TẢNG Y TẾ</div>
              <div className="text-3xl font-bold pt-3">CHĂM SÓC SỨC KHOẺ TOÀN DIỆN</div>
              <form className="max-w-md mx-auto rounded-full p-2 pt-5">   
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-5 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                  </div>
                  <input type="search" id="default-search" className="block w-full p-4 ps-14 text-sm text-gray-900 rounded-full focus:outline-none" placeholder={placeholder} />
                </div>
              </form>
          </div>
          <div className="content-option p-4 flex flex-col items-center absolute bottom-0 w-full">
            <div className="option grid grid-cols-2 sm:grid-cols-4 gap-4">
              {options.map((option, index) => (
                <div key={index} className="option-child flex flex-col items-center text-center rounded-lg cursor-pointer">
                  <div className="icon-child mb-2 p-4 rounded-full bg-white flex items-center justify-center" style={{height: "50px", width:'50px'}}>
                    <i className={`fas ${option.icon} text-blue-500 text-3xl`} />
                  </div>
                  <div className="text-child text-lg font-medium">{option.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default HomeBooking;
