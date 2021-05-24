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
  selected: boolean;
}

export interface ReservationState {
  currStep: number;
  seats: Array<Array<ISeat | null>>;
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

      state.selectedSeats = [];
      let seatsToToggle: Array<ICoordinates> = new Array<ICoordinates>();

      //iterate over seats
      for (const row of state.seats) {
        for (const seat of row) {
          if (state.adjacent) {
            if (seat === null || seat.reserved)
              seatsToToggle = new Array<ICoordinates>();
          }
          if (seat !== null && !seat.reserved) {
            seatsToToggle.push(seat.cords);
          }

          if (seatsToToggle.length === state.nSelectedSeats) {
            reservationSlice.caseReducers.toggleSeats(state, {
              type: "setSuggestedSeatsToggle",
              payload: seatsToToggle,
            });
            return;
          }
        }

        //reset seatsToToggle before new row if adjacent is true
        if (state.adjacent) {
          seatsToToggle = new Array<ICoordinates>();
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
    toggleSeats: (state, action: PayloadAction<Array<ICoordinates>>) => {
      for (const cords of action.payload) {
        //get seat at specified coordinates
        const seatAtCords = state.seats[cords.x][cords.y];

        if (seatAtCords === null) return;

        //add or remove seats from selected

        if (seatAtCords.reserved) {
          alert("Miejsce jest już zarezerwowane.");
          return;
        }

        if (seatAtCords.selected) {
          state.selectedSeats = state.selectedSeats.filter(
            (seat) => seat.id !== seatAtCords.id
          );
          seatAtCords.selected = false;
        } else {
          if (state.selectedSeats.length >= state.nSelectedSeats) {
            alert("Limit miejsc osiągnięty.");
            return;
          }
          state.selectedSeats.push(seatAtCords);
          seatAtCords.selected = true;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSeats.pending, () => {});

    builder.addCase(fetchSeats.fulfilled, (state, action) => {
      const seats = action.payload;
      let maxSeats = 0;
      const seats2D = new Array();

      //iterate over seats
      for (const seat of seats) {
        //fill a gap in rows with an array to make sure that seat.cords.x is within seats2D length.
        if (seat.cords.x >= seats2D.length) {
          for (let i = 0; i < 1 + seat.cords.x - seats2D.length; i++)
            seats2D.push(new Array());
        }

        const row = seats2D[seat.cords.x];

        //fill a gap in columns with nulls to make sure that seat.cords.y is within row length.
        if (seat.cords.y >= row.length) {
          for (let i = 0; i < 1 + seat.cords.y - row.length; i++)
            // row.concat(new Array(seat.cords.y - row.length).fill(null)) // test and refactor
            row.push(null);
        }

        //set seat at given coordinates
        row[seat.cords.y] = { ...seat, selected: false };
        if (!seat.reserved) maxSeats += 1;
      }

      state.maxEmptySeats = maxSeats;

      state.seats = seats2D;

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
