import React, { useEffect, lazy, Suspense } from "react";
import { scrollIntoView } from "../utils/functions";
// Use lazy() to dynamically import the components
const Nav = lazy(() => import("./Nav"));
const InfoBanner = lazy(() => import("./InfoBanner"));

const AboutPlatform = lazy(() => import("./AboutPlatform"));
const JobBoard = lazy(() => import("./JobBoard"));

export default function Home() {
  useEffect(() => {
    if (location.hash.length > 0) {
   
      const hashFragment = location.hash;
      const elem = document.querySelector(hashFragment);
     
      if (elem) scrollIntoView(elem);
    }
  }, []);
  return (
    <>
      <Suspense className="loadingDiv">
        <InfoBanner />
        <AboutPlatform />
        <JobBoard />
        <Nav />
      </Suspense>
    </>
  );
}
