import { getAuth } from "firebase/auth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    return <Navigate to="/" replace />;
  }
  console.log(user);
  return children;
};

export default ProtectedRoute;
