import React from "react";
import styled from "styled-components";
import { ISeatExample } from "../store/slices/reservationSlice";
import Seat from "./Seat";

const seatExamples: ISeatExample[] = [
  {
    name: "Wolne miejsce",
    reserved: false,
    selected: false,
  },
  {
    name: "Wybrane miejsce",
    reserved: false,
    selected: true,
  },
  {
    name: "Zajęte miejsce",
    reserved: true,
    selected: false,
  },
];

const Wrapper = styled.div`
  display: flex;
`;

const SeatExampleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30%;
`;

const SeatExampleContainer = styled.div`
  width: 25px;
  height: 25px;
`;

const SeatInfoContainer = styled.div`
  padding-left: 20px;
`;

const SeatDescription = () => {
  return (
    <Wrapper>
      {seatExamples.map((seatExample, i) => {
        return (
          <SeatExampleWrapper>
            <SeatExampleContainer>
              <Seat key={i} seat={seatExample} />
            </SeatExampleContainer>

            <SeatInfoContainer>{seatExample.name}</SeatInfoContainer>
          </SeatExampleWrapper>
        );
      })}
    </Wrapper>
  );
};

export default SeatDescription;
