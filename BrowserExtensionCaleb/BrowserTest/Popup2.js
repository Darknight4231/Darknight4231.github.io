//!!!!!!!!!!!! THE PROBLEM IS THE FUCKING SAVE!!!!!!!

//Easy fix, the save is an
//localStorage.clear();

function SpeedChanged(e){
  //console.log(this.value);
      localStorage.clear();
      console.log('Storage cleared.');
    localStorage.setItem('FastVideoSpeedload', this.value);
    console.log("Storage changed to "+this.value);

  //document.getElementById("SpeedTxt").innerHTML = 'Video is playing at '+ e.value+'x speed';
  //Send color to web page in tab.
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
  chrome.tabs.sendMessage(tabs[0].id, LOADsave);
  let tabURL = tabs[0].url;
  console.log(tabURL);
    });

};




//******  From here to next comment currently does nothing seemingly   *********//

/*
chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, url, tab) {
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
  chrome.tabs.sendMessage(tabs[0].id, LOADsave);
  let tabURL = tabs[0].url;
  console.log(tabURL);
    })
});

chrome.tabs.onCreated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.url == 'complete') {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    chrome.tabs.sendMessage(tabs[0].id, LOADsave);
    let tabURL = tabs[0].url;
    console.log(tabURL);
      });
    }
});
*/

//********** Below this does things *******//
let tabURL = '';
  let LOADsave = localStorage.getItem('FastVideoSpeedload');
document.addEventListener("DOMContentLoaded", (event) => {

  document.getElementById("SpeedValue").addEventListener("change", SpeedChanged);
  let qsav=document.querySelectorAll('video');

  for (var i = 0; i < qsav.length; i++) {
    qsav[i].addEventListener('loadeddata',()=>{console.log("heloooooooooo");});
    console.log(qsav[i]);
}

LOADsave = localStorage.getItem('FastVideoSpeedload');
});
