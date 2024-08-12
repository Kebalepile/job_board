import React, { useEffect, lazy, Suspense } from "react";
import { scrollIntoView } from "../../utils/functions";
// Use lazy() to dynamically import the components
// const Nav = lazy(() => import("../navigation/Nav"));
const InfoBanner = lazy(() => import("../about/InfoBanner"));

const AboutPlatform = lazy(() => import("../about/About"));
const JobBoard = lazy(() => import("../board/JobBoard"));

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
        {/* <InfoBanner /> */}
        {/* <AboutPlatform /> */}
        {/* <JobBoard /> */}
        {/* <Nav /> */}
      </Suspense>
    </>
  );
}
