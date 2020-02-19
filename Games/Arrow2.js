//***********NEWEST OF THINGS***************

/*
  Going to need a DynamicsCompressorNode on this for sound fixins
  https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode/DynamicsCompressorNode

*/



// Created on Mar 20, 2019 11:34:18 PM


//Canvas is the screen made on the page, it's what JS is able to doodle on.
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
canvas.addEventListener("click", arrowAngle);
document.addEventListener("keypress",keydown);
document.addEventListener("keyup", keyup);

//this chooses the canvas "myCanvas" and makes it take up the same space as the window does. dunno about resizing updates.. ****Resizing does not work--whatever the window size is when loaded, is what you get.
const cramw = canvas.width = 1280;
const cramh = canvas.height = 600;

let Arrow = {
  x: [],
  y: [],
  Gravity: [],
  Power: [],
}

let Player = {
  size: 20,
  x: cramw/8,
  y: cramh,
}

const slow = 0.2;
//let C = 0;
const grav = 2;

 let Blocks = {
    x: [800,200,400,1200],
    y: [60, 100, 360, 440],
    dx: [0,0,0,0],
    dy: [0,0,0,0],
    size: 40,
    fall: [0,0,0,0],
}

let rightPressed = false;
let leftPressed  = false;
let upPressed    = false;
let downPressed  = false;

function keydown (e){
  if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d") {
    rightPressed = true;
  }
  if ( e.key == "Left" || e.key == "ArrowLeft" || e.key == "a"){
   leftPressed = true;
  }
  if ( e.key == "Up" || e.key == "ArrowUp" || e.key == "w") {
    upPressed = true;
  }
  if ( e.key == "Down" || e.key == "ArrowDown" || e.key == "s" ) {
   downPressed = true;
  }
};

function keyup (e){
  if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d") {
    rightPressed = false;
  }
  if ( e.key == "Left" || e.key == "ArrowLeft" || e.key == "a"){
    leftPressed = false;
  }
  if ( e.key == "Up" || e.key == "ArrowUp" || e.key == "w") {
    upPressed = false;
  }
  if ( e.key == "Down" || e.key == "ArrowDown" || e.key == "s" ) {
   downPressed = false;
  }
  console.log(e.key);
 };

function PlayerGrav(){
    Player.y += grav;
};

function Xboundary(x){

           if (x > canvas.width-21) { //  right boundary
          return canvas.width-20;
      } else if (x < 0){               //left boundary
       return  1;
      } else return x;
  };

function Yboundary(y){

             if (y < 0) {              //top boundary
        return  0;
      } else if (y > canvas.height-20){//bottom boundary
        return canvas.height-20;
      } else return y;
  };


  function GravRad(X,Y) {
    if (Y-Player.y>0) {

      console.log("Below");
      return -(Math.abs(Y-Player.y/X));

    } else if (Y-Player.y <0) {

      console.log("Above");
      return (Math.abs(Y-Player.y/X));
    }
  };


function arrowAngle(e){

  let mouseY = e.clientY-canvas.offsetTop;
  let mouseX = e.clientX-canvas.offsetLeft;
  let mouseYminus = mouseY-Player.y;
  let mouseXminus = mouseX-Player.x;
  GravAngle = ((-(Math.atan((mouseY-Player.y)/160)*180/Math.PI)));


  //find the distance between the two points, (60, 400) and (e.clientX, e.clientY)
  //then add that (with some kinda multiplier ofc to scale it down) to Arrow.x[C]
  if (mouseX > Player.x) {
  pwr = (Math.pow( Math.pow(mouseXminus, 2) + Math.pow(mouseYminus, 2)  , 0.5));
} else if (mouseX < Player.x){
    pwr = (-(Math.pow( Math.pow(mouseXminus, 2) + Math.pow(mouseYminus, 2)  , 0.5)));
  }

  Arrow.x.push (Player.x+(Player.size/2));
  Arrow.y.push (Player.y+(Player.size/2));
  Arrow.Power.push(pwr/100);
  Arrow.Gravity.push ((-0.9)+GravRad(mouseXminus,mouseYminus)/100);

};


function DrawBlocks(){

  ctx.beginPath();
  for (let C=0; C<Blocks.y.length; C++){

    ctx.fillStyle = `rgb(0,180,200)`;
    ctx.rect(Blocks.x[C], Blocks.y[C], Blocks.size,Blocks.size);
    ctx.fill();


    Blocks.x[C] = Xboundary(Blocks.x[C]);
    Blocks.y[C] = Yboundary(Blocks.y[C]);


              Blocks.y[C] = Blocks.y[C] - Blocks.fall[C];
  }
  ctx.closePath();
};


function collisionDetection(C) {

      for (let B=0; B<Blocks.x.length; B++){

    //use x for both Arrow.x and Arrow.y to keep it on the same arrow at all times. Easy. Really easy actually.
    //B goes through every block before moving to check the next arrow, or x.

    if ( Blocks.x[B]-3 < Arrow.x[C] && Arrow.x[C] < Blocks.x[B]+Blocks.size  && Blocks.y[B] < Arrow.y[C] && Arrow.y[C] < Blocks.y[B]+Blocks.size ){
      Blocks.x[B] += 0.8*Arrow.Power[C];
      Blocks.fall[B] =- Arrow.Gravity[C];
    }
  }
};


function background(){

  //this is the background itself
  ctx.beginPath();
  ctx.fillStyle = `rgba(150,150,150,0.1)`;
  ctx.rect( 0, 0, cramw, cramh);
  ctx.fill();
  ctx.closePath();
};

  function playerplace(){

  //this is the spot to show where the arrow launches from (and is calculated at)
  ctx.beginPath();
  ctx.fillStyle = `rgb(255,0,0)`;
  ctx.rect(Player.x, Player.y, Player.size, Player.size);
  ctx.fill();
  ctx.closePath();

  if (rightPressed) {
    Player.x += 6;
  }
  if (leftPressed) {
    Player.x -=6;
  }
  if (upPressed) {
    Player.y -=12;
  }
  if (downPressed) {
    Player.y +=6;
  }
};



function PlayerUpdate(){

      playerplace();
      Player.x = Xboundary(Player.x);
      Player.y = Yboundary(Player.y);
      PlayerGrav();
};



function draw(){
      background();

  ctx.beginPath();
  ctx.fillStyle = 'grey';
  ctx.rect(0,0,cramw,cramh);
  ctx.fill();
  ctx.closePath();

  DrawBlocks();
  PlayerUpdate();


  for ( let C=0; C < Arrow.x.length; C++){

    collisionDetection(C);


    ctx.beginPath();
    ctx.fillStyle = `rgb(0,0,0)`;
    ctx.rect(Arrow.x[C], Arrow.y[C],18,3);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = `rgb(0,0,200)`;
    ctx.rect(Arrow.x[C]+17,Arrow.y[C]-3,10,8);
    ctx.fill();
    ctx.closePath();



    Arrow.y[C] =  Arrow.y[C]-Arrow.Gravity[C];
    Arrow.x[C] = Arrow.x[C]+Arrow.Power[C];

    Arrow.Gravity[C] = Arrow.Gravity[C]-0.02;


  }

requestAnimationFrame(draw);
};

draw();
