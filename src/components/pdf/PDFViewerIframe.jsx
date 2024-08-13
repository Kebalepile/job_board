import React from 'react';
import usePdfIframe from '../../hooks/usePdfIframe';
import './pdf_viewer.css'; 

const PDFViewerIframe = ({ file }) => {
  const iframeUrl = usePdfIframe(file);

  return (
    <div className="pdf-viewer-container">
      {iframeUrl ? (
        <iframe
          src={iframeUrl}
          className="pdf-viewer-iframe"
          title="PDF Viewer"
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PDFViewerIframe;
