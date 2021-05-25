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

const TutorialIcon = styled("div")`
  pointer-events: all;
  text-align: center;
  font-weight: bold;
  color: gray;
  cursor: default;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  box-shadow: 0px 0px 3px 1px gray;
`;

const TutorialWrapper = styled.div`
  width: 100%;
  position: absolute;
  display: flex;
  padding: 5px;
  pointer-events: none;

  #tutorial-icon:hover + #tutorial {
    display: inline-block;
    opacity: 1;
  }
`;

const Tutorial = styled.div`
  display: none;
  transition: opacity 0.15s ease;
  margin-left: 5px;
  width: 100%;
  background: #53ca7b;
  opacity: 0;
  text-align: center;
  pointer-events: None;
  border-radius: 5px;
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

const tutorialText =
  "Kliknij aby wybrać miejsce, kliknij i przeciąg aby zaznaczyć wiele na raz.";

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
      <TutorialWrapper>
        <TutorialIcon id="tutorial-icon"> ? </TutorialIcon>
        <Tutorial id="tutorial">{tutorialText}</Tutorial>
      </TutorialWrapper>
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
