import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { GraphDto } from "../../types/graph.dto";
import { RootState } from "../store";

export interface GraphState {
  data: GraphDto[];

  inputValue: string;

  showTooltip: boolean;
  tooltipLeft: number;
  tooltipTop: number;
  tooltipValue: string;
}

const initialState: GraphState = {
  data: [],

  inputValue: "",

  showTooltip: false,
  tooltipLeft: 0,
  tooltipTop: 0,
  tooltipValue: "",
};

export const graphSlice = createSlice({
  name: "graph",
  initialState,
  reducers: {
    updateInputValue(state, payload: PayloadAction<string>) {
      state.inputValue = payload.payload;
    },
    toggleTooltip(
      state,
      payload: PayloadAction<{
        show: boolean;
        left: number;
        top: number;
        value: string;
      }>
    ) {
      state.showTooltip = payload.payload.show;
      state.tooltipLeft = payload.payload.left;
      state.tooltipTop = payload.payload.top;
      state.tooltipValue = payload.payload.value;
    },
  },
});

export const { updateInputValue, toggleTooltip } = graphSlice.actions;

export const selectData = (state: RootState) => state.graph.data;
export const selectInputValue = (state: RootState) => state.graph.inputValue;
export const selectTooltipState = (state: RootState) => ({
  show: state.graph.showTooltip,
  left: state.graph.tooltipLeft,
  top: state.graph.tooltipTop,
  value: state.graph.tooltipValue,
});

export default graphSlice.reducer;
