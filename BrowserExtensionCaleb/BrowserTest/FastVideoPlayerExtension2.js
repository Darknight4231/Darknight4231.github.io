window.addEventListener('load', (event) => {


//When a message is received execute the receivedMessage function
chrome.runtime.onMessage.addListener(receivedMessage);

receivedMessage(LOADsave);


  });

LOADsave = localStorage.getItem('FastVideoSpeedload');
chrome.tabs.onCreated.addListener( function (tabId, changeInfo, tab) {
  receivedMessage(LOADsave);
});
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, url, tab) {
  receivedMessage(LOADsave);
});
function receivedMessage(message, sender, response){

  console.log(message);

try {
  let Vids = document.querySelectorAll('video');
        for (let i = 0; i < Vids.length; i++) {
          Vids[i].playbackRate = message;
          //Vids[i].loop = 'true';
              //window.alert("Running on Page created");
          console.log(Vids[i].src);
        }
        console.log(Vids);
     }catch (e) {
     window.alert("Caught Error --  "+e);
    } finally {
      console.log("Finished changing PlaybackRate");
  }

}
let qsav=document.querySelectorAll('video');

for (var i = 0; i < qsav.length; i++) {
  qsav[i].addEventListener('loadeddata',()=>{console.log("heloooooooooo");});
  console.log(qsav[i]);
}
console.log(qsav);
