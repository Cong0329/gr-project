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
import servicePackageReducer from './servicePackageSlice'
import medicalTestReducer from './medicalTestSlice';
import profileReducer from './profileSlice';
import navigationReducer from './navigationSlice';
import authReducer from './authSlice';
import brandReducer from './brandSlice';
import categoryReducer from './categorySlice';
import medicalObjectReducer from './medicalObjectSlice';
import indicationReducer from './indicationSlice';
import productReducer from './productSlice';

const cartPersistConfig = {
  key: 'cart',
  storage,
};

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['isAuthenticated', 'isUserAuthenticated', 'user', 'admin', 'verify', 'mail']
};

const persistedReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedReducer2 = persistReducer(authPersistConfig, authReducer);
// Cấu hình store
export const store = configureStore({
  reducer: {
    image: imageReducer,
    schedules: scheduleReducer,
    doctors: doctorReducer,
    departments: departmentReducer,
    servicePackage: servicePackageReducer,
    medicalTests: medicalTestReducer,
    filters: filterReducer,
    cart: persistedReducer,
    address: addressReducer,
    profile: profileReducer,
    navigation: navigationReducer,
    auth: persistedReducer2,
    brands: brandReducer,
    categories: categoryReducer,
    medicalObjects: medicalObjectReducer,
    indications: indicationReducer,
    products: productReducer
  },
});
export type AppDispatch = typeof store.dispatch;

export type RootState = ReturnType<typeof store.getState>;

export const persistor = persistStore(store); 
