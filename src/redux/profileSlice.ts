import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  fullName: string;
  phoneNumber: string;
  gender: string | null;
  birthDate: string | null;
}

const initialState: ProfileState = {
  fullName: 'NGUYỄN',
  phoneNumber: '0362696258',
  gender: null,
  birthDate: null,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateFullName: (state, action: PayloadAction<string>) => {
      state.fullName = action.payload;
    },
    updatePhoneNumber: (state, action: PayloadAction<string>) => {
      state.phoneNumber = action.payload;
    },
    updateGender: (state, action: PayloadAction<string>) => {
      state.gender = action.payload;
    },
    updateBirthDate: (state, action: PayloadAction<string>) => {
      state.birthDate = action.payload;
    },
  },
});

export const { updateFullName, updatePhoneNumber, updateGender, updateBirthDate } = profileSlice.actions;
export default profileSlice.reducer;