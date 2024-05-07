import React from "react";
import Style from "./Button.module.css";

const Button = ({ btnName, handleClick, classStyles }) => {
  return (
    <div className={Style.button} type="button" onClick={handleClick}>
      {btnName}
    </div>
  );
};

export default Button;
