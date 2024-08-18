import React from "react";
import { useSelector, useDispatch } from "react-redux";

import "./App.css";

import {
  selectInputValue,
  updateInputValue,
} from "./store/graphReducer/graphReducer";

import {
  Labels,
  Tooltip,
  NetworkDiagram,
  TransactionViewTypeRadioGroup,
} from "./components";

function App() {
  const dispatch = useDispatch();
  const inputValue = useSelector(selectInputValue);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateInputValue(e.target.value));
  };

  return (
    <div className="App">
      <input type="text" value={inputValue} onChange={handleInputChange} />

      <TransactionViewTypeRadioGroup />

      <Labels />

      <NetworkDiagram
        width={window.innerWidth - 200}
        height={window.innerHeight * 0.8}
      />

      <Tooltip />
    </div>
  );
}

export default App;
