import {Link} from 'react-router-dom'
import {FcRating} from 'react-icons/fc'

import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FaMapMarkerAlt} from 'react-icons/fa'
import './index.css'

const JobsSuccess = props => {
  const {userJobs} = props
  const {
    title,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    id,
  } = userJobs
  return (
    <Link to={`/jobs/${id}`} className="nav_link_style">
      <li className="jobs_list_card">
        <div className="company_logo_con">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company_logo_img"
          />
          <div className="title_rating_card">
            <h1 className="title_style">{title}</h1>
            <div className="rating_card">
              <FcRating />
              <p className="rating_para_style">{rating}</p>
            </div>
          </div>
        </div>
        <div className="location_intern_con">
          <div className="location_intern_card">
            <div className="location_card">
              <FaMapMarkerAlt />
              <p className="location_para">{location}</p>
            </div>
            <div className="intern_card">
              <BsFillBriefcaseFill />
              <p className="location_para">{employmentType}</p>
            </div>
          </div>
          <p className="package_style">{packagePerAnnum}</p>
        </div>
        <hr className="line_style" />
        <h1 className="description_style">Description</h1>
        <p className="description_para_style">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobsSuccess
