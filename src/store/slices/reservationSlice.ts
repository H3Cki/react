import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../index";

export interface ICoordinates {
  x: number;
  y: number;
}

export interface ISeatExample {
  name: string;
  reserved: boolean;
  selected: boolean;
}

export interface ISeat {
  id: string;
  cords: ICoordinates;
  reserved: boolean;
  selected?: boolean;
}

export interface ReservationState {
  currStep: number;
  seats: Array<ISeat>;
  adjacent: boolean;
  nSelectedSeats: number;
  maxEmptySeats: number;
  selectedSeats: Array<ISeat>;
  rows: number;
  cols: number;
}

const initialState: ReservationState = {
  currStep: 0,
  seats: [],
  adjacent: false,
  nSelectedSeats: 0,
  maxEmptySeats: 0,
  rows: 0,
  cols: 0,
  selectedSeats: [],
};

export const fetchSeats = createAsyncThunk("users/fetchSeats", async () => {
  const response = await fetch("http://localhost:3001/seats");
  return response.json();
});

export const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    setSuggestedSeats(state) {
      // reservationSlice.caseReducers.deselectAllSeats(state);
      // if (state.nSelectedSeats > state.maxEmptySeats) {
      //   alert(
      //     `Wybrano ${state.nSelectedSeats} miejsc, na tej sali wolnych miejsc jest ${state.maxEmptySeats}.`
      //   );
      //   return;
      // }
      // state.selectedSeats = [];
      // let seatsToToggle: Array<ISeat> = [];
      // if (state.seats.length == 0) return;
      // //iterate over seats
      // let prevX = state.seats[0].cords.x;
      // let prevY = state.seats[0].cords.y;
      // for (const seat of state.seats) {
      // }
      // alert(
      //   `Nie udało się wybrać ${state.nSelectedSeats} ${
      //     state.adjacent ? "sąsiadujących " : ""
      //   }miejsc.`
      // );
    },
    nextStep(state) {
      state.currStep += 1;
      prevStep();
    },
    prevStep(state) {
      state.currStep -= 1;
    },
    setNumberOfSeats: (state, action: PayloadAction<number>) => {
      state.nSelectedSeats = action.payload;
    },
    toggleAdjacent: (state, action: PayloadAction<boolean | undefined>) => {
      action.payload
        ? (state.adjacent = action.payload)
        : (state.adjacent = !state.adjacent);
    },
    deselectAllSeats(state) {
      for (const seat of state.selectedSeats) {
        seat.selected = false;
      }
      state.selectedSeats = [];
    },
    toggleSeats: (state, action: PayloadAction<Array<ISeat>>) => {
      for (const seat of action.payload) {
        //add or remove seats from selected

        if (seat.reserved) {
          alert("Miejsce jest już zarezerwowane.");
          return;
        }

        if (seat.selected) {
          state.selectedSeats = state.selectedSeats.filter(
            (seat) => seat.id !== seat.id
          );
          seat.selected = false;
        } else {
          if (state.selectedSeats.length >= state.nSelectedSeats) {
            alert("Limit miejsc osiągnięty.");
            return;
          }
          state.selectedSeats.push(seat);

          seat.selected = true;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSeats.pending, () => {});

    builder.addCase(fetchSeats.fulfilled, (state, action) => {
      const seats = action.payload;
      const extendedSeats = [];
      let maxSeats = 0;
      let rows = 0;
      let cols = 0;

      //iterate over seats
      for (const seat of seats) {
        if (seat.cords.x >= rows) rows = seat.cords.x + 1;
        if (seat.cords.y >= cols) cols = seat.cords.y + 1;
        if (!seat.reserved) maxSeats += 1;
        extendedSeats.push({ ...seat, selected: false });
      }

      state.maxEmptySeats = maxSeats;
      state.rows = rows;
      state.cols = cols;
      state.seats = extendedSeats;

      //advance to next step
      reservationSlice.caseReducers.nextStep(state);
    });

    builder.addCase(fetchSeats.rejected, (state, action) => {
      alert("Błąd Połączenia z serwerem.");
    });
  },
});

/// Exports

export const {
  toggleAdjacent,
  toggleSeats,
  setNumberOfSeats,
  nextStep,
  prevStep,
  setSuggestedSeats,
} = reservationSlice.actions;

export const selectNSeats = (state: RootState) =>
  state.reservation.nSelectedSeats;
export const selectAdjacent = (state: RootState) => state.reservation.adjacent;
export const selectSeats = (state: RootState) => state.reservation.seats;
export const selectSelectedSeats = (state: RootState) =>
  state.reservation.selectedSeats;
export const selectCurrStep = (state: RootState) => state.reservation.currStep;
export const selectActualNSeats = (state: RootState) =>
  state.reservation.nSelectedSeats <= state.reservation.maxEmptySeats
    ? state.reservation.nSelectedSeats
    : state.reservation.maxEmptySeats;
export const allSeatsSelected = (state: RootState) =>
  state.reservation.selectedSeats.length === selectActualNSeats(state);
export const selectRows = (state: RootState) => state.reservation.rows;
export const selectCols = (state: RootState) => state.reservation.cols;

export default reservationSlice.reducer;
