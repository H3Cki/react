import React from "react";
import styled, { css } from "styled-components";
import { ISeat, ISeatExample } from "../store/slices/reservationSlice";

interface Props {
  seat: ISeat | ISeatExample;
  onMouseDown?: () => void;
  onHover?: () => void;
}

const StyledSeat = styled("div")<{ seat: ISeat | ISeatExample }>`
  width: 100%;
  height: 100%;
  border-radius: 1px;
  box-shadow: 0px 0px 0px 1px rgba(0, 0, 0, 1);
  transition: background 0.25s ease;
  ${({ seat }) => {
    if (seat.reserved) {
      return css`
        background: gray;
      `;
    } else if (seat.selected) {
      return css`
        background: orange;
        box-shadow: 0px 0px 0px 1px orange;
      `;
    }
  }}
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
