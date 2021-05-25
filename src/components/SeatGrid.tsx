import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  toggleSeats,
  selectSeats,
  allSeatsSelected,
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

const SeatGrid = () => {
  const [rows, setRows] = useState<number>(0);
  const [cols, setCols] = useState<number>(0);
  const [hoverSelect, setHoverSelect] = useState(false);
  const dispatch = useAppDispatch();
  const seats = useAppSelector(selectSeats);
  const allSeats = useAppSelector(allSeatsSelected);

  useEffect(() => {
    console.log("Calculating rows and cols");
    let _rows = 0;
    let _cols = 0;

    for (const seat of seats) {
      if (seat.cords.x > _rows) _rows = seat.cords.x;
      if (seat.cords.y > _cols) _cols = seat.cords.y;
    }

    setRows(_rows + 1);
    setCols(_cols + 1);
  });

  if (!seats.length) return <div>No seats found!</div>;

  return (
    <div
      onDragStart={(e) => e.preventDefault()}
      onMouseDown={() => setHoverSelect(true)}
      onMouseUp={() => setHoverSelect(false)}
      onMouseLeave={() => setHoverSelect(false)}
    >
      <Grid nRows={rows} nCols={cols} gap={10}>
        {seats.map((seat, i) => {
          return (
            <SeatSlot key={i} x={seat.cords.x + 1} y={seat.cords.y + 1}>
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
