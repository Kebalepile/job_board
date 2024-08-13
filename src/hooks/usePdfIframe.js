import { useState } from "react";

const usePdfIframe = fileUrl => {
  const [iframeUrl, setIframeUrl] = useState("");

  useState(
    () => {
      if (fileUrl) {
        setIframeUrl(fileUrl);
      }
    },
    [fileUrl]
  );

  return iframeUrl;
};

export default usePdfIframe;
