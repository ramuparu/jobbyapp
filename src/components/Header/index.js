import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsFillHouseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'
import {FcBusiness} from 'react-icons/fc'

import './index.css'

const Header = props => {
  const {history} = props

  const logoutButtonPressed = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav_card">
      <Link to="/" className="nav_link_style">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="website_logo"
        />
      </Link>
      <ul className="unlist_style_small">
        <li className="list_style">
          <Link to="/" className="nav_link_style">
            <BsFillHouseFill className="icons_style" />
          </Link>
        </li>
        <li className="list_style">
          <Link to="/jobs" className="nav_link_style">
            <FcBusiness className="icons_style" />
          </Link>
        </li>
        <li className="list_style" onClick={logoutButtonPressed}>
          <Link to="/login" className="nav_link_style">
            <FiLogOut className="icons_style" />
          </Link>
        </li>
      </ul>
      <ul className="unlist_style_big">
        <li className="list_style_big">
          <Link to="/" className="nav_link_style">
            <p className="para_style">Home</p>
          </Link>
        </li>
        <li className="list_style_big">
          <Link to="/jobs" className="nav_link_style">
            <p className="para_style">Jobs</p>
          </Link>
        </li>
      </ul>
      <button
        className="logout_btn_style"
        type="button"
        onClick={logoutButtonPressed}
      >
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
