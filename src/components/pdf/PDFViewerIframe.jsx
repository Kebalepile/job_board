import React, { useState, useEffect } from 'react';
import usePdfIframe from '../../hooks/usePdfIframe';
import useLoadingPlaceholder from '../../hooks/useLoadingPlaceholder';
import './pdf_viewer.css';

const PDFViewerIframe = ({ file }) => {
  const iframeUrl = usePdfIframe(file);
  const [isFullView, setIsFullView] = useState(false);
  const [isPdfContainerViewerLoaded] = useLoadingPlaceholder(5000);

  const toggleView = () => setIsFullView(!isFullView);

  return (
    <div className={`pdf-viewer-container ${isFullView ? 'full-view' : 'min-view'}`}>
      <button className="toggle-view-btn" onClick={toggleView}>
        {isFullView ? 'Minimize View' : 'Full View'}
      </button>
      {isPdfContainerViewerLoaded ? (
        iframeUrl ? (
          <iframe
            src={iframeUrl}
            className="pdf-viewer-iframe"
            title="PDF Viewer"
          />
        ) : (
          <p>Loading...</p>
        )
      ) : (
        <div className="placeholder pdf-viewer-container-placeholder"></div>
      )}
    </div>
  );
};

export default PDFViewerIframe;
