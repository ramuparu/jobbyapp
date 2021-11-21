import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: '', showError: true}

  whenUserEnterUsername = event => {
    this.setState({username: event.target.value})
  }

  whenUserEnterPassword = event => {
    this.setState({password: event.target.value})
  }

  whenUserCredentialsSuccess = jwt => {
    const {history} = this.props
    Cookies.set('jwt_token', jwt, {expires: 30})
    history.replace('/')
  }

  whenCredentialsMismatch = errorMsg => {
    this.setState({showError: false, errorMsg})
  }

  renderUserLoginComponent = async event => {
    event.preventDefault()
    const {username, password} = this.state

    const userCredentials = {
      username,
      password,
    }

    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userCredentials),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.whenUserCredentialsSuccess(data.jwt_token)
    } else {
      this.whenCredentialsMismatch(data.error_msg)
    }
  }

  render() {
    const {username, password, showError, errorMsg} = this.state

    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="jobby-app-page">
        <div className="jobby-app-login_page">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="jobby_logo_style"
          />
          <form className="form_style" onSubmit={this.renderUserLoginComponent}>
            <div className="username_card">
              <label className="username_label_style" htmlFor="userName">
                USERNAME
              </label>
              <input
                type="text"
                id="userName"
                onChange={this.whenUserEnterUsername}
                className="username_input_style"
                placeholder="Username"
                value={username}
              />
            </div>
            <div className="password_card">
              <label className="password_label_style" htmlFor="password">
                PASSWORD
              </label>
              <input
                type="password"
                id="password"
                onChange={this.whenUserEnterPassword}
                className="password_input_style"
                placeholder="Password"
                value={password}
              />
            </div>
            <button className="login_btn_style" type="submit">
              Login
            </button>
            {showError ? (
              ''
            ) : (
              <p className="error_msg_style">{`*${errorMsg}`}</p>
            )}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
