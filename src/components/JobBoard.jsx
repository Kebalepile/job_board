import { useContext } from "react";
import NavContext from "../contexts/navigation/context";
import JobBoardContext from "../contexts/jobBoard/context";
import { IoMdCloseCircle } from "react-icons/io";

export default function Board() {
  const { JOBS, Display } = useContext(NavContext);
  const { PublicJobs, PrivateJobs, OtherPrivateJobs, AgencyIcons } =
    useContext(JobBoardContext);

  const Posts = (blogPosts) => {
    return (
      <section className="scroll-posts">
        {blogPosts.map((p, i) => {
          return (
            <article className="job-post" key={i} title={p.title}>
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
            <h3 className="i">
              Government Departments / Entites with Vacancies
            </h3>
            <hr />
            <br />
            {Posts(PublicJobs().blogPosts)}
            <br />
            <br />
            <h3 className="i">Private Companies hiring</h3>
            <hr />
            <br />
            {Posts(PrivateJobs().blogPosts)}
            <br />
            <h3 className="i">
              Private Jobs from other companies (which may be smaller or not
              that famous)
            </h3>
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
                      <button className="read-more">Read More</button>
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
                      {p?.jobSpecFields && (
                        <p className="job-field" title={p["jobSpecFields"]}>
                          {p["jobSpecFields"]}
                        </p>
                      )}
                      <br/>
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
                        {
                        Array.isArray(p.details) &&
                        (<>
                         <div className="short-detail"
                             
                             dangerouslySetInnerHTML={{ __html: p.details[1] }}
                           ></div>
                           <div className="ellipse">...</div></>)}
                       {/* p.details.replaceAll(/\.(?=[A-Z0-9 ])/g, ".<br/><br/>") */}
                     {! Array.isArray(p.details) && (
                      <>
                      <div className="snippet"
                      dangerouslySetInnerHTML={{ __html: p.details }}></div>
                      <div className="ellipse">...</div></>
                     )}
                     
                      </section>
                     
                    </section>
                    <br/>
                    <button className="read-more">Read More</button>
                  </article>
                );
              })}
            </section>

            <div className="i">
              <IoMdCloseCircle
                className="close"
                onClick={(e) => {
                  e.preventDefault();

                  Display("JOBS");
                }}
              />
            </div>
          </form>
        </dialog>
      )}
    </>
  );
}
function isObject(value) {
  return typeof value === "object" && value !== null;
}
