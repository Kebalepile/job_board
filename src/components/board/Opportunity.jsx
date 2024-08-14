import React, { useContext, useEffect } from "react";

import Share from "../../utils/share";
import { useNavigate } from "react-router-dom";
import { IoIosCloseCircle } from "react-icons/io";

import JobBoardContext from "../../contexts/jobBoard/context";
import isObject from "../../utils/isObject";

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

  useEffect(() => {
    if (!PostInfo) {
      Navigate("/");
    }
  });

  const line = () => {
    if (PostInfo?.title || PostInfo?.jobTitle) {
      return <hr className="line" />;
    }
  };
  const Iframe = () => {
    const renderIframe = (src) => (
      <iframe className="documentFrame" src={src}>
        <p>
          😞 sorry Document won't load, you can access it directly here{" "}
          {PostInfo.href} or click the source button
        </p>
      </iframe>
    );
    const renderElement = (content) => (
      <div className="full-details">{content}</div>
    );

    if (Array.isArray(PostInfo?.iframe) && PostInfo?.iframe?.length) {
      return renderElement(
        PostInfo?.iframe.map((src, index) => (
          <div key={index}>{renderIframe(src)}</div>
        ))
      );
    } else if (PostInfo?.iframe?.length) {
      return renderElement(renderIframe(PostInfo.iframe));
    }
  };

  return (
    <dialog open id="info-card">
      <form method="dialog">
        {PostInfo && (
          <article className="more-info">
            {PostInfo?.iconLink && (
              <img
                src={"./assets/" + PostInfo.iconLink}
                alt="agency icon"
                className="icon"
                title="agency icon"
              />
            )}
            {PostInfo?.imgSrc && (
              <img
                className="logo"
                src={PostInfo.imgSrc}
                alt="entity logo"
                loading="lazy"
              />
            )}
            <h3 className="title"> {PostInfo.jobTitle}</h3>
            <div className="header">
              {PostInfo?.title && (
                <h3> {PostInfo.title.replaceAll(/is hiring/gi, "")}</h3>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  // console.log("share");
                  Share({
                    title: `${
                      PostInfo?.title ||
                      PostInfo?.jobTitle ||
                      "Sa Youth Job Post"
                    }, more info @ Boitekong Job Board`,
                    text: "available job vacancy, might be suitable for you!",
                    url: `${location.origin}/${PostInfo.uuid}`
                  });
                }}
              >
                Share
              </button>
            </div>

            {line()}
            <br />
            {PostInfo.jobSpecFields && (
              <p className="job-field" title={PostInfo["jobSpecFields"]}>
                {PostInfo["jobSpecFields"]}
              </p>
            )}

            {PostInfo.province && (
              <h5 className="province">Province: {PostInfo.province}</h5>
            )}
            {PostInfo.location && isObject(PostInfo.location) && (
              <span>
                <h5 className="location">
                  Region: {PostInfo.location?.region?.replace(",", "")}
                </h5>
                <h5 className="location">
                  City: {PostInfo.location?.city?.replace(",", "")}
                </h5>
              </span>
            )}
            {PostInfo.location && !isObject(PostInfo.location) && (
              <h5 className="location">Location: {PostInfo.location}</h5>
            )}
            {PostInfo.expiryDate && <h5>{PostInfo.expiryDate}</h5>}
            {PostInfo.startDate && <h5> Start Date: {PostInfo.startDate}</h5>}
            {PostInfo.publishedDate && <h5>{PostInfo.publishedDate}</h5>}
            {PostInfo.vacancyType && (
              <h5>Vacancy type : {PostInfo.vacancyType}</h5>
            )}
            {PostInfo?.postedDate && (
              <>
                <h5>Date posted: {PostInfo.postedDate}</h5>

                <button className="source">
                  <a
                    href={PostInfo?.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "white" }}
                  >
                    original source
                  </a>
                </button>
              </>
            )}

            {PostInfo?.apply && (
              <a
                href={PostInfo?.apply}
                target="_blank"
                rel="noopener noreferrer"
                className="source"
                style={{
                  backgroundColor: "goldenrod",
                  width: "100px",
                  height: "20px",
                  lineHeight: "20px", // Add this
                  textAlign: "center",
                  color: "white"
                }}
              >
                apply
              </a>
            )}

            <hr className="line" />
            {PostInfo?.content?.length > 0 && (
              <>
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
            {Iframe()}
            {Array.isArray(PostInfo?.details) && (
              <div
                className="full-details"
                dangerouslySetInnerHTML={{
                  __html: PostInfo?.details?.map((p) => p)
                }}
              ></div>
            )}
            {!Array.isArray(PostInfo?.details) && (
              <>
                <div
                  className={
                    PostInfo?.summary ? "small full-details" : "full-details"
                  }
                  dangerouslySetInnerHTML={{
                    __html: PostInfo?.details?.replaceAll(
                      /\.(?=[A-Z0-9 ])/g,
                      ".<br/><br/>"
                    )
                  }}
                ></div>

                {line()}
              </>
            )}
          </article>
        )}
        <br />
        <nav className="sm-nav">
          <IoIosCloseCircle
            style={{
              color: "white",
              width: "40px",
              height: "40px",
              cursor: "pointer",
              margin: "0"
            }}
            onClick={(e) => {
              e.preventDefault();
              Navigate(`/#${PostInfo?.uuid}`);
            }}
          />
        </nav>
      </form>
    </dialog>
  );
}
