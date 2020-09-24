import React, { Component } from 'react'
import io from 'socket.io-client'
import axios from 'axios';
import './style.css';

var socket = io.connect('http://localhost:4000')
var room = localStorage.room_id
var user_id = localStorage.user_id
var username = localStorage.name

class Game extends Component {

    state = {
        populate: [],
        ballarr: [],
        cardnumarr: [],
        prizes: [],
        lop: [],
        CurrentDraw: '',
        IsCardExist: ''
    };

    constructor() {
        super();

        this.shuffleCard = this.shuffleCard.bind(this)

    }

    componentDidMount() {

        socket.emit('joinRoom', { username, room });

        socket.on('roomUsers', ({ room, users }) => {
            console.log(room)
            console.log(users)
            this.setState({ lop: users })
        });

        socket.on('displayDraw', message => {

            let hasSelected = document.getElementById("bingo-card").getAttribute("data-set")

            if(hasSelected === 'false'){

            }else{

                this.setState({ CurrentDraw: message.text })

            }
            
          
        });

        socket.on('displayAllDraw', message => {

            let hasSelected = document.getElementById("bingo-card").getAttribute("data-set")

            if(hasSelected === 'false'){

            }else{

                for(let i = 0; message.text.length > i; i++){
                    var element = document.querySelector("#js-card-"+message.text[i].split("-")[1]);
    
                    if(element === null || element === 'null'){
                        console.log("Does not exist")
                    }else{
                        element.classList.add("bg-success")
                        element.setAttribute("data-pattern", true)
    
                        // alert(document.querySelectorAll(".js-card-cell[data-pattern='false']").length)
    
                        if(document.querySelectorAll(".js-card-cell[data-pattern='false']").length === "0" || document.querySelectorAll(".js-card-cell[data-pattern='false']").length === 0){
                            // alert("BINGGO MADERFAKKERS")
                            document.getElementById("bingo").classList.remove("d-none")
                        }else{
                            
                        }
    
                    }
                }

            }

            console.log(message)
        });

        
        this.getPrices();
        this.getWinningPattern();
        this.getUserDetails();


    }

    getPrices = () => {

        let pl = JSON.parse(localStorage.prizes)

        for(let i = 0; pl.length > i; i++){

            this.setState({prizes: pl[i]})

        }

    }

    getDrawLogs = () => {

        let fetchDrawLogs = {
            binggo_event_id: room
        }

        axios.post(`Binggo/fetch_draw_logs`, fetchDrawLogs)
        .then(res => {

            if(res.data.status === "SUCCESS"){

                for(let i = 0; res.data.payload.length > i; i++){
                    var element = document.querySelector("#js-card-"+res.data.payload[i].binggo_draw.split("-")[1]);

                    if(element === null || element === 'null'){
                        console.log("Does not exist")
                    }else{
                        element.classList.add("bg-success")
                        element.setAttribute("data-pattern", true)

                        // alert(document.querySelectorAll(".js-card-cell[data-pattern='false']").length)

                        if(document.querySelectorAll(".js-card-cell[data-pattern='false']").length === "0" || document.querySelectorAll(".js-card-cell[data-pattern='false']").length === 0){
                            // alert("BINGGO MADERFAKKERS")
                            document.getElementById("bingo").classList.remove("d-none")
                        }else{
                            
                        }

                    }
                }


            }else{

            }
        })

    }

    check = () => {
        console.log("Is card set")
        console.log(this.state.IsCardExist)
    }
    
