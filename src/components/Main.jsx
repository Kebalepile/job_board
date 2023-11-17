import { useContext } from "react";
import JobBoardContext from "../contexts/jobBoard/context";
import { GoShareAndroid } from "react-icons/go";
import Share from "../utils/share";

export default function Main() {
  const { Hiring } = useContext(JobBoardContext);

  return (
    <>
      <div id="headline">
        <div id="headline-message" className="card">
          <h3 className="i">Looking for a job in the South African Market</h3>
          <h4 className="i">Start Here</h4>
          <hr />
          <h2 className="i">Currently There Are</h2>
          <br />

          <ol id="headline-job-info">
            <li> {Hiring().public} Government Departments</li>
            <li>25 Private Sector Entities/Companies </li>
            <li> +{Hiring().private} Private Sector</li>
            <br />
            <p className="i">Openings</p>
          </ol>

          <hr />
          <p className="call-to-action">
            share site with friends
            <button
              id="share-site"
              className="apply share"
              onClick={() => {
                Share({
                  title: "Boitekong Job Board",
                  text: "available job vacancy, might be suitable for you!",
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
