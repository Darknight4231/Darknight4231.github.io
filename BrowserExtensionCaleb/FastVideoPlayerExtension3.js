let LOADsave = localStorage.getItem('FastVideoSpeedload');

//When a message is received execute the receivedMessage function
chrome.runtime.onMessage.addListener(receivedMessage);

chrome.webNavigation.onCreatedNavigationTarget.addListener(details => {
    console.log("Created");
    this.receivedMessage(LOADsave);
});
chrome.webNavigation.onCommitted.addListener(details => {
    console.log("Commited");
    this.receivedMessage(LOADsave);
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("Updated");
    this.receivedMessage(LOADsave);
});
chrome.tabs.onActivated.addListener(details => {
    console.log("Activated");
    this.receivedMessage(LOADsave);
});
let Vids = document.querySelectorAll('video');

document.onreadystatechange = function(){

try {
console.log(document.readyState);

  Vids = document.querySelectorAll('video');
      for (i = 0; i < Vids.length; i++) {
    //The browser can play the media, but estimates that not enough data has been loaded to play the media up to its end without having to stop for further buffering of content.
      Vids[i].addEventListener("canplay", receivedMessage(LOADsave));

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
