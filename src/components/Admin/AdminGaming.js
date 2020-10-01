import React, { Component } from 'react'
import Header from './header';
import io from 'socket.io-client'
import axios from 'axios';

var socket = io.connect('https://gabayguro-bingo-server.herokuapp.com/')
var room = localStorage.room_id
var user_id = localStorage.user_id
var username = localStorage.name

const API = axios.create({
    baseURL: 'https://binggo-test.dokyumento.asia/index.php/',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    },
});

var CollectDraw = []

class Game extends Component {

    state = {
        playersJoined: [],
        get_winning_pattern: [],
        BallsArr: [],
        drawLogs: [],
        totalDraw: 0,
        BallCount: 75,
        maxGame: [],
        gamePhase: ''
    };

    componentDidMount() {   

        socket.emit('joinRoom', { username, room });

        socket.on('roomUsers', ({ room, users }) => {
            this.setState({ playersJoined: users })
        });

        socket.on('broadcaseWinner', message => {
            console.log(message)
            if(message.text.status === 'true' || message.status === true){
                API.post(`Binggo/end_game`, {
                    binggo_event_id: room
                }).then(res => {

                    if(this.state.gamePhase === 0 || this.state.gamePhase === '0'){
                        var gameCount = 1
                    }else{
                        var gameCount = this.state.gamePhase
                    }

                    API.post(`Binggo/save_winner`, {
                        binggo_event_id: room,
                        user_id: user_id,
                        binggo_game_no: gameCount
                    }).then(res => {
                        if(res.data.status === "SUCCESS"){
                            socket.emit('endGame', "restart");
                            window.location.reload()
                        }
                    }).catch(err => {
                        console.log(err)
                    });
                }).catch(err => {
                    console.log(err)
                });
            }else{

            }

            
        });

        API.post(`Binggo/fetch_binggo_event_by_id`, {
            binggo_event_id: room
        }).then(res => {
            if(res.data.status === "SUCCESS"){
                console.warn(res.data)
                var total_game = parseInt(res.data.payload.binggo_max_game_total) + 1
                var game_remaining = res.data.payload.binggo_max_game

                var game_played = total_game - game_remaining

                this.setState({ gamePhase:game_played })

                if(parseInt(game_remaining) === 0){
                    document.getElementById("triggerEndGame").click()
                }
                console.log("PHASE: "+ this.state.gamePhase)
            }
        }).catch(err => {
            console.log(err)
        });

        API.post(`Binggo/fetch_winning_pattern`, { 
            binggo_event_id: room
        }).then(res => {

            if(res.data.status === "SUCCESS"){

                API.post(`Binggo/fetch_binggo_event_by_id`, {
                    binggo_event_id: room
                }).then(res => {

                    if(res.data.status === "SUCCESS"){

                        var total_game = parseInt(res.data.payload.binggo_max_game_total) + 1
                        var game_remaining = res.data.payload.binggo_max_game
                        var gameStatus = res.data.payload.binggo_status
                        var game_played = total_game - game_remaining

                        this.setState({ gamePhase:game_played })

                        console.log("PHASE: "+ this.state.gamePhase)

                        if(res.data.payload.binggo_status === "1"){
                            document.querySelector(".stepTwo").classList.remove("disabled")
                            document.querySelector(".stepTwo p").classList.add("font-weight-bolder") 
                            document.querySelector(".btnStartBingo").classList.remove("d-none")
                        }else if(res.data.payload.binggo_status === "2"){
                            document.querySelector(".stepThree").classList.remove("disabled")
                            document.querySelector(".stepThree p").classList.add("font-weight-bolder") 
                            document.querySelector(".btnDrawNumber").classList.remove("d-none")
                        }else{
                            
                        }

                        console.log("--trigger--")

                        API.post(`Binggo/fetch_draw_logs`, {
                            binggo_event_id: room,
                            binggo_event_count: this.state.gamePhase
                        }).then(res => {
                
                            if(res.data.status === "SUCCESS"){
                                
                                console.log("NAUNA")
                                for(var i = 0; res.data.payload.length > i; i ++ ){
                                    CollectDraw.push(res.data.payload[i].binggo_draw)
                                    document.getElementById(`js-caller-${res.data.payload[i].binggo_draw}`).classList.add("marked")
                                    if(res.data.payload.length === i+1){
                                        setTimeout(function(){
                                            document.querySelector(".list-draw").firstChild.innerHTML = `<b class="text-primary">Current Draw:</b> "${res.data.payload[0].binggo_draw}"`
                                        })
                                    }
                                }
                
                                this.setState({ totalDraw: res.data.payload.length })
                                this.setState({ drawLogs : CollectDraw })
                                socket.emit('drawAllBall', CollectDraw);

                                console.log("--trigger--1")
                                this.populateBallsArray();
                
                                if(res.data.payload.length === 75){
                                    document.querySelector(".btnDrawNumber").remove()
                                    document.querySelector(".stepThree").classList.add("disabled")
                                    document.querySelector(".stepThree p").classList.remove("font-weight-bolder") 
                                    if(parseInt(gameStatus) === 2){
                                        document.querySelector(".btnBingo").classList.remove("d-none")
                                        document.querySelector(".stepFour").classList.remove("disabled")
                                        document.querySelector(".stepFour p").classList.add("font-weight-bolder")
                                    }
                
                                }else{
                                    document.querySelector(".stepThree").classList.remove("disabled")
                                    document.querySelector(".stepThree p").classList.add("font-weight-bolder") 
                                    document.querySelector(".btnDrawNumber").classList.remove("d-none")
                                }
                
                                CollectDraw = []
                                
                            }else{
                                this.populateBallsArray();
                                console.log("--trigger--1")
                            }
                        }).catch(err => {
                            console.log(err)
                        });


                    }
                }).catch(err => {
                    console.log(err)
                });

                document.querySelector(".stepOne").classList.remove("disabled")
                document.querySelector(".stepOne p").classList.add("text-muted")
                document.querySelector(".btnViewPattern").classList.remove("d-none")
                document.getElementById("winning-pattern-card").setAttribute("data-set", true)

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

                document.querySelector(".stepOne").classList.remove("disabled")
                document.querySelector(".stepOne p").classList.add("font-weight-boler")
                document.querySelector(".btnWinningPattern").classList.remove("d-none")
                this.populateBallsArray();
                
            }

        }).catch(err => {
            this.populateBallsArray();
        });

    }

