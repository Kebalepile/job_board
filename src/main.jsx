import React from "react";
import NavProvider from "./contexts/navigation/state.jsx";
import JobBoardProvider from "./contexts/jobBoard/state.jsx";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <NavProvider>
      <JobBoardProvider>
        <App />
      </JobBoardProvider>
    </NavProvider>
  </React.StrictMode>
);
