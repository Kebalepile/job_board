import { useContext } from "react";
import JobBoardContext from "../contexts/jobBoard/context";

export default function Opportunity() {
  const { PostInfo } = useContext(JobBoardContext);

  return (
    <>
      {PostInfo && (
        <div className="info-card">
          
          <article className="more-info">{JSON.stringify(PostInfo)}</article>
        </div>
      )}
    </>
  );
}
