//!!!!!!!!!!!! THE PROBLEM IS THE FUCKING SAVE!!!!!!!

let LOADsave = localStorage.getItem('FastVideoSpeedload');
let tabURL = '';

function SpeedChanged(e){
  console.log(this.value);
      localStorage.clear();
      //console.log('Storage cleared.');
    localStorage.setItem('FastVideoSpeedload', this.value);
    console.log("Storage changed to "+this.value);

  //document.getElementById("SpeedTxt").innerHTML = 'Video is playing at '+ e.value+'x speed';
  chrome.tabs.query({}, function (tabs){
  chrome.tabs.sendMessage(tabs[0].id, LOADsave);
  let tabURL = tabs[0].url;
  console.log(tabURL);
    });
//window.alert("fuck you");
};

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, url, tab) {
  chrome.tabs.query({}, function (tabs){
  chrome.tabs.sendMessage(tabs[0].id, LOADsave);
  let tabURL = tabs[0].url;
  console.log(tabURL);
    })
});

chrome.tabs.onCreated.addListener( function (tabId, changeInfo, tab) {
    chrome.tabs.query({}, function (tabs){
    chrome.tabs.sendMessage(tabs[0].id, LOADsave);
    let tabURL = tabs[0].url;
    console.log(tabURL);
      });
});

document.getElementById("SpeedValue").addEventListener("change", SpeedChanged);

document.addEventListener('DOMContentLoaded', (e) => {
  if (LOADsave) {
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    chrome.tabs.sendMessage(tabs[0].id, LOADsave);
    let tabURL = tabs[0].url;
    console.log(tabURL);
  })
} else{
  //localStorage.setItem('FastVideoSpeedload', document.getElementById("SpeedValue").value)
  console.log("save did not exist, set to default value");
}
})


/** This is what -would- make the change happen once it was input in the popup. buuut it won't fuggin read for whatever reason **/
//document.getElementById("SpeedValue").addEventListener("change", SpeedChanged);