    getWinningPattern = () => {
        axios.post(`Binggo/fetch_winning_pattern`, 
        { 
            binggo_event_id: localStorage.room_id,
        })
        .then(res => {

            if(res.data.payload[0].B1 === "1") { document.querySelector(".B1").setAttribute("data-pattern", false) }
            if(res.data.payload[0].B2 === "1") { document.querySelector(".B2").setAttribute("data-pattern", false) }
            if(res.data.payload[0].B3 === "1") { document.querySelector(".B3").setAttribute("data-pattern", false) }
            if(res.data.payload[0].B4 === "1") { document.querySelector(".B4").setAttribute("data-pattern", false) }
            if(res.data.payload[0].B5 === "1") { document.querySelector(".B5").setAttribute("data-pattern", false) }

            if(res.data.payload[0].I1 === "1") { document.querySelector(".I1").setAttribute("data-pattern", false) }
            if(res.data.payload[0].I2 === "1") { document.querySelector(".I2").setAttribute("data-pattern", false) }
            if(res.data.payload[0].I3 === "1") { document.querySelector(".I3").setAttribute("data-pattern", false) }
            if(res.data.payload[0].I4 === "1") { document.querySelector(".I4").setAttribute("data-pattern", false) }
            if(res.data.payload[0].I5 === "1") { document.querySelector(".I5").setAttribute("data-pattern", false) }

            if(res.data.payload[0].N1 === "1") { document.querySelector(".N1").setAttribute("data-pattern", false) }
            if(res.data.payload[0].N2 === "1") { document.querySelector(".N2").setAttribute("data-pattern", false) }
            // if(res.data.payload[0].N3 === "1") { document.querySelector(".N3").setAttribute("data-pattern", false) }
            if(res.data.payload[0].N4 === "1") { document.querySelector(".N4").setAttribute("data-pattern", false) }
            if(res.data.payload[0].N5 === "1") { document.querySelector(".N5").setAttribute("data-pattern", false) }

            if(res.data.payload[0].G1 === "1") { document.querySelector(".G1").setAttribute("data-pattern", false) }
            if(res.data.payload[0].G2 === "1") { document.querySelector(".G2").setAttribute("data-pattern", false) }
            if(res.data.payload[0].G3 === "1") { document.querySelector(".G3").setAttribute("data-pattern", false) }
            if(res.data.payload[0].G4 === "1") { document.querySelector(".G4").setAttribute("data-pattern", false) }
            if(res.data.payload[0].G5 === "1") { document.querySelector(".G5").setAttribute("data-pattern", false) }

            if(res.data.payload[0].O1 === "1") { document.querySelector(".O1").setAttribute("data-pattern", false) }
            if(res.data.payload[0].O2 === "1") { document.querySelector(".O2").setAttribute("data-pattern", false) }
            if(res.data.payload[0].O3 === "1") { document.querySelector(".O3").setAttribute("data-pattern", false) }
            if(res.data.payload[0].O4 === "1") { document.querySelector(".O4").setAttribute("data-pattern", false) }
            if(res.data.payload[0].O5 === "1") { document.querySelector(".O5").setAttribute("data-pattern", false) }

        })
        .catch(err => {
            console.log(err)
        });
    }


