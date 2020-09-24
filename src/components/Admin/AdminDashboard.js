import React, { Component } from 'react';
import Header from './header';
import '../../App.css'
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://binggo-test.dokyumento.asia/index.php/',
  headers: {
      "Content-Type": "application/x-www-form-urlencoded"
  },
});

class Dashboard extends Component {

  state = {
    keyvalue: '',
    room_id: '',
    prizes: '',
    listevents: [],
    event_desc: '',
    eventTitle: '',
    eventDesc: '',
    eventMaxWinners: '',
    eventDate: '',
    eventPrices: '',
  }

  constructor() {
    super();
    
    this.getRoomId = this.getRoomId.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  

  async componentDidMount() {
    let result = await API.post(`https://binggo-test.dokyumento.asia/index.php/Binggo/fetch_all_binggo_events`)
    console.log("THE RESULT"+ result.data)
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
    window.location.href = "/admin-bingo"
    event.preventDefault();
    
  }

  eventTitle = (e) => {
    this.setState({eventTitle: e.target.value})
  }
  eventDesc = (e) => {
    this.setState({eventDesc: e.target.value})
  }
  eventMaxWinners = (e) => {
    this.setState({eventMaxWinners: e.target.value})
  }
  eventDate = (e) => {
    this.setState({eventDate: e.target.value})
  }
  eventPrices = (e) => {
    this.setState({eventPrices: e.target.value})
  }

  createNewEvent = () => {
    API.post(`Binggo/create_binggo_event`, {
      binggo_title: this.state.eventTitle,
      binggo_desc: this.state.eventDesc,
      binggo_max_winners: this.state.eventMaxWinners,
      binggo_max_game: this.state.eventMaxWinners,
      created_by: localStorage.user_id,
      binggo_event_starts: this.state.eventDate,
      prizes: this.state.eventPrices.split(",")
    }).then(res => {
      alert("Saved")
    }).catch(err => {
      console.log(err)
    });
  }

  render() {
    return (
      <>
        <Header />

        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Event Description</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label className="small">Event Title</label>
                      <input type="text" name="eventTitle" className="form-control" value={this.state.eventTitle} onChange={this.eventTitle}/>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <label className="small">Description of the Event</label>
                      <textarea name="eventDescription" className="form-control" value={this.state.eventDesc} onChange={this.eventDesc}></textarea>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label className="small">No. of Max Winners</label>
                      <input type="text" name="eventMaxWinners" className="form-control" value={this.state.eventMaxWinners} onChange={this.eventMaxWinners}/>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <label className="small">Date of Event</label>
                      <input type="datetime-local" name="eventDate" className="form-control" value={this.state.eventDate} onChange={this.eventDate}/>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <label className="small">Winning List</label>
                      <input type="text" name="eventWinningList" className="form-control" placeholder="Macbook Air Pro, Realme 6 Pro, 5000 Cash" value={this.state.eventPrices} onChange={this.eventPrices}/>
                    </div>
                  </div>

                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={this.createNewEvent}>Save changes</button>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid mt-3">
          <div className="row">
            <div className="col-xl-4">
              <div className="card rounded-0">
                <h5 className="card-header text-center">List of Bingo Events</h5>
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

                    <button type="submit" className="btn btn-primary btn-block">Host this event</button>

                  </form>

                  <hr />

                  <button type="button" className="btn btn-block btn-secondary" data-toggle="modal" data-target="#exampleModal">
                    Create New Event
                  </button>

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
