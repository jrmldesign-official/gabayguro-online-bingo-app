import React, { Component } from 'react'
import Header from './header';
import io from 'socket.io-client'
import axios from 'axios';
import './style-admin.css';

var socket = io.connect('http://localhost:4000')
var room = localStorage.room_id
var user_id = localStorage.user_id
var username = localStorage.name

var CollectDraw = []

class Game extends Component {

    state = {
        get_winning_pattern: [],
        BallsArr: [],
        BallCount: 75
    };

    // constructor() {
    //     super();     
        
    // }

    componentDidMount() {

        this.populateBallsArray();

        socket.emit('joinRoom', { username, room });


        socket.on('roomUsers', ({ room, users }) => {
            console.log(room)
            console.log(users)
            this.setState({ lop: users })
        });

        let getWinningPattern = {
            binggo_event_id: room
        }

        axios.post(`Binggo/fetch_winning_pattern`, getWinningPattern)
        .then(res => {

            if(res.data.status === "SUCCESS"){
                document.getElementById("GetPattern").remove()
                // document.getElementById("DrawBall").classList.remove("d-none")
                document.getElementById("BingoStart").classList.remove("d-none")
                document.getElementById("winning-pattern-card").setAttribute("data-set", true)
                // document.getElementsByClassName("pattern")

                var elems = document.querySelectorAll(".pattern")
                var elemCount = elems.length;

                for (var i = 0; i < elemCount; i++) {
                    elems[i].classList.remove("pattern");
                }


                if(res.data.payload[0].B1 === "1"){ document.getElementById("pattern-B1").classList.add("marked") }
                if(res.data.payload[0].I1 === "1"){ document.getElementById("pattern-I1").classList.add("marked") }
                if(res.data.payload[0].N1 === "1"){ document.getElementById("pattern-N1").classList.add("marked") }
                if(res.data.payload[0].G1 === "1"){ document.getElementById("pattern-G1").classList.add("marked") }
                if(res.data.payload[0].O1 === "1"){ document.getElementById("pattern-O1").classList.add("marked") }

                if(res.data.payload[0].B2 === "1"){ document.getElementById("pattern-B2").classList.add("marked") }
                if(res.data.payload[0].I2 === "1"){ document.getElementById("pattern-I2").classList.add("marked") }
                if(res.data.payload[0].N2 === "1"){ document.getElementById("pattern-N2").classList.add("marked") }
                if(res.data.payload[0].G2 === "1"){ document.getElementById("pattern-G2").classList.add("marked") }
                if(res.data.payload[0].O2 === "1"){ document.getElementById("pattern-O2").classList.add("marked") }

                if(res.data.payload[0].B3 === "1"){ document.getElementById("pattern-B3").classList.add("marked") }
                if(res.data.payload[0].I3 === "1"){ document.getElementById("pattern-I3").classList.add("marked") }
                // if(res.data.payload[0].N3 === "1"){ document.getElementById("pattern-N3").classList.add("marked") } FREE
                if(res.data.payload[0].G3 === "1"){ document.getElementById("pattern-G3").classList.add("marked") }
                if(res.data.payload[0].O3 === "1"){ document.getElementById("pattern-O3").classList.add("marked") }

                if(res.data.payload[0].B4 === "1"){ document.getElementById("pattern-B4").classList.add("marked") }
                if(res.data.payload[0].I4 === "1"){ document.getElementById("pattern-I4").classList.add("marked") }
                if(res.data.payload[0].N4 === "1"){ document.getElementById("pattern-N4").classList.add("marked") }
                if(res.data.payload[0].G4 === "1"){ document.getElementById("pattern-G4").classList.add("marked") }
                if(res.data.payload[0].O4 === "1"){ document.getElementById("pattern-O4").classList.add("marked") }

                if(res.data.payload[0].B5 === "1"){ document.getElementById("pattern-B5").classList.add("marked") }
                if(res.data.payload[0].I5 === "1"){ document.getElementById("pattern-I5").classList.add("marked") }
                if(res.data.payload[0].N5 === "1"){ document.getElementById("pattern-N5").classList.add("marked") }
                if(res.data.payload[0].G5 === "1"){ document.getElementById("pattern-G5").classList.add("marked") }
                if(res.data.payload[0].O5 === "1"){ document.getElementById("pattern-O5").classList.add("marked") }


            }else{

            }

            console.log(res);
            console.log(res.data);
        })

    }

