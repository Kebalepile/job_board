import React, { useContext } from "react";
// import { useNavigate } from "react-router-dom";
import navContext from "../contexts/navigation/context";
import { ABOUTPLATFORM } from "../contexts/types";
import { MdHomeFilled } from "react-icons/md";
import { MdWork } from "react-icons/md";
import { RiMenu5Line } from "react-icons/ri";
import { scrollIntoView } from "../utils/functions";

// function useNavigation() {
//   const navigateTo = useNavigate();
//   function navigate(path) {
//     navigateTo(path);
//   }
//   return navigate;
// }

export default function Nav() {
  // const Navigate = useNavigation();
  const { Display } = useContext(navContext);
  return (
    <nav className="menu">
      <button
        onClick={() => {
          const elem = document.querySelector("#headline-message");
          scrollIntoView(elem);
        }}
        className="menu-items"
        title="Home"
      >
        <MdHomeFilled />
      </button>

      <button
        onClick={() => {
          Display(ABOUTPLATFORM);
        }}
        className="menu-items"
        title="Menu"
      >
        <RiMenu5Line />
      </button>

      <button
        onClick={() => {
          const elem = document.querySelector("#board");
          scrollIntoView(elem, "instant");
        }}
        className="menu-items"
        title="Jobs"
      >
        <MdWork />
      </button>
    </nav>
  );
}