    getUserDetails = () => {

        axios.post(`Binggo/select_event`, 
        { 
            binggo_event_id: localStorage.room_id,
            user_id: localStorage.user_id 
        })
        .then(res => {

            if(res.data.status === "SUCCESS"){

                console.log("THE RESULT")
                console.log(res.data)
                
                if(res.data.payload[0].isCardset === "0") { 

                    alert("NOT EXIST")
                    document.getElementById("shuffle").click()
                    // this.populateCard()
                    
                } else { 
                    
                    alert("EXIST")

                    document.getElementById("bingo-card").setAttribute("data-set", true)
                    document.getElementById("shuffle").remove()
                    document.getElementById("select_card").remove()

                    console.log("ANG BINGO CARD KO")
                    console.log(res.data)

                    
                    document.getElementById("B1").innerHTML = res.data.payload[0].B1
                    document.getElementById("B1").id = 'js-card-'+res.data.payload[0].B1
                    document.getElementById("B2").innerHTML = res.data.payload[0].B2
                    document.getElementById("B2").id = 'js-card-'+res.data.payload[0].B2
                    document.getElementById("B3").innerHTML = res.data.payload[0].B3
                    document.getElementById("B3").id = 'js-card-'+res.data.payload[0].B3
                    document.getElementById("B4").innerHTML = res.data.payload[0].B4
                    document.getElementById("B4").id = 'js-card-'+res.data.payload[0].B4
                    document.getElementById("B5").innerHTML = res.data.payload[0].B5
                    document.getElementById("B5").id = 'js-card-'+res.data.payload[0].B5

                    document.getElementById("I1").innerHTML = res.data.payload[0].I1
                    document.getElementById("I1").id = 'js-card-'+res.data.payload[0].I1
                    document.getElementById("I2").innerHTML = res.data.payload[0].I2
                    document.getElementById("I2").id = 'js-card-'+res.data.payload[0].I2
                    document.getElementById("I3").innerHTML = res.data.payload[0].I3
                    document.getElementById("I3").id = 'js-card-'+res.data.payload[0].I3
                    document.getElementById("I4").innerHTML = res.data.payload[0].I4
                    document.getElementById("I4").id = 'js-card-'+res.data.payload[0].I4
                    document.getElementById("I5").innerHTML = res.data.payload[0].I5
                    document.getElementById("I5").id = 'js-card-'+res.data.payload[0].I5

                    document.getElementById("N1").innerHTML = res.data.payload[0].N1
                    document.getElementById("N1").id = 'js-card-'+res.data.payload[0].N1
                    document.getElementById("N2").innerHTML = res.data.payload[0].N2
                    document.getElementById("N2").id = 'js-card-'+res.data.payload[0].N2
                    document.getElementById("N3").innerHTML = 'FREE'
                    document.getElementById("N3").id = 'js-card-'+res.data.payload[0].N3
                    document.getElementById("N4").innerHTML = res.data.payload[0].N4
                    document.getElementById("N4").id = 'js-card-'+res.data.payload[0].N4
                    document.getElementById("N5").innerHTML = res.data.payload[0].N5
                    document.getElementById("N5").id = 'js-card-'+res.data.payload[0].N5

                    document.getElementById("G1").innerHTML = res.data.payload[0].G1
                    document.getElementById("G1").id = 'js-card-'+res.data.payload[0].G1
                    document.getElementById("G2").innerHTML = res.data.payload[0].G2
                    document.getElementById("G2").id = 'js-card-'+res.data.payload[0].G2
                    document.getElementById("G3").innerHTML = res.data.payload[0].G3
                    document.getElementById("G3").id = 'js-card-'+res.data.payload[0].G3
                    document.getElementById("G4").innerHTML = res.data.payload[0].G4
                    document.getElementById("G4").id = 'js-card-'+res.data.payload[0].G4
                    document.getElementById("G5").innerHTML = res.data.payload[0].G5
                    document.getElementById("G5").id = 'js-card-'+res.data.payload[0].G5

                    document.getElementById("O1").innerHTML = res.data.payload[0].O1
                    document.getElementById("O1").id = 'js-card-'+res.data.payload[0].O1
                    document.getElementById("O2").innerHTML = res.data.payload[0].O2
                    document.getElementById("O2").id = 'js-card-'+res.data.payload[0].O2
                    document.getElementById("O3").innerHTML = res.data.payload[0].O3
                    document.getElementById("O3").id = 'js-card-'+res.data.payload[0].O3
                    document.getElementById("O4").innerHTML = res.data.payload[0].O4
                    document.getElementById("O4").id = 'js-card-'+res.data.payload[0].O4
                    document.getElementById("O5").innerHTML = res.data.payload[0].O5
                    document.getElementById("O5").id = 'js-card-'+res.data.payload[0].O5

                    this.getDrawLogs()

                }
            }else{

            }

        })
        .catch(err => {
            console.log(err)
        });

    }
    
    isValidNumber = ( num, arr = [] ) => {

        if ( !arr.includes( num ) ) {
    
            return true;
    
        } else {
    
            return false;
    
        }
    
    };

