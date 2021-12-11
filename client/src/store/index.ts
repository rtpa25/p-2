/** @format */

import { configureStore } from '@reduxjs/toolkit';
import CreationSliceActions from './slices/creationSlice';

const store = configureStore({
  reducer: {
    creation: CreationSliceActions,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
