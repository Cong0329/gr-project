interface Product {
    id: string;
    name: string;
    image: string;
    price: number;
    type: string[];
  }

const products: Record<string, Product[]> = {
  exclusive: [
    { id: '1', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/v5hrLHF.png', price: 1000000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '2', name: 'Viên uống Glucosamine And Chondroitin Jpanwell hỗ trợ bổ sung chất nhờn dịch khớp (120 viên)', image: 'https://i.imgur.com/HXN77Ev.png', price: 200000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '3', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/VoWEXd6.png', price: 300000, type: ['hộp', 'vỉ'] },
        { id: '4', name: 'Viên uống Glucosamine And Chondroitin Jpanwell hỗ trợ bổ sung chất nhờn dịch khớp (120 viên)', image: 'https://i.imgur.com/v5hrLHF.png', price: 3000000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '5', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/HXN77Ev.png', price: 300000, type: ['hộp', 'vỉ'] },
        { id: '6', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '7', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '8', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '9', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '10', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '11', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '12', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
  ],
  trending: [
    { id: '1', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/HXN77Ev.png', price: 1000000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '2', name: 'Viên uống Glucosamine And Chondroitin Jpanwell hỗ trợ bổ sung chất nhờn dịch khớp (120 viên)', image: 'https://i.imgur.com/HXN77Ev.png', price: 200000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '3', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/VoWEXd6.png', price: 300000, type: ['hộp', 'vỉ'] },
        { id: '4', name: 'Viên uống Glucosamine And Chondroitin Jpanwell hỗ trợ bổ sung chất nhờn dịch khớp (120 viên)', image: 'https://i.imgur.com/v5hrLHF.png', price: 3000000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '5', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/HXN77Ev.png', price: 300000, type: ['hộp', 'vỉ'] },
        { id: '6', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '7', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '8', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '9', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '10', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '11', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '12', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
  ],
  new: [
    { id: '1', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/v5hrLHF.png', price: 1000000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '2', name: 'Viên uống Glucosamine And Chondroitin Jpanwell hỗ trợ bổ sung chất nhờn dịch khớp (120 viên)', image: 'https://i.imgur.com/HXN77Ev.png', price: 200000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '3', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/VoWEXd6.png', price: 300000, type: ['hộp', 'vỉ'] },
        { id: '4', name: 'Viên uống Glucosamine And Chondroitin Jpanwell hỗ trợ bổ sung chất nhờn dịch khớp (120 viên)', image: 'https://i.imgur.com/v5hrLHF.png', price: 3000000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '5', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/HXN77Ev.png', price: 300000, type: ['hộp', 'vỉ'] },
        { id: '6', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '7', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '8', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '9', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '10', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '11', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '12', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
  ],
  family: [
    { id: '1', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/v5hrLHF.png', price: 1000000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '2', name: 'Viên uống Glucosamine And Chondroitin Jpanwell hỗ trợ bổ sung chất nhờn dịch khớp (120 viên)', image: 'https://i.imgur.com/HXN77Ev.png', price: 200000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '3', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/VoWEXd6.png', price: 300000, type: ['hộp', 'vỉ'] },
        { id: '4', name: 'Viên uống Glucosamine And Chondroitin Jpanwell hỗ trợ bổ sung chất nhờn dịch khớp (120 viên)', image: 'https://i.imgur.com/v5hrLHF.png', price: 3000000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '5', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/HXN77Ev.png', price: 300000, type: ['hộp', 'vỉ'] },
        { id: '6', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '7', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '8', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '9', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '10', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '11', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '12', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
  ],
  vitamin: [
    { id: '1', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/v5hrLHF.png', price: 1000000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '2', name: 'Viên uống Glucosamine And Chondroitin Jpanwell hỗ trợ bổ sung chất nhờn dịch khớp (120 viên)', image: 'https://i.imgur.com/HXN77Ev.png', price: 200000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '3', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/VoWEXd6.png', price: 300000, type: ['hộp', 'vỉ'] },
        { id: '4', name: 'Viên uống Glucosamine And Chondroitin Jpanwell hỗ trợ bổ sung chất nhờn dịch khớp (120 viên)', image: 'https://i.imgur.com/v5hrLHF.png', price: 3000000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '5', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/HXN77Ev.png', price: 300000, type: ['hộp', 'vỉ'] },
        { id: '6', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '7', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '8', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '9', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '10', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '11', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '12', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
  ],
  beauty: [
    { id: '1', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/v5hrLHF.png', price: 1000000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '2', name: 'Viên uống Glucosamine And Chondroitin Jpanwell hỗ trợ bổ sung chất nhờn dịch khớp (120 viên)', image: 'https://i.imgur.com/HXN77Ev.png', price: 200000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '3', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/VoWEXd6.png', price: 300000, type: ['hộp', 'vỉ'] },
        { id: '4', name: 'Viên uống Glucosamine And Chondroitin Jpanwell hỗ trợ bổ sung chất nhờn dịch khớp (120 viên)', image: 'https://i.imgur.com/v5hrLHF.png', price: 3000000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '5', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/HXN77Ev.png', price: 300000, type: ['hộp', 'vỉ'] },
        { id: '6', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '7', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '8', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '9', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '10', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '11', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '12', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
  ],
  cold: [
    { id: '1', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/v5hrLHF.png', price: 1000000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '2', name: 'Viên uống Glucosamine And Chondroitin Jpanwell hỗ trợ bổ sung chất nhờn dịch khớp (120 viên)', image: 'https://i.imgur.com/HXN77Ev.png', price: 200000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '3', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/VoWEXd6.png', price: 300000, type: ['hộp', 'vỉ'] },
        { id: '4', name: 'Viên uống Glucosamine And Chondroitin Jpanwell hỗ trợ bổ sung chất nhờn dịch khớp (120 viên)', image: 'https://i.imgur.com/v5hrLHF.png', price: 3000000, type: ['hộp', 'vỉ', 'viên'] },
        { id: '5', name: 'Thuốc Telfor 60 DHG điều trị các triệu chứng viêm mũi dị ứng (2 vỉ x 10 viên)', image: 'https://i.imgur.com/HXN77Ev.png', price: 300000, type: ['hộp', 'vỉ'] },
        { id: '6', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '7', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '8', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '9', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '10', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '11', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
        { id: '12', name: 'Medicine 3', image: 'https://i.imgur.com/HXN77Ev.png', price: 30, type: ['hộp', 'vỉ', 'viên'] },
  ],

};
export default products;



export interface Medicine {
    id: number;
    name: string;
    image: string;
    price: number;
    oldPrice?: number;
    discount?: number;
    package: string;
}

export interface Category {
    id: string;
    name: string;
    image: string;
}

export const categories: Category[] = [
    { id: "kids", name: "Trẻ em", image: "https://i.imgur.com/w0ltsqF.png" },
    { id: "mom", name: "Mẹ và bé", image: "https://i.imgur.com/AJHFtoL.png" },
    { id: "old", name: "Người cao tuổi", image: "https://i.imgur.com/PDtX6oA.png" },
    { id: "diabetes", name: "Người tiểu đường", image: "https://i.imgur.com/Nv4hnxI.png" },
];

export const medicines: Record<string, Medicine[]> = {
    kids: [
        { id: 1, name: "Siro Brauer Baby Kids Liquid Calcium With Magnesium And Zinc 200ml hỗ trợ xương, răng chắc khỏe", image: "/images/soki-tium.png", price: 264000, oldPrice: 330000, discount: 20, package: "Hộp 12 Gói x 3g" },
        { id: 2, name: "Immune Defence", image: "/images/probiotic.png", price: 550000, package: "Hộp x 45ml" },
        { id: 3, name: "Soki Novo", image: "/images/soki-novo.png", price: 292000, oldPrice: 365000, discount: 20, package: "Hộp 18 Gói x 3g" },
        { id: 4, name: "Soki Novo", image: "/images/soki-novo.png", price: 292000, oldPrice: 365000, discount: 20, package: "Hộp 18 Gói x 3g" },
        { id: 5, name: "Soki Novo", image: "/images/soki-novo.png", price: 292000, oldPrice: 365000, discount: 20, package: "Hộp 18 Gói x 3g" },
        { id: 6, name: "Soki Novo", image: "/images/soki-novo.png", price: 292000, oldPrice: 365000, discount: 20, package: "Hộp 18 Gói x 3g" },
        { id: 7, name: "Soki Novo", image: "/images/soki-novo.png", price: 292000, oldPrice: 365000, discount: 20, package: "Hộp 18 Gói x 3g" },
        { id: 8, name: "Soki Novo", image: "/images/soki-novo.png", price: 292000, oldPrice: 365000, discount: 20, package: "Hộp 18 Gói x 3g" },
        { id: 9, name: "Soki Novo", image: "/images/soki-novo.png", price: 292000, oldPrice: 365000, discount: 20, package: "Hộp 18 Gói x 3g" },
        { id: 10, name: "Soki Novo", image: "/images/soki-novo.png", price: 292000, oldPrice: 365000, discount: 20, package: "Hộp 18 Gói x 3g" },
    ],
    mom: [
        { id: 1, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 2, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 3, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 4, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 5, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 6, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 7, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 8, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 9, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 10, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
    ],
    old: [
        { id: 1, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 2, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 3, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 4, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 5, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 6, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 7, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 8, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 9, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 10, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
    ],
    diabetes: [
        { id: 1, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 2, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 3, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 4, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 5, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 6, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 7, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 8, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 9, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 10, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 11, name: "Vitamin mẹ bầu", image: "/images/vitamin-mom.png", price: 420000, package: "Hộp 30 viên" },
        { id: 12, name: "Sữa tiểu đường", image: "/images/milk-diabetes.png", price: 450000, package: "Hộp 850g" },
    ],
};