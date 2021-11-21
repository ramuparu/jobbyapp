import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FcRating} from 'react-icons/fc'

import {FaMapMarkerAlt} from 'react-icons/fa'
import Header from '../Header/index'

import './index.css'

const apiStatusObj = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobDetails extends Component {
  state = {
    similarJobData: [],
    jobDetailsData: {},
    skillsList: [],
    apiStatus: apiStatusObj.initial,
  }

  componentDidMount() {
    this.renderJobDetails()
  }

  renderJobDetails = async () => {
    this.setState({apiStatus: apiStatusObj.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()

      const jobKeysChangedData = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
        lifeImageUrl: data.job_details.life_at_company.image_url,
        description: data.job_details.life_at_company.description,
      }
      console.log(data.job_details)

      const skillsChange = data.job_details.skills.map(eachSkill => ({
        imageUrl: eachSkill.image_url,
        name: eachSkill.name,
      }))

      this.setState({
        skillsList: skillsChange,
        jobDetailsData: jobKeysChangedData,
        apiStatus: apiStatusObj.success,
      })
    } else {
      this.setState({apiStatus: apiStatusObj.failure})
    }
  }

  whenJobDetailsRetry = () => {
    this.renderJobDetails()
  }

  renderFailureView = () => (
    <div className="failure_con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure_img"
      />
      <h1 className="oops_para">Oops! Something Went Wrong</h1>
      <p className="failure_para">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="failure_retry_btn"
        type="button"
        onClick={this.whenJobDetailsRetry}
      >
        Retry
      </button>
    </div>
  )

  renderInprogressView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSuccessView = () => {
    const {skillsList, jobDetailsData} = this.state
    const {similarJobs} = jobDetailsData

    console.log(similarJobs)
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      lifeImageUrl,
      description,
      title,
    } = jobDetailsData

    return (
      <div className="job_details_page">
        <Header />
        <div className="jobs_list_con">
          <div className="jobs_list_card">
            <div className="company_logo_con">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
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
            <div className="description_card">
              <h1 className="description_style">Description</h1>
              <a href={companyWebsiteUrl} className="link_style">
                <p>Visit</p>
              </a>
            </div>
            <p className="description_para_style">{jobDescription}</p>
            <h1 className="skills_style">Skills</h1>
            <ul className="skills_unlist_card">
              {skillsList.map(eachSkill => (
                <li className="skills_list_card" key={eachSkill.name}>
                  <img
                    src={eachSkill.imageUrl}
                    alt={eachSkill.name}
                    className="skill_img_style"
                  />
                  <p className="skills_para">{eachSkill.name}</p>
                </li>
              ))}
            </ul>
            <h1 className="life_style">Life at Company</h1>
            <div className="life_card">
              <p className="life_para_style">{description}</p>

              <img
                src={lifeImageUrl}
                alt="life at company"
                className="life_img_style"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusObj.inProgress:
        return this.renderInprogressView()
      case apiStatusObj.failure:
        return this.renderFailureView()
      case apiStatusObj.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }
}

export default JobDetails
