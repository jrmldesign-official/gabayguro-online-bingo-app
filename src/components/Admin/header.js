import React, { Component } from 'react';
import axios from 'axios';

var api = axios.create({
    baseURL: 'https://binggo-test.dokyumento.asia/index.php',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, Origin, Authorization',
      'Content-Type': 'application/json',
    },
});

class header extends Component {

    state = {
        name: '',
        listevents: []
    }

    constructor() {
        super();

        this.getUserDetails();
    }

    getUserDetails = async () => {
        api.post(`/Useraccounts/fetch_user_details_by_user_id`, { user_id: localStorage.user_id })
        .then(res => {

            localStorage.setItem("name", res.data.payload[0].user_fullname)

            this.setState({
                name: res.data.payload[0].user_fullname,
            })

        })
        .catch(err => {
            console.log(err)
        });
    }
    
    

    render() {

        function handleClick(e) {
            localStorage.clear()
            window.location.reload()
        }

        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <a className="navbar-brand" href="/admin-dashboard">GabayGuro's Online Bingo | Admin Dashboard</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav ml-auto">
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="/" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Welcome {this.state.name}
                            </a>
                            <div className="dropdown-menu">
                                <a href="/admin" className="dropdown-item" onClick={handleClick}>
                                    Click me
                                </a>
                            </div>
                        </li>
                        </ul>
                    </div>
                </nav>
            </div>
        );
    }
}

export default header;