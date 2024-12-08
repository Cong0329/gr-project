import { configureStore } from '@reduxjs/toolkit';
import imageReducer from './imageSlice';


// Cấu hình store
const store = configureStore({
  reducer: {
    image: imageReducer,
  },
});
export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export default store;
