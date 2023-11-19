import { useContext } from "react";
import NavContext from "../contexts/navigation/context";
import { MdHomeFilled, MdWork } from "react-icons/md";
import { RiMenu5Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

function useNavigation() {
  const navigateTo = useNavigate();
  function navigate(path) {
    navigateTo(path);
  }
  return navigate;
}
export default function Nav() {
  const Navigate = useNavigation();
  const { Display } = useContext(NavContext);

  return (
    <>
      <nav className="menu">
        <button
          onClick={(e) => {
            e.preventDefault();
            Navigate("/");
          }}
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
