import { useContext } from "react";
import JobBoardContext from "../contexts/jobBoard/context";
import Share from "../utils/share";
import { useNavigate } from "react-router-dom";

function useNavigation() {
  const navigateTo = useNavigate();
  function navigate(path) {
    navigateTo(path);
  }
  return navigate;
}
export default function Opportunity() {
  const Navigate = useNavigation();
  const { PostInfo } = useContext(JobBoardContext);
  console.log(PostInfo);
  return (
    <dialog open id="info-card">
      <form method="dialog">
        {PostInfo && (
          <article className="more-info">
            {PostInfo?.imgSrc && (
              <img
                className="logo"
                src={PostInfo.imgSrc}
                alt="entity logo"
                loading="lazy"
              />
            )}
            <div className="header">
              {PostInfo?.title && (
                <h3> {PostInfo.title.replaceAll(/is hiring/gi, "")}</h3>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  console.log("share");
                  Share({
                    title: `${PostInfo.title}, more info @ Boitekong Job Board`,
                    text: "available job vacancy, might be suitable for you!",
                    url: location.origin
                  });
                }}
              >
                Share
              </button>
            </div>
            <hr className="line" />
            <br />
            {PostInfo?.postedDate && (
              <h5>Date posted: {PostInfo.postedDate}</h5>
            )}
            <br />
            {Array.isArray(PostInfo?.content) && (
              <>
                <hr className="line" />
                <div
                  className="full-details"
                  dangerouslySetInnerHTML={{
                    __html: PostInfo?.content.map((p) =>
                      p.replaceAll(/\.(?=[A-Z0-9 ])/g, ".<br/><br/>")
                    )
                  }}
                ></div>
                <hr className="line" />
              </>
            )}
            {/*    <h3 className="title"> {p?.jobTitle}</h3>
                    <br /> <hr />
                    <section className="post-summary">
                      <img
                        src={"./assets/" + p.iconLink}
                        alt="agency icon"
                        className="icon"
                        title="agency icon"
                      />
                      <br />
                  {p?.jobSpecFields && (
                        <p className="job-field" title={p["jobSpecFields"]}>
                          {p["jobSpecFields"]}
                        </p>
                      )}
                      <br />
                      {p?.province && (
                        <h5 className="province">Province: {p.province}</h5>
                      )}
                      {p?.location && isObject(p.location) && (
                        <span>
                          <h5 className="location">
                            Region: {p.location?.region?.replace(",", "")}
                          </h5>
                          <h5 className="location">
                            City: {p.location?.city?.replace(",", "")}
                          </h5>
                        </span>
                      )}
                      {p?.location && !isObject(p.location) && (
                        <h5 className="location">Location: {p.location}</h5>
                      )}
                      {p?.expiryDate && <h5>{p.expiryDate}</h5>}
                      {p?.startDate && <h5> Start Date: {p.startDate}</h5>}
                      {p?.publishedDate && <h5>{p.publishedDate}</h5>}
                      {p?.vacancyType && (
                        <h5>Vacancy type : {p.vacancyType}</h5>
                      )}
                      <br /> */}
          </article>
        )}
        <br />
        <button
          className="closeBtn"
          onClick={(e) => {
            e.preventDefault();
            Navigate("/");
          }}
        >
          close
        </button>
      </form>
    </dialog>
  );
}
