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


export const popularSearches: CategoryGroup[] = [
    {
        id: 1, name: 'Thực phẩm chức năng', categories: [
            {
                id: 1,
                name: "Vitamin & Khoáng chất",
                image: vitaminC,
                children: [
                    { id: 1, name: "Vitamin C", image: "..." },
                    { id: 2, name: "Vitamin D", image: "..." },
                ],
                products: [
                    { id: 1, name: "Cetirizine", image: "...", price: 100000 },
                ],
            },
            {
                id: 2,
                name: "Sinh lý - Nội tiết tố",
                image: blood,
                children: [
                    { id: 3, name: "Thuốc ho", image: "..." },
                ],
                products: [
                    { id: 2, name: "Paracetamol", image: "...", price: 80000 },
                ],
            },
            {
                id: 3,
                name: "Cải thiện tăng cường chức năng",
                image: strength,
                children: [
                    { id: 3, name: "Thuốc ho", image: "..." },
                ],
                products: [
                    { id: 2, name: "Paracetamol", image: "...", price: 80000 },
                ],
            },
            {
                id: 4,
                name: "Hỗ trợ điều trị",
                image: medicine,
                children: [
                    { id: 3, name: "Thuốc ho", image: "..." },
                ],
                products: [
                    { id: 2, name: "Paracetamol", image: "...", price: 80000 },
                ],
            },
            {
                id: 5,
                name: "Hỗ trợ tiêu hóa",
                image: gas,
                children: [
                    { id: 3, name: "Thuốc ho", image: "..." },
                ],
                products: [
                    { id: 2, name: "Paracetamol", image: "...", price: 80000 },
                ],
            },
            {
                id: 6,
                name: "Thần kinh não",
                image: brain,
                children: [
                    { id: 3, name: "Thuốc ho", image: "..." },
                ],
                products: [
                    { id: 2, name: "Paracetamol", image: "...", price: 80000 },
                ],
            },
            {
                id: 7,
                name: "Hỗ trợ làm đẹp",
                image: skin,
                children: [
                    { id: 3, name: "Thuốc ho", image: "..." },
                ],
                products: [
                    { id: 2, name: "Paracetamol", image: "...", price: 80000 },
                ],
            },
            {
                id: 8,
                name: "Sức khỏe tim mạch",
                image: heart,
                children: [
                    { id: 3, name: "Thuốc ho", image: "..." },
                ],
                products: [
                    { id: 2, name: "Paracetamol", image: "...", price: 80000 },
                ],
            },
        ]
    },
    {
        id: 2, name: 'Dược mỹ phẩm', categories: [
            {
                id: 1,
                name: "Chăm sóc da mặt",
                image: faceSkin,
                children: [
                    { id: 1, name: "Vitamin C", image: "..." },
                    { id: 2, name: "Vitamin D", image: "..." },
                ],
                products: [
                    { id: 1, name: "Cetirizine", image: "...", price: 100000 },
                ],
            },
            {
                id: 2,
                name: "Chăm sóc cơ thể",
                image: bodyCare,
                children: [
                    { id: 3, name: "Thuốc ho", image: "..." },
                ],
                products: [
                    { id: 2, name: "Paracetamol", image: "...", price: 80000 },
                ],
            },
            {
                id: 3,
                name: "Giải pháp làn da",
                image: skinCare,
                children: [
                    { id: 3, name: "Thuốc ho", image: "..." },
                ],
                products: [
                    { id: 2, name: "Paracetamol", image: "...", price: 80000 },
                ],
            },
            {
                id: 4,
                name: "Chăm sóc tóc - da đầu",
                image: hair,
                children: [
                    { id: 3, name: "Thuốc ho", image: "..." },
                ],
                products: [
                    { id: 2, name: "Paracetamol", image: "...", price: 80000 },
                ],
            },
            {
                id: 5,
                name: "Mỹ phẩm trang điểm",
                image: cream,
                children: [
                    { id: 3, name: "Thuốc ho", image: "..." },
                ],
                products: [
                    { id: 2, name: "Paracetamol", image: "...", price: 80000 },
                ],
            },
            {
                id: 6,
                name: "Chăm sóc da vùng mắt",
                image: eye,
                children: [
                    { id: 3, name: "Thuốc ho", image: "..." },
                ],
                products: [
                    { id: 2, name: "Paracetamol", image: "...", price: 80000 },
                ],
            },
        ]
    },
    {
        id: 3, name: 'Chăm sóc cá nhân', categories: [
            {
                id: 1,
                name: "Hỗ trợ tình dục",
                image: sexual,
                children: [
                    { id: 1, name: "Vitamin C", image: "..." },
                    { id: 2, name: "Vitamin D", image: "..." },
                ],
                products: [
                    { id: 1, name: "Cetirizine", image: "...", price: 100000 },
                ],
            },
            {
                id: 2,
                name: "Thực phẩm - Đồ uống",
                image: drink,
                children: [
                    { id: 3, name: "Thuốc ho", image: "..." },
                ],
                products: [
                    { id: 2, name: "Paracetamol", image: "...", price: 80000 },
                ],
            },
            {
                id: 3,
                name: "Vệ sinh cá nhân",
                image: selfCare,
                children: [
                    { id: 3, name: "Thuốc ho", image: "..." },
                ],
                products: [
                    { id: 2, name: "Paracetamol", image: "...", price: 80000 },
                ],
            },
            {
                id: 4,
                name: "Chăm sóc răng miệng",
                image: tooth,
                children: [
                    { id: 3, name: "Thuốc ho", image: "..." },
                ],
                products: [
                    { id: 2, name: "Paracetamol", image: "...", price: 80000 },
                ],
            },
        ]
    },
    {
        id: 4, name: 'Bệnh', categories: [

        ]
    },
    {
        id: 5, name: 'Góc sức khỏe', categories: [

        ]
    }
];