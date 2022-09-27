import "./App.css";
import { Routes, Route } from "react-router-dom";

import Home from "./Home";
import Message from "./Message";

function App() {
  return (
    <>
      <Routes>
        <Route path="/messages" element={<Home />} />
        <Route path="/message/new" element={<Message />} />
        <Route path="/message/:messageId" element={<Message />} />
      </Routes>
    </>
  );
}

export default App;
