export interface ProductOption {
  id: string;
  label: string;
  price: number;
  discounted_price: number ;
}

interface Image {
  id: string;
  image: string;
}

interface Brand {
  id: string;
  name: string;
  country: string;
  original: string;
}

interface Category {
  id: string;
  name: string;
}
interface Indication {
  id: string;
  name: string;
}
interface MedicalObject {
  id: string;
  name: string;
}
export interface ProductDetail {
  id: string;
  slug: string;
  name: string;
  brand: Brand;
  type: string;
  code: string;
  rating: number;
  review_count: number;
  comments_count: number;
  category: Category;
  specification: string;
  dosage_form: string;
  manufacturer: string;
  ingredients: string;
  indication: Indication;
  medical_object: MedicalObject;
  description: string;
  options: ProductOption[];
  images: Image[];
  quantity: number;
  registration_number: string;
}



export const policies = [
  {
    icon: "📬", // Thay bằng icon phù hợp (có thể dùng Font Awesome hoặc hình ảnh)
    title: "Đổi trả trong 30 ngày",
    description: "kể từ ngày mua hàng",
  },
  {
    icon: "📪", // Thay bằng icon phù hợp
    title: "Miễn phí 100%",
    description: "đổi thuốc",
  },
  {
    icon: "✈️", // Thay bằng icon phù hợp
    title: "Miễn phí vận chuyển",
    description: "theo chính sách giao hàng",
  },
];





// export const productData: Product[] = [{
//   name: "Hỗn dịch uống men vi sinh Enterogermina Gut Defense Sanofi tăng cường tiêu hóa, hỗ trợ bảo vệ đường ruột",
//   brand: "Sanofi",
//   code: "00047402",
//   rating: 4.5,
//   review: 5,
//   comments: 10,
//   category: "Dạ dày, tá tràng",
//   dosageform: "Hỗn dịch uống",
//   specification: "Hộp 2 Vỉ x 10 Ống",
//   origin: "Pháp",
//   manufacturer: "Opella Healthcare Italy S.R.L.",
//   country: "Ý",
//   ingredients: "Bacillus clausii",
//   registrationNumber: "2085/2024/ĐKSP",
//   description: "Enterogermina Gut Defense giúp tăng cường tiêu hóa, hỗ trợ bảo vệ đường ruột trước hại khuẩn.",
//   options: [
//     { id: "hop", label: "Hộp", price: 165000, discountedPrice: 150000, isDiscounted: true },
//     { id: "vi", label: "Vỉ", price: 92000 },
//     { id: "ong", label: "Ống", price: 9200 },
//   ],
//   images: Array.from({ length: 8 }, (_, i) => `https://i.imgur.com/${["hUFtD3Y", "L0dc03u", "XvkadE6", "91fjQIr", "hUFtD3Y", "L0dc03u", "XvkadE6", "91fjQIr"][i]}.png`),
// }
// ];

// import { Medicine } from "../home/product_for_age/Medical";

// export const medicines: Medicine[] = [
//   { id: 1, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
//   { id: 2, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
//   { id: 3, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
//   { id: 4, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
//   { id: 5, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
//   { id: 6, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
//   { id: 7, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
//   { id: 8, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
//   { id: 9, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
//   { id: 10, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
// ]

