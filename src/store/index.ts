import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import reservationReducer from './slices/reservationSlice';

export const store = configureStore({
  reducer: {
    reservation: reservationReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
