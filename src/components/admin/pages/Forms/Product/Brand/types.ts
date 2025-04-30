export interface BaseEntity {
  [key: string]: any;
}



interface BrandProduct {
  id: string;
  name: string;
}

interface Options {
  id: string;
  label: string;
  price: number;
  discounted_pricet: number;
}

interface Images {
  id: string;
  image: string;
}


export interface Brand extends BaseEntity {
  name: string;
  country: string;
  logo: string | File | FileList;
  original: string;
}

export interface Category extends BaseEntity {
  name: string;
}

export interface MedicalObject extends BaseEntity {
  name: string;
}

export interface Indication extends BaseEntity {
  name: string;
}


export interface Product extends BaseEntity {
  id: string;
  name: string;
  images: Images[];
  quantity: number;
  brand: BrandProduct;
  options: Options[];
}

export type ModalType = 'create' | 'edit' | 'delete' | 'view';

export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'date' | 'file';
  options?: { value: string | number; label: string }[];
  required?: boolean;
}

export interface EntityConfig<T extends BaseEntity> {
  name: string;
  pluralName: string;
  fields: FieldConfig[];
  initialState: () => T;
  tableColumns: {
    key: keyof T | string;
    header: string;
    render?: (item: T) => React.ReactNode;
  }[];
}