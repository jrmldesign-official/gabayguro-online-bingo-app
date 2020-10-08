import React, { Component } from 'react';
import axios from 'axios';

const API = axios.create({
    baseURL: 'https://binggo-test.dokyumento.asia/index.php/',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
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

        API.post(`Useraccounts/fetch_user_details_by_user_id`, {
            user_id: localStorage.user_id 
        }).then(res => {
            if(res.data.status === "SUCCESS"){

                localStorage.setItem("name", res.data.payload[0].user_fullname)
                this.setState({ name: res.data.payload[0].user_fullname })
                
            }

        }).catch(err => {
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
                <nav id="player-nav" className="navbar navbar-expand-lg">
                    <a className="navbar-brand text-white" href="/">GabayGuro | Online Bingo</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav ml-auto ">
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle text-white" href="/" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Welcome {this.state.name}
                            </a>
                            <div className="dropdown-menu">
                                <a href="/" className="dropdown-item" onClick={handleClick}>
                                    Log out
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