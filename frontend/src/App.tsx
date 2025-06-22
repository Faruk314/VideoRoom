import "./App.css";
import { Routes, Route } from "react-router-dom";
import { CreateChannel } from "./features/channel/pages/CreateChannel";
import { Channel } from "./features/channel/pages/Channel";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<CreateChannel />} />
        <Route path="/room/:id" element={<Channel />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
