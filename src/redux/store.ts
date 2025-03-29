import { configureStore } from '@reduxjs/toolkit';
import imageReducer from './imageSlice';
import scheduleReducer from './scheduleSlice';
import filterReducer from './filterSlice'


// Cấu hình store
const store = configureStore({
  reducer: {
    image: imageReducer,
    schedule: scheduleReducer,
    filters: filterReducer,
  },
});
export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export default store;
