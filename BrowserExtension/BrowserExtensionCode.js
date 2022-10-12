//TO DO
/*
******** Add in Tables, <td>, <tr>, <table>********

***********ADD IN SPAN************

*/

let oldvalues=null;
window.addEventListener('load', (event) => {
//When a message is received execute the receivedMessage function
chrome.runtime.onMessage.addListener(receivedMessage);

chrome.storage.sync.get('colorobj', function(result){
    console.log('ffs..');
    //oldvalues=result;
    console.log(result);
    });

});

//These are nukes to your broswer data. Do NOT enable/uncomment these unless you're cool with losing your stuff.
//chrome.storage.local.clear(); //clears ALL local storage. Be cautious.
//chrome.storage.sync.clear();  //clears ALL sync'd storage. Be cautious.


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
  case 'Aside':document.querySelectorAll('aside').style.color = color;
            oldvalues.aside = color;
    break;
  case 'Header1Text':document.querySelector('h1').style.color = color;
         chrome.storage.sync.set({'colorobj.header1': color}, function() {
           console.log(id+ ' is set to '+ color);
         });
    break;
  case 'Header2Text':document.querySelector('h2').style.color = color;
         chrome.storage.sync.set({'colorobj.header2': color}, function() {
           console.log(id+ ' is set to ' + color);
          });
    break;
  case 'Header3Text':document.querySelector('h3').style.color = color;
        chrome.storage.sync.set({'colorobj.header3': color}, function() {
            console.log(id+ ' is set to ' + color);
          });
    break;
  case 'Header4Text':document.querySelector('h4').style.color = color;
        chrome.storage.sync.set({'colorobj.header4': color}, function() {
            console.log(id+ ' is set to '+ color);
          });
    break;
  case 'Header5Text':document.querySelector('h5').style.color = color;
        chrome.storage.sync.set({'colorobj.header5': color}, function() {
            console.log(id+ ' is set to '+ color);
          });
    break;
  case 'Header6Text':let h6=document.querySelectorAll('h6'); for (i = 0; i < h6.length; i++) {h6[i].style.color = color;};
         chrome.storage.sync.set({'colorobj.header6': color}, function() {
           console.log(id+ ' is set to '+ color);
         });
    break;
  case 'divinput':let divs=document.querySelectorAll('div'); for (i = 0; i < divs.length; i++) {divs[i].style.backgroundColor =color;};
        chrome.storage.sync.set({'colorobj.div': color}, function() {
            console.log(id+ ' is set to ' + color);
          });
    break;
  case 'divinputtxt':let divstxt=document.querySelectorAll('div'); for (i = 0; i < divstxt.length; i++) {divstxt[i].style.color =color;};
        chrome.storage.sync.set({'colorobj.divText': color}, function() {
            console.log(id+ ' is set to ' + color);
          });
    break;
  case 'bodyBackground':document.querySelector('body').style.backgroundColor = color;
        chrome.storage.sync.set({'colorobj.bodyBackground': [color]}, function() {
            console.log('it might be working idk');
        });
        chrome.storage.sync.set({'colorobj.bodyText': color}, function() {
            console.log(id+ ' is set to ' + color);
          });
    break;
    case 'BodyText':document.querySelector('body').style.color = color;
        chrome.storage.sync.set({'colorobj.bodyText': color}, function() {
            console.log(id+ ' is set to ' + color);
          });
      break;
  case 'pinput':document.querySelector('p').style.color = color;
        chrome.storage.sync.set({'colorobj.pText': color}, function() {
            console.log(id+ ' is set to ' + color);
          });
    break;
  case 'useold': console.log('Hey, loading user Values...');
    gebb();
         /*if(document.querySelector = null){document.querySelectorAll('aside').each.style.color = oldvalues.aside;}
         document.querySelector('h1').style.color = oldvalues.header1;                   */
    break; 
  default:console.log("Element ID "+ id + " didn't match a case. \n" + color + " this color not applied to "+id+".");
    break;
  }
          chrome.storage.sync.set({'colorobj': oldvalues}, function() {
            console.log('Values updated.');
          });
}

function gebb(){
    
    console.log('Within gebb '+oldvalues);

    if(document.querySelector('aside')){document.querySelectorAll('aside').forEach(element => element.style.color =oldvalues.aside);}
    if(document.querySelector('h1')){document.querySelectorAll('h1').forEach(element => element.style.color = oldvalues.header1);}
    if(document.querySelector('h2')){document.querySelectorAll('h2').forEach(element => element.style.color =oldvalues.header2);}
    if(document.querySelector('h3')){document.querySelectorAll('h3').forEach(element => element.style.color=oldvalues.header3);}
    if(document.querySelector('h4')){document.querySelectorAll('h4').forEach(element => element.style.color=oldvalues.header4);}
    if(document.querySelector('h5')){document.querySelectorAll('h5').forEach(element => element.style.color=oldvalues.header5);}
    if(document.querySelector('h6')){document.querySelectorAll('h6').forEach(element => element.style.color=oldvalues.header6);}
    if(document.querySelector('div')){document.querySelectorAll('div').forEach(element => element.style.color=oldvalues.divText);
                                      document.querySelectorAll('div').forEach(element => element.style.backgroundColor=oldvalues.divBackground);
    }
    if(document.querySelector('body')){document.querySelectorAll('body').forEach(element => element.style.color=oldvalues.bodyText);}
    if(document.querySelector('body')){document.querySelectorAll('body').forEach(element => element.style.backgroundColor=oldvalues.bodyBackground);}
    if(document.querySelector('p')){document.querySelectorAll('p').forEach(element => {element.style.color=oldvalues.pText;
                                                                                      element.style.color=oldvalues.pBackground;});
    }
    if(document.querySelector('table')){document.querySelectorAll('table').forEach(element => {element.style.color=oldvalues.tableText;
                                                                                   element => element.style.backgroundColor=oldvalues.tableBackground;});
    }
    if(document.querySelector('span')){document.querySelectorAll('span').forEach(element => {
        element.style.color=oldvalues.spanText;
        element.style.backgroundColor=oldvalues.spanBackground;});
    }
    if(document.querySelector('main')){document.querySelectorAll('main').forEach(element => {element.style.color=oldvalues.mainText;
                                                                                             element.style.backgroundColor=oldvalues.mainBackground;});
    }

    //document.querySelector('').style.color
   }
/*
//Set some content from background page
chrome.storage.local.set({"Aside":"#00FF00", "asideId":"Aside"},function (){
    console.log("Storage Succesful");
});
*/

//get all contents of LOCAL chrome storage
chrome.storage.sync.get(null,function (obj){

    let StrObj = JSON.stringify(obj);
    let parseobj = JSON.parse(StrObj);
    console.log(parseobj.colorobj);
     oldvalues=parseobj.colorobj;
});

/*
background.js
This scripts sets content to chrome storage



chrome.storage.sync.set({key: value}, function() {
  console.log('Value is set to ' + value);
});

chrome.storage.sync.get(['key'], function(result) {
  console.log('Value currently is ' + result.key);
});
*/

//popup.js
//is script retrieves and sets content from\to chrome storage

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