    generateRandomNumber = ( max, min = 0, arr = [] ) => {

        const _max = Math.floor( max );
        const _min = Math.ceil( min );
        const _arr = arr;
        // random number between and including range
        const _num = Math.floor( Math.random() * ( _max - _min + 1 ) ) + _min;
    
        // Make sure random number doesn't already exist in the array
        if ( this.isValidNumber( _num, _arr ) ) {
    
            _arr.push( _num );
    
            return _num;
    
        } else {
    
            return this.generateRandomNumber( _max, _min, _arr );
    
        }
        
    
    };

    randomBallSelector = () => {

        const _ballCount  = this.state.ballarr.length;
        const _randomBall = this.generateRandomNumber( _ballCount - 1 );
    
        return this.state.ballarr[ _randomBall ];
    
    };

    populateCard = () => {

        this.setState({cardnumarr: []});
    
        for ( let i = 25 - 1; i >= 0; i-- ) {
    
            let _randomNumber = this.generateRandomNumber( document.getElementsByClassName( 'js-card-cell' )[ i ].dataset.max,
                                                            document.getElementsByClassName( 'js-card-cell' )[ i ].dataset.min,
                                                            this.state.cardnumarr );

            document.getElementsByClassName( 'js-card-cell' )[ i ].classList.remove( 'marked' );
            document.getElementsByClassName( 'js-card-cell' )[ i ].innerHTML = _randomNumber;
            document.getElementsByClassName( 'js-card-cell' )[ i ].id = 'js-card-' + _randomNumber;

            document.getElementsByClassName( 'js-card-cell' )[ 12 ].innerHTML = 'FREE';
            document.getElementsByClassName( 'js-card-cell' )[ 12 ].className = 'js-card-cell N3 marked';
            document.getElementsByClassName( 'js-card-cell' )[ 12 ].removeAttribute("id");

            document.getElementsByClassName( 'js-card-cell' )[ 0 ].className = 'js-card-cell B1';
            document.getElementsByClassName( 'js-card-cell' )[ 1 ].className = 'js-card-cell I1';
            document.getElementsByClassName( 'js-card-cell' )[ 2 ].className = 'js-card-cell N1';
            document.getElementsByClassName( 'js-card-cell' )[ 3 ].className = 'js-card-cell G1';
            document.getElementsByClassName( 'js-card-cell' )[ 4 ].className = 'js-card-cell O1';

            document.getElementsByClassName( 'js-card-cell' )[ 5 ].className = 'js-card-cell B2';
            document.getElementsByClassName( 'js-card-cell' )[ 6 ].className = 'js-card-cell I2';
            document.getElementsByClassName( 'js-card-cell' )[ 7 ].className = 'js-card-cell N2';
            document.getElementsByClassName( 'js-card-cell' )[ 8 ].className = 'js-card-cell G2';
            document.getElementsByClassName( 'js-card-cell' )[ 9 ].className = 'js-card-cell O2';

            document.getElementsByClassName( 'js-card-cell' )[ 10 ].className = 'js-card-cell B3';
            document.getElementsByClassName( 'js-card-cell' )[ 11 ].className = 'js-card-cell I3';
            document.getElementsByClassName( 'js-card-cell' )[ 12 ].innerHTML = 'FREE';
            document.getElementsByClassName( 'js-card-cell' )[ 12 ].className = 'js-card-cell N3 marked';
            document.getElementsByClassName( 'js-card-cell' )[ 12 ].removeAttribute("id");
            document.getElementsByClassName( 'js-card-cell' )[ 13 ].className = 'js-card-cell G3';
            document.getElementsByClassName( 'js-card-cell' )[ 14 ].className = 'js-card-cell O3';

            document.getElementsByClassName( 'js-card-cell' )[ 15 ].className = 'js-card-cell B4';
            document.getElementsByClassName( 'js-card-cell' )[ 16 ].className = 'js-card-cell I4';
            document.getElementsByClassName( 'js-card-cell' )[ 17 ].className = 'js-card-cell N4';
            document.getElementsByClassName( 'js-card-cell' )[ 18 ].className = 'js-card-cell G4';
            document.getElementsByClassName( 'js-card-cell' )[ 19 ].className = 'js-card-cell O4';

            document.getElementsByClassName( 'js-card-cell' )[ 20 ].className = 'js-card-cell B5';
            document.getElementsByClassName( 'js-card-cell' )[ 21 ].className = 'js-card-cell I5';
            document.getElementsByClassName( 'js-card-cell' )[ 22 ].className = 'js-card-cell N5';
            document.getElementsByClassName( 'js-card-cell' )[ 23 ].className = 'js-card-cell G5';
            document.getElementsByClassName( 'js-card-cell' )[ 24 ].className = 'js-card-cell O5';

    
        }

    }