    viewPattern = () => {
        document.querySelector("#setWinningPattern .modal-title").innerHTML = "View Winning Pattern"
        document.getElementById("GetPattern").classList.add("d-none")
    }

    Setppattern = (event) => {
        event.target.classList.toggle("markedPattern");
        console.log(event.target.getAttribute("data-cell"))
    }

    GetPattern = (e) => {

        let B1 = document.querySelector("#pattern-B1").classList.contains("markedPattern")
        let I1 = document.querySelector("#pattern-I1").classList.contains("markedPattern")
        let N1 = document.querySelector("#pattern-N1").classList.contains("markedPattern")
        let G1 = document.querySelector("#pattern-G1").classList.contains("markedPattern")
        let O1 = document.querySelector("#pattern-O1").classList.contains("markedPattern")
        let B2 = document.querySelector("#pattern-B2").classList.contains("markedPattern")
        let I2 = document.querySelector("#pattern-I2").classList.contains("markedPattern")
        let N2 = document.querySelector("#pattern-N2").classList.contains("markedPattern")
        let G2 = document.querySelector("#pattern-G2").classList.contains("markedPattern")
        let O2 = document.querySelector("#pattern-O2").classList.contains("markedPattern")
        let B3 = document.querySelector("#pattern-B3").classList.contains("markedPattern")
        let I3 = document.querySelector("#pattern-I3").classList.contains("markedPattern")
        let G3 = document.querySelector("#pattern-G3").classList.contains("markedPattern")
        let O3 = document.querySelector("#pattern-O3").classList.contains("markedPattern")
        let B4 = document.querySelector("#pattern-B4").classList.contains("markedPattern")
        let I4 = document.querySelector("#pattern-I4").classList.contains("markedPattern")
        let N4 = document.querySelector("#pattern-N4").classList.contains("markedPattern")
        let G4 = document.querySelector("#pattern-G4").classList.contains("markedPattern")
        let O4 = document.querySelector("#pattern-O4").classList.contains("markedPattern")
        let B5 = document.querySelector("#pattern-B5").classList.contains("markedPattern")
        let I5 = document.querySelector("#pattern-I5").classList.contains("markedPattern")
        let N5 = document.querySelector("#pattern-N5").classList.contains("markedPattern")
        let G5 = document.querySelector("#pattern-G5").classList.contains("markedPattern")
        let O5 = document.querySelector("#pattern-O5").classList.contains("markedPattern")

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

        API.post(`Binggo/set_binggo_wining_pattern`, {
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
        }).then(res => {
            if(res.data.status === "SUCCESS"){

                document.querySelector(".stepOne").classList.add("disabled")
                document.querySelector(".stepOne p").classList.remove("font-weight-boler")
                document.querySelector(".btnWinningPattern").classList.add("d-none")
                document.querySelector(".stepTwo").classList.remove("disabled")
                document.querySelector(".stepTwo p").classList.add("font-weight-boler")
                document.querySelector(".btnStartBingo").classList.remove("d-none")
                document.querySelector(".close").click()
            }

        }).catch(err => {
            console.log(err)
        });

    }