    Setppattern = (event) => {
        event.target.classList.toggle("marked");
        console.log(event.target.getAttribute("data-cell"))
    }

    GetPattern = (e) => {

        let B1 = document.querySelector("#pattern-B1").classList.contains("marked")
        let I1 = document.querySelector("#pattern-I1").classList.contains("marked")
        let N1 = document.querySelector("#pattern-N1").classList.contains("marked")
        let G1 = document.querySelector("#pattern-G1").classList.contains("marked")
        let O1 = document.querySelector("#pattern-O1").classList.contains("marked")

        let B2 = document.querySelector("#pattern-B2").classList.contains("marked")
        let I2 = document.querySelector("#pattern-I2").classList.contains("marked")
        let N2 = document.querySelector("#pattern-N2").classList.contains("marked")
        let G2 = document.querySelector("#pattern-G2").classList.contains("marked")
        let O2 = document.querySelector("#pattern-O2").classList.contains("marked")

        let B3 = document.querySelector("#pattern-B3").classList.contains("marked")
        let I3 = document.querySelector("#pattern-I3").classList.contains("marked")
        // let N3 = document.querySelector("#pattern-N3").classList.contains("marked") //FREE
        let G3 = document.querySelector("#pattern-G3").classList.contains("marked")
        let O3 = document.querySelector("#pattern-O3").classList.contains("marked")

        let B4 = document.querySelector("#pattern-B4").classList.contains("marked")
        let I4 = document.querySelector("#pattern-I4").classList.contains("marked")
        let N4 = document.querySelector("#pattern-N4").classList.contains("marked")
        let G4 = document.querySelector("#pattern-G4").classList.contains("marked")
        let O4 = document.querySelector("#pattern-O4").classList.contains("marked")

        let B5 = document.querySelector("#pattern-B5").classList.contains("marked")
        let I5 = document.querySelector("#pattern-I5").classList.contains("marked")
        let N5 = document.querySelector("#pattern-N5").classList.contains("marked")
        let G5 = document.querySelector("#pattern-G5").classList.contains("marked")
        let O5 = document.querySelector("#pattern-O5").classList.contains("marked")

        if(B1 === true) { var B1_flag = 1 } else { var B1_flag = 0 }
        if(I1 === true) { var I1_flag = 1 } else { var I1_flag = 0 }
        if(N1 === true) { var N1_flag = 1 } else { var N1_flag = 0 }
        if(G1 === true) { var G1_flag = 1 } else { var G1_flag = 0 }
        if(O1 === true) { var O1_flag = 1 } else { var O1_flag = 0 }

        if(B2 === true) { var B2_flag = 1 } else { var B2_flag = 0 }
        if(I2 === true) { var I2_flag = 1 } else { var I2_flag = 0 }
        if(N2 === true) { var N2_flag = 1 } else { var N2_flag = 0 }
        if(G2 === true) { var G2_flag = 1 } else { var G2_flag = 0 }
        if(O2 === true) { var O2_flag = 1 } else { var O2_flag = 0 }

        if(B3 === true) { var B3_flag = 1 } else { var B3_flag = 0 }
        if(I3 === true) { var I3_flag = 1 } else { var I3_flag = 0 }
        // if(N3 === true) { var N3_flag = 1 } else { var N3_flag = 0 } // FREE
        if(G3 === true) { var G3_flag = 1 } else { var G3_flag = 0 }
        if(O3 === true) { var O3_flag = 1 } else { var O3_flag = 0 }

        if(B4 === true) { var B4_flag = 1 } else { var B4_flag = 0 }
        if(I4 === true) { var I4_flag = 1 } else { var I4_flag = 0 }
        if(N4 === true) { var N4_flag = 1 } else { var N4_flag = 0 }
        if(G4 === true) { var G4_flag = 1 } else { var G4_flag = 0 }
        if(O4 === true) { var O4_flag = 1 } else { var O4_flag = 0 }

        if(B5 === true) { var B5_flag = 1 } else { var B5_flag = 0 }
        if(I5 === true) { var I5_flag = 1 } else { var I5_flag = 0 }
        if(N5 === true) { var N5_flag = 1 } else { var N5_flag = 0 }
        if(G5 === true) { var G5_flag = 1 } else { var G5_flag = 0 }
        if(O5 === true) { var O5_flag = 1 } else { var O5_flag = 0 }


        const payload = {
            "binggo_event_id": room,
            "created_by": user_id,
            "B1": B1_flag,
            "B2": B2_flag,
            "B3": B3_flag,
            "B4": B4_flag,
            "B5": B5_flag,
            "I1": I1_flag,
            "I2": I2_flag,
            "I3": I3_flag,
            "I4": I4_flag,
            "I5": I5_flag,
            "N1": N1_flag,
            "N2": N2_flag,
            "N3": 1,
            "N4": N4_flag,
            "N5": N5_flag,
            "G1": G1_flag,
            "G2": G2_flag,
            "G3": G3_flag,
            "G4": G4_flag,
            "G5": G5_flag,
            "O1": O1_flag,
            "O2": O2_flag,
            "O3": O3_flag,
            "O4": O4_flag,
            "O5": O5_flag
        }
    
        axios.post(`Binggo/set_binggo_wining_pattern`, payload)
        .then(res => {
            if(res.data.status === "SUCCESS"){
                document.getElementById("GetPattern").remove()
                document.getElementById("DrawBall").classList.remove("d-none")
                document.getElementById("BingoStart").classList.remove("d-none")
            }
            console.log(res);
            console.log(res.data);
        })


        // let getPattern = document.getElementsByClassName('pattern marked')
        // let patternObj = []

        // for(let i = 0; getPattern.length > i; i++){

        //     let data = getPattern[i].getAttribute('data-cell')
        //     patternObj.push(data)

        // }

        // this.setState({get_winning_pattern: patternObj})

    }

