import './index.css'

const FailureView = props => {
  const {whenRetryButtonPress} = props
  const userPressRetry = () => {
    whenRetryButtonPress()
  }

  return (
    <div className="failure_con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="img_style"
      />
      <h1 className="oops_head">Oops! Something Went Wrong</h1>
      <p className="failure_para_big">
        We cannot seem to find the page you are looking for.
      </p>
      <button className="retry_btn" type="button" onClick={userPressRetry}>
        Retry
      </button>
    </div>
  )
}

export default FailureView
