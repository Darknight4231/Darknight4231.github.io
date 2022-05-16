chrome.webNavigation.onCreatedNavigationTarget.addListener(details => {
    console.log("Created");
    chrome.tabs.query({}, function (tabs){
      for (var i = 0; i < tabs.length; i++) {
        chrome.tabs.sendMessage(tabs[i].id, 'Run');
      }
  });
});

chrome.webNavigation.onCommitted.addListener(details => {
    console.log("Commited");
    chrome.tabs.query({}, function (tabs){
      for (var i = 0; i < tabs.length; i++) {
        chrome.tabs.sendMessage(tabs[i].id, 'Run');
      }
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("Updated");
    chrome.tabs.query({}, function (tabs){
      for (var i = 0; i < tabs.length; i++) {
        chrome.tabs.sendMessage(tabs[i].id, 'Run');
      }
    });
});

document.onreadystatechange=function(){
  chrome.tabs.query({}, function (tabs){
    for (var i = 0; i < tabs.length; i++) {
      chrome.tabs.sendMessage(tabs[i].id, 'Run');
    }
});
}

window.addEventListener('load', () => {
  chrome.tabs.query({}, function (tabs){
    for (var i = 0; i < tabs.length; i++) {
      chrome.tabs.sendMessage(tabs[i].id, 'Run');
    }
  });
});