    CheckWinningPatternExist = () => {

        let data = {
            binggo_event_id: room
        }

        axios.post(`Binggo/fetch_draw_logs`, data)
        .then(res => {

        })
    }

    BingoStart = (e) => {
        console.log(this.state.get_winning_pattern)
    }

    populateBallsArray = () => {

        var populate = []

        for ( let i = this.state.BallCount; i >= 1; i-- ) {
    
            if ( i >= 1  && i <= 15 ){
                populate.push('B-' + i)
            } 
            if ( i >= 16 && i <= 30 ){
                populate.push('I-' + i)
            } 
            if ( i >= 31 && i <= 45 ){
                populate.push('N-' + i)
            } 
            if ( i >= 46 && i <= 60 ){
                populate.push('G-' + i)
            } 
            if ( i >= 61 && i <= 75 ){
                populate.push('O-' + i)
            } 
    
        }

        this.setState({BallsArr: populate})
    
    };

    IsValidNumber = ( num, arr = [] ) => {

        if ( !arr.includes( num ) ) {
    
            return true;
    
        } else {
    
            return false;
    
        }
    
    };

    GenerateRandomNumber = ( max, min = 0, arr = [] ) => {

        const _max = Math.floor( max );
        const _min = Math.ceil( min );
        const _arr = arr;
        // random number between and including range
        const _num = Math.floor( Math.random() * ( _max - _min + 1 ) ) + _min;
    
        // Make sure random number doesn't already exist in the array
        if ( this.IsValidNumber( _num, _arr ) ) {
    
            _arr.push( _num );
    
            return _num;
    
        } else {
    
            // recursive call if invalid
            return this.GenerateRandomNumber( _max, _min, _arr );
    
        }
    
    };

    RandomBallSelector = () => {

        const ballCount  = this.state.BallsArr.length;
        const randomBall = this.GenerateRandomNumber( ballCount - 1 );

        return this.state.BallsArr[ randomBall ];
    
    };

    PopBall = ball => {

        const _ballIndex = this.state.BallsArr.indexOf( ball );
    
        if ( _ballIndex > -1 ) this.state.BallsArr.splice( _ballIndex, 1 );
    
    };
    
