import React from "react";

import styles from "./Labels.module.css";

const labels = [
  {
    name: "cex",
    color: "black",
  },
  {
    name: "bridge",
    color: "yellow",
  },
  {
    name: "user",
    color: "red",
  },
];

export const Labels = () => {
  return (
    <div className={styles.Labels}>
      {labels.map((l) => (
        <div className={styles.Label}>
          <div
            className={styles["Label-color"]}
            style={{ backgroundColor: l.color }}
          ></div>
          <span>{l.name}</span>
        </div>
      ))}
    </div>
  );
};
