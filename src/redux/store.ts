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
<<<<<<< HEAD
import generalExReducer from "./generalExSlice";
import medicalTestReducer from './medicalTestSlice';
=======
import profileReducer from './profileSlice';
import navigationReducer from './navigationSlice';
>>>>>>> c7ae778af31bddca2d3f2663101b5490247e8952

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
    address: addressReducer,
    profile: profileReducer,
    navigation: navigationReducer,
  },
});
export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export const persistor = persistStore(store); 
