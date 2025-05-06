import { Brand, Category, EntityConfig, Indication, MedicalObject } from './types';



export const brandConfig: EntityConfig<Brand> = {
  name: 'thương hiệu',
  pluralName: 'thương hiệu',
  fields: [
    { name: 'name', label: 'Tên thương hiệu', type: 'text', required: true },
    { name: 'country', label: 'Quốc gia', type: 'text', required: true },
    { name: 'original', label: 'Xuất sứ', type: 'text', required: true },
    { name: 'logo', label: 'Logo URL', type: 'file', required: true },
  ],
  initialState: () => ({
    name: '',
    country: '',
    original: '',
    logo: '',
  }),
  tableColumns: [
    { key: 'id', header: 'ID' },
    { key: 'logo', header: 'Logo' },
    { key: 'name', header: 'Tên thương hiệu' },
    { key: 'country', header: 'Quốc gia' },
    { key: 'original', header: 'Xuất sứ' },
  ]
};

export const categoryConfig: EntityConfig<Category> = {
  name: 'danh mục',
  pluralName: 'danh mục',
  fields: [
    { name: 'name', label: 'Tên danh mục', type: 'text', required: true },
  ],
  initialState: () => ({
    name: '',
  }),
  tableColumns: [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Tên danh mục' },
  ]
};

export const medicalObjectConfig: EntityConfig<MedicalObject> = {
  name: 'đối tượng',
  pluralName: 'đối tượng',
  fields: [
    { name: 'name', label: 'Tên đối tượng', type: 'text', required: true },
  ],
  initialState: () => ({
    name: '',
  }),
  tableColumns: [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Tên đối tượng' },
  ]
};

export const indicationConfig: EntityConfig<Indication> = {
  name: 'chỉ định',
  pluralName: 'chỉ định',
  fields: [
    { name: 'name', label: 'Tên loại bệnh', type: 'text', required: true },
  ],
  initialState: () => ({
    name: '',
  }),
  tableColumns: [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Tên loại bệnh' },
  ]
};