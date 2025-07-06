import "./App.css";
import { Routes, Route } from "react-router-dom";
import { CreateChannel } from "./features/channel/pages/CreateChannel";
import { Channel } from "./features/channel/pages/Channel";
import { ToastContainer } from "react-toastify";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import { useLoginStatusQuery } from "./features/auth/queries/auth";
import Loader from "./components/loaders/Loader";
import { useChannelEvents } from "./features/channel/websocket/listeners/channel";
import useMediasoupEvents from "./features/media/websocket/listeners/mediasoup";
import usePermissionWatcher from "./hooks/usePermissionWatcher";

function App() {
  const { isLoading } = useLoginStatusQuery();

  useChannelEvents();

  useMediasoupEvents();

  usePermissionWatcher();

  if (isLoading) {
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
