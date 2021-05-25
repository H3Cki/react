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

export interface IBareSeat {
  id: string;
  cords: ICoordinates;
  reserved: boolean;
}

export interface ISeat extends IBareSeat {
  selected: boolean;
}

export interface ReservationState {
  currStep: number;
  seats: Array<ISeat>;
  adjacent: boolean;
  nSelectedSeats: number;
  maxEmptySeats: number;
  selectedSeats: Array<ISeat>;
}

const initialState: ReservationState = {
  currStep: 0,
  seats: [],
  adjacent: false,
  nSelectedSeats: 0,
  maxEmptySeats: 0,
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
      reservationSlice.caseReducers.deselectAllSeats(state);
      if (state.nSelectedSeats > state.maxEmptySeats) {
        alert(
          `Wybrano ${state.nSelectedSeats} miejsc, na tej sali wolnych miejsc jest ${state.maxEmptySeats}.`
        );
        return;
      }

      let seatsToToggle: String[] = [];
      let prev = null;

      for (const seat of state.seats) {
        if (prev && state.adjacent) {
          if (
            prev.cords.y !== seat.cords.y - 1 ||
            prev.cords.x !== seat.cords.x ||
            seat.reserved
          ) {
            seatsToToggle = [];
          }
        }

        if (!seat.reserved) seatsToToggle.push(seat.id);

        prev = seat;

        if (seatsToToggle.length === state.nSelectedSeats) {
          reservationSlice.caseReducers.toggleSeats(state, {
            type: "suggested/toggle",
            payload: seatsToToggle,
          });
          return;
        }
      }

      alert(
        `Nie udało się wybrać ${state.nSelectedSeats} ${
          state.adjacent ? "sąsiadujących " : ""
        }miejsc.`
      );
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
    toggleSeats: (state, action: PayloadAction<Array<String>>) => {
      const seatIds = action.payload;

      const seatsToToggle = state.seats.filter((seat) =>
        seatIds.includes(seat.id)
      );

      for (const seat of seatsToToggle) {
        //add or remove seats from selected

        if (seat.reserved) {
          alert("Miejsce jest już zarezerwowane.");
          return;
        }

        if (seat.selected) {
          state.selectedSeats = state.selectedSeats.filter(
            (_seat) => _seat.id !== seat.id
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
      state.maxEmptySeats = 0;
      state.seats = action.payload.map((seat: IBareSeat) => {
        if (!seat.reserved) state.maxEmptySeats += 1;
        return { ...seat, selected: false };
      });

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

export default reservationSlice.reducer;
