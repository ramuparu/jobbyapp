import {Link} from 'react-router-dom'
import Header from '../Header/index'
import './index.css'

const Home = () => (
  <div className="home_page">
    <Header />
    <div className="home_content_card">
      <h1 className="home_content_head">Find The Job That Fits Your Life</h1>
      <p className="home_content_para">
        Millions of people are searching for jobs,salary information,company
        reviews.Find the job that fits your abilities and potential.
      </p>
      <Link to="/jobs">
        <button className="home_content_btn_style" type="button">
          Find Jobs
        </button>
      </Link>
    </div>
  </div>
)

export default Home
