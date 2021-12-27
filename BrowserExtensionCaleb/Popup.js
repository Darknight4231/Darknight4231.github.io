//!!!!!!!!!!!! THE PROBLEM IS THE FUCKING SAVE!!!!!!!

//Easy fix, the save is an
localStorage.clear();


function SpeedChanged(e){
  //console.log(this.value);
  let stringy = JSON.stringify({Speed:this.value});
  if (localStorage.getItem('FastVideoSpeedload')!=stringy) {
    localStorage.clear();
    console.log('Storage cleared.');
    localStorage.setItem('FastVideoSpeedload', stringy);
    console.log("Storage changed to "+stringy);
  }
  //document.getElementById("SpeedTxt").innerHTML = 'Video is playing at '+ e.value+'x speed';
  //Send color to web page in tab.
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
  chrome.tabs.sendMessage(tabs[0].id, stringy);
  let tabURL = tabs[0].url;
  console.log(tabURL);
    });
};

window.addEventListener('load', (e) => {
  if (localStorage.getItem('FastVideoSpeedload')!=e) {
    localStorage.clear();
    console.log('Storage cleared.');
    localStorage.setItem('FastVideoSpeedload', e);
    console.log("Storage changed to "+e);
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    chrome.tabs.sendMessage(tabs[0].id, LOADsave);
    let tabURL = tabs[0].url;
    console.log(tabURL);
  })
}
chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
chrome.tabs.sendMessage(tabs[0].id, LOADsave);
let tabURL = tabs[0].url;
console.log(tabURL);
window.alert(LOADsave);
})
})

/*
chrome.tabs.onCreated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.url == 'complete' && tab.active) {
    //SpeedChanged(LOADsave);
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    chrome.tabs.sendMessage(tabs[0].id, stringy);
    let tabURL = tabs[0].url;
    console.log(tabURL);
      });
 }
})


chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, url, tab) {
  if (changeInfo.url == 'complete') {


  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
  chrome.tabs.sendMessage(tabs[0].id, LOADsave);
  let tabURL = tabs[0].url;
  console.log(tabURL);

  });
  }

//window.alert(url);

  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
  console.log('AAHHH');
})



  //window.alert("URL CHANGED")

//changeInfo.url == 'complete' &&
      //window.alert(LOADsave);
      chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
      chrome.tabs.sendMessage(tabs[0].id, LOADsave);
      let tabURL = tabs[0].url;
      console.log(tabURL);
        });
    //SpeedChanged(LOADsave);
})


//This loads when the webpage is created
chrome.tabs.onActivated.addListener( function (tabId, changeInfo, url, tab) {
//  if (changeInfo.url == 'complete') {
      window.alert('HELP');
      chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
      chrome.tabs.sendMessage(tabs[0].id, LOADsave);
      let tabURL = tabs[0].url;
      console.log(tabURL);
        });
    //SpeedChanged(LOADsave);
  //}
})


*/

let tabURL = '';
  let LOADsave = localStorage.getItem('FastVideoSpeedload');
document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("SpeedValue").addEventListener("change", SpeedChanged);
  let qsav=document.querySelectorAll('video');

  for (var i = 0; i < qsav.length; i++) {
    qsav[i].addEventListener('input',()=>{console.log("heloooooooooo");});
    console.log(qsav[i]);
}

LOADsave = localStorage.getItem('FastVideoSpeedload');
});
