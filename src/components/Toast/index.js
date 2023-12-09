import React, { useContext } from "react";
import { ToastContext } from "../../context/toastContext";

import "./style.css";

const Toast = () => {
  const toastContext = useContext(ToastContext);

  return (
    <div
      className={`Toast ${toastContext.type} ${
        toastContext.show ? "show" : null
      }`}
    >
      <p>{toastContext.message}</p>
    </div>
  );
};

export default Toast;