    DrawBall = () => {

        let test = document.getElementById("winning-pattern-card").getAttribute("data-set")

        if(test === 'false'){

            alert("Please set your winning pattern first.")

        }else{

            var _ball = this.RandomBallSelector();
            const _drawnNumber = parseInt( _ball.split( '-' )[ 1 ] );
            
            if( this.state.BallCount > 0 ) {

                this.PopBall(_ball)


                socket.emit('drawBall', _ball);
                

                let insertDraw = {
                    binggo_event_id: room,
                    binggo_draw: _ball,
                    bdl_created_by: user_id
                }
        
                axios.post(`Binggo/insert_draw_logs`, insertDraw)
                .then(res => {
        
                    if(res.data.status === "SUCCESS"){

                        let getAllDraw = {
                            binggo_event_id: room
                        }
                
                        axios.post(`Binggo/fetch_draw_logs`, getAllDraw)
                        .then(res => {
                
                            if(res.data.status === "SUCCESS"){

                                for(let i = 0; res.data.payload.length > i; i ++ ){
                                    CollectDraw.push(res.data.payload[i].binggo_draw)
                                }

                                socket.emit('drawAllBall', CollectDraw);

                                CollectDraw = []
                                
                            }else{
                
                            }
        
                        })
                        
                    }else{
        
                    }

                })

        
            //     BINGO.popBall( _ball )
            //          .updateDrawHistory( _ball )
            //          .updateLastDrawn( _ball )
            //          .highlightDrawnBall( _ball )
            //          .highlightCardCell( _drawnNumber );
                
                document.getElementById("js-caller-"+_ball).classList.add("marked")

                this.state.BallCount--;
                console.log("Ball count: "+this.state.BallCount)
                console.log(_drawnNumber)
                console.log(_ball)
                console.log(this.state.BallsArr)
        
                if( this.state.BallCount === 0 ) {

                    alert("GAME HAS ENDED")
        
            //         // disable draw button
            //         BINGO.domElems.drawButton.disabled = true;
            //         BINGO.domElems.drawButton.classList.add( 'disabled' );
            //         // show the reset button
            //         BINGO.domElems.resetButton.classList.remove( 'display-none' );
        
                }
        
            }

        }

    
    };

