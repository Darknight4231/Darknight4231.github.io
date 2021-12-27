/*navigator.serviceWorker.register('/background_page.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }, function(err) {
    // registration failed :(
    //window.alert('ServiceWorker registration failed: ', err);
  });*/
//chrome.storage.local.get({variable: variableInformation});
//
/*
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, url, tab) {
   chrome.tabs.query({}, function (tabs){
   let LOADsave = localStorage.getItem('FastVideoSpeedload');
  if (LOADsave) {
    try {
      let Vids = document.querySelectorAll('video');
            for (let i = 0; i < Vids.length; i++) {
              Vids[i].playbackRate = LOADsave;
              //Vids[i].loop = 'true';
                 window.alert("Running on Page updated");

                 chrome.tabs.sendMessage(tabs[0].id, LOADsave);
               }

         }catch (e) {
         window.alert("Caught Error --  "+e);
        } finally {
          console.log(LOADsave);
      }

    } else {
      window.alert("no save exists");
    console.log("No save data exists.");
   }
 });
});

chrome.tabs.onCreated.addListener( function (tabId, changeInfo, tab) {
  chrome.tabs.query({}, function (tabs){
  let LOADsave = localStorage.getItem('FastVideoSpeedload');
 if (LOADsave) {
   try {
     let Vids = document.querySelectorAll('video');
           for (let i = 0; i < Vids.length; i++) {
             Vids[i].playbackRate = LOADsave;
             //Vids[i].loop = 'true';
                window.alert("Running on Page updated");

                chrome.tabs.sendMessage(tabs[0].id, LOADsave);
              }

        }catch (e) {
        window.alert("Caught Error --  "+e);
       } finally {
         console.log(LOADsave);
     }

   } else {
     window.alert("FUCK IT ALL");
   console.log("No save data exists.");
  }
});
});
*/
/*
Current solution...

Grab all tabId s, send in a https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/sendMessage
Save all tabId s in background page.

on Popup open, sendMessage to background_page reloading all tabId s, renewing liseteners on each if necessary,
as well as sending the current value of the speed setting.


on update of speed setting, send to background_page. It will handle everything from now on. Persistently.

*/
