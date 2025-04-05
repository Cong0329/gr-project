// features/navigation/navigationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PageId } from '../components/information/menuItems';

interface NavigationState {
  activePage: PageId;
}

const initialState: NavigationState = {
  activePage: 'personal-info',
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setActivePage: (state, action: PayloadAction<PageId>) => {
      state.activePage = action.payload;
    },
  },
});

export const { setActivePage } = navigationSlice.actions;
export default navigationSlice.reducer;