import { createContext, useState } from "react";

const STATES = {
  SUCCESS: "success",
  ERROR: "error",
};

const ToastContext = createContext({
  show: false,
  type: STATES.SUCCESS,
  message: "Message added",
  success: () => {},
  error: () => {},
});

const ToastProvider = (props) => {
  const [type, setType] = useState(null);
  const [message, setMessage] = useState(null);
  const [timeOut, setTimeOut] = useState(null);
  const [show, setShow] = useState(false);

  const success = (text) => {
    setMessage(`🎉  ${text}`);
    setType(STATES.SUCCESS);
    setShow(true);
    if (timeOut) {
      clearTimeout(timeOut);
    }
    setTimeOut(
      setTimeout(() => {
        clear();
      }, 4000)
    );
  };
  const error = (text) => {
    setMessage(`❗️  ${text}`);
    setType(STATES.ERROR);
    setShow(true);
    if (timeOut) {
      clearTimeout(timeOut);
    }
    setTimeOut(
      setTimeout(() => {
        clear();
      }, 2000)
    );
  };

  const clear = () => {
    setShow(false);
    // setMessage(null);
    // setType(null);
  };

  return (
    <ToastContext.Provider
      value={{
        show,
        success,
        error,
        clear,
        type,
        message,
      }}
    >
      {props.children}
    </ToastContext.Provider>
  );
};

export { ToastContext };
export default ToastProvider;
