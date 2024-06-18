import React from "react";
import NavProvider from "./contexts/navigation/state.jsx";
import JobBoardProvider from "./contexts/jobBoard/state.jsx";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    //   ./src/serviceWorker.js for development
    // ./serviceWorker.js for Production
    navigator.serviceWorker
      .register("./serviceWorker.js")
      .then((registration) => {
        console.log("service worker registered as: ", registration.scope);
      })
      .catch((error) => console.error("service worker registration: ", error));
  });
}
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <JobBoardProvider>
      <NavProvider>
        <App />
      </NavProvider>
    </JobBoardProvider>
  </React.StrictMode>
);
