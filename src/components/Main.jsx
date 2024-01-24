import React,  { useContext } from "react";

import { GoShareAndroid } from "react-icons/go";
import boardImg from "../assets/images/2.jpg";
import Share from "../utils/share";

import  JobBoardContext from 
 "../contexts/jobBoard/context"


export default function Main() {
  const { Hiring } = useContext(JobBoardContext);

  return (
    <>
      <div id="headline">
        <div id="headline-message" className="card i">
          <img src={boardImg} alt="banner image" className="board-banner" />
          <hr className="line" style={{ width: "240px" }} />
          <br />
          <h3 className="i">Looking for a job in the South African Market</h3>
          <h4>Start Here</h4>
          <hr
            className="line"
            style={{ width: "300px", border: "white dashed 2px" }}
          />
          <br />
          <h2 className="i">Currently There Are</h2>

          <ol id="headline-job-info">
            <li> {Hiring().public} Government Departments</li>
            <li>{Hiring().private} Private Sector Entities/Companies </li>
            <li> +{Hiring().agencyJobs} Private Sector</li>
            <br />
            <p className="i">Openings</p>
          </ol>

          <hr className="line" style={{ width: "200px" }} />
          <p className="call-to-action">
            share site with friends
            <button
              id="share-site"
              className="apply share"
              onClick={() => {
                Share({
                  title: "Boitekong Job Board",
                  text: "Check Boitekong Community Job Board Site for job posts around the North West and more.",
                  url: location.origin
                });
              }}
            >
              <GoShareAndroid />
            </button>
          </p>
          <br />
        </div>
      </div>
    </>
  );
}
