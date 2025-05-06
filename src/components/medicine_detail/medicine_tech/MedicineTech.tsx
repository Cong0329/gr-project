import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ProductSection from "./MedicineSection";
import ExpandableText from "./ExpandableText";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const MedicineTech: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const { detail } = useSelector((state: RootState) => state.products);
  return (
    <div className="pb-4">
      <div className="flex">
        <Sidebar sections={detail.sections.map((section) => ({ type: section.type }))} isCollapsed={expanded} />
        <div className="flex-1 pt-4 pr-4 tb:pl-4">
          <h2 className="text-3xl ms:text-xl font-bold border-b pb-3" id="introduction">{detail.title}</h2>
          <div className="relative z-10">
            <ExpandableText expanded={expanded} setExpanded={setExpanded}>
              {detail.sections.map((section) => (
                <ProductSection  key={section.type} id={section.type} section={section} />
              ))}
            </ExpandableText>
            {!expanded && (
              <div className="absolute bottom-8 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent"></div>
            )}
          </div>
        </div>
      </div>
      <div className="border-l-4 border-blue-700 bg-blue-100 h-8 ml:h-12 mm:h-16  rounded-[4px] mx-4 text-[11px] text-blue-700 font-semibold p-2">
        <p>Mọi thông tin trên đây chỉ mang tính chất tham khảo. Việc sử dụng thuốc phải tuân theo hướng dẫn của bác sĩ chuyên môn.</p>
      </div>
    </div>

  );
};

export default MedicineTech;
