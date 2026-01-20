import "./App.css";
import { Routes, Route } from "react-router-dom";
import { CreateChannel } from "./features/channel/pages/CreateChannel";
import { Channel } from "./features/channel/pages/Channel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import { useLoginStatusQuery } from "./features/auth/queries/auth";
import Loader from "./components/loaders/Loader";
import { useChannelEvents } from "./features/channel/websocket/listeners/channel";
import useMediasoupEvents from "./features/media/websocket/listeners/mediasoup";
import usePermissionWatcher from "./hooks/usePermissionWatcher";
import PrivateRoute from "./components/PrivateRoute";
import Redirect from "./components/Redirect";
import { useChannelMessageEvents } from "./features/channel/websocket/listeners/channelMessage";

function App() {
  const { isLoading } = useLoginStatusQuery();

  useChannelEvents();

  useChannelMessageEvents();

  useMediasoupEvents();

  usePermissionWatcher();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<CreateChannel />} />
          <Route path="/channel/:id" element={<Channel />} />
        </Route>

        <Route element={<Redirect />}>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="!bg-[#0f1219]/95 !backdrop-blur-xl !border !border-white/10 !text-white !rounded-xl !shadow-2xl !mb-3 !p-4 !text-sm !font-medium"
      />
    </>
  );
}

export default App;