    render() {
        return (
            <>
                <Header />
                <div id="bingo-body" className="container-fluid bg-dark">
                    <div className="row">
                        <div className="col-xl-4">
                            <div className="row">
                                <div className="col-xl-12">
                                    <h2>Last Ball: <span id="js-last-num" className="last-num">Click to Draw</span></h2>
                                    <p>Draw History</p>
                                    <ol id="js-history"></ol>
                                    <button id="DrawBall" className="btn btn-dark btnsm btn-block d-none" onClick={this.DrawBall}>Draw Number</button>
                                    <button id="BingoStart" className="btn btn-dark btnsm btn-block d-none" onClick={this.BingoStart}>Start Game</button>
                                    <button id="GetPattern" className="btn btn-dark btnsm btn-block" onClick={this.GetPattern}>Set Winning Pattern</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4">
                            WINNING PATTERN
                            <table id="winning-pattern-card" data-set="false">
                                <tbody>
                                    <tr>
                                        <td className="pattern" id="pattern-B1" onClick={this.Setppattern} data-cell="B1"></td>
                                        <td className="pattern" id="pattern-I1" onClick={this.Setppattern} data-cell="I1"></td>
                                        <td className="pattern" id="pattern-N1" onClick={this.Setppattern} data-cell="N1"></td>
                                        <td className="pattern" id="pattern-G1" onClick={this.Setppattern} data-cell="G1"></td>
                                        <td className="pattern" id="pattern-O1" onClick={this.Setppattern} data-cell="O1"></td>
                                    </tr>
                                    <tr>
                                        <td className="pattern" id="pattern-B2" onClick={this.Setppattern} data-cell="B2"></td>
                                        <td className="pattern" id="pattern-I2" onClick={this.Setppattern} data-cell="I2"></td>
                                        <td className="pattern" id="pattern-N2" onClick={this.Setppattern} data-cell="N2"></td>
                                        <td className="pattern" id="pattern-G2" onClick={this.Setppattern} data-cell="G2"></td>
                                        <td className="pattern" id="pattern-O2" onClick={this.Setppattern} data-cell="O2"></td>
                                    </tr>
                                    <tr>
                                        <td className="pattern" id="pattern-B3" onClick={this.Setppattern} data-cell="B3"></td>
                                        <td className="pattern" id="pattern-I3" onClick={this.Setppattern} data-cell="I3"></td>
                                        <td className="pattern marked" data-cell="N3">FREE</td>
                                        <td className="pattern" id="pattern-G3" onClick={this.Setppattern} data-cell="G3"></td>
                                        <td className="pattern" id="pattern-O3" onClick={this.Setppattern} data-cell="O3"></td>
                                    </tr>
                                    <tr>
                                        <td className="pattern" id="pattern-B4" onClick={this.Setppattern} data-cell="B4"></td>
                                        <td className="pattern" id="pattern-I4" onClick={this.Setppattern} data-cell="I4"></td>
                                        <td className="pattern" id="pattern-N4" onClick={this.Setppattern} data-cell="N4"></td>
                                        <td className="pattern" id="pattern-G4" onClick={this.Setppattern} data-cell="G4"></td>
                                        <td className="pattern" id="pattern-O4" onClick={this.Setppattern} data-cell="O4"></td>
                                    </tr>
                                    <tr>
                                        <td className="pattern" id="pattern-B5" onClick={this.Setppattern} data-cell="B5"></td>
                                        <td className="pattern" id="pattern-I5" onClick={this.Setppattern} data-cell="I5"></td>
                                        <td className="pattern" id="pattern-N5" onClick={this.Setppattern} data-cell="N5"></td>
                                        <td className="pattern" id="pattern-G5" onClick={this.Setppattern} data-cell="G5"></td>
                                        <td className="pattern" id="pattern-O5" onClick={this.Setppattern} data-cell="O5"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="col-xl-4">
                        <table id="bingo-caller" className="table table-sm table-bordered">
                            <tbody>
                                <tr>
                                    <th>B</th>
                                    <th>I</th>
                                    <th>N</th>
                                    <th>G</th>
                                    <th>O</th>
                                </tr>
                                <tr>
                                <td id="js-caller-B-1" className="js-caller-cell">1</td>
                                <td id="js-caller-I-16" className="js-caller-cell">16</td>
                                <td id="js-caller-N-31" className="js-caller-cell">31</td>
                                <td id="js-caller-G-46" className="js-caller-cell">46</td>
                                <td id="js-caller-O-61" className="js-caller-cell">61</td>
                                </tr>
                                <tr>
                                <td id="js-caller-B-2" className="js-caller-cell">2</td>
                                <td id="js-caller-I-17" className="js-caller-cell">17</td>
                                <td id="js-caller-N-32" className="js-caller-cell">32</td>
                                <td id="js-caller-G-47" className="js-caller-cell">47</td>
                                <td id="js-caller-O-62" className="js-caller-cell">62</td>
                                </tr>
                                <tr>
                                <td id="js-caller-B-3" className="js-caller-cell">3</td>
                                <td id="js-caller-I-18" className="js-caller-cell">18</td>
                                <td id="js-caller-N-33" className="js-caller-cell">33</td>
                                <td id="js-caller-G-48" className="js-caller-cell">48</td>
                                <td id="js-caller-O-63" className="js-caller-cell">63</td>
                                </tr>
                                <tr>
                                <td id="js-caller-B-4" className="js-caller-cell">4</td>
                                <td id="js-caller-I-19" className="js-caller-cell">19</td>
                                <td id="js-caller-N-34" className="js-caller-cell">34</td>
                                <td id="js-caller-G-49" className="js-caller-cell">49</td>
                                <td id="js-caller-O-64" className="js-caller-cell">64</td>
                                </tr>
                                <tr>
                                <td id="js-caller-B-5" className="js-caller-cell">5</td>
                                <td id="js-caller-I-20" className="js-caller-cell">20</td>
                                <td id="js-caller-N-35" className="js-caller-cell">35</td>
                                <td id="js-caller-G-50" className="js-caller-cell">50</td>
                                <td id="js-caller-O-65" className="js-caller-cell">65</td>
                                </tr>
                                <tr>
                                <td id="js-caller-B-6" className="js-caller-cell">6</td>
                                <td id="js-caller-I-21" className="js-caller-cell">21</td>
                                <td id="js-caller-N-36" className="js-caller-cell">36</td>
                                <td id="js-caller-G-51" className="js-caller-cell">51</td>
                                <td id="js-caller-O-66" className="js-caller-cell">66</td>
                                </tr>
                                <tr>
                                <td id="js-caller-B-7" className="js-caller-cell">7</td>
                                <td id="js-caller-I-22" className="js-caller-cell">22</td>
                                <td id="js-caller-N-37" className="js-caller-cell">37</td>
                                <td id="js-caller-G-52" className="js-caller-cell">52</td>
                                <td id="js-caller-O-67" className="js-caller-cell">67</td>
                                </tr>
                                <tr>
                                <td id="js-caller-B-8" className="js-caller-cell">8</td>
                                <td id="js-caller-I-23" className="js-caller-cell">23</td>
                                <td id="js-caller-N-38" className="js-caller-cell">38</td>
                                <td id="js-caller-G-53" className="js-caller-cell">53</td>
                                <td id="js-caller-O-68" className="js-caller-cell">68</td>
                                </tr>
                                <tr>
                                <td id="js-caller-B-9" className="js-caller-cell">9</td>
                                <td id="js-caller-I-24" className="js-caller-cell">24</td>
                                <td id="js-caller-N-39" className="js-caller-cell">39</td>
                                <td id="js-caller-G-54" className="js-caller-cell">54</td>
                                <td id="js-caller-O-69" className="js-caller-cell">69</td>
                                </tr>
                                <tr>
                                <td id="js-caller-B-10" className="js-caller-cell">10</td>
                                <td id="js-caller-I-25" className="js-caller-cell">25</td>
                                <td id="js-caller-N-40" className="js-caller-cell">40</td>
                                <td id="js-caller-G-55" className="js-caller-cell">55</td>
                                <td id="js-caller-O-70" className="js-caller-cell">70</td>
                                </tr>
                                <tr>
                                <td id="js-caller-B-11" className="js-caller-cell">11</td>
                                <td id="js-caller-I-26" className="js-caller-cell">26</td>
                                <td id="js-caller-N-41" className="js-caller-cell">41</td>
                                <td id="js-caller-G-56" className="js-caller-cell">56</td>
                                <td id="js-caller-O-71" className="js-caller-cell">71</td>
                                </tr>
                                <tr>
                                <td id="js-caller-B-12" className="js-caller-cell">12</td>
                                <td id="js-caller-I-27" className="js-caller-cell">27</td>
                                <td id="js-caller-N-42" className="js-caller-cell">42</td>
                                <td id="js-caller-G-57" className="js-caller-cell">57</td>
                                <td id="js-caller-O-72" className="js-caller-cell">72</td>
                                </tr>
                                <tr>
                                <td id="js-caller-B-13" className="js-caller-cell">13</td>
                                <td id="js-caller-I-28" className="js-caller-cell">28</td>
                                <td id="js-caller-N-43" className="js-caller-cell">43</td>
                                <td id="js-caller-G-58" className="js-caller-cell">58</td>
                                <td id="js-caller-O-73" className="js-caller-cell">73</td>
                                </tr>
                                <tr>
                                <td id="js-caller-B-14" className="js-caller-cell">14</td>
                                <td id="js-caller-I-29" className="js-caller-cell">29</td>
                                <td id="js-caller-N-44" className="js-caller-cell">44</td>
                                <td id="js-caller-G-59" className="js-caller-cell">59</td>
                                <td id="js-caller-O-74" className="js-caller-cell">74</td>
                                </tr>
                                <tr>
                                <td id="js-caller-B-15" className="js-caller-cell">15</td>
                                <td id="js-caller-I-30" className="js-caller-cell">30</td>
                                <td id="js-caller-N-45" className="js-caller-cell">45</td>
                                <td id="js-caller-G-60" className="js-caller-cell">60</td>
                                <td id="js-caller-O-75" className="js-caller-cell">75</td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            </>
        );
    }

}

export default Game;