    shuffleCard(event) {

        this.populateCard()

    }

    selectCard(event) {

        const bingo_card_data = {
            "binggo_event_id": room,
            "user_id": user_id,
            "isCardset": "1",
            "B1": document.querySelector(".B1").innerHTML, 
            "B2": document.querySelector(".B2").innerHTML, 
            "B3": document.querySelector(".B3").innerHTML, 
            "B4": document.querySelector(".B4").innerHTML, 
            "B5": document.querySelector(".B5").innerHTML,
            "I1": document.querySelector(".I1").innerHTML,
            "I2": document.querySelector(".I2").innerHTML,
            "I3": document.querySelector(".I3").innerHTML,
            "I4": document.querySelector(".I4").innerHTML,
            "I5": document.querySelector(".I5").innerHTML,
            "N1": document.querySelector(".N1").innerHTML,
            "N2": document.querySelector(".N2").innerHTML,
            "N3": document.querySelector(".N3").innerHTML,
            "N4": document.querySelector(".N4").innerHTML,
            "N5": document.querySelector(".N5").innerHTML,
            "G1": document.querySelector(".G1").innerHTML,
            "G2": document.querySelector(".G2").innerHTML,
            "G3": document.querySelector(".G3").innerHTML,
            "G4": document.querySelector(".G4").innerHTML,
            "G5": document.querySelector(".G5").innerHTML,
            "O1": document.querySelector(".O1").innerHTML,
            "O2": document.querySelector(".O2").innerHTML,
            "O3": document.querySelector(".O3").innerHTML,
            "O4": document.querySelector(".O4").innerHTML,
            "O5": document.querySelector(".O5").innerHTML
        }

        axios.post(`Binggo/select_card`, bingo_card_data)
        .then(res => {
            if(res.data.status === "SUCCESS"){
                document.getElementById("bingo-card").setAttribute("data-set", true)
                document.getElementById("shuffle").remove()
                document.getElementById("select_card").remove()
            }
            
            console.log(res);
            console.log(res.data);
        })
        
    }

    Bingo = () => {

    }



