
// Created on Apr 19, 2019 4:28:42 PM


//Canvas is the screen made on the page, it's what JS is able to doodle on.
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//this chooses the canvas "myCanvas" and makes it take up the same space as the window does. dunno about resizing updates.. ****Resizing does not work--whatever the window size is when loaded, is what you get.
var cramw = myCanvas.width = window.innerWidth-20;
var cramh = myCanvas.height = window.innerHeight-20;

//X value of raindrop--in an array.
var RainDropx =  [100];
//Same but Y value
var RainDropy =  [60];

var RainDropB = [255];
var RainDropG = [200];
var RainDropR = [0];

var RainDropw = cramw/100;
var RainDroph = cramh/100;

var drops = 160;
//global constant to be used in the for loop in the draw(); function.
// It would be best to find another way to define this, since it seems as though defining it inside the
// "for loop" doesn't work. Or maybe I'm just doing it all wrong ;D
var C = 0;

//adds a listener to register "click" (which is what it sounds like, any mouseclick). the second part,
// click, is the name of the function to run when a mouse is clicked-- the second click can be named anything,
//second part is the function name. The first part shows what it's listening for
//parts I'm referring to are inside the parenthesese --> ( )


//window.addEventListener("click", click);


//function that grabs a random value. I only need one.
function getRandom(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive-- min and max are possible values to have return.
}

//what to do when mouse is clicked
for ( var C = 0; C < 160; C++) {


  //add a raindrop to the Raindrop# Array where the mouse is clicked.
  RainDropx.push (getRandom(0, cramw));
  RainDropy.push (getRandom(0, cramh));
  //also get colors on those raindrops, but these are random between the (min,max) values defined
  RainDropR.push (getRandom(0, 50));
  RainDropG.push (getRandom(0, 200));
  RainDropB.push (getRandom(50, 255));

}
//DropDis is named for KH:DDD (Kingdom Hearts:Dream Drop Distance). It checks if the raindrop is off-screen, specifically below the bottom of the canvas.
// If so, it restarts the raindrop with a small randomizer as to where in X and Y, also randomizes the colors.
function DropDis(C) {
  if (RainDropy[C] > cramh) {

    RainDropB[C] = getRandom(100,255);
    RainDropG[C] = getRandom(50,200);
    RainDropR[C] = getRandom(0,20);

    RainDropx[C] = getRandom(0,cramw-70);
    RainDropy[C] = getRandom(0, 60);
  }
}


//This is one of the main functions-- this grabs the raindrop data out of each array. X,Y position, Color.
function raindrop(C) {
  var r = RainDropR[C];
  var g = RainDropG[C];
  var b = RainDropB[C];

  ctx.beginPath();
  ctx.fillStyle = `rgb( ${(r)}, ${(g)}, ${(b)})`;;


  //void ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle [, anticlockwise]);
  ctx.ellipse(RainDropx[C]+RainDropw/2, RainDropy[C]+RainDroph/2, RainDropw/2, RainDroph,0,0,2*Math.PI);
  //ctx.rect(RainDropx[C], RainDropy[C], RainDropw, RainDroph);

  ctx.fill();
  ctx.lineWidth = 6;

  ctx.strokeStyle = `rgb( ${(r)}, ${(g)}, ${(b)})`


  //Left to right arc
  ctx.moveTo(RainDropx[C], RainDropy[C]);
  //void ctx.arcTo(x1, y1, x2, y2, radius);
  ctx.arcTo(RainDropx[C]+RainDropw/2,RainDropy[C]-RainDroph/1.1,RainDropx[C]+RainDropw/2,RainDropy[C]-RainDroph*2,RainDropw);


  //right to left arc
  ctx.moveTo(RainDropx[C]+RainDropw, RainDropy[C]);
  //void ctx.arcTo(x1, y1, x2, y2, radius);
  ctx.arcTo(RainDropx[C]+RainDropw/2,RainDropy[C]-RainDroph/1.1,RainDropx[C]+RainDropw/2,RainDropy[C]-RainDroph*2,RainDropw);


  ctx.stroke();
  ctx.closePath();
  }


//This draws things, as the name suggests.
function draw() {

  ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
  ctx.fillStyle = `rgb(100,100,100)`;
  ctx.rect(0,0,myCanvas.width,myCanvas.height);
  ctx.fill();
  for ( var C = 0; C < RainDropy.length; C++) {





    DropDis(C);
    raindrop(C);
    //raindroptop(C);
    RainDropy[C] += 6;

  }
  //requestAnimationFrame is much better than setting the 'draw();' function to a set interval, this only draws what needs to be
  // updated, instead of everything every frame... which saves the background I guess lol
  requestAnimationFrame(draw);
};
draw();
