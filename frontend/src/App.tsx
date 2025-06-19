import "./App.css";
import { useSocket } from "./hooks/useSocket";
import { Routes, Route } from "react-router-dom";
import { CreateRoom } from "./pages/CreateRoom";
import { Room } from "./pages/Room";

function App() {
  const { socket } = useSocket();

  return (
    <Routes>
      <Route path="/" element={<CreateRoom />} />
      <Route path="/room/:id" element={<Room />} />
    </Routes>
  );
}

export default App;
