let LOADsave = localStorage.getItem('FastVideoSpeedload');

window.addEventListener('load', (event) => {
  let Vids = document.querySelectorAll('video');
        for (i = 0; i < Vids.length; i++) {
          Vids[i].playbackRate = LOADsave;
        }


//chrome.runtime.onMessage.addListener(receivedMessage);
  //receivedMessage(LOADsave);
  });
//When a message is received execute the receivedMessage function
chrome.runtime.onMessage.addListener(receivedMessage);
document.addEventListener('readystatechange',() => {
try {
  let Vids = document.querySelectorAll('video');
        for (i = 0; i < Vids.length; i++) {
          Vids[i].playbackRate = LOADsave;
          //Vids[i].loop = 'true';
            //  window.alert("Running on Popup Opened");
        }
      console.log(Vids);
     }catch (e) {
      LOADsave = '1';
     console.log("Caught Error --  "+e);
    } finally {
      console.log(LOADsave);
  }
});

document.addEventListener('DOMContentLoaded',() => {
 Vids = document.querySelectorAll('video');
  console.log("All videos affected on this page "+Vids);
  //let LOADsave = '16';
  if (LOADsave) {
    console.log(LOADsave);
      for (i = 0; i < Vids.length; i++) {
        Vids[i].addEventListener('loadeddata', ()=>{
            Vids[i].playbackRate = LOADsave;
        })
      }
    }
});

if (LOADsave) {receivedMessage(LOADsave);}

function receivedMessage(message, sender, response){
  //localStorage.clear();
localStorage.setItem('FastVideoSpeedload', message);
  console.log(message);
  console.log(LOADsave);
  //window.alert(message+"  "+LOADsave+"  "+localStorage.getItem('FastVideoSpeedload'));
try {
  let Vids = document.querySelectorAll('video');
        for (i = 0; i < Vids.length; i++) {
          Vids[i].playbackRate = message;
          //Vids[i].loop = 'true';
            //  window.alert("Running on Popup Opened");
        }
      console.log(Vids);
     }catch (e) {
      LOADsave = '1';
     console.log("Caught Error --  "+e);
    } finally {
      console.log(message);
  }
//window.alert("message received");
}
/*
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  receivedMessage(LOADsave);
});
chrome.tabs.onCreated.addListener( function (tabId, changeInfo, tab) {
  receivedMessage(LOADsave);
});
*/
