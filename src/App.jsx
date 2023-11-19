import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./components/Home";
import Opportunity from "./components/Opportunity";
function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/post_information" element={<Opportunity/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
