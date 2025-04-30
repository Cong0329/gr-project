import { Brand, Category } from "./types"

export const initialBrands: Brand[] = [
  { id: 1, name: "Samsung", country: "Hàn Quốc", original:"Hàn Quốc", logo: "/samsung.png" },
  { id: 2, name: "Apple", country: "Mỹ", original:"Mỹ", logo: "/apple.png" },
  { id: 3, name: "Sony", country: "Nhật Bản", original:"Nhật Bản",  logo: "/sony.png" },
];

export const initialCategories: Category[] = [
  { id: 1, name: "Điện thoại", description: "Các loại điện thoại di động", parentId: null },
  { id: 2, name: "Laptop", description: "Các loại máy tính xách tay", parentId: null },
  { id: 3, name: "Phụ kiện", description: "Các loại phụ kiện điện tử", parentId: null },
  { id: 4, name: "Tai nghe", description: "Các loại tai nghe", parentId: null },
];


export const initialOrigins: Category[] = [
  { id: 1, name: "Điện thoại", description: "Các loại điện thoại di động", parentId: null },
  { id: 2, name: "Laptop", description: "Các loại máy tính xách tay", parentId: null },
  { id: 3, name: "Phụ kiện", description: "Các loại phụ kiện điện tử", parentId: null },
  { id: 4, name: "Tai nghe", description: "Các loại tai nghe", parentId: null },
];