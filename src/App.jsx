import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

const Home = lazy(() => import("./components/home/Home"));
const Opportunity = lazy(() => import("./components/board/Opportunity"));
const NotFound = lazy(() => import("./components/redirect/NotFound"));

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
