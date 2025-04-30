import { configureStore } from '@reduxjs/toolkit';
import imageReducer from './imageSlice';
import scheduleReducer from './scheduleSlice';
import filterReducer from './filterSlice';
import cartReducer from './cartSlice';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import doctorReducer from './doctorSlice';
import departmentReducer from './departmentSlice';
import addressReducer from './addressSlice';
import servicePackageReducer from './servicePackageSlice';
import profileReducer from './profileSlice';
import navigationReducer from './navigationSlice';
import authReducer from './authSlice';
import brandReducer from './brandSlice';
import categoryReducer from './categorySlice';
import medicalObjectReducer from './medicalObjectSlice';
import indicationReducer from './indicationSlice';
import productReducer from './productSlice';

<<<<<<< HEAD
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
=======
const persistConfig = {
  key: "root",
  storage, // lưu trữ vào localStorage
};

const persistedReducer = persistReducer(persistConfig, cartReducer);

>>>>>>> 839d7a0d1638e7296fdba23a004aaed5f5f54add
// Cấu hình store
export const store = configureStore({
  reducer: {
    image: imageReducer,
    schedules: scheduleReducer,
    doctors: doctorReducer,
    departments: departmentReducer,
    servicePackage: servicePackageReducer,
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
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const persistor = persistStore(store);
