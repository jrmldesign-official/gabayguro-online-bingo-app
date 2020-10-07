import React, { Component } from 'react';
import Header from './header';
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
    eventList: []
  }

  constructor() {
    super();
    
    this.getRoomId = this.getRoomId.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
  }
  

  async componentDidMount() {
    this.getEventList()
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

  getEventList = () => {

    API.get(`Binggo/fetch_all_binggo_events`).
    then(res => {
      if(res.data.status === "SUCCESS"){

        this.setState({listevents: res.data.payload})
  
      }else{
  
      }
    }).catch(err => {
      console.log(err)
    });
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

    let prizeObj = []

    for(let a = 0; a < this.state.eventPrices.split(",").length; a++){
      let item = this.state.eventPrices.split(",")[a].trimStart()
      var rowData = {
        prize_desc: item,
        prize_qty: 0
      }
      prizeObj.push(rowData)
    }

    API.post(`Binggo/create_binggo_event`, {
      binggo_title: this.state.eventTitle,
      binggo_desc: this.state.eventDesc,
      binggo_max_winners: this.state.eventMaxWinners,
      binggo_max_game: this.state.eventMaxWinners,
      created_by: localStorage.user_id,
      binggo_event_starts: this.state.eventDate,
      prizes: prizeObj
    }).then(res => {
      document.querySelector("#exampleModal button.close").click()
      this.getEventList()
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
                  <div className="col-4">
                    <div className="form-group">
                      <label className="small">No. of Max Winners</label>
                      <input type="text" name="eventMaxWinners" className="form-control" value={this.state.eventMaxWinners} onChange={this.eventMaxWinners}/>
                    </div>
                  </div>
                  <div className="col-8">
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

        <div className="modal fade" id="hostEvent" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Host a Event</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                
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

              </div>
            </div>
          </div>
        </div>


        <div className="container-fluid mt-3">
          <div className="row">

          <div className="col-xl-12 mb-3">

            <button type="button" className="btn rounded-0 btn-sm btn-primary" data-toggle="modal" data-target="#exampleModal">
              Create Event
            </button>

            <button type="button" className="btn rounded-0 btn-sm btn-primary ml-3" data-toggle="modal" data-target="#hostEvent">
              Host a event 
            </button>

          </div>

            <div className="col-xl-8">

              <div className="card-deck">

                <div className="card rounded-0 shadow-sm">
                  <div className="card-body">
                    <p className="mb-2 panel-title">Total Events</p>
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-bar-chart float-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5h-2v12h2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/>
                    </svg>
                    <a href="#!" className="badge badge-primary float-right">+{this.state.listevents.length}</a>
                  </div>
                </div>



                {/* <div className="card rounded-0 border-0 shadow-sm">
                  <div className="card-body">
                    <h6 className="card-title"></h6>
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-bar-chart float-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5h-2v12h2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/>
                    </svg>
                    <a href="#!" className="badge badge-primary float-right">+{this.state.listevents.length}</a>
                  </div>
                </div> */}

                <div className="card rounded-0 border-0 shadow-sm">
                  <div className="card-body">
                    <h6 className="card-title">Total Prices Given</h6>
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-joystick float-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.106 15.553L.553 12.276A1 1 0 0 1 0 11.382V9.471a1 1 0 0 1 .606-.89L6 6.269v1.088L1 9.5l5.658 2.83a3 3 0 0 0 2.684 0L15 9.5l-5-2.143V6.27l5.394 2.312a1 1 0 0 1 .606.89v1.911a1 1 0 0 1-.553.894l-6.553 3.277a2 2 0 0 1-1.788 0z"/>
                      <path fillRule="evenodd" d="M7.5 9.5v-6h1v6h-1z"/>
                      <path d="M10 9.75c0 .414-.895.75-2 .75s-2-.336-2-.75S6.895 9 8 9s2 .336 2 .75zM10 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
                    </svg>
                    <a href="#!" className="badge badge-primary float-right">0</a>
                  </div>
                </div>

                <div className="card rounded-0 border-0 shadow-sm">
                  <div className="card-body">
                    <h6 className="card-title">Players Online</h6>
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-circle-fill float-left" fill="green" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="8" r="8"/>
                    </svg>
                    <a href="#!" className="badge badge-success float-right">0</a>
                  </div>
                </div>

              </div>

              <hr />

            </div>
            
            <div className="col-xl-4">

              <div className="row">
                <div className="col-xl-12">
                  <div className="card rounded-0 shadow-sm">
                    <div className="card-body">
                      <p className="mb-3 panel-title float-right">ACTIVITY LOGS</p>
                      <span className="clearfix"></span>
                      {this.state.listevents.length > 0 ? (
                        <ul className="list-group list-group-flush" style={{ maxHeight: 50+'vh', overflowX: 'auto' }}>
                          {this.state.listevents.map((list, index) => 
                            <li className="list-group-item" key={list.binggo_event_id}>
                              <p className="mb-0 small float-left"><b>You create a event:</b> "{list.binggo_title}"</p>
                            </li>
                          )}
                        </ul>
                              
                          ):(
                              <span></span>
                          )
                        }
                    </div>
                  </div>
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
