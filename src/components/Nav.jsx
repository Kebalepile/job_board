import { useContext } from "react";
import NavContext from "../contexts/navigation/context";
import { MdHomeFilled, MdWork } from "react-icons/md";
import { RiMenu5Line } from "react-icons/ri";

export default function Nav() {
  const { Display } = useContext(NavContext);
  const HandleClickEvent = (type) => {
    console.log(type);
  };
  return (
    <>
      <nav className="menu">
        <button
          onClick={() => HandleClickEvent("HOME")}
          className="menu-items"
          title="Home"
        >
          <MdHomeFilled />
        </button>
        <button
          onClick={() => Display("MENU")}
          className="menu-items"
          title="Menu"
        >
          <RiMenu5Line />
        </button>
        <button
          onClick={() => Display("JOBS")}
          className="menu-items"
          title="Jobs"
        >
          <MdWork />
        </button>
      </nav>
    </>
  );
}
