import React from "react";
import theme from "../../../../assets/tải xuống.jpeg";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center p-6 bg-blue-600 w-full h-screen container mx-auto">
      <div className=" flex  items-center w-2/3  h-full   rounded-lg ">
        <div className="w-1/3 h-full">
          <img src={theme} alt="logo" className="w-full h-full rounded-l-3xl" />
        </div>
        {children}
      </div>
    </div>
  );
}
