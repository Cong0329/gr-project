import React from "react";

interface ExpandableTextProps {
  expanded: boolean;
  setExpanded: (value: boolean) => void;
  children: React.ReactNode;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ expanded, setExpanded, children }) => {


  return (
    <div className="relative">
      <div className={`overflow-hidden transition-all ${expanded ? "max-h-full" : "max-h-[500px]"} relative`}>
        {children}
        <div />
      </div>
      <div className="flex justify-center mt-2 mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Thu gọn" : "Xem thêm"}
        </button>
      </div>
    </div>
  );
};

export default ExpandableText;
