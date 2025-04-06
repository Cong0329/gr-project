import { configureStore } from '@reduxjs/toolkit';
import imageReducer from './imageSlice';
import scheduleReducer from './scheduleSlice';
import filterReducer from './filterSlice'
import cartReducer from './cartSlice'
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import doctorReducer from './doctorSlice';
import departmentReducer from './departmentSlice'
import addressReducer from './addressSlice';
import generalExReducer from "./generalExSlice";
import medicalTestReducer from './medicalTestSlice';

const persistConfig = {
  key: "root",
  storage, // lưu trữ vào localStorage
};

const persistedReducer = persistReducer(persistConfig, cartReducer);
// Cấu hình store
export const store = configureStore({
  reducer: {
    image: imageReducer,
    schedule: scheduleReducer,
    doctors: doctorReducer,
    departments: departmentReducer,
    generalExams: generalExReducer,
    medicalTests: medicalTestReducer,
    filters: filterReducer,
    cart: persistedReducer,
    address: addressReducer
  },
});
export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export const persistor = persistStore(store); 
