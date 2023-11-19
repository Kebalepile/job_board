import { useContext } from "react";
import NavContext from "../contexts/navigation/context";
import JobBoardContext from "../contexts/jobBoard/context";
import { useNavigate } from "react-router-dom";
import isObject from "../utils/isObject";
function useNavigation() {
  const navigateTo = useNavigate();
  function navigate(path) {
    navigateTo(path);
  }
  return navigate;
}
export default function Board() {
  const { JOBS, Display } = useContext(NavContext);
  const { PublicJobs, PrivateJobs, OtherPrivateJobs, AgencyIcons, ReadMore } =
    useContext(JobBoardContext);
  /**
   * @descrption change current path to given path arguement
   *@param {string} path
   */

  const Navigate = useNavigation();

  const Posts = (blogPosts) => {
    return (
      <section className="scroll-posts">
        {blogPosts.map((p, i) => {
          return (
            <article
              className="job-post"
              key={i}
              title={p.title}
              onClick={(e) => {
                e.preventDefault();
                ReadMore(p);
                Navigate("/post_information");
              }}
            >
              <div className="company-logo">
                <img loading="lazy" src={p.imgSrc} alt="company logo" />
              </div>
              <p className="title">{p.title}</p>
            </article>
          );
        })}
      </section>
    );
  };

  return (
    <>
      {JOBS && (
        <dialog open id="board">
          <form>
            <hr />
            <h3 className="i">
              Government Departments / Entites with Vacancies
            </h3>
            <hr />
            <br />
            {Posts(PublicJobs().blogPosts)}
            <br />
            <br />
            <hr />
            <h3 className="i">Private Companies Hiring</h3>
            <hr />
            <br />
            {Posts(PrivateJobs().blogPosts)}
            <br />
            <hr />
            <h3 className="i">
              Private Jobs from other companies (which may be smaller or not
              that famous)
            </h3>
            <hr />
            <section className="icons i">
              {AgencyIcons.map((icon, i) => {
                return (
                  <img
                    key={i}
                    src={icon.src}
                    title={icon.title}
                    alt={icon.title}
                    className="agency-icon"
                  />
                );
              })}
            </section>
            <h3 />
            <hr />
            <section className="posts">
              {OtherPrivateJobs().map((p, i) => {
                if (p?.summary) {
                  return (
                    <article className="sa-youth" key={i}>
                      {p?.jobTitle}
                      {p?.summary && (
                        <span
                          dangerouslySetInnerHTML={{ __html: p.summary }}
                        ></span>
                      )}
                      <hr />
                      <br />
                      <button
                        className="read-more"
                        onClick={(e) => {
                          e.preventDefault();
                          ReadMore(p);
                          Navigate("/post_information");
                        }}
                      >
                        Read More
                      </button>
                    </article>
                  );
                }

                return (
                  <article className="post" key={i}>
                    <h3 className="title"> {p?.jobTitle}</h3>
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
                      <br />
                      <section className="details">
                        {Array.isArray(p.details) && (
                          <div
                            className="short-detail"
                            dangerouslySetInnerHTML={{ __html: p.details[1] }}
                          ></div>
                        )}
                        {/* p.details.replaceAll(/\.(?=[A-Z0-9 ])/g, ".<br/><br/>") */}
                        {!Array.isArray(p.details) && (
                          <div
                            className="snippet"
                            dangerouslySetInnerHTML={{ __html: p.details }}
                          ></div>
                        )}
                      </section>
                    </section>
                    <br />
                    <hr />
                    <br />
                    <button
                      className="read-more"
                      onClick={(e) => {
                        e.preventDefault();
                        ReadMore(p);
                        Navigate("/post_information");
                      }}
                    >
                      Read More
                    </button>
                  </article>
                );
              })}
            </section>
            <br />
            <div className="i">
              <button
                className="closeBtn"
                onClick={(e) => {
                  e.preventDefault();

                  Display("JOBS");
                }}
              >
                close
              </button>
            </div>
          </form>
        </dialog>
      )}
    </>
  );
}
