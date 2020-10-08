import React, { Component } from 'react'
import io from 'socket.io-client'
import Header from './header';
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

class Game extends Component {

    state = {
        populate: [],
        ballarr: [],
        cardnumarr: [],
        prizes: [],
        lop: [],
        CurrentDraw: '',
        IsCardExist: '',
        eventWinners: [],
        prizeToWin: ''
    };

    constructor() {
        super();

        this.shuffleCard = this.shuffleCard.bind(this)

    }

    componentDidMount() {

        socket.emit('joinRoom', { username, room });

        socket.on('roomUsers', ({ room, users }) => {
            this.setState({ lop: users })
        });

        socket.on('displayWinningPrize', message => {
            this.setState({ prizeToWin: message.text })
        })
        
        socket.on('displayDraw', message => {

            let hasSelected = document.getElementById("bingo-card").getAttribute("data-set")

            if(hasSelected === 'false'){

            }else{

                if(document.querySelectorAll("#select_card").length === 0){

                    this.setState({ CurrentDraw: message.text })
                    document.getElementById("js-caller-"+message.text).classList.add("marked")

                    if(document.querySelectorAll("#recentDraw tbody tr td").length === 5){
                        document.querySelector("#recentDraw tbody tr td:nth-of-type(1)").remove()
                    }

                    var node = document.createElement("td");
                    var textnode = document.createTextNode(message.text);
                    node.appendChild(textnode);
                    document.querySelector("#recentDraw tbody tr").appendChild(node);

                }else{

                }

            }
            
          
        });

        socket.on('displayAllDraw', message => {

            let hasSelected = document.getElementById("bingo-card").getAttribute("data-set")

            if(hasSelected === 'false'){

            }else{

                for(let i = 0; message.text.length > i; i++){
                    document.getElementById("js-caller-"+message.text[i]).classList.add("marked")
                    let ifElementExist = document.querySelectorAll("#js-card-"+message.text[i].split("-")[1]).length

                    if(ifElementExist === 0){
                    }else{

                        let ifElementWithAttrExist = document.querySelector("#js-card-"+message.text[i].split("-")[1]).hasAttribute("data-pattern")

                        if(ifElementWithAttrExist === true || ifElementWithAttrExist === 'true'){
                            document.querySelector("#js-card-"+message.text[i].split("-")[1]).classList.add("bg-success")
                            document.querySelector("#js-card-"+message.text[i].split("-")[1]).setAttribute("data-pattern", true)

                            if(document.querySelectorAll(".js-card-cell[data-pattern='false']").length === "0" || document.querySelectorAll(".js-card-cell[data-pattern='false']").length === 0){
                                document.getElementById("bingo").classList.remove("d-none")
                            }

                        }else{
                            document.querySelector("#js-card-"+message.text[i].split("-")[1]).classList.add("bg-success")

                            if(document.querySelectorAll(".js-card-cell[data-pattern='false']").length === "0" || document.querySelectorAll(".js-card-cell[data-pattern='false']").length === 0){
                                document.getElementById("bingo").classList.remove("d-none")
                            }
                        }

                        

                    

                    }
                }

            }
        });

        socket.on('eventStartTrigger', message => {

            this.getWinningPattern();

            if(message.text === 'true' || message.text === true){

                if(document.getElementById("select_card") === 'null' || document.getElementById("select_card") === null){

                }else{
                    document.getElementById("select_card").click()
                }
            
            }else{

            }
            
          
        });

        socket.on('newGame', message => {
            window.location.reload()
        });

        this.getWinningPattern();
        this.getUserDetails();

        // console.log("--trigger fetch bingo event--")
        API.post(`Binggo/fetch_binggo_event_by_id`, {
            binggo_event_id: room
        }).then(res => {

            if(res.data.status === "SUCCESS"){

                var total_game = parseInt(res.data.payload.binggo_max_game_total) + 1
                var game_remaining = res.data.payload.binggo_max_game
                var game_played = total_game - game_remaining

                const prizeObj = []

                for(let x = 0; res.data.payload.prizes.length > x; x++){
                    prizeObj.push(res.data.payload.prizes[x].prize_desc)
                }

                this.setState({ eventWinners: res.data.payload.winners })
                this.setState({ gamePhase:game_played })
                this.setState({ prizes: prizeObj});

                if(parseInt(game_remaining) === 0){
                    document.getElementById("triggerEndGame").click()
                    document.getElementById("bingo-card-section").remove()
                    document.getElementById("bingo-table-section").remove()
                }

                API.post(`Binggo/fetch_draw_logs`, {
                    binggo_event_id: room,
                    binggo_event_count: game_played
                }).then(res => {
                    if(res.data.status === "SUCCESS"){

                        var fetchDraw = res.data.payload

                        API.post(`https://binggo-test.dokyumento.asia/index.php/Binggo/select_event`, 
                        { 
                            binggo_event_id: localStorage.room_id,
                            user_id: localStorage.user_id 
                        })
                        .then(res => {

                            if(res.data.status === "SUCCESS"){
                
                                if(res.data.payload[0].isCardset === "0" && res.data.payload.length > 0) { 
                                    document.getElementById("bingo-card").setAttribute("data-set", false)
                                }else{
                                    document.getElementById("bingo-card").setAttribute("data-set", true)
                                    
                                    for(let i = 0; fetchDraw.length > i; i++){
                                        document.getElementById("js-caller-"+fetchDraw[i].binggo_draw).classList.add("marked")
                                        
                                        let ifElementExist = document.querySelectorAll("#js-card-"+fetchDraw[i].binggo_draw.split("-")[1]).length
            
                                        if(ifElementExist === 0){
                                        }else{
                                            
                                            let ifElementWithAttrExist = document.querySelector("#js-card-"+fetchDraw[i].binggo_draw.split("-")[1]).hasAttribute("data-pattern")
            
                                            if(ifElementWithAttrExist === true || ifElementWithAttrExist === 'true'){
                                                document.querySelector("#js-card-"+fetchDraw[i].binggo_draw.split("-")[1]).classList.add("bg-success")
                                                document.querySelector("#js-card-"+fetchDraw[i].binggo_draw.split("-")[1]).setAttribute("data-pattern", true)
            
                                                if(document.querySelectorAll(".js-card-cell[data-pattern='false']").length === "0" || document.querySelectorAll(".js-card-cell[data-pattern='false']").length === 0){
                                                    document.getElementById("bingo").classList.remove("d-none")
                                                }
            
                                            }else{
                                                document.querySelector("#js-card-"+fetchDraw[i].binggo_draw.split("-")[1]).classList.add("bg-success")
            
                                                if(document.querySelectorAll(".js-card-cell[data-pattern='false']").length === "0" || document.querySelectorAll(".js-card-cell[data-pattern='false']").length === 0){
                                                    document.getElementById("bingo").classList.remove("d-none")
                                                }
                                            }
                                        }
                                    }

                                }

                            }

                        }).catch(err => {
                            console.log(err)
                        });

                    }
                }).catch(err => {
                    console.log(err)
                });
                
                console.log("PHASE: "+ this.state.gamePhase)
            }

        }).catch(err => {
            console.log(err)
        });


    }

