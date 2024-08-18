import React from "react";
import { useSelector, useDispatch } from "react-redux";

import "./App.css";

import { NetworkDiagram } from "./components/NetworkDiagram/NetworkDiagram";
import { Labels } from "./components";

import {
  selectInputValue,
  updateInputValue,
} from "./store/graphReducer/graphReducer";
import { useGetGraphByAddressQuery } from "./api/api";

function App() {
  const dispatch = useDispatch();
  const inputValue = useSelector(selectInputValue);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateInputValue(e.target.value));
  };

  const { data } = useGetGraphByAddressQuery(inputValue);

  return (
    <div className="App">
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <Labels />
      {data && <NetworkDiagram data={data} width={1200} height={800} />}
    </div>
  );
}

export default App;
