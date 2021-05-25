import React, { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  toggleSeats,
  selectSeats,
  allSeatsSelected,
  ISeat,
} from "../store/slices/reservationSlice";
import Seat from "./Seat";

import styled from "styled-components";

const Grid = styled("div")<{ nRows: number; nCols: number; gap: number }>`
  display: grid;
  grid-template-columns: ${({ nCols }) => `repeat(${nCols}, 1fr)`};
  grid-template-rows: ${({ nRows }) => `repeat(${nRows}, 1fr)`};
  grid-column-gap: ${({ gap }) => `${gap}px`};
  grid-row-gap: ${({ gap }) => `${gap}px`};
`;

const SeatSlot = styled("div")<{ x: number; y: number }>`
  width: 50px;
  height: 50px;
  grid-column: ${({ y }) => y};
  grid-row: ${({ x }) => x};
`;

function calculateGridDim(seats: ISeat[]) {
  let _rows = 0;
  let _cols = 0;

  for (const seat of seats) {
    if (seat.cords.x > _rows) _rows = seat.cords.x;
    if (seat.cords.y > _cols) _cols = seat.cords.y;
  }

  return {
    rows: _rows,
    cols: _cols,
  };
}

const SeatGrid = () => {
  const [hoverSelect, setHoverSelect] = useState(false);
  const dispatch = useAppDispatch();
  const seats = useAppSelector(selectSeats);
  const allSeats = useAppSelector(allSeatsSelected);

  const dimensions = useMemo(() => calculateGridDim(seats), [seats]);

  if (!seats.length) return <div>No seats found!</div>;

  return (
    <div
      onDragStart={(e) => e.preventDefault()}
      onMouseDown={() => setHoverSelect(true)}
      onMouseUp={() => setHoverSelect(false)}
      onMouseLeave={() => setHoverSelect(false)}
    >
      <Grid nRows={dimensions.rows} nCols={dimensions.cols} gap={10}>
        {seats.map((seat, i) => {
          return (
            <SeatSlot
              key={"slot" + i}
              x={seat.cords.x + 1}
              y={seat.cords.y + 1}
            >
              <Seat
                key={i}
                seat={seat}
                onHover={() => {
                  if (hoverSelect && !seat.reserved && !allSeats)
                    dispatch(toggleSeats([seat.id]));
                }}
                onMouseDown={() => {
                  dispatch(toggleSeats([seat.id]));
                }}
              />
            </SeatSlot>
          );
        })}
      </Grid>
    </div>
  );
};

export default SeatGrid;
