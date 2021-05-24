import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import styled, { css } from "styled-components";
import { Button } from "antd";
import {
  prevStep,
  nextStep,
  toggleSeats,
  selectNSeats,
  selectSelectedSeats,
  setSuggestedSeats,
  selectSeats,
} from "../store/slices/reservationSlice";

import Seat from "./Seat";
import SeatDescription from "./SeatDescription";

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.2);
`;

const SeatDescriptionWrapper = styled.div`
  margin-top: 20px;
`;

const ControlPanelWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
`;

const Hr = styled.hr`
  margin-top: 20px;
  margin-bottom: 20px;
  width: 80%;
  border: none;
  border-top: 1px solid gray;
`;

const Table = styled.table``;

const Info = styled.div`
  display: flex;
  align-items: center;
`;

const NSeatsIndicator = styled("span")<{
  selected: number;
  target: number;
}>`
  margin-left: 10px;
  padding: 0px 5px 0px 5px;
  border-radius: 3px;
  background: gray;
  color: white;
  font-weight: bold;
  ${(props) =>
    props.selected > 0 &&
    props.selected < props.target &&
    css`
      background: orange;
    `}
  ${(props) =>
    props.selected > 0 &&
    props.selected === props.target &&
    css`
      background: #36ca4a;
    `}
`;

const SeatGrid = () => {
  const dispatch = useAppDispatch();
  const seats = useAppSelector(selectSeats);
  const selectedSeats = useAppSelector(selectSelectedSeats);
  const nSeats = useAppSelector(selectNSeats);

  const handleSubmit = () => {
    if (selectedSeats.length !== nSeats) {
      alert(`Wybierz ${nSeats} miejsca zanim zatwierdzisz wybór.`);
      return;
    }
    dispatch(nextStep());
  };

  useEffect(() => {
    dispatch(setSuggestedSeats());
  }, []);

  if (!seats.length) return <div>No seats found!</div>;

  return (
    <Wrapper>
      <Table>
        <tbody>
          {seats.map((seatRow) => {
            return (
              <tr>
                {seatRow.map((seat, i) => (
                  <td style={{ width: "60px", height: "60px", padding: "4px" }}>
                    <Seat
                      key={i}
                      seat={seat}
                      onClick={() => {
                        if (seat) dispatch(toggleSeats([seat.cords]));
                      }}
                    />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>

      <SeatDescriptionWrapper>
        <SeatDescription />
      </SeatDescriptionWrapper>
      <Hr />
      <ControlPanelWrapper>
        <Button
          onClick={() => {
            dispatch(prevStep());
          }}
        >
          Powrót
        </Button>

        <Info>
          Wybrano miejsca:{" "}
          <NSeatsIndicator
            selected={selectedSeats.length}
            target={nSeats}
          >{`${selectedSeats.length}/${nSeats}`}</NSeatsIndicator>
        </Info>

        <Button type="primary" onClick={() => handleSubmit()}>
          Zatwierdź miejsca
        </Button>
      </ControlPanelWrapper>
    </Wrapper>
  );
};

export default SeatGrid;
