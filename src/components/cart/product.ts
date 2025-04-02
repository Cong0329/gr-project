export interface ProductOption {
    id: string;
    label: string;
    price: number;
    discountedPrice?: number;
    isDiscounted?: boolean;
}

export interface Product {
    id: string;
    name: string;
    quantity: number;
    image: string;
    selectedOption: string; // ID của option được chọn
    options: ProductOption[]; // Danh sách các lựa chọn
}

export const Item: Product[] = [
    {
        id: "1",
        name: 'Siro Immune Defence Probiotic Liquid Brauer giúp tăng cường sức đề kháng và tốt cho đường ruột (45ml)',
        quantity: 1,
        image: 'https://i.imgur.com/HXN77Ev.png',
        selectedOption: 'vi', // Mặc định chọn "Hộp"
        options: [
            { 
                id: 'hop', 
                label: 'Hộp', 
                price: 200000, 
                discountedPrice: 180000, 
                isDiscounted: true 
            },
            { 
                id: 'vi', 
                label: 'Vỉ', 
                price: 120000 
            },
            { 
                id: 'ong', 
                label: 'Ống', 
                price: 35000 
            }
        ]
    },
    {
        id: "2",
        name: 'Vitamin C 1000mg',
        quantity: 1,
        image: 'https://i.imgur.com/HXN77Ev.png',
        selectedOption: 'hop', // Mặc định chọn "Hộp"
        options: [
            { 
                id: 'hop', 
                label: 'Hộp', 
                price: 165000, 
                discountedPrice: 150000, 
                isDiscounted: true 
            },
            { 
                id: 'vi', 
                label: 'Vỉ', 
                price: 92000 
            },
            { 
                id: 'ong', 
                label: 'Ống', 
                price: 9200 
            }
        ]
    },
   
];
