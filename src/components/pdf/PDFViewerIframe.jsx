import React, { useState, useEffect, useRef } from 'react';
import usePdfIframe from '../../hooks/usePdfIframe';
import useLoadingPlaceholder from '../../hooks/useLoadingPlaceholder';
import './pdf_viewer.css';

const PDFViewerIframe = ({ file }) => {
  const iframeUrl = usePdfIframe(file);
  const [isFullView, setIsFullView] = useState(false);
  const [isPdfContainerViewerLoaded] = useLoadingPlaceholder(5000);
  const iframeRef = useRef(null);

  const toggleView = () => setIsFullView(!isFullView);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      const handleLoad = () => {
        const iframeDocument = iframe.contentWindow.document;
        const embedElement = iframeDocument.querySelector('body > embed');
        if (embedElement) {
          embedElement.style.overflow = 'scroll'; // Allow scrolling
          embedElement.style.scrollbarWidth = 'none'; // For Firefox
          embedElement.style.webkitScrollbar = 'none'; // For WebKit browsers
        }
      };

      iframe.addEventListener('load', handleLoad);

      // Cleanup
      return () => {
        iframe.removeEventListener('load', handleLoad);
      };
    }
  }, [iframeUrl]);

  return (
    <div className={`pdf-viewer-container ${isFullView ? 'full-view' : 'min-view'}`}>
      <button className="toggle-view-btn" onClick={toggleView}>
        {isFullView ? 'Minimize View' : 'Full View'}
      </button>
      {isPdfContainerViewerLoaded ? (
        iframeUrl ? (
          <iframe
            ref={iframeRef}
            src={iframeUrl}
            className="pdf-viewer-iframe"
            title="PDF Viewer"
          />
        ) : (
          <p>Loading...</p>
        )
      ) : (
        <div className='placeholder pdf-viewer-container-placeholder'></div>
      )}
    </div>
  );
};

export default PDFViewerIframe;
