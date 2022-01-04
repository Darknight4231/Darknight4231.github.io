let LOADsave = localStorage.getItem('FastVideoSpeedload');

chrome.runtime.onMessage.addListener(receivedMessage);

document.addEventListener('load', (event) => {
  //window.alert("Page Fully loaded FastVidExt");
  let Vids = document.querySelectorAll('video');
        for (i = 0; i < Vids.length; i++) {
          Vids[i].playbackRate = LOADsave;
        }



  });
//When a message is received execute the receivedMessage function
//chrome.runtime.onMessage.addListener(receivedMessage);


let Vids = document.querySelectorAll('video');

      for (i = 0; i < Vids.length; i++) {
        
        //The browser can play the media, but estimates that not enough data has been loaded to play the media up to its end without having to stop for further buffering of content.
        Vids[i].addEventListener("canplay", receivedMessage(LOADsave));

        //The first frame of the media has finished loading.
        Vids[i].addEventListener("loadeddata", receivedMessage(LOADsave));

        //The metadata has been loaded.
        Vids[i].addEventListener("loadedmetadata", receivedMessage(LOADsave));

        console.log(Vids[i]);
      }
//window.alert(Vids);

document.addEventListener('readystatechange',() => {
  //window.alert("Ready State changed");
try {
  Vids = document.querySelectorAll('video');
      for (i = 0; i < Vids.length; i++) {
        Vids[i].playbackRate = LOADsave;
        //Vids[i].loop = 'true';
        //  window.alert("Running on Popup Opened");
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
});

document.addEventListener('DOMContentLoaded',() => {
  window.alert("DOMContentLoaded FastVidExt");
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
            //  window.alert("Running on Popup Opened");
        }
      console.log(Vids);
     }catch (e) {
      LOADsave = '1';
     console.log("Caught Error --  "+e);
    } finally {
      console.log(message);
  }

}

/*
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  receivedMessage(LOADsave);
});
chrome.tabs.onCreated.addListener( function (tabId, changeInfo, tab) {
  receivedMessage(LOADsave);
});
*/
