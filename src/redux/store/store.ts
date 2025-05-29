// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import authReducer from "./authSlice";
import { combineReducers } from "redux";
import adminAuthSlice from "./adminAuthSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  adminAuth: adminAuthSlice,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "adminAuth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required by redux-persist
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
