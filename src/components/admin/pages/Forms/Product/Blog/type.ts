export enum DescriptionType {
    PRODUCT_DESCRIPTION = "Product Description",
    INGREDIENTS = "Ingredients",
    BENEFITS = "Benefits",
    USAGE = "Usage",
    SIDE_EFFECTS = "Side Effects",
    WARNINGS = "Warnings",
    STORAGE = "Storage"
}

export const descriptionTypeLabels: Record<DescriptionType, string> = {
    [DescriptionType.PRODUCT_DESCRIPTION]: "Mô tả sản phẩm",
    [DescriptionType.INGREDIENTS]: "Thành phần",
    [DescriptionType.BENEFITS]: "Công dụng",
    [DescriptionType.USAGE]: "Cách dùng",
    [DescriptionType.SIDE_EFFECTS]: "Tác dụng phụ",
    [DescriptionType.WARNINGS]: "Lưu ý",
    [DescriptionType.STORAGE]: "Bảo quản",
};

export interface Description {
    title: string;
    description: Title[];
}

export interface TitleBase {
    type: DescriptionType;
    title: string | null;
    image: File | FileList | null;
    url: string | null;
}

export interface TextTitle extends TitleBase {
    type: DescriptionType; // Chỉ sử dụng các giá trị từ enum
    description: string;
}

export interface IngredientTitle extends TitleBase {
    type: DescriptionType.INGREDIENTS; // Chỉ sử dụng type Ingredients
    descriptions: Ingredient;
}

export interface Ingredient {
    description: string[] | null;
    ingredients: Instruction[];
}

export interface Instruction {
    name: string;
    value: string;
}

export type Title = TextTitle | IngredientTitle;

