export interface ProductOption {
  id: string;
  label: string;
  price: number;
  discountedPrice?: number;
  isDiscounted?: boolean;
  }
  
 export interface Product {
    name: string;
    brand: string;
    code: string;
    rating: number;
    review: number;
    comments: number;
    category: string;
    specification: string;
    origin: string;
    dosageform: string;
    manufacturer: string;
    country: string;
    ingredients: string; 
    description: string; 
    options: ProductOption[];
    images: string[];
    registrationNumber: string;
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
 
  



export const productData: Product[] = [{
    name: "Hỗn dịch uống men vi sinh Enterogermina Gut Defense Sanofi tăng cường tiêu hóa, hỗ trợ bảo vệ đường ruột",
    brand: "Sanofi",
    code: "00047402",
    rating: 4.5,
    review:5,
    comments: 10,
    category: "Dạ dày, tá tràng",
    dosageform: "Hỗn dịch uống",
    specification: "Hộp 2 Vỉ x 10 Ống",
    origin: "Pháp",
    manufacturer: "Opella Healthcare Italy S.R.L.",
    country: "Ý",
    ingredients:"Bacillus clausii",
    registrationNumber: "2085/2024/ĐKSP",
    description: "Enterogermina Gut Defense giúp tăng cường tiêu hóa, hỗ trợ bảo vệ đường ruột trước hại khuẩn.",  
    options: [
      { id: "hop", label: "Hộp", price: 165000, discountedPrice: 150000, isDiscounted: true },
      { id: "vi", label: "Vỉ", price: 92000 },
      { id: "ong", label: "Ống", price: 9200 },
    ],
    // images: Array.from({ length: 3 }, (_, i) => `https://i.imgur.com/${["hUFtD3Y", "L0dc03u", "XvkadE6",][i]}.png`),
    images: Array.from({ length: 8 }, (_, i) => `https://i.imgur.com/${["hUFtD3Y", "L0dc03u", "XvkadE6", "91fjQIr", "hUFtD3Y", "L0dc03u", "XvkadE6", "91fjQIr"][i]}.png`),
  // }, {
  //   name: "Siro Brauer Baby Kids Liquid Calcium With Magnesium And Zinc 200ml",
  //   brand: "Brauer",
  //   options: Array.from({ length: 2 }, (_, i) => ({
  //     id: ["s1", "s2"][i],
  //     label: ["Siro 1", "Siro 2"][i],
  //     price: [264000, 330000][i],
  //   })),
  //   images: Array.from({ length: 4 }, (_, i) => `https://i.imgur.com/${["WLDASTO", "bAGysSi", "1PFCxUX", "hoWTJoH"][i]}.png`),
  }
];


