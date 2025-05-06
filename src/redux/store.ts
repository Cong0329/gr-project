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

const persistConfig = {
  key: "root",
  storage, // lưu trữ vào localStorage
};

const persistedReducer = persistReducer(persistConfig, cartReducer);

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
    appointments: appointmentReducer,
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
