import { CategoryGroup } from "./NavLink";
import vitaminC from "../../assets/category-icons/vitamin-c.png";
import blood from "../../assets/category-icons/red-blood-cells.png";
import strength from "../../assets/category-icons/healthy.png";
import medicine from "../../assets/category-icons/medicine_1.png";
import gas from "../../assets/category-icons/gastroenterology.png";
import brain from "../../assets/category-icons/positive-thinking.png";
import skin from "../../assets/category-icons/products.png";
import heart from "../../assets/category-icons/health-insurance.png";
import faceSkin from "../../assets/category-icons/face-mask.png";
import bodyCare from "../../assets/category-icons/healthy_care.png"
import skinCare from "../../assets/category-icons/skincare.png"
import hair from "../../assets/category-icons/hair-fall.png"
import cream from "../../assets/category-icons/cream.png"
import eye from "../../assets/category-icons/eye-drop.png"
import sexual from "../../assets/category-icons/std.png"
import tooth from "../../assets/category-icons/tooth.png"
import drink from "../../assets/category-icons/herbal-tea.png"
import selfCare from "../../assets/category-icons/amenities.png"


export const imageMap: Record<string, string> = {
    "Vitamin C": vitaminC,
    "Vitamin & Khoáng chất": vitaminC,
    "Sinh lý - Nội tiết tố": blood,
    "Cải thiện tăng cường chức năng": strength,
    "Hỗ trợ điều trị": medicine,
    "Hỗ trợ tiêu hóa": gas,
    "Thần kinh não": brain,
    "Hỗ trợ làm đẹp": skin,
    "Sức khỏe tim mạch": heart,
    "Chăm sóc da mặt": faceSkin,
    "Chăm sóc cơ thể": bodyCare,
    "Chăm sóc da": skinCare,
    "Chăm sóc tóc": hair,
    "Kem - thuốc bôi ngoài": cream,
    "Mắt - tai - mũi - họng": eye,
    "Sinh lý - tình dục": sexual,
    "Chăm sóc răng miệng": tooth,
    "Thức uống": drink,
    "Tự chăm sóc": selfCare,
};

export const categoriesMapIcon: Record<string, string> = {
    "Thần kinh não": "🧠",
    "Vitamin & Khoáng chất": "💊",
    "Sức khỏe tim mạch": "💙",
    "Cải thiện tăng cường sức khỏe": "🛡️",
    "Hỗ trợ tiêu hóa": "🌀",
    "Sinh lý - Nội tiết tố": "⚕️",
    "Dinh dưỡng": "🍎",
    "Hỗ trợ điều trị": "🩺",
    "Giải pháp làn da": "🧴",
    "Chăm sóc da mặt": "🎭",
    "Hỗ trợ làm đẹp": "💎",
    "Hỗ trợ tình dục": "🔗",
    "Thực phẩm - Đồ uống": "🍹",
    "Chăm sóc răng miệng": "🦷",
    "Vệ sinh cá nhân": "🧼"
}

export const popularSearches: CategoryGroup[] = [
    {
        id: 4, name: 'Bệnh', categories: [

        ]
    },
    {
        id: 5, name: 'Góc sức khỏe', categories: [

        ]
    }
];