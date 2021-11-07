window.addEventListener('load', (event) => {
//When a message is received execute the receivedMessage function
chrome.runtime.onMessage.addListener(receivedMessage);

//window.alert("divs= "+divs.length)
  //if(confirm("Use old colors?")){

//  };
});

function receivedMessage(message, sender, response){
  parse(message);
};

function parse(message){
  let parsing = JSON.parse(message);
//When the message is received call and pass the value to the colorElements function.
colorElements(parsing.color, parsing.id);

};

function colorElements(color, id){

//Get elements.
switch (id) {
  case 'undefined':window.alert("Undefined");
    break;
  case 'Aside':document.querySelector('aside').style = color;
    break;
  case 'Header1Text':document.querySelector('h1').style.color = color;
    break;
  case 'Header2Text':document.querySelector('h2').style.color = color;
    break;
  case 'Header3Text':document.querySelector('h3').style.color = color;
    break;
  case 'Header4Text':document.querySelector('h4').style.color = color;
    break;
  case 'Header5Text':document.querySelector('h5').style.color = color;
    break;
  case 'Header6Text':let h6=document.querySelectorAll('h6'); for (i = 0; i < h6.length; i++) {h6[i].style.color = color;};
    break;
  case 'divinput':let divs=document.querySelectorAll('div'); for (i = 0; i < divs.length; i++) {divs[i].style.backgroundColor =color;};
    break;
  case 'divinputtxt':let divstxt=document.querySelectorAll('div'); for (i = 0; i < divs.length; i++) {divs[i].style.color =color;};
    break;
  case 'bodyBackground':document.querySelector('body').style.backgroundColor = color;
    break;
    case 'BodyText':document.querySelector('body').style.color = color;
      break;
  case 'useold': chrome.storage.local.get(null,function (obj){console.log(JSON.stringify(obj));window.alert(obj);});
    break;
  default:window.alert("Element ID didn't match a case.");
    break;
  }
}

//Set some content from background page
chrome.storage.local.set({"identifier":"SomeReallyAwesomecontent, strings only"},function (){
    console.log("Storage Succesful");
});
//get all contents of chrome storage
chrome.storage.local.get(null,function (obj){
        console.log(JSON.stringify(obj));
});

/*
background.js
This scripts sets content to chrome storage

//Set some content from background page
chrome.storage.local.set({"identifier":"Some awesome Content"},function (){
    console.log("Storage Succesful");
});
//get all contents of chrome storage
chrome.storage.local.get(null,function (obj){
        console.log(JSON.stringify(obj));
});



popup.js
This script retrieves and sets content from\to chrome storage

document.addEventListener("DOMContentLoaded",function (){
    //Fetch all contents
    chrome.storage.local.get(null,function (obj){
        console.log(JSON.stringify(obj));
    });
    //Set some content from browser action
    chrome.storage.local.set({"anotherIdentifier":"Another awesome Content"},function (){
        console.log("Storage Succesful");
    });
});
*/


/*
Copied stuff https://eecs.blog/making-a-browser-extension/
window.addEventListener('load', (event) => {
//When a message is received execute the receivedMessage function
chrome.runtime.onMessage.addListener(receivedMessage);
chrome.storage.sync.get(['color'], function(color) {
colorElements(color.color);
});
});
function receivedMessage(message, sender, response){
//When the message is received call and pass the value to the colorElements function.
colorElements(message);
}
function colorElements(color){
//Get elements.
let list = document.getElementsByTagName("H2");
//Color the elements.
for(let element of list){
element.style.color = color;
}
}
*/
