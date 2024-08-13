import React, { useEffect, useState } from 'react'
import PDFViewerIframe from '../pdf/PDFViewerIframe'
import { getPdfTitle } from '../../utils/getPdfTitle'
import './home.css'

export default function HomePage () {
  const pdfFiles = [
    {
      file: '/assets/pdfs/PANEL-OF-EXECUTIVE-MANAGING-AGENTS-ADVERT-FINAL.pdf'
    },
    {
      file: "/assets/pdfs/ARMC_Members_x2(Aug'24).pdf"
    },
    {
      file: '/assets/pdfs/Advert_Junior_Compliance_Analyst_Aug_2024.pdf'
    }
  ]

  return (
    <div>
      <h1>Vacancies</h1>
      <div className='pdf-container'>
        {pdfFiles.map((pdf, index) => (
          <div key={index} className='pdf-viewer-iframe'>
            <PDFViewerIframe file={pdf.file} />
          </div>
        ))}
      </div>
    </div>
  )
}
