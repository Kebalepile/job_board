import React, { useState } from 'react'
import PDFViewerIframe from '../pdf/PDFViewerIframe'
import useLoadingPlaceholder from '../../hooks/useLoadingPlaceholder'
import pdfUrls from '../../assets/pdfs/pdfUrls.json'
import './home.css'

export default function HomePage () {
  const pdfFiles = pdfUrls.pdfUrls
  const [currentPage, setCurrentPage] = useState(0)
  const [isPdfContainerLoaded] = useLoadingPlaceholder(5000)

  const totalPages = pdfFiles.length

  const handlePrevClick = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextClick = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }


  return (
    <div>
      <h1>Vacancies</h1>
      {isPdfContainerLoaded ? (
        <div className='pdf-container'>
          <div className='pdf-viewer-iframe'>
            <PDFViewerIframe file={pdfFiles[currentPage]} />
          </div>
        </div>
      ) : (
        <div className='placeholder pdf-container-placeholder'></div>
      )}

      <div className='pagination'>
        <button onClick={handlePrevClick} disabled={currentPage === 0}>
          Previous
        </button>
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={handleNextClick}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  )
}
