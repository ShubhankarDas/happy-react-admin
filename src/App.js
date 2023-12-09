import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import Home from "./Home";
import Message from "./Message";
import AuthPage from "./AuthPage";
import ToastProvider from "./context/toastContext";
import Toast from "./components/Toast";

function App() {
  return (
    <>
      <ToastProvider>
        <Toast />
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Home />{" "}
              </ProtectedRoute>
            }
          />
          <Route path="/message/new" element={<Message />} />
          <Route path="/message/:messageId" element={<Message />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </>
  );
}

export default App;
