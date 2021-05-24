import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  toggleSeats,
  selectSeats,
  allSeatsSelected,
} from "../store/slices/reservationSlice";
import Seat from "./Seat";

const SeatGrid = () => {
  const [hoverSelect, setHoverSelect] = useState(false);
  const dispatch = useAppDispatch();
  const seats = useAppSelector(selectSeats);
  const allSeats = useAppSelector(allSeatsSelected);
  
  if (!seats.length) return <div>No seats found!</div>;

  return (
    <table
      onDragStart={(e) => e.preventDefault()}
      onMouseDown={() => setHoverSelect(true)}
      onMouseUp={() => setHoverSelect(false)}
      onMouseLeave={() => setHoverSelect(false)}
    >
      <tbody>
        {seats.map((seatRow) => {
          return (
            <tr>
              {seatRow.map((seat, i) => (
                <td style={{ width: "60px", height: "60px", padding: "4px" }}>
                  <Seat
                    key={i}
                    seat={seat}
                    onHover={() => {
                      if (seat && hoverSelect && !seat.reserved && !allSeats)
                        dispatch(toggleSeats([seat.cords]));
                    }}
                    onMouseDown={() => {
                      if (seat) dispatch(toggleSeats([seat.cords]));
                    }}
                  />
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default SeatGrid;
