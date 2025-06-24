import "./App.css";
import { Routes, Route } from "react-router-dom";
import { CreateChannel } from "./features/channel/pages/CreateChannel";
import { Channel } from "./features/channel/pages/Channel";
import { ToastContainer } from "react-toastify";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import { useLoginStatusQuery } from "./features/auth/queries/auth";
import Loader from "./components/loaders/Loader";

function App() {
  const { isPending } = useLoginStatusQuery();

  if (isPending) {
    return <Loader />;
  }

  return (
    <>
      <Routes>
        <Route path="/home" element={<CreateChannel />} />
        <Route path="/channel/:id" element={<Channel />} />

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
