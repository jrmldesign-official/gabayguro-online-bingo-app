import React from 'react';
import axios from 'axios';

export default class Login extends React.Component {

  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      contact: '',
      error: '',
      errorName: '',
      errorEmail: '',
      errorContact: '',
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleContactChange = this.handleContactChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {

    if(this.props.match.params.pathParam1 === undefined){
      this.setState({ name: '' })
    }else{
      this.setState({ name:this.props.match.params.pathParam1 })
    }
    
    if(this.props.match.params.pathParam2 === undefined){
      this.setState({ email: '' })
    }else{
      this.setState({ email:this.props.match.params.pathParam2 })
    }

    if(this.props.match.params.pathParam3 === undefined){
      this.setState({ contact: '' })
    }else{
      this.setState({ contact:this.props.match.params.pathParam3 })
    }

    if(this.props.match.params.pathParam1 !== undefined && this.props.match.params.pathParam2 !== undefined && this.props.match.params.pathParam3 !== undefined){
      setTimeout(function(){
        document.querySelector("#btnLogin").click()
      },500)
    }else if(localStorage.user_id === undefined || localStorage.user_id === "undefined"){
      localStorage.clear();
    }else{
      window.location.href = "/bingo";
    }
  }

  handleSubmit(evt) {
    evt.preventDefault();

    if (!this.state.name) {
      this.setState({ errorName: 'Fullname is required' });
      document.getElementById("gg-username").classList.add("is-invalid");
    }else{
      this.setState({ errorName: '' });
      document.getElementById("gg-username").classList.remove("is-invalid");
    }

    if (!this.state.email) {
      this.setState({ errorEmail: 'Email is required' });
      document.getElementById("gg-email").classList.add("is-invalid");
    }else{
      this.setState({ errorEmail: '' });
      document.getElementById("gg-email").classList.remove("is-invalid");
    }

    if (!this.state.contact) {
      this.setState({ errorContact: 'Contact no. is required' });
      document.getElementById("gg-contact").classList.add("is-invalid");
    }else{
      this.setState({ errorContact: '' });
      document.getElementById("gg-contact").classList.remove("is-invalid");
    }

    const user = {
      name: this.state.name,
      email: this.state.email,
      contact: this.state.contact
    };

    if(this.state.name.length === 0 || this.state.email.length === 0 || this.state.contact.length === 0){
    }else{
      axios.post(`https://binggo-test.dokyumento.asia/index.php/Useraccounts/authenticate/?name=${user.name}&email=${user.email}&contact_no=${user.contact}`)
        .then(res => {
          console.log(res)
          if(res.data.status === "Success"){
            localStorage.setItem("user_id", res.data.payload[0].user_id)
            window.location.href = "/bingo"
          }else{

          }
        })
    }

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

  handleContactChange(evt) {
    this.setState({
      contact: evt.target.value,
    });
  }  

  render() {
    return (
      <div className="container-fluid">
        <div id="login-body" className="row justify-content-center">
            <div className="col-10 col-sm-6 col-md-5 col-xl-4 pos-relative">
              <div id="gg-login-container" className="card rounded-0 border-0 shadow p-3">
                  <a href="/register" className="small text-right mb-3 d-none">Register here</a>

                  <a href="/login" className="mb-5 mr-auto">
                  <img src="https://www.gabayguro.com/wp-content/uploads/2018/09/cropped-gabayguro-favicon-1-32x32.png" alt="logo" style={{ width: 1.5+'rem' }} />
                  </a>

                  <form className="row" onSubmit={this.handleSubmit}>
                    <div className="col-12">
                      <div className="form-group">
                      <label htmlFor="exampleInputEmail1" className="small gg-text">Name</label>
                      <input type="text" name="name" className="form-control custorm-form-login" id="gg-username" value={this.state.name} onChange={this.handleUserChange}/>
                      <small className="form-text text-danger">{this.state.errorName}</small>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                      <label htmlFor="exampleInputEmail1" className="small gg-text float-left">Email</label> 
                      <a href="#!" className="small float-right d-none">Forgot password?</a>
                      <input type="text" name="email" className="form-control custorm-form-login" id="gg-email" value={this.state.email} onChange={this.handleEmailChange}/>
                      <small className="form-text text-danger">{this.state.errorEmail}</small>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                      <label htmlFor="exampleInputEmail1" className="small gg-text">Contact No.</label>
                      <input type="text" name="contact" className="form-control custorm-form-login" id="gg-contact" value={this.state.contact} onChange={this.handleContactChange}/>
                      <small className="form-text text-danger">{this.state.errorContact}</small>
                      </div>
                    </div>
                    <div className="col-12 mt-2">
                      <button type="submit" id="btnLogin" className="btn gg-bg text-white btn-block">Log in</button>
                    </div>
                  </form>
              </div>
              <p className="small text-center fixed-bottom text-white">GabayGuro - Online Bingo 2020</p>
            </div>
        </div>
      </div>
    )
  }
}