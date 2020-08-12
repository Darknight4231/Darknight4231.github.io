//***********NEWEST OF THINGS***************

/*
  Going to need a DynamicsCompressorNode on this for sound fixins
  https://developer.mozilla.org/en-US/docs/Web/API/DynamicsCompressorNode/DynamicsCompressorNode

*/

NotSoUgly = false; // you ugly

let Play1=document.getElementById("Play");
Play1.addEventListener('click',()=>{cramw=(window.innerWidth/Play1.value); cramh = window.innerHeight/Play1.value; console.log("Picking 1?"); NotSoUgly=true;});
let Play2=document.getElementById("Play2");
Play2.addEventListener('click',()=>{cramw=(window.innerWidth/Play2.value); cramh = window.innerHeight/Play2.value; console.log("Why 2?"); NotSoUgly=true;});
let Play3=document.getElementById("Play3");
Play3.addEventListener('click',()=>{cramw=(window.innerWidth/Play3.value); cramh = window.innerHeight/Play3.value; console.log("WHY 3??!"); NotSoUgly=true;});

function UglyCheck(){
if (NotSoUgly) {



/*
// Created on Mar 20, 2019 11:34:18 PM

let CanvMod = 1;
let Play1=document.getElementById("Play");
Play1.addEventListener('click',()=>{AwaitUserInput(Play1.value)});
let Play2=document.getElementById("Play2");
Play2.addEventListener('click',()=>{AwaitUserInput(Play2.value)});
let Play3=document.getElementById("Play3");
Play3.addEventListener('click',()=>{AwaitUserInput(Play3.value)});

canvas.style.display = 'none';

const promise1 = Promise.reject(0);
const promise2 = new Promise((resolve) => setTimeout(resolve, 100, 'quick'));
const promise3 = new Promise((resolve) => setTimeout(resolve, 500, 'slow'));

const promises = [promise1, promise2, promise3];

Promise.any(promises).then((value) => console.log(value));

// expected output: "quick"


// await Promise.all([function1,function2,etc])
async function AwaitUserInput(e) {
  console.log("Waiting for user to choose canvas size PROCESS")
  console.log(CanvMod);
   CanvMod = await new Promise((resolve,reject) => {
    if (e==Play1.value) {
      resolve(Play1.value);
      console.log(Play1.value);
    } else if (e==Play2.value) {
      resolve(Play2.value);
      console.log(Play2.value);
    } else if (e==Play3.value) {
      resolve(Play3.value);
      console.log(Play3.value);
    }
    console.log("STuck In HErE");
    canvas.style.display = 'block';
  })
  .catch(e).then(console.log("Error! Value of "+e )).then(canvas.style.display = 'none').then(console.log(CanvMod))
}
//AwaitUserInput();
// Maybe I'm just making this way too complicated.. I think I am heh..
*/

    MainJuice();
  }
}
let Ugliest;
Ugliest = setInterval(UglyCheck,1000);
function MainJuice () {

  clearInterval(Ugliest);


  document.body.innerHTML = "<canvas id='myCanvas'><p>This message is for those who can't have a canvas element running in their browser. Try a different browser to see what's on the page.</p></canvas>";
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width=cramw;
  canvas.height=cramh;

  canvas.addEventListener("click", arrowAngle);
let GravAngle =0;
let Arrows = [];

function Arrow(x,y,dx,dy,Weight,Power) {
   this.x= x;
   this.y= y;
   this.dx = dx;
   this.dy = dy;
   this.Weight= Weight;
   this.Power= Power;
}

let Player = {
  size: 20,
  x: cramw/8,
  y: cramh,
  Jumpheight: 12,
  FallSpeed: 0,
}

const slow = 0.2;
//let C = 0;
const grav = 2;

 let Blocks = {
    x: [cramw/1.6,cramw/6.4,cramw/3.2,cramw/1.06],
    y: [cramh/13, cramh/8, cramh/2, cramh/1.8],
    dx: [0,0,0,0],
    dy: [0,0,0,0],
    size: 40,
    fall: [0,0,0,0],
}

let rightPressed = false;
let leftPressed  = false;
let upPressed    = false;
let downPressed  = false;
let up = false;

 // KEYBOARD
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
/*           KeyCodes for
        W 87  A 65  S 83  D 68
      KeyCodes are physical placement on Keyboard, and should be used to optimize playability*/
    function keyDownHandler(e) {
            switch(e.key) {
                case "Unidentified":
                     console.log("Unidentified " +e.key);
                    break;
                case "ArrowRight":
                case "Right": // IE <= 9 and FF <= 36
                case "KeyD":
                case "D":
                case "d":
                    rightPressed = true;
                    break;
                case "ArrowLeft":
                case "Left": // IE <= 9 and FF <= 36
                case "KeyA":
                case "A":
                case "a":
                    leftPressed = true;
                    break;
                case "KeyW":
                case "w":
                case "W":
                case "ArrowUp":
                case " ":
                case "Up": // IE <= 9 and FF <= 36
                    upPressed = true;
                    break;
                case "ArrowDown":
                case "Down": // IE <= 9 and FF <= 36
                case "KeyS":
                case "s":
                case "S":
                    downPressed = true;
                    break;
                default:
                 console.log("Default "+e.key);
                    return;
            }
    }
    function keyUpHandler(e) {
            switch(e.key) {
                case "Unidentified":
                    break;
                case "ArrowRight":
                case "Right": // IE <= 9 and FF <= 36
                case "KeyD":
                case "d":
                case "D":
                    rightPressed = false;
                    break;
                case "ArrowLeft":
                case "Left": // IE <= 9 and FF <= 36
                case "KeyA":
                case "a":
                case "A":
                    leftPressed = false;
                    break;
                case "ArrowUp":
                case "Up": // IE <= 9 and FF <= 36
                case "KeyW":
                case "w":
                case "W":
                case " ":
                    upPressed = false;
                    up = false;
                    break;
                case "ArrowDown":
                case "Down": // IE <= 9 and FF <= 36
                case "KeyS":
                case "s":
                case "S":
                    downPressed = false;
                    break;
                default:
                    return;
            }
    }

function PlayerGrav(){
    Player.y += grav;
};

function Xboundary(x){

           if (x > canvas.width-21) { //  right boundary
          return canvas.width-Player.size;
      } else if (x < 0){               //left boundary
       return  1;
      } else return x;
  };

function Yboundary(y){

             if (y < 0) {              //top boundary
        return  0;
      } else if (y > canvas.height-20){//bottom boundary
        return canvas.height-Player.size;
      } else return y;
  };

function arrowAngle(e){

  let mouseY = e.clientY-canvas.offsetTop;
  let mouseX = e.clientX-canvas.offsetLeft;

  GravAngle = (Math.atan2(Player.y-mouseY,mouseX-Player.x)*180/Math.PI);
  console.log(GravAngle);
  console.log("Reversed calc from GravAngle    X"+`${mouseX-Player.x}` + '  Y'+`${Player.y-mouseY}`);


  //find the distance between the two points, (60, 400) and (e.clientX, e.clientY)
  //then add that (with some kinda multiplier ofc to scale it down) to Arrow.x[C]
  let pwr = (mouseY-Player.y/mouseX-Player.x);

  Arrows.push(new Arrow((Player.x+(Player.size/2)),(Player.y+(Player.size/2)),(mouseX-Player.x)/10,(Player.y-mouseY)/10,4,(pwr)));
};
                //Arrow(      x,                      y,                        dx,                   dy,               Weight,      Power)

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

    if ( Blocks.x[B]-3 < Arrows[C].x && Arrows[C].x < Blocks.x[B]+Blocks.size  && Blocks.y[B] < Arrows[C].y && Arrows[C].y < Blocks.y[B]+Blocks.size ){
      Blocks.x[B] += 0.8*Arrows[C].Power;
      Blocks.fall[B] =- Arrows[C].Weight;
    }
  }
};


