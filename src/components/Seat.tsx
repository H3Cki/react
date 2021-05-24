import React from "react";
import styled, { css } from "styled-components";
import { ISeat, ISeatExample } from "../store/slices/reservationSlice";

interface Props {
  seat: ISeat | ISeatExample | null;
  onMouseDown?: () => void;
  onHover?: () => void;
}

const StyledSeat = styled("div")<{ seat: ISeat | ISeatExample | null }>`
  width: 100%;
  height: 100%;
  border-radius: 1px;
  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 1);
  transition: background 0.25s ease;
  pointer-events: all;
  ${(props) => {
    if (props.seat) {
      if (props.seat.reserved) {
        return css`
          background: gray;
        `;
      } else if (props.seat.selected) {
        return css`
          background: orange;
          box-shadow: 0px 0px 0px 1px orange;
        `;
      }
    } else {
      return css`
        background: transparent;
        box-shadow: none;
        pointer-events: none;
      `;
    }
  }};
`;

const Seat = ({ seat, onMouseDown, onHover }: Props) => {
  return (
    <StyledSeat
      seat={seat}
      onMouseEnter={() => {
        if (onHover) onHover();
      }}
      onMouseDown={() => {
        if (onMouseDown) onMouseDown();
      }}
    />
  );
};

export default Seat;
