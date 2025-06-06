// constants/menuItems.ts
export const menuItems = [
  { id: 'personal-info', icon: 'user', label: 'Thông tin cá nhân' },
  { id: 'orders', icon: 'box', label: 'Đơn hàng của tôi' },
  { id: 'addresses', icon: 'map-pin', label: 'Quản lý số địa chỉ' },
  { id: 'health-check', icon: 'syringe', label: 'Lịch khám' },
  { id: 'chat', icon: 'clipboard', label: 'Tin nhắn' },
  { id: 'prescriptions', icon: 'pill', label: 'Đơn thuốc của tôi' },
  { id: 'logout', icon: 'log-out', label: 'Đăng xuất' }
] as const;

export type PageId = typeof menuItems[number]['id'];
export type MenuItem = typeof menuItems[number];
export const validPageIds = menuItems.map(item => item.id);