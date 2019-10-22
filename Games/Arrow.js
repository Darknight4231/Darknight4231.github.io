
// Created on Mar 20, 2019 11:34:18 PM


//Canvas is the screen made on the page, it's what JS is able to doodle on.
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
canvas.addEventListener("click", arrowAngle);
document.addEventListener("keypress",keydown);
document.addEventListener("keyup", keyup);

//this chooses the canvas "myCanvas" and makes it take up the same space as the window does. dunno about resizing updates.. ****Resizing does not work--whatever the window size is when loaded, is what you get.
const cramw = myCanvas.width = 1280;
const cramh = myCanvas.height = 600;

let arrowX = [];
let arrowY = [];
let Gravity = [];
let ArrowPower =[];
let mouseY = 0;

let playerblock = [50,390];
const slow = 0.2;
let C = 0;
const grav = 2;


let BX = [800,200,400,1200];
let BDX = [0,0,0,0];
let BDY = [0,0,0,0];
let blocksY = [60, 100, 360, 440];
let blocksize = 40;
let blockfall = [0,0,0,0];

let rightPressed = false;
let leftPressed  = false;
let upPressed    = false;
let downPressed  = false;

function keydown (e){
  /*
      if (leftPressed){
     playerblock[0] -=6;
     return;
   }
   else if (rightPressed){
     playerblock[0] += 6;
     return;
   }
   else if (upPressed){
     playerblock[1] -=6;
     return;
   }
   else if (downPressed){
     playerblock[1] +=6;

   }*/

  if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d") {
    rightPressed = true;
    playerblock[0] += 6;
  }
  if ( e.key == "Left" || e.key == "ArrowLeft" || e.key == "a"){
   leftPressed = true;
   playerblock[0] -=6;
  }
  if ( e.key == "Up" || e.key == "ArrowUp" || e.key == "w") {
   upPressed = true;
   playerblock[1] -=6;
  }

  if ( e.key == "Down" || e.key == "ArrowDown" || e.key == "s" ) {
   downPressed = true;
   playerblock[1] +=6;
   }
};


function keyup (e){

  if (e.key=="Right" || e.key=="ArrowRight" || e.key == "d"){
    rightPressed = false;

  }
  if ( e.key=="Left" || e.key=="ArrowLeft"  || e.key == "a"){
    leftPressed = false;

  }
  if ( e.key == "Up" || e.key == "ArrowUp" || e.key == "w" ) {
    upPressed = false;
   }
  if ( e.key == "Down" || e.key == "ArrowDown" || e.key == "s") {
    downPressed = false;
   }
 };


function PlayerGrav(){
    playerblock[1] += grav;
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


function arrowAngle(e){
  //It seems as though I've forgotten some trig properties. You can't shoot up or down..


  //mouseY needs to be converted to something divisible.
  //HOW DO I read the cursor Y position as an angle..?!?!?
  //that's what GravAngle is for.. would making mouseY into radians help?

  let mouseY = e.clientY;
  //this shows the radians
  //console.log((-(Math.atan((mouseY-400)/160))));

  GravAngle = ((-(Math.atan((mouseY-playerblock[1])/160)*180/Math.PI)));//same as grav rad, but in human terms--degrees instead of radians. Make understanding easier, though will obviously output a different valued. mainly for understanding the angle simply.
  GravRad = ((-(Math.atan((mouseY-playerblock[1])/160))));
  //there are two points, to find the distance between the two, and find the two sides of the triangle it'd make. (x1,y1) (x2,y2)
  //it's easy, just do x1-x2 and y1-y2 or vice versa (x2-x1 and y2-y1)
  // Sin gives the angle from opposite to hypotenuse, we need using two legs of a right triangle.
  //while we could find the distance using the X and Y method described above (distance = hypotenuse, use pythagorean theorem) we don't need the distance
  //we need the angle.
  //
  //this is to get an actual angle. it works wonderfully.  GravAngle = ((-(Math.atan((mouseY-400)/160)*180/Math.PI)));
  //a
  //tan=O/A  tangent = Opposite/Adjacent, the two sides we have available.
  //opposite is Y
  //adjacent is X

  mouseX = e.clientX;
  //find the distance between the two points, (60, 400) and (e.clientX, e.clientY)
  //then add that (with some kinda multiplier ofc to scale it down) to arrowX[C]
  if (mouseX > playerblock[0]) {
  pwr = (Math.pow( Math.pow(mouseX-playerblock[0], 2) + Math.pow(mouseY-playerblock[1], 2)  , 0.5));
  } else if (mouseX < playerblock[0]){
    pwr = (-(Math.pow( Math.pow(mouseX-playerblock[0], 2) + Math.pow(mouseY-playerblock[1], 2)  , 0.5)));
  }

  console.log(pwr/100);

  shot();

};

function shot (){

  arrowX.push (playerblock[0]);
  arrowY.push (playerblock[1]);
  ArrowPower.push(pwr/100);
  Gravity.push ((-0.9)+GravRad*4);

};

function blocks(){

  ctx.beginPath();
  for (let C=0; C<blocksY.length; C++){

    ctx.fillStyle = `rgb(0,180,200)`;
    ctx.rect(BX[C], blocksY[C], blocksize,blocksize);
    ctx.fill();


    BX[C] = Xboundary(BX[C]);
    blocksY[C] =Yboundary(blocksY[C]);


              blocksY[C] = blocksY[C] - blockfall[C];
              //if(blockfall[C] /= 0){
              //blockfall[C] = blockfall[C]-grav;
   //}
  }
  ctx.closePath();
};


function collisionDetection(C) {

      for (let B=0; B<BX.length; B++){

    //use x for both arrowX and arrowY to keep it on the same arrow at all times. Easy. Really easy actually.
    //B goes through every block before moving to check the next arrow, or x.

    if ( BX[B]-3 < arrowX[C] && arrowX[C] < BX[B]+blocksize  && blocksY[B] < arrowY[C] && arrowY[C] < blocksY[B]+blocksize ){
      BX[B] += 0.8*ArrowPower[C];
      blockfall[B] =- Gravity[C];
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
  ctx.rect(playerblock[0], playerblock[1], 20, 20);
  ctx.fill();
  ctx.closePath();
  };



function player(){

      playerplace();
      playerblock[0] = Xboundary(playerblock[0]);
      playerblock[1] = Yboundary(playerblock[1]);
      PlayerGrav();
};



function draw(){
      background();


  ctx.clearRect(0,0,cramw,cramh); //this clears the canvas completely


  blocks();
  player();


  for ( let C=0; C < arrowX.length; C++){

    collisionDetection(C);


    ctx.beginPath();
    ctx.fillStyle = `rgb(0,0,0)`;
    ctx.rect(arrowX[C], arrowY[C],18,3);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = `rgb(0,0,200)`;
    ctx.rect(arrowX[C]+17,arrowY[C]-3,10,8);
    ctx.fill();
    ctx.closePath();



    arrowY[C] =  arrowY[C]-Gravity[C];
    arrowX[C] = arrowX[C]+ArrowPower[C];

    Gravity[C] = Gravity[C]-0.02;


  }

requestAnimationFrame(draw);
};

draw();
