import React, { Component } from 'react';
import Header from './header';
import axios from 'axios';

var api = axios.create({
  baseURL: 'https://binggo-test.dokyumento.asia/index.php/',
});

class Dashboard extends Component {

  state = {
    keyvalue: '',
    room_id: 0,
    prizes: '',
    listevents: []
  }

  constructor() {
    super();
    
    this.getRoomId = this.getRoomId.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  

  async componentDidMount() {

    if(localStorage.user_id === undefined || localStorage.user_id === "undefined"){
      localStorage.clear();
      window.location.href = "/bingo";
    }else{
      let result = await api.post(`Binggo/fetch_all_binggo_events`)

      if(result.data.status === "SUCCESS"){

        let bingoEvts = []

        for(let i = 0; result.data.payload.length > i; i++){
          if(result.data.payload[i].binggo_max_game === "0"){

          }else{
            bingoEvts.push({
              binggo_event_id: result.data.payload[i].binggo_event_id,
              binggo_title: result.data.payload[i].binggo_title
            })
          }
        
        }

        this.setState({listevents: bingoEvts})

      }else{
        // document.getElementById("btnJoin").classList.add("d-none")
        // document.getElementById("eventsHelper").classList.remove("d-none")
      }
      
    }

    
  }

  getRoomId(event) {
    let idx = event.target.selectedIndex;
    let dataset = event.target.options[idx].dataset;
    this.setState({prizes: JSON.stringify(this.state.listevents[dataset.id].prizes)})
    this.setState({room_id: event.target.value});
  }

  handleSubmit(event) {
    
    if(this.state.room_id === 0){
      event.preventDefault()
    }else{
      localStorage.setItem("room_id", this.state.room_id)
      localStorage.setItem("prizes", this.state.prizes)
      window.location.href = "/game"
      event.preventDefault();
    }
    
  }

  render() {
    return (
      <>
        <Header />

        <div className="container-fluid mt-3">
          <div className="row">
            <div className="col-xl-8">
              <div className="card rounded-0 shadow-sm">
                <div className="card-body">
                  <p className="mb-5 panel-title float-right">DASHBOARD</p>
                </div>
              </div>
            </div>
            <div className="col-xl-4">
              <div className="row">
                <div className="col-xl-12">
                  <div className="card rounded-0 shadow-sm">
                    <div className="card-body">
                      <p className="mb-3 panel-title float-right">BINGO EVENTS</p>
                      <span className="clearfix"></span>
                      <form onSubmit={this.handleSubmit}>

                        {
                          this.state.listevents.length > 0 ? (
                            <>
                              <select className="custom-select rounded-0 mb-3" value={this.state.room_id} data-id={this.state.keyvalue} onChange={this.getRoomId}>
                                  <option>Select Bingo Event</option>
                                  {this.state.listevents
                                      .map((list, index) => 
                                      <option key={list.binggo_event_id} data-id={index} value={list.binggo_event_id} >{list.binggo_title}</option>
                                  )}
                              </select>

                              <button type="submit" id="btnJoin" className="btn btn-primary btn-block">Join</button>
                            </>
                          ):(
                            <h3 id="eventsHelper" className="text-center">no events found</h3>
                          )
                        }

                      </form>

                    </div>
                  </div>
                </div>

                <div className="col-xl-12 mt-3">
                  <div className="card rounded-0 shadow-sm">
                    <div className="card-body">
                      <p className="mb-3 panel-title float-right">Recent Activities</p>
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
