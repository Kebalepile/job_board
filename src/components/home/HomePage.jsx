import React, { useState } from 'react'
import PDFViewerIframe from '../pdf/PDFViewerIframe'
import useLoadingPlaceholder from '../../hooks/useLoadingPlaceholder'
import pdfUrls from '../../assets/pdfs/pdfUrls.json'
import minopexData from '../../assets/private/minopex.json'
import sayouthData from '../../assets/private/SA-Youth.json'
import propersonnelData from '../../assets/private/Pro-Personnel.json'
import govPagePublicData from '../../assets/public/govpage-public-sector.json'
import govPagePrivateData from '../../assets/public/govpage-private-sector.json'

import './home.css'
import './posts.css'

// Constants
const POSTS_PER_PAGE = 6

export default function HomePage () {
  const [currentPage, setCurrentPage] = useState(0)
  const [isPdfContainerLoaded] = useLoadingPlaceholder(5000)
  const [selectedPost, setSelectedPost] = useState(null)

  // All data combined for pagination calculation
  const allData = [
    ...pdfUrls.pdfUrls,
    ...minopexData.blogPosts,
    ...sayouthData.blogPosts,
    ...propersonnelData.blogPosts,
    ...govPagePublicData.blogPosts,
    ...govPagePrivateData.blogPosts
  ]

  // Total pages based on maximum length of data arrays
  const totalPages = Math.ceil(allData.length / POSTS_PER_PAGE)

  // Pagination logic
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

  const handlePostClick = post => {
    setSelectedPost(post)
  }

  const handleCloseModal = () => {
    setSelectedPost(null)
  }

  return (
    <div>
      <PdfPosts
        pdfFiles={pdfUrls.pdfUrls}
        isLoaded={isPdfContainerLoaded}
        currentPage={currentPage}
      />
      <MinoPexPosts onPostClick={handlePostClick} />
      <GovPagePosts
        data={govPagePublicData.blogPosts}
        onPostClick={handlePostClick}
      />

      <SaYouthPosts onPostClick={handlePostClick} />
      <GovPagePosts
        data={govPagePrivateData.blogPosts}
        onPostClick={handlePostClick}
      />
      <ProPersonnelPosts onPostClick={handlePostClick} />
      <div className='pagination'>
        <button onClick={handlePrevClick} disabled={currentPage === 0}>
          Previous
        </button>
        <span>
          {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={handleNextClick}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {selectedPost && (
        <div className='modal' onClick={handleCloseModal}>
          <div className='modal-content' onClick={e => e.stopPropagation()}>
            <span className='close' onClick={handleCloseModal}>
              &times;
            </span>
            <div className='modal-body'>
              <img
                src={selectedPost.imgSrc || selectedPost.iconLink}
                alt='company logo'
              />
              <h2>{selectedPost.title || selectedPost.jobTitle}</h2>

              <div
                className='details'
                dangerouslySetInnerHTML={{
                  __html: selectedPost?.details
                    ? selectedPost.details
                    : formatDetails(selectedPost?.content || '')
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const formatDetails = contentArray => {
  // Check if contentArray is an array and not empty
  if (Array.isArray(contentArray) && contentArray.length > 0) {
    // Join the array items into a single string with appropriate HTML tags
    return contentArray
      .map(item => {
        // Replace periods with <br/>
        const formattedItem = item.replace(/\./g, '.<br/><br/>')

        // Replace newlines with paragraph breaks
        return formattedItem.replace(/\n\n/g, '</p><p>')
      })
      .join('') // Join all formatted strings into a single HTML string
  }
  return '' // Return an empty string if contentArray is not valid
}

function MinoPexPosts ({ onPostClick }) {
  const posts = minopexData.blogPosts
  return renderPosts(posts, onPostClick)
}

function SaYouthPosts ({ onPostClick }) {
  const posts = sayouthData.blogPosts
  return renderPosts(posts, onPostClick)
}

function ProPersonnelPosts ({ onPostClick }) {
  const posts = propersonnelData.blogPosts
  return renderPosts(posts, onPostClick)
}

function GovPagePosts ({ data, onPostClick }) {
  return renderPosts(data, onPostClick)
}

function PdfPosts ({ pdfFiles, isLoaded, currentPage }) {
  return (
    <section id='pdf-posts'>
      {isLoaded ? (
        <div className='pdf-container'>
          <PDFViewerIframe file={pdfFiles[currentPage]} />
        </div>
      ) : (
        <div className='placeholder pdf-container-placeholder'></div>
      )}
    </section>
  )
}

function renderPosts (posts, onClick) {
  if (posts.length) {
    return (
      <section>
        {posts.map((p, i) => (
          <article className='job-post' key={i} onClick={() => onClick(p)}>
            <div className='company-logo'>
              <img
                loading='lazy'
                src={p.imgSrc || p.iconLink}
                alt='company logo'
              />
            </div>
            <p className='title'>{p?.title || p?.jobTitle}</p>
            <div
              className='summary'
              dangerouslySetInnerHTML={{ __html: p?.details || p?.content }}
            />
          </article>
        ))}
      </section>
    )
  }
  return <></>
}
