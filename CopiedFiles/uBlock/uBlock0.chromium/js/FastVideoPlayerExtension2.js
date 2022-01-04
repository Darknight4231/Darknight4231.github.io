let LOADsave = localStorage.getItem('FastVideoSpeedload');

document.getElementById("SpeedValue").addEventListener("change", SpeedChanged);

function SpeedChanged(e){
 console.log(this.value);
     localStorage.clear();
     //console.log('Storage cleared.');
   localStorage.setItem('FastVideoSpeedload', this.value);
   console.log("Storage changed to "+this.value);

 document.getElementById("SpeedTxt").innerHTML = 'Video is playing at '+ this.value+'x speed';
 chrome.tabs.query({}, function (tabs){
 chrome.tabs.sendMessage(tabs[0].id, this.value);
 let tabURL = tabs[0].url;
 console.log(tabURL);
   })
};

if (LOADsave) {
 document.getElementById("SpeedTxt").innerHTML = 'Save file has video playing at '+ LOADsave+'x speed';
}else {
 document.getElementById("SpeedTxt").innerHTML = 'No Saved Speed';
}
//When a message is received execute the receivedMessage function
chrome.runtime.onMessage.addListener(receivedMessage);


let Vids = document.querySelectorAll('video');

document.onreadystatechange = function(){

try {
//window.alert(document.readyState);

  Vids = document.querySelectorAll('video');
      for (i = 0; i < Vids.length; i++) {
    //The browser can play the media, but estimates that not enough data has been loaded to play the media up to its end without having to stop for further buffering of content.
      Vids[i].addEventListener("canplay", receivedMessage(LOADsave));
      window.alert(Vids);

        //Vids[i].loop = 'true';
      }
      console.log(Vids);
    }catch (e) {
      LOADsave = '1';
      window.alert("Caught Error --  "+e);
     console.log("Caught Error --  "+e);
    } finally {
      //window.alert("Ready State Finished.");
      console.log(LOADsave);
  }
};


if (LOADsave) {receivedMessage(LOADsave);}

function receivedMessage(message, sender, response){
  //window.alert("Message Received -- " + message);
  //localStorage.clear();
localStorage.setItem('FastVideoSpeedload', message);
  console.log(message);
  console.log(LOADsave);
  //window.alert(message+"msg  save"+LOADsave+"  save"+localStorage.getItem('FastVideoSpeedload'));
try {
  let Vids = document.querySelectorAll('video');
        for (i = 0; i < Vids.length; i++) {
          Vids[i].playbackRate = message;
          //Vids[i].loop = 'true';
              //window.alert("Running on Popup Opened");
        }
      console.log(Vids);
     }catch (e) {
      LOADsave = '1';
     console.log("Caught Error --  "+e);
    } finally {
      console.log(message);
  }

}
function Startit(){
  receivedMessage(LOADsave);
  window.cancelAnimationFrame(Startit);
  //window.alert("Running on Animation Frame");
}
window.requestAnimationFrame(Startit);
