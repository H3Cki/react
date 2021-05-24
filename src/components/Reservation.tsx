import React from "react";
import { useAppSelector, useAppDispatch } from "../hooks";
import { Button, Input as AntInput, Checkbox } from "antd";
import styled from "styled-components";
import {
  fetchSeats,
  toggleAdjacent,
  setNumberOfSeats,
  selectNSeats,
  selectAdjacent,
} from "../store/slices/reservationSlice";

const Wrapper = styled.div`
  position: relative;
  width: 100vh;
  height: 100vh;
`;

const Window = styled.div`
  position: fixed;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  border-radius: 5px;
  background: white;
  padding: 20px;
  width: 300px;

  .field:not(:first-child) {
    margin-top: 20px;
  }

  box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.2);
`;

const Half = styled.div`
  display: flex;
`;

const Column = styled.div`
  width: 50%;
`;

const Input = styled(AntInput)`
  text-align: right;
`;

const Reservation: React.FC = () => {
  const nSeats = useAppSelector(selectNSeats);
  const adjacent = useAppSelector(selectAdjacent);
  const dispatch = useAppDispatch();

  const handleNSeatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value)) {
      alert("BAD");
    } else {
      dispatch(setNumberOfSeats(value));
    }
  };

  const handleSubmit = () => {
    if (nSeats < 1) {
      alert("Wybierz przynajmniej jedno miejsce");
      return;
    }
    dispatch(fetchSeats());
  };

  return (
    <Wrapper>
      <Window>
        <div className="field">
          <Half>
            <Column>
              <span>Liczba miejsc:</span>
            </Column>

            <Column>
              <Input
                checked={adjacent}
                onChange={(e) => handleNSeatsChange(e)}
              />
            </Column>
          </Half>
        </div>

        <div className="field">
          <Checkbox
            onChange={(e) => dispatch(toggleAdjacent(e.target.checked))}
          >
            Czy miejsca mają być obok siebie?
          </Checkbox>
        </div>

        <div className="field">
          <Half>
            <Column />
            <Column>
              <Button type="primary" onClick={(e) => handleSubmit()}>
                Wybierz miejsca
              </Button>
            </Column>
          </Half>
        </div>
      </Window>
    </Wrapper>
  );
};

export default Reservation;
