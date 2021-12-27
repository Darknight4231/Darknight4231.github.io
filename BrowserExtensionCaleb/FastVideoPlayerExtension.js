window.addEventListener('load', (event) => {
//When a message is received execute the receivedMessage function
chrome.runtime.onMessage.addListener(receivedMessage);

});

function receivedMessage(message, sender, response){

  console.log(message.Speed);

    let parsing = message;
  try {
    console.log(Number(parsing));
    console.log(Number.isFinite(parsing.Speed));
      let Vids = document.querySelectorAll('video');
      let SpeedStr=toString(parsing.Speed);
        for (let i = 0; i < Vids.length; i++) {
          Vids[i].playbackRate = parsing.Speed;
          //Vids[i].loop = 'true';
        }
    } catch (e) {
     window.alert("Caught Error --  "+e);
    } finally {
      console.log(parsing);
  }
 /*else {
    let parsing = JSON.parse(message);
      console.log(parsing);
      try {
        console.log(Number(parsing.Speed));
        console.log(Number.isFinite(parsing.Speed));
          let Vids = document.querySelectorAll('video');
          let SpeedStr=toString(parsing.Speed);
            for (let i = 0; i < Vids.length; i++) {
              Vids[i].playbackRate = parsing.Speed;
              //Vids[i].loop = 'true';
            }
        } catch (e) {
         window.alert("Caught Error --  "+e);
        } finally {
          console.log(parsing);
      }
  }*/
};
