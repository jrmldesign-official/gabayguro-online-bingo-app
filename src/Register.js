import React from 'react';
import axios from 'axios';

export default class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      fname: '',
      lname: '',
      email: '',
      contact: '',
    };

    
    this.handleSubmit = this.handleSubmit.bind(this);

    this.regFname = this.regFname.bind(this);
    this.regLname = this.regLname.bind(this);
    this.regEmail = this.regEmail.bind(this);
    this.regContact = this.regContact.bind(this);


    this.dismissError = this.dismissError.bind(this);
  
  }

  dismissError() {
    this.setState({ error: '' });
  }

  handleSubmit(evt) {
    evt.preventDefault();


    if (!this.state.fname) {
      return this.setState({ error: 'Username is required' });
    }

    if (!this.state.lname) {
      return this.setState({ error: 'Username is required' });
    }

    if (!this.state.email) {
      return this.setState({ error: 'Username is required' });
    }

    if (!this.state.contact) {
      return this.setState({ error: 'Username is required' });
    }

    const user = {
      name: this.state.fname+" "+this.state.lname,
      email: this.state.email,
      contact: this.state.contact
    };


    axios.post(`https://binggo-test.dokyumento.asia/index.php/Useraccounts/register_as_player/?name=${user.name}&email=${user.email}&contact_no=${user.contact}`)
      .then(res => {
        if(res.data.status === "SUCCESS"){
          localStorage.setItem("user_id", res.data.payload.user_id)
          window.location.href = "/bingo"
        }
        // localStorage.setItem("user_id", res.data.payload.user_id)
        // window.location.href = "/bingo"
        console.log(res);
        console.log(res.data);
      })

    return this.setState({ error: '' });
  }

  regFname(evt) {
    this.setState({
      fname: evt.target.value,
    });
  };

  regLname(evt) {
    this.setState({
      lname: evt.target.value,
    });
  };

  regEmail(evt) {
    this.setState({
      email: evt.target.value,
    });
  };

  regContact(evt) {
    this.setState({
      contact: evt.target.value,
    });
  };

  // handleEmailChange(evt) {
  //   this.setState({
  //     email: evt.target.value,
  //   });
  // }

    // const user = {
    //   name: this.state.name,
    //   email: this.state.email
    // };

    // console.log(user)
    

    // axios.post(`https://binggo-test.dokyumento.asia/index.php/Useraccounts/authenticate/?name=Jr&email=jr@gmail.com`)
    //   .then(res => {
    //     localStorage.setItem("user_id", res.data.payload.user_id)
    //     window.location.href = "/bingo"
    //     console.log(res);
    //     console.log(res.data);
    //   })
    
  

  render() {
    return (
      <div className="container-fluid">
        <div id="login-body" className="row justify-content-center">
            <div className="col-10 col-sm-8 col-md-5 col-xl-4 pos-relative">
              <div id="gg-login-container" className="card rounded-0 border-0 shadow-sm p-3">

                  <a href="/" className="small text-right mb-5">Login</a>

                  <h3 className="mb-5">Register</h3>

                  <form className="row" onSubmit={this.handleSubmit}>
                    <div className="col">
                      <div className="form-group">
                      <label htmlFor="exampleInputEmail1" className="small gg-text">First name</label>
                      <input type="text" name="fname" className="form-control custorm-form-login" id="gg-firstname" value={this.state.fname} onChange={this.regFname}/>
                      <small id="emailHelp" className="form-text text-muted d-none"></small>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                      <label htmlFor="exampleInputEmail1" className="small gg-text float-left">Last name</label>
                      <input type="text" name="lname" className="form-control custorm-form-login" id="gg-lastname" value={this.state.lname} onChange={this.regLname}/>
                      <small id="emailHelp" className="form-text text-muted d-none"></small>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                      <label htmlFor="exampleInputEmail1" className="small gg-text float-left">Email address</label>
                      <input type="text" name="email" className="form-control custorm-form-login" id="gg-email" value={this.state.email} onChange={this.regEmail}/>
                      <small id="emailHelp" className="form-text text-muted d-none"></small>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                      <label htmlFor="exampleInputEmail1" className="small gg-text float-left">Contact no.</label>
                      <input type="text" name="contact" className="form-control custorm-form-login" id="gg-contact" value={this.state.contact} onChange={this.regContact}/>
                      <small id="emailHelp" className="form-text text-muted d-none"></small>
                      </div>
                    </div>
                    <div className="col-12 mt-2">
                      <button type="submit" className="btn gg-bg text-white btn-block">Register</button>
                    </div>
                  </form>
              </div>
            </div>
        </div>
      </div>
    )
  }
}