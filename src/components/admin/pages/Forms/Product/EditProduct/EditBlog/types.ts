export interface Ingredient {
    id: number;
    section_id: number;
    name: string;
    value: string;
}

export interface Description {
    id: number;
    section_id: number;
    text: string;
}

export interface Section {
    id: number;
    product_detail_id: number;
    type: string;
    title: string;
    image: string | File | null;
    description: string | null;
    descriptions: Description[];
    ingredients: Ingredient[];
}

export interface Product {
    id: number;
    product_id: string;
    title: string;
    sections: Section[];
}


export interface DescriptionProduct {
    id: number;
    product_id: string;
    title: string;
    sections: Section[];
}