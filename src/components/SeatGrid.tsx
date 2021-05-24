import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  toggleSeats,
  selectSeats,
  allSeatsSelected,
  selectRows,
  selectCols,
} from "../store/slices/reservationSlice";
import Seat from "./Seat";

const Grid = styled("div")<{ columns: number; rows: number; gap: number }>`
  display: grid;
  grid-template-columns: ${({ columns }) => `repeat(${columns}, 1fr)`};
  grid-template-rows: ${({ rows }) => `repeat(${rows}, 1fr)`};
  grid-column-gap: ${({ gap }) => `${gap}px`};
  grid-row-gap: ${({ gap }) => `${gap}px`};
`;

const SeatWrapper = styled("div")<{ x: number; y: number }>`
  grid-row: ${({ x }) => x};
  grid-column: ${({ y }) => y};
  width: 50px;
  height: 50px;
`;

const SeatGrid = () => {
  const [hoverSelect, setHoverSelect] = useState(false);
  const dispatch = useAppDispatch();
  const seats = useAppSelector(selectSeats);
  const allSeats = useAppSelector(allSeatsSelected);
  const rows = useAppSelector(selectRows);
  const cols = useAppSelector(selectCols);
  if (!seats.length) return <div>No seats found!</div>;

  return (
    <div
      onDragStart={(e) => e.preventDefault()}
      onMouseDown={() => setHoverSelect(true)}
      onMouseUp={() => setHoverSelect(false)}
      onMouseLeave={() => setHoverSelect(false)}
    >
      <Grid rows={rows} columns={cols} gap={10}>
        {seats.map((seat, i) => {
          return (
            <SeatWrapper x={seat.cords.x + 1} y={seat.cords.y + 1}>
              <Seat
                key={i}
                seat={seat}
                onHover={() => {
                  if (hoverSelect && !seat.reserved && !allSeats)
                    dispatch(toggleSeats([seat]));
                }}
                onMouseDown={() => {
                  dispatch(toggleSeats([seat]));
                }}
              />
            </SeatWrapper>
          );
        })}
      </Grid>
    </div>
  );
};

export default SeatGrid;
