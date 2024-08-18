import React from "react";

import styles from "./Tooltip.module.css";
import { useSelector } from "react-redux";
import { selectTooltipState } from "../../store/graphReducer/graphReducer";

export const Tooltip = () => {
  const { show, left, top, value } = useSelector(selectTooltipState);

  if (!show) {
    return null;
  }

  return (
    <div className={styles.tooltip} style={{ left, top }}>
      {value}
    </div>
  );
};