    render() {

        function HighlightName(props) {
            const isLoggedIn = props.username;

            if (isLoggedIn === localStorage.name) {
                return <li className="list-group-item"><strong>{isLoggedIn}</strong></li>;
            }
            return <li className="list-group-item">{isLoggedIn}</li>;
        }

        return (
            <div id="bingo-body" className="container-fluid bg-dark">
                <div className="row">
                    <div className="col-xl-4 bg-white">

                        <div className="card mx-auto">
                            
                            <div className="card-body text-center">
                                <p>Current Draw</p>
                                <p id="current_draw">{this.state.CurrentDraw}</p>
                            </div>

                            <div className="card-footer">
                                <small className="text-muted">Show Winning Prices</small>  
                            </div>
                        </div>

                        <div className="card mx-auto">
                            <div className="card-header text-center">
                                Participants ({this.state.lop.length})
                            </div>
                            {this.state.lop.length > 0 ? (
                                <ul className="list-group list-group-flush">
                                    {this.state.lop.map((data, index) => (
                                        <HighlightName key={index} username={data.username} />
                                    ))}
                                </ul>
                            ):(
                                <div>
                                </div>
                            )}
                            
                        </div>
                    </div>
                    <div className="col-xl-4 bg-primary">
                        <h1>{localStorage.name}</h1>

                        <table id="bingo-card" className="w-75 mx-auto" data-set="false">
                            <thead>
                                <tr>
                                    <th>B</th>
                                    <th>I</th>
                                    <th>N</th>
                                    <th>G</th>
                                    <th>O</th>
                                </tr>
                            </thead>
                            <tbody id="bingo-card-player" className="bg-white">
                                <tr>
                                    <td id="B1" className="js-card-cell B1" data-min="1" data-max="15"></td>
                                    <td id="I1" className="js-card-cell I1" data-min="16" data-max="30"></td>
                                    <td id="N1" className="js-card-cell N1" data-min="31" data-max="45"></td>
                                    <td id="G1" className="js-card-cell G1" data-min="46" data-max="60"></td>
                                    <td id="O1" className="js-card-cell O1" data-min="61" data-max="75"></td>
                                </tr>
                                <tr>
                                    <td id="B2" className="js-card-cell B2" data-min="1" data-max="15"></td>
                                    <td id="I2" className="js-card-cell I2" data-min="16" data-max="30"></td>
                                    <td id="N2" className="js-card-cell N2" data-min="31" data-max="45"></td>
                                    <td id="G2" className="js-card-cell G2" data-min="46" data-max="60"></td>
                                    <td id="O2" className="js-card-cell O2" data-min="61" data-max="75"></td>
                                </tr>
                                <tr>
                                    <td id="B3" className="js-card-cell B3" data-min="1" data-max="15"></td>
                                    <td id="I3" className="js-card-cell I3" data-min="16" data-max="30"></td>
                                    <td id="N3" className="js-card-cell N3 marked bg-success" data-pattern="true">FREE</td>
                                    <td id="G3" className="js-card-cell G3" data-min="46" data-max="60"></td>
                                    <td id="O3" className="js-card-cell O3" data-min="61" data-max="75"></td>
                                </tr>
                                <tr>
                                    <td id="B4" className="js-card-cell B4" data-min="1" data-max="15"></td>
                                    <td id="I4" className="js-card-cell I4" data-min="16" data-max="30"></td>
                                    <td id="N4" className="js-card-cell N4" data-min="31" data-max="45"></td>
                                    <td id="G4" className="js-card-cell G4" data-min="46" data-max="60"></td>
                                    <td id="O4" className="js-card-cell O4" data-min="61" data-max="75"></td>
                                </tr>
                                <tr>
                                    <td id="B5" className="js-card-cell B5" data-min="1" data-max="15"></td>
                                    <td id="I5" className="js-card-cell I5" data-min="16" data-max="30"></td>
                                    <td id="N5" className="js-card-cell N5" data-min="31" data-max="45"></td>
                                    <td id="G5" className="js-card-cell G5" data-min="46" data-max="60"></td>
                                    <td id="O5" className="js-card-cell O5" data-min="61" data-max="75"></td>
                                </tr>
                            </tbody>
                        </table>

                        <button id="shuffle" className="btn btn-dark btn-block btn-sm" onClick={this.shuffleCard}>SHUFFLE CARD</button>
                        <button id="select_card" className="btn btn-dark btn-block btn-sm" onClick={this.selectCard}>SELECT CARD</button>
                        <button id="bingo" className="btn btn-dark btn-block btn-sm d-none" onClick={this.Bingo}>BINGO</button>
                    </div>
                    <div className="col-xl-4 bg-white">
                        a
                    </div>
                </div>
            </div>
        );
    }

}

export default Game;