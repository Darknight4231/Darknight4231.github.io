/*
chrome.webNavigation.onCreatedNavigationTarget.addListener(details => {
    console.log("Created");
    Message();
});

Need to somehow limit the events (messages sent) -- larger sites  overrun the code;
the website then suffers from less workers than necessary to successfully load the DOM.

I think this is mostly due to loading Chrome.sync so frequently.
If I actually -SEND- the value instead that'd be a hell of a lot faster,
and not occupy all service workers.
*/
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({'iFrames': false},function() {});
  chrome.storage.sync.set({'VidSpeed': 1},function() {});
});

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
chrome.tabs.query({active:true, currentWindow:true}, function (tab){
  try {
    chrome.tabs.sendMessage(tab[0].id, 'Run');
    console.log("Message sent successfully.");
  } catch (e) {
    console.log("Failed Sending, error.");
    console.log(e);
    return;
  } finally {
  }
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