    BingoStart = (e) => {

        API.post(`Binggo/start_game`, {
            binggo_event_id: room
        }).then(res => {
            if(res.data.status === "SUCCESS"){

                document.querySelector(".stepTwo").classList.add("disabled")
                document.querySelector(".stepTwo p").classList.remove("font-weight-bolder") 
                document.querySelector(".btnStartBingo").classList.add("d-none")

                document.querySelector(".stepThree").classList.remove("disabled")
                document.querySelector(".stepThree p").classList.add("font-weight-bolder") 
                document.querySelector(".btnDrawNumber").classList.remove("d-none")

                socket.emit('eventStart', true);
            }

        }).catch(err => {
            console.log(err)
        });

    }

    CheckWinningPatternExist = () => {

        API.post(`Binggo/fetch_draw_logs`, {
            binggo_event_id: room,
            binggo_event_count: this.state.gamePhase
        }).then(res => {
            
        }).catch(err => {
            console.log(err)
        });

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

        // console.log("ORIGINAL FORMAT")
        // console.log(populate)

        for(let i = 0; this.state.drawLogs.length > i; i++){
            const _ballIndex = populate.indexOf( this.state.drawLogs[i] );
            if ( _ballIndex > -1 ) populate.splice( _ballIndex, 1 );
        }

        // console.log("NEW FORMAT")
        // console.log(populate)

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
    
    DrawBall = (e) => {

        var btnDrawBall = e.target

        btnDrawBall.setAttribute("disabled", true)

        document.getElementById("drawBuffer").classList.remove("d-none")

        var _ball = this.RandomBallSelector();
            // const _drawnNumber = parseInt( _ball.split( '-' )[ 1 ] );
        
            if( this.state.BallCount > 0 ) {

                API.post(`Binggo/insert_draw_logs`, {

                    binggo_event_id: room,
                    binggo_draw: _ball,
                    bdl_created_by: user_id,
                    binggo_event_count: this.state.gamePhase

                }).then(res => {

                    if(res.data.status === "SUCCESS"){

                        
                        API.post(`Binggo/fetch_draw_logs`, {
                            binggo_event_id: room,
                            binggo_event_count: this.state.gamePhase
                        }).then(res => {

                            if(res.data.status === "SUCCESS"){

                                for(var i = 0; res.data.payload.length > i; i ++ ){
                                    CollectDraw.push(res.data.payload[i].binggo_draw)
                                    document.getElementById(`js-caller-${res.data.payload[i].binggo_draw}`).classList.add("marked")
                                    if(res.data.payload.length === i+1){
                                        setTimeout(function(){
                                            document.querySelector(".list-draw").firstChild.innerHTML = `<b class="text-primary">Current Draw:</b> "${res.data.payload[0].binggo_draw}"`
                                        })
                                    }
                                }

                                let countAllDraw = res.data.payload.length
                                let getBallCount = this.state.BallCount

                                let total = getBallCount - countAllDraw

                    

                                


                                this.setState({ totalDraw: res.data.payload.length })
                                this.setState({ drawLogs : CollectDraw })
                                socket.emit('drawAllBall', CollectDraw);
                                socket.emit('drawBall', _ball);
                                this.PopBall(_ball)
                                document.getElementById("js-caller-"+_ball).classList.add("marked")
                                document.getElementById("drawBuffer").classList.add("d-none")
                                btnDrawBall.removeAttribute("disabled")
                                
                                if( total === 0 ) {

                                    document.querySelector(".btnDrawNumber").remove()
                                    document.querySelector(".stepThree").classList.add("disabled")
                                    document.querySelector(".stepThree p").classList.remove("font-weight-bolder") 

                                    document.querySelector(".btnBingo").classList.remove("d-none")
                                    document.querySelector(".stepFour").classList.remove("disabled")
                                    document.querySelector(".stepFour p").classList.add("font-weight-bolder")
                    
                                }

                                CollectDraw = []

                                console.log("BALL COUNT" + total)
                                
                            }else{

                            }
                        }).catch(err => {
                            console.log(err)
                        });

                    }


                }).catch(err => {
                    console.log(err)
                });
                
                
        
            }

    
    };

    BingoEnd = (e) => {

        var btnBingoEnd = e.target
        btnBingoEnd.setAttribute("disabled", true)

        API.post(`Binggo/end_game`, {
            binggo_event_id: room
        }).then(res => {
            if(res.data.status === "SUCCESS"){
                window.location.reload()
            }
        }).catch(err => {
            console.log(err)
        });


    }

    render() {

        return (
            <>
                
                <div className="modal fade" id="endGame" tabIndex="-1" aria-labelledby="endGame" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            <div className="modal-body text-center">
                                <p style={{ fontSize : 2 + 'rem', fontWeight : 900 }}>GAME HAS ALREADY ENDED</p>
                                (<a href="/admin-dashboard">return home</a>)
                            </div>

                        </div>
                    </div>
                </div>

                <div className="modal fade" id="setWinningPattern" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">

                            <div className="modal-header">

                                <h5 className="modal-title" id="exampleModalLabel">Set Winning Pattern</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>

                            </div>

                            <div className="modal-body text-center">
                            
                                <table id="winning-pattern-card" className="table text-center mx-auto" data-set="false">
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
                                            <td className="pattern markedPattern" data-cell="N3">FREE</td>
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

                                <button id="GetPattern" className="btn btn-primary mx-auto w-50 mt-3" onClick={this.GetPattern}>Set</button>

                            </div>

                        </div>
                    </div>
                </div>

                <Header />
                <div id="bingo-body" className="container-fluid pt-0">

                    <div className="row pt-3">

                        <div className="col-xl-4">

                            <ul className="list-group rounded-0 small">
                                <li className="stepOne list-group-item disabled">
                                    <p className="float-left p-0 m-0">Step 1: Set bingo winning pattern</p>
                                    <button type="button" className="btnWinningPattern btn btn-sm btn-link float-right p-0 m-0 d-none" style={{ fontSize: 12 + 'px' }} data-toggle="modal" data-target="#setWinningPattern">Set</button>
                                    <button type="button" className="btnViewPattern btn btn-sm btn-link float-right p-0 m-0 d-none" style={{ fontSize: 12 + 'px' }} data-toggle="modal" data-target="#setWinningPattern" onClick={this.viewPattern}>View Pattern</button>
                                </li>
                                <li className="stepTwo list-group-item disabled">
                                    <p className="float-left p-0 m-0">Step 2: Start bingo event</p>
                                    <button type="button" className="btnStartBingo btn btn-sm btn-link float-right p-0 m-0 d-none" style={{ fontSize: 12 + 'px' }} onClick={this.BingoStart}>Start</button>
                                </li>
                                <li className="stepThree list-group-item disabled">
                                    <p className="float-left p-0 m-0">Step 3: Draw until</p> <p className="float-left p-0 m-0 ml-1">({this.state.totalDraw}/75)</p>
                                    <button type="button" className="btnDrawNumber btn btn-sm btn-link float-right p-0 m-0 d-none" style={{ fontSize: 12 + 'px' }} onClick={this.DrawBall}>Draw <div id="drawBuffer" className="spinner-border spinner-border-sm d-none" role="status"><span className="sr-only">Loading...</span></div></button>
                                </li>
                                <li className="stepFour list-group-item disabled">
                                    <p className="float-left p-0 m-0">Step 4: End Bingo</p>
                                    <button type="button" className="btnBingo btn btn-sm btn-link float-right p-0 m-0 d-none" style={{ fontSize: 12 + 'px' }} onClick={this.BingoEnd}>BINGO!</button>
                                </li>
                            </ul>

                        </div>

                        <div className="col-xl-5">

                        <div className="card rounded-0">
                            <div className="card-header font-weight-bold bg-white">
                                Bingo Activity
                            </div>
                            {this.state.drawLogs.length > 0 ? (
                            <ul className="list-group list-group-flush" style={{ maxHeight : 70 + 'vh', overflowX : 'auto' }}>
                                {this.state.drawLogs.map((list, index) => 
                                <li className="list-group-item list-draw" key={index}>
                                    <p className="mb-0 small float-left"><b>Ball Draw:</b> "{list}"</p>
                                </li>
                                )}
                            </ul>
                                    
                                ):(
                                    <span></span>
                                )
                            }
                        </div>

                        </div>

                        <div className="col-xl-3">

                            <table id="bingo-caller" className="table table-sm table-bordered text-center">
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

                    <button type="button" id="triggerEndGame" className="d-none" data-toggle="modal" data-target="#endGame"></button>
                </div>
            </>
        );
    }

}

export default Game;