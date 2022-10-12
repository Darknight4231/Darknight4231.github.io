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
//localStorage.setItem('DarkSaveFile', JSONSaveArray);
//saveGrabber = localStorage.getItem('DarkSaveFile');

chrome.runtime.onInstalled.addListener(() => {
    //Full-NUKE, unless you're me -- the DEV, don't use this. Please.
    //chrome.storage.sync.clear();

       let colorobj ={
          aside:  '#FF0000',
          header1:'#F00000',
          header2:'#F00000',
          header3:'#F00000',
          header4:'#F00000',
          header5:'#F00000',
          header6:'#F00000',

          div:    '#000000',
          divText:'#0F6CFF',

          bodyBackground:'#000000',
          bodyText:'#00BB00',
          
          pBackground:'#000000',
          pText:    '#0BDDDD',

          spanBackground:'#00FF00',
          spanText:'#00CC00',

          tableBackground:'#0C00C0',
          tableText:'#FFFFFF',

          mainText:'#FFFFFF',
          mainBackground:'#000000',
          
          
       }
          chrome.storage.sync.set({'colorobj': colorobj}, function(){
            console.log('Hi, arrays... am I right? Object master race.');
          });
          
          
          /*
         chrome.storage.sync.set({'Aside': null}, function() {
           console.log('Aside reset to ' + null);
          });
         chrome.storage.sync.set({'Header1Text': null}, function(){
             console.log('Header1Text reset to '+ null);
         });
        chrome.storage.sync.set({'Header2Text': null}, function() {
           console.log('Header2Text is set to ' + null);
          });
       chrome.storage.sync.set({'Header3Text': null}, function() {
            console.log('Header3Text is set to ' + null);
          });
        chrome.storage.sync.set({'Header4Text': null}, function() {
            console.log('Header4Text is set to ' + null);
          });
        chrome.storage.sync.set({'Header5Text': null}, function() {
            console.log('Header5Text is set to ' + null);
          });
         chrome.storage.sync.set({'Header6Text': null}, function() {
           console.log('Header6Text is set to ' + null);
         });
        chrome.storage.sync.set({'divinput': null}, function() {
            console.log('divinput is set to ' + null);
          });
        chrome.storage.sync.set({'divinputtxt': null}, function() {
            console.log('divinputtxt is set to ' + null);
          });
        chrome.storage.sync.set({'bodyBackground': null}, function() {
            console.log('bodyBackground is set to ' + null);
          });
        chrome.storage.sync.set({'BodyText': null}, function() {
            console.log('BodyText is set to ' + null);
          });
        chrome.storage.sync.set({'pinput': null}, function() {
            console.log('pinput is set to ' + null);
          });
          */
});

let array = ['#00FF00','bodyBackground'];
/*
    //Always load the values before sending any messages.
    localStorage.getItem('color', (data) => {array[0]=data.color});
      localStorage.getItem('side',  (data) => {array[1]=data.aside;});*/

/*chrome.webNavigation.onCommitted.addListener(details => {
    console.log("Commited");
    Message("Commited");
});*/

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("Updated");
    Message("Updated");
});

chrome.tabs.onActivated.addListener(details => {
    console.log("Activated");
    Message("Activated");
});

document.onreadystatechange=function(){
  console.log("ReadyStateChanged");
    Message("ReadyStateChanged");
}

window.addEventListener('load', () => {
  console.log("Page fully loaded");
    Message("Page fully loaded");
});

function Message(Reason){
  array[2]='useold';
  //stringy = JSON.stringify(array);
  let stringy = JSON.stringify({color: null, id: 'useold'});
  console.log(stringy);
chrome.tabs.query({active:true, currentWindow:true}, function (tab){
  try {
    chrome.tabs.sendMessage(tab[0].id, stringy);
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
