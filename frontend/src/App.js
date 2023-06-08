import "./App.css";
import { Routes, Route } from "react-router-dom";
import Homepage from "./Components/Homepage";
import Chatpage from "./Components/Chatpage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        <Route exact path="/chat" element={<Chatpage />} />
      </Routes>
    </div>
  );
}

export default App;
