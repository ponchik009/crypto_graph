import React from "react";
import { useSelector, useDispatch } from "react-redux";

import "./App.css";

import { NetworkDiagram } from "./components/NetworkDiagram/NetworkDiagram";
import { Labels } from "./components";

import {
  selectInputValue,
  updateInputValue,
} from "./store/graphReducer/graphReducer";
import { Tooltip } from "./components/Tooltip/Tooltip";

function App() {
  const dispatch = useDispatch();
  const inputValue = useSelector(selectInputValue);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateInputValue(e.target.value));
  };

  return (
    <div className="App">
      <input type="text" value={inputValue} onChange={handleInputChange} />
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
