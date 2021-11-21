import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header/index'
import FailureView from '../FailureView/index'
import JobsSuccess from '../JobsSuccess/index'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusObj = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    searchInput: '',
    userProfileData: {},
    profileFailure: false,
    jobsFailure: false,
    userJobsData: [],
    employmentFilter: [],
    salaryInput: '',
    jobsApiStatus: apiStatusObj.initial,
    profileApiStatus: apiStatusObj.initial,
    employmentCategory: '',
  }

  componentDidMount() {
    this.renderJobsComponent()
    this.renderProfileComponent()
  }

  whenUserSearchJobs = event => {
    this.setState({searchInput: event.target.value})
  }

  whenUserClicksSearchButton = () => this.renderJobsComponent()

  whenUserClicksSalaryRange = event => {
    this.setState({salaryInput: event.target.value}, this.renderJobsComponent)
  }

  whenUserStateChanges = event => {
    this.setState({employmentCategory: event})
  }

  whenUserSelectEmploymentType = event => {
    this.whenUserStateChanges(event.target.value)

    this.setState(
      prevState => ({
        employmentFilter: [...prevState.employmentFilter, event.target.value],
      }),
      this.renderJobsComponent,
    )
  }

  renderProfileComponent = async () => {
    this.setState({profileApiStatus: apiStatusObj.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const profileData = await response.json()

      const changedProfileKeysFormat = {
        name: profileData.profile_details.name,
        profileImageUrl: profileData.profile_details.profile_image_url,
        shortBio: profileData.profile_details.short_bio,
      }
      this.setState({
        userProfileData: changedProfileKeysFormat,
        profileApiStatus: apiStatusObj.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusObj.failure})
    }
  }

  renderJobsComponent = async () => {
    this.setState({jobsApiStatus: apiStatusObj.inProgress})
    const {
      employmentFilter,
      searchInput,
      salaryInput,
      employmentCategory,
    } = this.state

    const slicingElements = employmentFilter.slice(
      0,
      employmentFilter.length - 1,
    )
    if (employmentFilter.length >= 2) {
      const findingElements = slicingElements.includes(employmentCategory)

      if (findingElements) {
        const findingIndexValue = employmentFilter.indexOf(employmentCategory)
        employmentFilter.splice(findingIndexValue, 1)
        employmentFilter.splice(employmentFilter.length - 1, 1)
        this.setState({
          employmentFilter,
        })
      } else {
        this.setState({employmentFilter})
      }
    }

    const employmentApiQueryValues = employmentFilter.join(',')
    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentApiQueryValues}&minimum_package=${salaryInput}&search=${searchInput}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const jobsData = await response.json()

      const changedJobsKeysFormat = jobsData.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))

      this.setState({
        userJobsData: changedJobsKeysFormat,
        jobsApiStatus: apiStatusObj.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusObj.failure})
    }
  }

  whenUserPressProfileRetry = () => {
    this.renderProfileComponent()
  }

  renderProfileFailureView = () => (
    <div className="failure_card">
      <button
        className="failure_para"
        type="button"
        onClick={this.whenUserPressProfileRetry}
      >
        Retry
      </button>
    </div>
  )

  whenRetryButtonPress = () => {
    this.renderJobsComponent()
  }

  renderJobsFailureView = () => (
    <FailureView whenRetryButtonPress={this.whenRetryButtonPress} />
  )

  renderProfileComponentsView = () => {
    const {userProfileData, profileFailure} = this.state
    const {name, profileImageUrl, shortBio} = userProfileData
    return (
      <>
        {profileFailure ? (
          this.renderFailureView()
        ) : (
          <div className="profile_card">
            <img
              src={profileImageUrl}
              alt="profile"
              className="profile_img_style"
            />
            <h1 className="profile_head">{name}</h1>
            <p className="profile_para">{shortBio}</p>
          </div>
        )}
      </>
    )
  }

  renderJobDataComponentsView = () => {
    const {userJobsData, jobsFailure} = this.state
    const renderUserElementsData = () =>
      userJobsData.length >= 1 ? (
        <ul className="jobs_unlisted_card">
          {userJobsData.map(eachItem => (
            <JobsSuccess key={eachItem.id} userJobs={eachItem} />
          ))}
        </ul>
      ) : (
        <div className="no_jobs_failure_con">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no_jobs_img_style"
          />
          <h1 className="no_jobs_head">No Jobs Found</h1>
          <p className="no_jobs_para">
            We could not find any jobs. Try other filters.
          </p>
        </div>
      )
    return <>{jobsFailure ? '' : renderUserElementsData()}</>
  }

  renderSuccessView = () => {
    const {searchInput} = this.state

    return (
      <div className="jobs_page">
        <Header />

        <div className="jobs_details_con">
          <div className="sidebar_con">
            <div className="small_input_card">
              <input
                type="search"
                placeholder="Search"
                className="input_style"
                onChange={this.whenUserSearchJobs}
                value={searchInput}
              />
              <button
                type="button"
                testid="searchButton"
                className="search_btn_style"
                onClick={this.whenUserClicksSearchButton}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>

            {this.renderProfileComponents()}
            <hr className="line_style" />
            <div className="">
              <h1 className="radio_heading_style">Type of Employment</h1>
              <ul className="unlist_employment_type">
                {employmentTypesList.map(eachType => (
                  <li
                    className="radio_list_style"
                    key={eachType.employmentTypeId}
                  >
                    <input
                      type="checkbox"
                      name="employment"
                      id={eachType.employmentTypeId}
                      onChange={this.whenUserSelectEmploymentType}
                      value={eachType.employmentTypeId}
                    />

                    <label
                      htmlFor={eachType.employmentTypeId}
                      className="label_style"
                    >
                      {eachType.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <hr className="line_style" />
            <div className="">
              <h1 className="radio_heading_style">Salary Range</h1>
              <ul className="unlist_employment_type">
                {salaryRangesList.map(eachType => (
                  <li className="radio_list_style" key={eachType.salaryRangeId}>
                    <input
                      type="radio"
                      name="employment"
                      id={eachType.salaryRangeId}
                      onChange={this.whenUserClicksSalaryRange}
                      value={eachType.salaryRangeId}
                    />
                    <label
                      htmlFor={eachType.salaryRangeId}
                      className="label_style"
                    >
                      {eachType.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="job_description_con">
            <div className="big_input_card">
              <input
                type="search"
                placeholder="Search"
                className="input_style"
                onChange={this.whenUserSearchJobs}
                value={searchInput}
              />
              <button
                type="button"
                testid="searchButton"
                className="search_btn_style"
                onClick={this.whenUserClicksSearchButton}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobDataComponents()}
          </div>
        </div>
      </div>
    )
  }

  renderLoaderView = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileComponents = () => {
    const {profileApiStatus} = this.state
    switch (profileApiStatus) {
      case apiStatusObj.inProgress:
        return this.renderLoaderView()
      case apiStatusObj.success:
        return this.renderProfileComponentsView()
      case apiStatusObj.failure:
        return this.renderProfileFailureView()

      default:
        return null
    }
  }

  renderJobDataComponents = () => {
    const {jobsApiStatus} = this.state
    switch (jobsApiStatus) {
      case apiStatusObj.inProgress:
        return this.renderLoaderView()
      case apiStatusObj.success:
        return this.renderJobDataComponentsView()
      case apiStatusObj.failure:
        return this.renderJobsFailureView()
      default:
        return null
    }
  }

  render() {
    return <>{this.renderSuccessView()}</>
  }
}

export default Jobs
