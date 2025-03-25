import React from "react";
import { FaAngleDoubleDown, FaAngleDoubleUp } from "react-icons/fa";

interface ExpandableTextProps {
  expanded: boolean;
  setExpanded: (value: boolean) => void;
  children: React.ReactNode;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ expanded, setExpanded, children }) => {


  return (
    <div className="relative">
      <div className={`overflow-hidden transition-all ${expanded ? "max-h-full" : "m-h-[500px]"} relative`}>
        {children}
        <div />
      </div>
      <div className="flex justify-center mt-2 mb-4">
        <button
          className=""
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ?
            <div className="">
              <FaAngleDoubleUp className="inline-block mr-2" />
              Thu gọn
            </div> :
            <div className="">
              <FaAngleDoubleDown className="inline-block mr-2" />
              Xem thêm
            </div>
          }
        </button>
      </div>
    </div>
  );
};

export default ExpandableText;
