import React, { useState } from "react";
import Sidebar from "./Sidebar";
import ProductSection from "./MedicineSection";
import ExpandableText from "./ExpandableText";
import { productDescription } from "./description";

const MedicineTech: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="flex">
      <Sidebar sections={productDescription.description} isCollapsed={expanded} />
      <div className="flex-1 pt-4 pr-4">
        <h2 className="text-3xl font-bold border-b pb-3" id="introduction">{productDescription.title}</h2>
        <div className="relative">
          <ExpandableText expanded={expanded} setExpanded={setExpanded}>
            {productDescription.description.map((section) => (
              <ProductSection key={section.type} id={section.type} section={section} />
            ))}
          </ExpandableText>
          {!expanded && (
            <div className="absolute bottom-10 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent"></div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MedicineTech;
