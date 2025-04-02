import { configureStore } from '@reduxjs/toolkit';
import imageReducer from './imageSlice';
import scheduleReducer from './scheduleSlice';
import filterReducer from './filterSlice';
import doctorReducer from './doctorSlice';
import departmentReducer from './departmentSlice'


// Cấu hình store
const store = configureStore({
  reducer: {
    image: imageReducer,
    schedule: scheduleReducer,
    doctors: doctorReducer,
    departments: departmentReducer,
    filters: filterReducer,
  },
});
export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export default store;
