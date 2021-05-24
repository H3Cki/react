import React from "react";
import Reservation from "./components/Reservation";
import SeatView from "./components/SeatView";
import Summary from "./components/Summary";
import { selectCurrStep} from "./store/slices/reservationSlice";
import { useAppSelector } from "./hooks";

const App: React.FC = () => {
  const currStep = useAppSelector(selectCurrStep);

  switch (currStep) {
    default:
      return (
        <Reservation/>
      );
    case 0:
      return (
        <Reservation/>
      );
    case 1:
      return (
        <SeatView/>
      );
    case 2:
      return (
        <Summary/>
      );
  }
};

export default App;
