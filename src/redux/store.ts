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
import appointmentReducer from './appointmentSlice';
import authReducer from './authSlice';
import brandReducer from './brandSlice';
import categoryReducer from './categorySlice';
import medicalObjectReducer from './medicalObjectSlice';
import indicationReducer from './indicationSlice';
import productReducer from './productSlice';
import orderReducer from './orderSlice';

const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items']
};

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['isAuthenticated', 'isUserAuthenticated', 'user', 'admin', 'verify', 'mail']
};

const orderPersistConfig = {
  key: 'order',
  storage,
  whitelist: ['reset']
};

const persistedReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedReducer2 = persistReducer(authPersistConfig, authReducer);
const persistedReducer3 = persistReducer(orderPersistConfig, orderReducer);
// Cấu hình store
export const store = configureStore({
  reducer: {
    image: imageReducer,
    schedules: scheduleReducer,
    doctors: doctorReducer,
    departments: departmentReducer,
    servicePackage: servicePackageReducer,
    filters: filterReducer,
    // cart: cartReducer,
    cart: persistedReducer,
    address: addressReducer,
    profile: profileReducer,
    navigation: navigationReducer,
    appointments: appointmentReducer,
    auth: persistedReducer2,
    brands: brandReducer,
    categories: categoryReducer,
    medicalObjects: medicalObjectReducer,
    indications: indicationReducer,
    products: productReducer,
    // order: orderReducer
    order: persistedReducer3
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
