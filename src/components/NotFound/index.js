import './index.css'

const NotFound = () => (
  <div className="notFound_card">
    <img
      src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
      alt="not found"
      className="notFound_img_style"
    />
    <h1 className="page_para1">Page Not Found</h1>
    <p className="page_para2">
      we’re sorry, the page you requested could not be found
    </p>
  </div>
)

export default NotFound
