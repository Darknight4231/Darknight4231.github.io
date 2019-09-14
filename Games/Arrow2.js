
// Created on Mar 20, 2019 11:34:18 PM


//Canvas is the screen made on the page, it's what JS is able to doodle on.
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

canvas.addEventListener("click", arrowAngle);
document.addEventListener("keydown",keydown);
document.addEventListener("keyup", keyup);

//this chooses the canvas "myCanvas" and makes it take up the same space as the window does. dunno about resizing updates.. ****Resizing does not work--whatever the window size is when loaded, is what you get.
var cramw = myCanvas.width = 1280;
var cramh = myCanvas.height = 600;

var arrowX = [];
var arrowY = [];
var Gravity = [];
var ArrowPower =[];
var mouseY = 0;

var playerblock = [50,390];

var rightmove = 1;
var leftmove  = 1;
var upmove = 1;
var downmove = 1;

var slow = 0.2;

var C = 0;

var BX = [1200,1200,1200,1200];
var blocksY = [60, 100, 160, 340];

var rightPressed = false;
var leftPressed  = false;
var upPressed    = false;
var downPressed  = false;

function keydown (e){
  
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  }
  if ( e.key == "Left" || e.key == "ArrowLeft" ){
    leftPressed = true;
   }
  if ( e.key == "Up" || e.key == "ArrowUp" ) {
    upPressed = true;
   }
   
  if ( e.key == "Down" || e.key == "ArrowDown" ) {
    downPressed = true;
   }
}


function keyup (e){
  
    
  
  if (e.key=="Right" || e.key=="ArrowRight"){
    rightPressed = false;
  }
  if ( e.key=="Left" || e.key=="ArrowLeft" ){
    leftPressed = false;
  }
   if ( e.key == "Up" || e.key == "ArrowUp" ) {
    upPressed = false;
   }
   if ( e.key == "Down" || e.key == "ArrowDown" ) {
    downPressed = false;
   }
 };

function playerslow(){
    
    //first check if moving too slow, then stop if so.
    //stop X value Left + Right
    if (playermoveX < 0.5 && playermoveX > (-0.5)){
      playermoveX=0;
  } 
  
    //first check if moving too slow, then stop if so.
    //stop Y value Up and Down
   else if (playermoveY < 0.5 && playermoveY > (-0.5)){
     playermoveY=0; 
  }
  
  
    if (rightPressed = false) {
       rightmove=0;
  }
    if (leftPressed = false){
       leftmove=0;
  }
    if(upPressed = false){
       upmove=0;
  }
    if(downPressed = false){
       downmove=0;
  }
};



function playermove(){
 
 if (rightPressed){
     playerblock[0] += rightmove;
 } else if (leftPressed){
     playerblock[0] -= leftmove;
 } else if (upPressed){
     playerblock[1] -= upmove;
 } else if (downPressed){
     playerblock[1] += downmove; 
 }
 
  
   if (playerblock[0] > canvas.width-20) {      /*right boundary*/
    playermoveX = 0;
    playerblock[0] = canvas.width-20;
  } else if (playerblock[0] < 0){               /*left boundary*/
    playermoveX = 0;
    playerblock[0] = 0;
  } else if (playerblock[1] < 0) {              /*top boundary*/
    playermoveY = 0;
    playerblock[1] = 0;
  } else if (playerblock[1] > canvas.height-20){/*bottom boundary*/
    playermoveY = 0;
    playerblock[1] = canvas.height-20;
  }

  };

      
  //slow on stop press

function collisionDetection() {
  
  for (var x=0; x<arrowX.length; x++){
    for (var y=0; y<arrowY.length; y++){
      //literally just make the arrows an object. this should solve a lot. maybe?
      //keeping as an array would allow to .pop or whatever as necessary, but it's still costly ain't it?
      //but is an object truly better in this circumstance?
      
      //I believe you can access an object and its properties in the same (well a better) way than you can in an array.
      //then it is settled. To look it up!
    }
  }
}



/* underneath is essentially the original... gross and doesn't work. But it is a point of reference.. somehow lol
for(var c=0; c<arrowX; c++) {
for(var r=0; r<arrowY; r++) {
  var b = arrowX[c][r];

if() {
  
}

}
 }*/


function arrowAngle(e){
  
  
  
  //mouseY needs to be converted to something divisible.
  //HOW DO I read the cursor Y position as an angle..?!?!?
  //that's what GravAngle is for.. would making mouseY into radians help?
  
  var mouseY = e.clientY;
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
  //found within the shot(); function
  //arrowX.push (60)
  //arrowY.push (400);
  
}

function shot (){
  
  arrowX.push (playerblock[0]);
  arrowY.push (playerblock[1]);
  ArrowPower.push(pwr/100);
  Gravity.push ((-0.9)+GravRad*4);
}

function blocks(){
  
  for (var C=0; C<blocksY.length; C++){
    
    ctx.beginPath();
    ctx.fillStyle = `rgb(0,180,200)`;
    ctx.rect(BX[C], blocksY[C], 20,20);
    ctx.fill();
    ctx.closePath();
  }
  
}

function background(){
  
  //this is the background itself
  ctx.beginPath();
  ctx.fillStyle = `rgb(150,150,150)`;
  ctx.rect( 0, 0, cramw, cramh);
  ctx.fill();
  ctx.closePath();
  
  //this is the spot to show where the arrow launches from (and is calculated at)
  ctx.beginPath();
  ctx.fillStyle = `rgb(255,0,0)`;
  ctx.rect(playerblock[0], playerblock[1], 20, 20);
  ctx.fill();
  ctx.closePath();
  
}

function draw(){
    
    //fillStyle with alpha value that blankets the canvas creates a trailing effect
  ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //ctx.clearRect(0,0,cramw,cramh); this clears the canvas completely
  background();
  blocks();
  
  
  for ( var C=0; C < arrowX.length; C++){
    
    
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
  playermove();
  collisionDetection();
};

setInterval(draw,10);
draw();

