import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

import "./style.css";
import { ToastContext } from "../context/toastContext";

const AuthPage = () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const toastContext = useContext(ToastContext);

  useEffect(() => {
    setLoading(true);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/messages");
        toastContext.success("Nice to see you!");
      }
      setLoading(false);
    });
  }, [auth, navigate, toastContext]);

  const signIn = () => {
    setLoading(true);
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        return signInWithPopup(auth, provider);
      })
      .then((result) => {
        navigate("/messages");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toastContext.error("Error occurred");
        console.log(`[Error][${errorCode}] - ${errorMessage}`);
      });
    setLoading(false);
  };

  return (
    <div className="AuthPage">
      <h1>Auth screen</h1>
      {loading ? (
        <Loader />
      ) : (
        <button onClick={signIn}>
          <svg
            viewBox="0 0 24 24"
            className="fill-current mr-3 w-6 h-5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
          </svg>
          Sign in with Google
        </button>
      )}
    </div>
  );
};

export default AuthPage;
