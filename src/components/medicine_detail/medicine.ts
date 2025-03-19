interface ProductOption {
    id: string;
    label: string;
    price: number;
  }
  
  interface Product {
    name: string;
    brand: string;
    options: ProductOption[];
    images: string[];
  }



export const productData: Product[] = [{
    name: "Hỗn dịch uống men vi sinh Enterogermina Gut Defense",
    brand: "Sanofi",
    options: Array.from({ length: 3 }, (_, i) => ({
      id: ["hop", "vi", "ong"][i],
      label: ["Hộp", "Vỉ", "Ống"][i],
      price: [165000, 92000, 9200][i],
    })),
    images: Array.from({ length: 8 }, (_, i) => `https://i.imgur.com/${["hUFtD3Y", "L0dc03u", "XvkadE6", "91fjQIr", "hUFtD3Y", "L0dc03u", "XvkadE6", "91fjQIr"][i]}.png`),
  }, {
    name: "Siro Brauer Baby Kids Liquid Calcium With Magnesium And Zinc 200ml",
    brand: "Brauer",
    options: Array.from({ length: 2 }, (_, i) => ({
      id: ["s1", "s2"][i],
      label: ["Siro 1", "Siro 2"][i],
      price: [264000, 330000][i],
    })),
    images: Array.from({ length: 4 }, (_, i) => `https://i.imgur.com/${["WLDASTO", "bAGysSi", "1PFCxUX", "hoWTJoH"][i]}.png`),
  }];


