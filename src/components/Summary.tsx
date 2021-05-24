import React from "react";
import { useAppSelector } from "../hooks";
import styled, { css } from "styled-components";
import { ISeat, selectSelectedSeats } from "../store/slices/reservationSlice";

const Text = styled("p")<{ bold?: boolean }>`
  ${(props) =>
    props.bold &&
    css`
      font-weight: bold;
    `}
`;

const Window = styled.div`
  position: fixed;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  border-radius: 5px;
  background: white;
  padding: 20px;
  width: 600px;

  .field:not(:first-child) {
    margin-top: 20px;
  }

  box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.2);
`;

const Summary = () => {
  const selectedSeats = useAppSelector(selectSelectedSeats);
  return (
    <Window>
      <Text bold>Twoja rezerwacja przebiegła pomyślnie!</Text>
      <Text>
        Wybrałeś miejsca:
        {selectedSeats.map((seat: ISeat) => (
          <div>
            {`- rząd x${seat.cords.x + 1}, miejsce y${seat.cords.y + 1} (${
              seat.id
            })`}
          </div>
        ))}
      </Text>

      <Text bold>
        Dziękujemy! W razie problemów prosimy o kontakt z działem administracji
      </Text>
    </Window>
  );
};

export default Summary;
