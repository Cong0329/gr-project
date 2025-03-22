import React, { useEffect, useState } from "react";
import { DescriptionType } from "./description";

interface SidebarProps {
  sections: { title: string | null; type: DescriptionType }[];
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ sections, isCollapsed }) => {
  const [activeSection, setActiveSection] = useState<DescriptionType | null>(
    sections.length > 0 ? sections[0].type : null
  );

  // 🟢 Khi "Thu gọn" thì về section đầu tiên ngay lập tức
  useEffect(() => {
    if (sections.length > 0) {
      setActiveSection(sections[0].type);
      document.getElementById('introduction')?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isCollapsed, sections]);

  useEffect(() => {
    if (isCollapsed) {
      const handleScroll = () => {
        let currentSection: DescriptionType | null = null;
        const OFFSET = 30;

        sections.forEach((section) => {
          const el = document.getElementById(section.type);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= OFFSET && rect.bottom > OFFSET) {
              currentSection = section.type;
            }
          }
        });

        if (currentSection !== activeSection) {
          setActiveSection(currentSection);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [sections, activeSection, isCollapsed]);

  return (
    <div className="w-1/5 h-full sticky top-0 overflow-y-auto p-4">
      {sections.map((item) => (
        <a
          key={item.type}
          href={`#${item.type}`}
          className={`block p-3 rounded-lg text-lg font-semibold transition-all ${activeSection === item.type ? "bg-gray-300 text-black" : "text-gray-500"
            }`}
          onClick={(e) => {
            e.preventDefault();
            setActiveSection(item.type); // ✅ Cập nhật active khi click
            document.getElementById(item.type)?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          {item.title}
        </a>
      ))}
    </div>
  );
};

export default Sidebar;
