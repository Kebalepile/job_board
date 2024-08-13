import { useState, useEffect } from "react";

const usePdfIframe = (fileUrl) => {
  const [iframeUrl, setIframeUrl] = useState("");

  useEffect(() => {
    if (fileUrl) {
      setIframeUrl(fileUrl);
    }
  }, [fileUrl]);

  return iframeUrl;
};

export default usePdfIframe;
