import React, { Suspense } from "react";
import { PiTelegramLogoThin } from "react-icons/pi";
import { MdOutlineMailOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import MainImage from "../assets/images/4.jpg";

function useNavigation() {
  const navigateTo = useNavigate();
  function navigate(path) {
    navigateTo(path);
  }
  return navigate;
}

export default function Info() {
  const Navigate = useNavigation();

  return (
    <>
      <dialog id="info" open>
        <Suspense className='loadingDiv'>
          <form>
            <div style={{ width: "100%", display: "flex" }}>
              <img
                src={MainImage}
                alt="banner image"
                className="board-banner"
                style={{ margin: "center" }}
              />
            </div>
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
                  Navigate("/");
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
        </Suspense>
      </dialog>
    </>
  );
}
