/********thinking started from here*************/
// if(eligible(index,posblank))
// {
//     slidetile(index,posblank);
//     updatetile();
//     posblank=index;
//     if(win)
//         add to leaderboard();
// }

//height and width
let height;
let width;
let total;
var arr=[];
//clearing local storage
localStorage.clear();
//IF YOU WANT TO STOP SUFFLING AND TEST THE CODE MAKE IT 0
let SUFFLER=1;

/*************( DECLARING SOME UTILITY FUNCTIONS A)*************/

//checking if tile is clicked
let clicked = 0;
function clicktile() {
    let index;
    for (index = 0; index < total; index++) {
        if (arr[index] == 1) {
            console.log(index, "2");
            arr[index] = 0;
            clicked = 1;
            break;
        }
    }
    return index;
}
//IF THE BLOCK IS ELIGIBLE FOR SLIDING 
function eligible(index, blktile) {
    if (parseInt(index / width) == parseInt(blktile / width) || index % width == blktile % width)
        return 1;
    else
        return 0;
}
//SLIDE THE BLOCK HORIZONTALLY AND VERTICALLY
function slidetile(index, blktile) {
    if (parseInt(index / width) == parseInt(blktile / width)) {
        let diff = index - blktile;
        if (diff < 0)
            while (diff++) {
                swap = part[blktile].innerHTML;
                part[blktile].innerHTML = part[blktile-1].innerHTML;
                part[blktile-1].innerHTML = swap;
                part[blktile--].classList.toggle("ex");
                part[blktile].classList.toggle("ex");
            }
        else
            while (diff--) {
                swap = part[blktile].innerHTML;
                part[blktile].innerHTML = part[blktile+1].innerHTML;
                part[blktile+1].innerHTML = swap;
                part[blktile++].classList.toggle("ex");
                part[blktile].classList.toggle("ex");
            }
    }
    else{
        let diff = parseInt(index/width) - parseInt(blktile/width);
        if (diff < 0)
            while (diff++) {
                swap = part[blktile].innerHTML;
                part[blktile].innerHTML = part[blktile-width].innerHTML;
                part[blktile-width].innerHTML = swap;
                part[blktile].classList.toggle("ex");
                part[blktile-width].classList.toggle("ex");
                blktile-=width;
            }
        else
            while (diff--) {
                swap = part[blktile].innerHTML;
                part[blktile].innerHTML = part[blktile+width].innerHTML;
                part[blktile+width].innerHTML = swap;
                part[blktile].classList.toggle("ex");
                part[blktile+width].classList.toggle("ex");
                blktile+=width;
            }
    }
}
//CHECKING IF I WON OR STILL HASTLING 
function wincheck() {
    part = document.getElementsByClassName("part");
    let win = 1;
    for (let index = 0; index < total-1; index++) {
        if (part[index].innerHTML != part[index + 1].innerHTML - 1)
            win = 0;
    }
    return win;
}
//UPDATING THE LEADERBOARD
function leaderboardupdate(time , move){
    if(localStorage.getItem('itemJson')==null){
        itemJsonArrey = [];
        itemJsonArrey.push({time:time,move:move});
        localStorage.setItem('itemJson',JSON.stringify(itemJsonArrey));
    }
    else{
        itemJsonArreyStr=localStorage.getItem('itemJson');
        itemJsonArrey=JSON.parse(itemJsonArreyStr);
        itemJsonArrey.push({time:time,move:move});
        itemJsonArrey.sort(function(a, b) {          
            if (a.time === b.time) {
               // moves is only important when times are the same
               return a.move - b.move;
            }
            return a.time > b.time ? 1 : -1;
         });
        localStorage.setItem('itemJson',JSON.stringify(itemJsonArrey));
    }
    itemJsonArreyStr=localStorage.getItem('itemJson');
    itemJsonArrey=JSON.parse(itemJsonArreyStr);
    tableBody=document.getElementById("tableBody");
    let str="";
    itemJsonArrey.forEach((element,index) => {
        console.log(element.time+" "+element.move);
        str+=`
        <tr>
        <th scope="col">${element.time}</th>
        <th scope="col">${element.move}</th>
      </tr>`;
    });
    tableBody.innerHTML = str;
}
//SUFFLE THE ARREY
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}
//GENERATING THE ARREY ELEMENTS
let blktile;
function sufflearrey(){
    let brr=[];
    for (let index = 1; index <= total; index++) {
        brr.push(index);
    }
    if(SUFFLER){
        shuffle(brr);
    }
    console.log(brr);
    part = document.getElementsByClassName("part");
    for (let index = 0; index < total; index++) {
        part[index].innerHTML=brr[index];
        if(brr[index]==total){
            blktile=index;
            part[index].classList.toggle("ex");
        }
    }
}
//FLEX WIN
function showwin(time,move){
    setTimeout(()=>{
        game=document.getElementById("game");
        let str="";
        str+=`
        <div class="letsstart">WIN!!!<br>time: ${time} move: ${move} <br>play again!</div>`;
        game.innerHTML = str;
    },500);
}