function background(){

  //this is the background itself
  ctx.beginPath();
  ctx.fillStyle = `rgb(150,150,150)`;
  ctx.rect(0, 0, cramw, cramh);
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
    Player.x += cramw/200;
  }
  if (leftPressed) {
    Player.x -=cramw/200;
  }
  if (upPressed && up) {
    if (Player.FallSpeed<0) {
      console.log('This never happens...');
      Player.FallSpeed -=grav;
    } else if (Player.FallSpeed>=0){
      Player.y -= Player.FallSpeed;
      Player.FallSpeed --;
      console.log('EE');
    }
  } else if (upPressed) {
    up = true;
    Player.FallSpeed = Player.Jumpheight;
    Player.y -= Player.FallSpeed;
    Player.FallSpeed --;
  }
  if (downPressed) {
    Player.y +=cramh/100;
  }
      /*  if (Player.y<cramh-Player.size+1) {
    console.log('kelp');
    Player.y =Player.y+Player.FallSpeed;
    Player.FallSpeed =Player.FallSpeed+grav;
  }*/

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
  ctx.fillStyle = 'black';
  ctx.font = '12px serif';
  ctx.fillText(`${GravAngle}`, Player.x, Player.y-(cramh/20));
  if (Arrows.length != 0) {
    ctx.fillText(`${Arrows[Arrows.length-1].dy/Arrows[Arrows.length-1].dx}`, Player.x, Player.y-cramh/20-20);
  }
  ctx.closePath();

  DrawBlocks();
  PlayerUpdate();


  for ( let C=0; C < Arrows.length; C++){

    collisionDetection(C);


    ctx.beginPath();
    ctx.fillStyle = `rgb(0,0,0)`;
    ctx.rect(Arrows[C].x, Arrows[C].y,18,3);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = `rgb(0,0,200)`;
    ctx.rect(Arrows[C].x+17,Arrows[C].y-3,10,8);
    ctx.fill();
    ctx.closePath();



    Arrows[C].y =  Arrows[C].y-Arrows[C].dy;
    Arrows[C].x = Arrows[C].x+Arrows[C].dx;

    Arrows[C].dy = Arrows[C].dy-Arrows[C].Weight;
    if (Arrows[C].dx>0) {
      Arrows[C].dx=Arrows[C].dx-Arrows[C].Weight/4;
    } else {
      Arrows[C].dx=Arrows[C].dx+Arrows[C].Weight/4;
    }
    if (Arrows[C].x>cramw||Arrows[C].x<0||Arrows[C].y>cramh) {
      Arrows.splice(C,1);
    }
  }
requestAnimationFrame(draw);
};

console.log(Play1.value);

draw();
}
