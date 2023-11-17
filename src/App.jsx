import "./App.css";
import Nav from "./components/Nav";
import Main from "./components/Main";
import Info from "./components/Info";
import Board from "./components/JobBoard"
function App() {
  return (
    <>
      <Main />
      <Info />
      <Board/>
      <Nav />
    </>
  );
}

export default App;
