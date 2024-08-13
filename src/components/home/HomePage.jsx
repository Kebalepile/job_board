import React from 'react'
import PDFViewerIframe from '../pdf/PDFViewerIframe'
import pdfUrls from '../../assets/pdfs/pdfUrls.json'
import './home.css'

export default function HomePage () {
  const pdfFiles = pdfUrls.pdfUrls

  return (
    <div>
      <h1>Vacancies</h1>
      <div className='pdf-container'>
        {pdfFiles.map((url, index) => (
          <div key={index} className='pdf-viewer-iframe'>
            <PDFViewerIframe file={url} />
          </div>
        ))}
      </div>
    </div>
  )
}
