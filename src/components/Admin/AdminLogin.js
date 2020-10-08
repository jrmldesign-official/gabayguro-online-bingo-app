import React from 'react';
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://binggo-test.dokyumento.asia/index.php/',
  headers: {
      "Content-Type": "application/x-www-form-urlencoded"
  },
});

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      error: '',
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.dismissError = this.dismissError.bind(this);
  }

  dismissError() {
    this.setState({ error: '' });
  }

  handleSubmit(evt) {
    evt.preventDefault();

    if (!this.state.name) {
      return this.setState({ error: 'Username is required' });
    }

    if (!this.state.email) {
      return this.setState({ error: 'Password is required' });
    }


    API.post(`Useraccounts/authenticate_admin`, {
      username_or_email: this.state.name,
      password: this.state.email
    }).then(res => {
        if(res.data.status === "SUCCESS"){
          localStorage.setItem("user_id", res.data.payload.user_id)
          window.location.href = "/admin-dashboard"
        }
    }).catch(err => {
        console.log(err)
    });

    return this.setState({ error: '' });
  }

  handleUserChange(evt) {
    this.setState({
      name: evt.target.value,
    });
  };

  handleEmailChange(evt) {
    this.setState({
      email: evt.target.value,
    });
  }  

  render() {
    return (
      <div className="container-fluid">
        <div id="login-body" className="row justify-content-center">
            <div className="col-10 col-sm-6 col-md-5 col-xl-3 pos-relative">
              <div id="gg-login-container" className="card rounded-0 border-0 shadow p-3">

                  <h3 className="mb-3 mt-3 text-center" style={{ fontWeight: 700 }}>ADMIN</h3>

                  <form className="row" onSubmit={this.handleSubmit}>
                  {
                  this.state.error &&
                  <h3 data-test="error" onClick={this.dismissError}>
                    <button onClick={this.dismissError}>✖</button>
                    {this.state.error}
                  </h3>
                }
                    <div className="col-12">
                      <div className="form-group">
                      <label htmlFor="exampleInputEmail1" className="small gg-text">Name</label>
                      <input type="text" name="name" className="form-control custorm-form-login" id="gg-username" value={this.state.name} onChange={this.handleUserChange}/>
                      <small id="emailHelp" className="form-text text-muted d-none"></small>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                      <label htmlFor="exampleInputEmail1" className="small gg-text float-left">Password</label> <a href="#!" className="small float-right d-none">Forgot password?</a>
                      <input type="password" name="email" className="form-control custorm-form-login" id="gg-password" value={this.state.email} onChange={this.handleEmailChange}/>
                      <small id="emailHelp" className="form-text text-muted d-none"></small>
                      </div>
                    </div>
                    <div className="col-12 mt-2">
                      <button type="submit" className="btn gg-bg text-white btn-block">Log in</button>
                    </div>
                  </form>
                  
              </div>
            </div>
        </div>
      </div>
    )
  }
}