import { useContext } from "react";
import NavContext from "../contexts/navigation/context";
import { PiTelegramLogoThin } from "react-icons/pi";
import { MdOutlineMailOutline } from "react-icons/md";

export default function Info() {
  const { MENU, Display } = useContext(NavContext);

  return (
    <>
      {MENU && (
        <dialog id="info" open>
          <form>
            <h2 style={{ textAlign: "center" }}>
              {" "}
              Boitekong Community Job Board
            </h2>
            <hr />
            <p>
              We&apos;re all about connecting you with job opportunities from
              various sectors. Our board features vacancies from :
            </p>
            <ul>
              <li>
                <strong>Public sector departments & entities</strong>
              </li>
              <li>
                <strong>Private sector companies</strong>
              </li>
              <li>
                <strong>Job posts from job agencies</strong>
              </li>
            </ul>

            <p>
              Whether you&apos;re a fresh graduate 🎓 or an experienced
              professional 👩‍💼👨‍💼, we&apos;re here to help you navigate your
              career path. Dive in and explore the multitude of opportunities
              waiting for you! 🚀💼
            </p>

            <div className="i">
              <button
                className="closeBtn"
                onClick={(e) => {
                  e.preventDefault();

                  Display("MENU");
                }}
              >
                close
              </button>
            </div>
            <br />
            <hr />

            <p className="i">Contacts</p>
            <br />
            <p className="contacts">
              <a
                className="contact"
                href="https://t.me/Kebalepile_1"
                target="_blank"
                rel="noopener noreferrer"
                title="https://t.me/Kebalepile_1"
              >
                <PiTelegramLogoThin />
              </a>
              <a
                className="contact"
                href="mailto:boitkongcommunity@gmail.com"
                title="boitkongcommunity@gmail.com"
              >
                <MdOutlineMailOutline />
              </a>
            </p>
            <br />
            <h6 className="i" style={{ color: "gray" }}>
              © 2023 K.T Motshoana
            </h6>
          </form>
        </dialog>
      )}
    </>
  );
}
