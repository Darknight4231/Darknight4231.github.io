/*
chrome.webNavigation.onCreatedNavigationTarget.addListener(details => {
    console.log("Created");
    Message();
});
*/

chrome.webNavigation.onCommitted.addListener(details => {
    console.log("Commited");
    Message();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("Updated");
    Message();
});
chrome.tabs.onActivated.addListener(details => {
    console.log("Activated");
    Message();
});

document.onreadystatechange=function(){
  console.log("ReadyStateChanged");
    Message();
}

window.addEventListener('load', () => {
  console.log("Page fully loaded");
    Message();
});

function Message(){
chrome.tabs.query({currentWindow: true, active:true}, function (tab){
chrome.tabs.sendMessage(tab[0].id, 'Run');
  });
}

//https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/sendMessage
//https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/sendMessage
/*
for (var i = 0; i < tabs.length; i++) {
  chrome.tabs.sendMessage(tabs[i].id, 'Run');
  }

  function sendMessage() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    lastTabId = tabs[0].id;
    chrome.tabs.sendMessage(lastTabId, "Background page started.");
  });
}
*/
