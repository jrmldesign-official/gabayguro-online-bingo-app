import React, { Component } from 'react';
import Header from './header';
import '../../App.css'
import axios from 'axios';

var api = axios.create({
  baseURL: 'https://binggo-test.dokyumento.asia/index.php/',
});

class Dashboard extends Component {

  state = {
    keyvalue: '',
    room_id: '',
    prizes: '',
    listevents: []
  }

  constructor() {
    super();
    
    this.getRoomId = this.getRoomId.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  

  async componentDidMount() {
    let result = await api.post(`Binggo/fetch_all_binggo_events`)
    this.setState({listevents: result.data.payload})
    console.log(result.data)
  }

  getRoomId(event) {
    let idx = event.target.selectedIndex;
    let dataset = event.target.options[idx].dataset;
    this.setState({prizes: JSON.stringify(this.state.listevents[dataset.id].prizes)})
    this.setState({room_id: event.target.value});
  }

  handleSubmit(event) {
    
    localStorage.setItem("room_id", this.state.room_id)
    localStorage.setItem("prizes", this.state.prizes)
    window.location.href = "/game"
    event.preventDefault();
    
  }

  render() {
    return (
      <>
        <Header />

        <div className="container-fluid mt-3">
          <div className="row">
            <div className="col-xl-4">
              <div className="card rounded-0">
                <h5 className="card-header text-center">List of Bingo Event</h5>
                <div className="card-body">

                  <form onSubmit={this.handleSubmit}>

                    {
                      this.state.listevents.length > 0 ? (
                          <select className="custom-select rounded-0 mb-3" value={this.state.room_id} data-id={this.state.keyvalue} onChange={this.getRoomId}>
                              <option>Select Bingo Event</option>
                              {this.state.listevents.map((list, index) => 
                                  <option key={list.binggo_event_id} data-id={index} value={list.binggo_event_id} >{list.binggo_title}</option>
                              )}
                          </select>
                          
                      ):(
                          <span></span>
                      )
                    }

                    <button type="submit" className="btn btn-primary btn-block">Join</button>

                  </form>

                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Dashboard;