    getDrawLogs = () => {

        let fetchDrawLogs = {
            binggo_event_id: room
        }

        API.post(`https://binggo-test.dokyumento.asia/index.php/Binggo/fetch_draw_logs`, fetchDrawLogs)
        .then(res => {

            if(res.data.status === "SUCCESS"){

                for(let i = 0; res.data.payload.length > i; i++){
                            
                    let ifElementExist = document.querySelectorAll("#js-card-"+res.data.payload[i].binggo_draw.split("-")[1]).length

                    if(ifElementExist === 0){
                    }else{

                        let ifElementWithAttrExist = document.querySelector("#js-card-"+res.data.payload[i].binggo_draw.split("-")[1]).hasAttribute("data-pattern")

                        if(ifElementWithAttrExist === true || ifElementWithAttrExist === 'true'){
                            document.querySelector("#js-card-"+res.data.payload[i].binggo_draw.split("-")[1]).classList.add("bg-success")
                            document.querySelector("#js-card-"+res.data.payload[i].binggo_draw.split("-")[1]).setAttribute("data-pattern", true)

                            if(document.querySelectorAll(".js-card-cell[data-pattern='false']").length === "0" || document.querySelectorAll(".js-card-cell[data-pattern='false']").length === 0){
                                document.getElementById("bingo").classList.remove("d-none")
                            }

                        }else{
                            document.querySelector("#js-card-"+res.data.payload[i].binggo_draw.split("-")[1]).classList.add("bg-success")

                            if(document.querySelectorAll(".js-card-cell[data-pattern='false']").length === "0" || document.querySelectorAll(".js-card-cell[data-pattern='false']").length === 0){
                                document.getElementById("bingo").classList.remove("d-none")
                            }
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

        API.post(`Binggo/fetch_winning_pattern`, {
            binggo_event_id: localStorage.room_id
        }).then(res => {
            if(res.data.status === "SUCCESS"){

                this.setState({ prizeToWin: res.data.payload[0].prize_desc })

                if(res.data.payload[0].B1 === "1") { document.querySelector(".B1").setAttribute("data-pattern", false); document.querySelector(".B1").classList.add("marked") }
                if(res.data.payload[0].B2 === "1") { document.querySelector(".B2").setAttribute("data-pattern", false); document.querySelector(".B2").classList.add("marked") }
                if(res.data.payload[0].B3 === "1") { document.querySelector(".B3").setAttribute("data-pattern", false); document.querySelector(".B3").classList.add("marked") }
                if(res.data.payload[0].B4 === "1") { document.querySelector(".B4").setAttribute("data-pattern", false); document.querySelector(".B4").classList.add("marked") }
                if(res.data.payload[0].B5 === "1") { document.querySelector(".B5").setAttribute("data-pattern", false); document.querySelector(".B5").classList.add("marked") }

                if(res.data.payload[0].I1 === "1") { document.querySelector(".I1").setAttribute("data-pattern", false); document.querySelector(".I1").classList.add("marked") }
                if(res.data.payload[0].I2 === "1") { document.querySelector(".I2").setAttribute("data-pattern", false); document.querySelector(".I2").classList.add("marked") }
                if(res.data.payload[0].I3 === "1") { document.querySelector(".I3").setAttribute("data-pattern", false); document.querySelector(".I3").classList.add("marked") }
                if(res.data.payload[0].I4 === "1") { document.querySelector(".I4").setAttribute("data-pattern", false); document.querySelector(".I4").classList.add("marked") }
                if(res.data.payload[0].I5 === "1") { document.querySelector(".I5").setAttribute("data-pattern", false); document.querySelector(".I5").classList.add("marked") }

                if(res.data.payload[0].N1 === "1") { document.querySelector(".N1").setAttribute("data-pattern", false); document.querySelector(".N1").classList.add("marked") }
                if(res.data.payload[0].N2 === "1") { document.querySelector(".N2").setAttribute("data-pattern", false); document.querySelector(".N2").classList.add("marked") }
                // if(res.data.payload[0].N3 === "1") { document.querySelector(".N3").setAttribute("data-pattern", false) }
                if(res.data.payload[0].N4 === "1") { document.querySelector(".N4").setAttribute("data-pattern", false); document.querySelector(".N4").classList.add("marked") }
                if(res.data.payload[0].N5 === "1") { document.querySelector(".N5").setAttribute("data-pattern", false); document.querySelector(".N5").classList.add("marked") }

                if(res.data.payload[0].G1 === "1") { document.querySelector(".G1").setAttribute("data-pattern", false); document.querySelector(".G1").classList.add("marked") }
                if(res.data.payload[0].G2 === "1") { document.querySelector(".G2").setAttribute("data-pattern", false); document.querySelector(".G2").classList.add("marked") }
                if(res.data.payload[0].G3 === "1") { document.querySelector(".G3").setAttribute("data-pattern", false); document.querySelector(".G3").classList.add("marked") }
                if(res.data.payload[0].G4 === "1") { document.querySelector(".G4").setAttribute("data-pattern", false); document.querySelector(".G4").classList.add("marked") }
                if(res.data.payload[0].G5 === "1") { document.querySelector(".G5").setAttribute("data-pattern", false); document.querySelector(".G5").classList.add("marked") }

                if(res.data.payload[0].O1 === "1") { document.querySelector(".O1").setAttribute("data-pattern", false); document.querySelector(".O1").classList.add("marked")}
                if(res.data.payload[0].O2 === "1") { document.querySelector(".O2").setAttribute("data-pattern", false); document.querySelector(".O2").classList.add("marked")}
                if(res.data.payload[0].O3 === "1") { document.querySelector(".O3").setAttribute("data-pattern", false); document.querySelector(".O3").classList.add("marked")}
                if(res.data.payload[0].O4 === "1") { document.querySelector(".O4").setAttribute("data-pattern", false); document.querySelector(".O4").classList.add("marked")}
                if(res.data.payload[0].O5 === "1") { document.querySelector(".O5").setAttribute("data-pattern", false); document.querySelector(".O5").classList.add("marked")}

            }

        }).catch(err => {
            console.log(err)
        });

    }

    getUserDetails = () => {

        API.post(`https://binggo-test.dokyumento.asia/index.php/Binggo/select_event`, 
        { 
            binggo_event_id: localStorage.room_id,
            user_id: localStorage.user_id 
        })
        .then(res => {

            if(res.data.status === "SUCCESS"){
                
                if(res.data.payload[0].isCardset === "0") { 

                    if(res.data.payload[0].B1 === null){
                        alert("Please select your card")
                        document.getElementById("shuffle").click()
                    }else{

                        document.getElementById("bingo-card").setAttribute("data-set", true)
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

                    }

                } else { 

                    document.getElementById("bingo-card").setAttribute("data-set", true)
                    document.getElementById("shuffle").remove()
                    document.getElementById("select_card").remove()
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

        API.post(`https://binggo-test.dokyumento.asia/index.php/Binggo/select_card`, bingo_card_data)
        .then(res => {
            if(res.data.status === "SUCCESS"){
                document.getElementById("bingo-card").setAttribute("data-set", true)
                document.getElementById("shuffle").remove()
                document.getElementById("select_card").remove()
            }
            
        })
        
    }
    
    Bingo = () => {
        socket.emit('playerBingo', {
            playerID: user_id,
            status: 'true',
            pattern: '--pause--'
        });
    }



    render() {

        function HighlightName(props) {
            const isLoggedIn = props.username;

            if (isLoggedIn === localStorage.name) {
                return <p className="m-0"><strong>{isLoggedIn}</strong></p>;
            }
            return <p className="m-0">{isLoggedIn}</p>;
        }

        return (
            <>

                <div className="modal fade" id="endGame" tabIndex="-1" aria-labelledby="endGame" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            <div className="modal-body text-center">
                                <p style={{ fontSize : 2 + 'rem', fontWeight : 900 }}>GAME HAS ALREADY ENDED</p>
                                (<a href="/">return home</a>)
                            </div>

                        </div>
                    </div>
                </div>

                <div className="modal fade" id="showWinners" tabIndex="-1" aria-labelledby="endGame" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            <div className="modal-body text-center">
                            <h4 className="mb-0">List of Winners</h4>
                                {this.state.eventWinners.length > 0 ? (
                                    <ul className="list-group list-group-flush" style={{ maxHeight: 50+'vh', overflowX: 'auto' }}>
                                        {this.state.eventWinners.map((list, index) => 
                                            <li className="list-group-item" key={list.bew_id}>
                                                <p className="mb-0"><b>{index+1}:</b> {list.user_fullname}</p>
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

                <div className="modal fade" id="showPrizes" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">

                            <div className="modal-body text-center">
                            <h4 className="mb-0">List of Prizes Left</h4>
                                {this.state.prizes.length > 0 ? (
                                    <ul className="list-group list-group-flush" style={{ maxHeight: 50+'vh', overflowX: 'auto' }}>
                                        {this.state.prizes.map((list, index) => 
                                            <li className="list-group-item" key={index}>
                                                <p className="mb-0"><b>{index+1}:</b> {list}</p>
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
            
                <Header />
                <div className="container-fluid my-4 mb-4">
                    <div className="row">
                        <div className="col-xl-4">

                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="card pb-0">
                                        <div className="card-body">
                                            <p className="mb-3 panel-title float-right">CURRENT DRAW</p>
                                            <p id="current_draw"><strong>{this.state.CurrentDraw ? this.state.CurrentDraw : 0}</strong></p>
                                            <table id="recentDraw" className="table">
                                                <thead className="d-none">
                                                    <tr>
                                                        <th>Last</th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        <th>Current</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            <button type="button" className="btn btn-sm btn-link small p-0 m-0 mr-1" data-toggle="modal" data-target="#showPrizes">Show Prices</button> 
                                            | 
                                            {this.state.eventWinners.length > 0 ? (
                                                <button type="button" className="btn btn-sm btn-link small p-0 m-0 ml-1" data-toggle="modal" data-target="#showWinners">Show Winners</button> 
                                            ):(
                                                <button type="button" className="btn btn-sm btn-link text-muted small p-0 m-0 ml-1" disabled>No Winners Yet</button> 
                                            )
                                            }
                                            
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-12 mt-3">
                                    <div className="card">
                                        <div className="card-body">
                                            <p className="mb-3 panel-title float-right">PARTICIPANTS ({this.state.lop.length})</p>
                                            <span className="clearfix"></span>
                                            
                                            {this.state.lop.length > 0 ? (
                                                <>
                                                    {
                                                    this.state.lop.map((data, index) => (
                                                        <div key={index} className="card border-0 rounded-0 shadow-sm mb-1 p-2 pl-3">
                                                            <HighlightName key={index} username={data.username} />
                                                        </div>
                                                        
                                                    ))}
                                                </>
                                            ):(
                                                <p>-- No Winners Yet --</p>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div id="bingo-card-section" className="col-xl-4">

                            <div className="card mx-auto">
                                <div className="card-body text-center">
                                    <h3 className="text-center m-0 p-0" style={{ fontWeight: 900 }}>{this.state.prizeToWin}</h3>
                                    <p className="small text-center m-0 p-0 mb-3">prize to win</p>
                                    <h3 className="d-none">{localStorage.name}</h3>

                                    <table id="bingo-card" className="table table-borderless mx-auto" data-set="false">
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

                                    <div className="btn-group w-100" role="group" aria-label="Basic example">
                                        <button id="shuffle" className="btn btn-dark btn-sm" onClick={this.shuffleCard}>SHUFFLE CARD</button>
                                        <button id="select_card" className="btn btn-dark btn-sm" onClick={this.selectCard}>SELECT CARD</button>
                                        <button id="bingo" className="btn btn-dark btn-block btn-sm d-none" onClick={this.Bingo}>BINGO</button>
                                    </div>

                                </div>

                            </div>
                        </div>
                        <div id="bingo-table-section" className="col-xl-4 bg-white">
                            
                            <div className="card mx-auto">
                                <div className="card-body text-center" style={{ maxHeight: 85 + 'vh', overflowX: 'auto'}}>
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

                        </div>
                    </div>
                </div>
                <button type="button" id="triggerEndGame" className="d-none" data-toggle="modal" data-target="#endGame"></button>
        </>
        );
    }

}

export default Game;