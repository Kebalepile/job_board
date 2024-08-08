import React, { useContext } from 'react'

import { useNavigate } from 'react-router-dom'
import isObject from '../../utils/isObject'
import { IoIosCloseCircle } from 'react-icons/io'

import JobBoardContext from '../../contexts/jobBoard/context'

function useNavigation () {
  const navigateTo = useNavigate()
  function navigate (path) {
    navigateTo(path)
  }
  return navigate
}
export default function JobBoard () {
  const { PublicJobs, PrivateJobs, OtherPrivateJobs, AgencyIcons, ReadMore } =
    useContext(JobBoardContext)
  /**
   * @descrption change current path to given path arguement
   *@param {string} path
   */

  const Navigate = useNavigation()
  /**
   *
   * @param {object} event
   * @param {object} data
   * @description nevigates to opportunity compoent , where more info about
   * post clicked on is shown.
   */
  const HandleClick = (event, data) => {
    event.preventDefault()
    ReadMore(data)
    Navigate('/post_information')
  }

  /**
   *
   * @param {array} blogPosts
   * @description compiles blog posts compoenet using the blogpost parameter
   * @returns blog posts component
   */
  const Posts = blogPosts => {
    return (
      <section className='scroll-posts'>
        {blogPosts.map((p, i) => {
          return (
            <article
              className='job-post'
              id={p?.uuid}
              key={i}
              title={p.title}
              onClick={e => {
                HandleClick(e, p)
              }}
            >
              <div className='company-logo'>
                <img loading='lazy' src={p.imgSrc} alt='company logo' />
              </div>
              <p className='title'>{p.title}</p>
            </article>
          )
        })}
      </section>
    )
  }

  /**
   * @description Sets the header content for job post section
   */
  const sectionHeader = content => {
    return (
      <>
        <hr />
        <h3 className='i'>{content}</h3>
        <hr />
        <br />
      </>
    )
  }
  return (
    <dialog open id='board'>
      <form>
        {PublicJobs().blogPosts.length > 0 && (
          <>
            {sectionHeader('Government Departments / Entites with Vacancies')}
            {Posts(PublicJobs().blogPosts)}
          </>
        )}

        {PrivateJobs().blogPosts.length > 0 && (
          <>
            <br />
            {sectionHeader('Private Companies Hiring')}
            {Posts(PrivateJobs().blogPosts)}
          </>
        )}

        {sectionHeader(
          'Private Jobs from other companies (which may be smaller or not that famous)'
        )}

        <section className='icons i'>
          {AgencyIcons.map((icon, i) => {
            return (
              <img
                key={i}
                src={icon.src}
                title={icon.title}
                alt={icon.title}
                className='agency-icon'
              />
            )
          })}
        </section>
        <h3 />
        <hr />
        <section className='posts'>
          {OtherPrivateJobs().map((p, i) => {
            if (p?.summary) {
              return (
                <article id={p?.uuid} className='sa-youth' key={i}>
                  {p?.jobTitle}
                  <img
                    src={'./assets/' + p.iconLink}
                    alt='agency icon'
                    className='icon'
                    title='agency icon'
                    style={{ boarderRadius: '4px' }}
                  />
                  {p?.summary && (
                    <span
                      dangerouslySetInnerHTML={{ __html: p.summary }}
                    ></span>
                  )}
                  <hr />
                  <br />
                  <button
                    className='read-more'
                    onClick={e => {
                      HandleClick(e, p)
                    }}
                  >
                    Read More
                  </button>
                </article>
              )
            }

            return (
              <article className='post' key={i}>
                <h3 className='title'> {p?.jobTitle}</h3>
                <br /> <hr />
                <section className='post-summary'>
                  <img
                    src={'./assets/' + p.iconLink}
                    alt='agency icon'
                    className='icon'
                    title='agency icon'
                  />
                  <br />
                  {p?.jobSpecFields && (
                    <p className='job-field' title={p['jobSpecFields']}>
                      {p['jobSpecFields']}
                    </p>
                  )}
                  <br />
                  {p?.province && (
                    <h5 className='province'>Province: {p.province}</h5>
                  )}
                  {p?.location && isObject(p.location) && (
                    <span>
                      <h5 className='location'>
                        Region: {p.location?.region?.replace(',', '')}
                      </h5>
                      <h5 className='location'>
                        City: {p.location?.city?.replace(',', '')}
                      </h5>
                    </span>
                  )}
                  {p?.location && !isObject(p.location) && (
                    <h5 className='location'>Location: {p.location}</h5>
                  )}
                  {p?.expiryDate && <h5>{p.expiryDate}</h5>}
                  {p?.startDate && <h5> Start Date: {p.startDate}</h5>}
                  {p?.publishedDate && <h5>{p.publishedDate}</h5>}
                  {p?.vacancyType && <h5>Vacancy type : {p.vacancyType}</h5>}
                  <br />
                  <section className='details'>
                    {Array.isArray(p.details) && (
                      <div
                        className='short-detail'
                        dangerouslySetInnerHTML={{ __html: p.details[1] }}
                      ></div>
                    )}
                    {/* p.details.replaceAll(/\.(?=[A-Z0-9 ])/g, ".<br/><br/>") */}
                    {!Array.isArray(p.details) && (
                      <div
                        className='snippet'
                        dangerouslySetInnerHTML={{ __html: p.details }}
                      ></div>
                    )}
                  </section>
                </section>
                <br />
                <hr />
                <br />
                <button
                  className='read-more'
                  onClick={e => {
                    HandleClick(e, p)
                  }}
                >
                  Read More
                </button>
              </article>
            )
          })}
        </section>
        <br />

        <nav className='sm-nav'>
          <IoIosCloseCircle
            style={{
              color: 'white',
              width: '40px',
              height: '40px',
              cursor: 'pointer'
            }}
            onClick={e => {
              e.preventDefault()
              Navigate('/')
            }}
          />
        </nav>
      </form>
    </dialog>
  )
}