/*****************(LET'S START THE GAME)************************/
let start=0;     //TO CHECK IF ALREADY GAME IS GOING ON..
let clr;         //use to stop the timer
function startgame(){ 
    time = 0;
    move= 0;
    sufflearrey();
    start=1;     //NOW GAME STARTED
    clearInterval(clr);
    clr = setInterval(() => {
        clicked = 0;
        let index = clicktile();
        
        //if tile is clicked then only update the value
        if (clicked) {
            beep(0.17);
            move+=1;
            console.log(index);
            if (eligible(index, blktile)) {
                console.log("eligible");
                slidetile(index, blktile);
                blktile = index;
            }
            else{
                alert("illegal move"); //GIVE YOU A ALERT IF WRONG MOVE
            }
            if (wincheck()) {
                console.log("win");
                start=0;
                clearInterval(clr);
                leaderboardupdate(parseInt(time),move);
                showwin(parseInt(time),move);
            }
        }
        a = new Date();
        time += 0.1;
        document.getElementById('time').innerHTML = parseInt(time);
        document.getElementById('move').innerHTML = move;
    }, 100);
}
//to check if game already started
function started(){
    beep(0.7);
    //if game is already started then we have to clear the time
    // if(start){
    //     clearInterval(clr);
    //     part[blktile].classList.toggle("ex");
    // }
    startgame();
}
//ADDING BLOCKS ADDING EVENTLISTENER AND OTHER THINGS
function initiate(width,height){
    game=document.getElementById("game");
    let str="";
    for (let index = 1; index <= total; index++){
        str+=`
        <div  class="part" style="order:${index}">${index}</div>`;
    };
    game.innerHTML = str;
    game.style.width=width*10+width+1+'rem';
    game.style.height=height*10+height+1+'rem';
    //arrey to ckeck if tile is clicked
    arr=[];
    for (let index = 1; index <= total; index++) {
        arr.push(0);
    }
    //adding functinoality in all the tiles
    part = document.getElementsByClassName("part");
    for (let index = 0; index < total; index++) {
        part[index].addEventListener("click", () => {
            console.log(index, "1");
            arr[index] = 1;
        });
    }
}
function start4X4(){
    height=4;
    width=4;
    total=height*width;
    initiate(4,4);
    started();
}
function start4X3(){
    height=3;
    width=4;
    total=height*width;
    initiate(4,3);
    started();
}
function start3X3(){
    height=3;
    width=3;
    total=height*width;
    initiate(3,3);
    started();
}

//do a sound
audioCtx = new(window.AudioContext || window.webkitAudioContext)();
function beep(volume) {
    frequency=190;
    duration= 200;
    type='triangle';
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();
  
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
  
    gainNode.gain.value = volume;
    oscillator.frequency.value = frequency;
    oscillator.type = type;
  
    oscillator.start();
  
    setTimeout(
      function() {
        oscillator.stop();
      },
      duration
    );
}