import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

const Home = lazy(() => import("./components/Home"));
const Opportunity = lazy(() => import("./components/Opportunity"));
const NotFound = lazy(() => import("./components/NotFound"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="loadingDiv"></div>}>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/post_information" element={<Opportunity />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
