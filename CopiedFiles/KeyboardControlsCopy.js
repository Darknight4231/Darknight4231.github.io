// KEYBOARD
   document.addEventListener("keydown", keyDownHandler, false);
   document.addEventListener("keyup", keyUpHandler, false);



   function keyDownHandler(e) {
       if ("code" in e) {
           switch(e.code) {
               case "Unidentified":
                   break;
               case "ArrowRight":
               case "Right": // IE <= 9 and FF <= 36
               case "KeyD":
                   rightPressed = true;
                   return;
               case "ArrowLeft":
               case "Left": // IE <= 9 and FF <= 36
               case "KeyA":
                   leftPressed = true;
                   return;
               case "ArrowUp":
               case "Up": // IE <= 9 and FF <= 36
               case "KeyW":
                   upPressed = true;
                   return;
               case "ArrowDown":
               case "Down": // IE <= 9 and FF <= 36
               case "KeyS":
                   downPressed = true;
                   return;
               default:
                   return;
           }
       }

       if(e.keyCode == 39) {
           rightPressed = true;
       }
       else if(e.keyCode == 37) {
           leftPressed = true;
       }
       if(e.keyCode == 40) {
           downPressed = true;
       }
       else if(e.keyCode == 38) {
           upPressed = true;
       }
   }
   function keyUpHandler(e) {
       if ("code" in e) {
           switch(e.code) {
               case "Unidentified":
                   break;
               case "ArrowRight":
               case "Right": // IE <= 9 and FF <= 36
               case "KeyD":
                   rightPressed = false;
                   return;
               case "ArrowLeft":
               case "Left": // IE <= 9 and FF <= 36
               case "KeyA":
                   leftPressed = false;
                   return;
               case "ArrowUp":
               case "Up": // IE <= 9 and FF <= 36
               case "KeyW":
                   upPressed = false;
                   return;
               case "ArrowDown":
               case "Down": // IE <= 9 and FF <= 36
               case "KeyS":
                   downPressed = false;
                   return;
               default:
                   return;
           }
       }

       if(e.keyCode == 39) {
           rightPressed = false;
       }
       else if(e.keyCode == 37) {
           leftPressed = false;
       }
       if(e.keyCode == 40) {
           downPressed = false;
       }
       else if(e.keyCode == 38) {
           upPressed = false;
       }
   }


/*
       function draw() {

           ctx.clearRect(0, 0, canvas.width, canvas.height);



           // KEYBOARD

           if(rightPressed) {

               playerX += 5;

           }

           else if(leftPressed) {

               playerX -= 5;

           }

           if(downPressed) {

               playerY += 5;

           }

           else if(upPressed) {

               playerY -= 5;

           }
*/
