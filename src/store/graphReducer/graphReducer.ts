import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { GraphDto } from "../../types/graph.dto";
import { RootState } from "../store";

export interface GraphState {
  data: GraphDto[];

  inputValue: string;
}

const initialState: GraphState = {
  data: [],

  inputValue: "",
};

export const graphSlice = createSlice({
  name: "graph",
  initialState,
  reducers: {
    updateInputValue(state, payload: PayloadAction<string>) {
      state.inputValue = payload.payload;
    },
  },
});

export const { updateInputValue } = graphSlice.actions;

export const selectData = (state: RootState) => state.graph.data;
export const selectInputValue = (state: RootState) => state.graph.inputValue;

export default graphSlice.reducer;
