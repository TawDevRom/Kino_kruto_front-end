import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Player from "./pages/Player/Player";
import Add from "./pages/Add/Add"

export default function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/watch' element={<Player />} />
      <Route path='/add' element={<Add />} />
    </Routes>
  )
}