import React from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./TransactionViewTypeRadioGroup.module.css";

import {
  selectTransactionViewType,
  updateTransactionViewType,
} from "../../store/graphReducer/graphReducer";

export const TransactionViewTypeRadioGroup = () => {
  const dispatch = useDispatch();

  const transactionViewType = useSelector(selectTransactionViewType);

  return (
    <div className={styles.TransactionViewTypeRadioGroup}>
      <label>
        USDT
        <input
          type="radio"
          name="transactionViewType"
          value="usdt"
          onChange={() => dispatch(updateTransactionViewType("usdt"))}
          checked={transactionViewType === "usdt"}
        />
      </label>
      <label>
        TOKEN
        <input
          type="radio"
          name="transactionViewType"
          value="token"
          onChange={() => dispatch(updateTransactionViewType("token"))}
          checked={transactionViewType === "token"}
        />
      </label>
    </div>
  );
};
