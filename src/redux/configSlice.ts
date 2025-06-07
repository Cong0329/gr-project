// // store/configSlice.ts
// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { CONFIG } from '../components/admin/components';

// interface ConfigState {
//   layout: string;
//   layoutType: string;
//   collapseMenu: boolean;
//   isOpen: string[];
//   isTrigger: string[];
// }

// const initialState: ConfigState = {
//   ...CONFIG,
//   isOpen: [],
//   isTrigger: [],
//   collapseMenu: false,
// };

// const configSlice = createSlice({
//   name: 'config',
//   initialState,
//   reducers: {
//     changeLayout: (state, action: PayloadAction<string>) => {
//       state.layout = action.payload;
//     },
//     collapseMenu: (state) => {
//       state.collapseMenu = !state.collapseMenu;
//     },
//     collapseToggle: (state, action: PayloadAction<{ menu: { id: string; type: string } }>) => {
//       const { id, type } = action.payload.menu;
//       if (type === 'sub') {
//         const triggerIndex = state.isTrigger.indexOf(id);
//         if (triggerIndex > -1) {
//           state.isOpen = state.isOpen.filter((item) => item !== id);
//           state.isTrigger = state.isTrigger.filter((item) => item !== id);
//         } else {
//           state.isOpen.push(id);
//           state.isTrigger.push(id);
//         }
//       } else {
//         const triggerIndex = state.isTrigger.indexOf(id);
//         state.isTrigger = triggerIndex === -1 ? [id] : [];
//         state.isOpen = triggerIndex === -1 ? [id] : [];
//       }
//     },
//     layoutType: (state, action: PayloadAction<string>) => {
//       state.layoutType = action.payload;
//     },
//     navCollapseLeave: (state, action: PayloadAction<{ menu: { id: string; type: string } }>) => {
//       const { id, type } = action.payload.menu;
//       if (type === 'sub') {
//         const triggerIndex = state.isTrigger.indexOf(id);
//         if (triggerIndex > -1) {
//           state.isOpen = state.isOpen.filter((item) => item !== id);
//           state.isTrigger = state.isTrigger.filter((item) => item !== id);
//         }
//       }
//     },
//     navContentLeave: (state) => {
//       state.isOpen = [];
//       state.isTrigger = [];
//     }
//   }
// });

// export const {
//   changeLayout,
//   collapseMenu,
//   collapseToggle,
//   layoutType,
//   navCollapseLeave,
//   navContentLeave
// } = configSlice.actions;

// export default configSlice.reducer;
