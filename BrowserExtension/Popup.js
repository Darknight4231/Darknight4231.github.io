function colorchanged(e){
  //document.querySelector("p").innerHTML = this.value;
  let stringy = JSON.stringify({color:this.value, id:this.id});
  //let stringy = JSON.stringify({this.id:this.value})
  document.getElementById("headingText").innerHTML = 'Color is now '+ e.value;
  //Send color to web page in tab.
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
  chrome.tabs.sendMessage(tabs[0].id, stringy);
    });
};
document.addEventListener("DOMContentLoaded", (event) => {
  //Fetch all contents
  chrome.storage.local.get(null,function (obj){
      console.log(JSON.stringify(obj));
  });
/*  //Set some content from browser action
  chrome.storage.local.set({"anotherIdentifier":"Another awesome Content"},function (){
      console.log("Storage Succesful");
  });*/
  //This first checks to see if elements exist in the webpage, then adds EventListeners where needed.
  if(document.querySelector('aside')){document.getElementById("Aside").addEventListener("change", colorchanged);}else{document.getElementById("AsideDiv").style.display='none';}
  if(document.querySelector('h1')){document.getElementById("Header1Text").addEventListener("change", colorchanged);}else{document.getElementById("H1Div").style.display='none';}
  if(document.querySelector('h2')){document.getElementById("Header2Text").addEventListener("change", colorchanged);}else{document.getElementById("H2Div").style.display='none';}
  if(document.querySelector('h3')){document.getElementById("Header3Text").addEventListener("change", colorchanged);}else{document.getElementById("H3Div").style.display='none';}
  if(document.querySelector('h4')){document.getElementById("Header4Text").addEventListener("change", colorchanged);}else{document.getElementById("H4Div").style.display='none';}
  if(document.querySelector('h5')){document.getElementById("Header5Text").addEventListener("change", colorchanged);}else{document.getElementById("H5Div").style.display='none';}
  if(document.querySelector('h6')){document.getElementById("Header6Text").addEventListener("change", colorchanged);}else{document.getElementById("H6Div").style.display='none';}
  if(document.querySelector('div')){document.getElementById("divinput").addEventListener("change", colorchanged);document.getElementById("divinputtxt").addEventListener("change", colorchanged);}else{document.getElementById("Div").style.display='none';}
  if(document.querySelector('body')){document.getElementById("bodyBackground").addEventListener("change", colorchanged);document.getElementById("BodyText").addEventListener("change", colorchanged);}else{document.getElementById("bodyBackground").style.display='none';document.getElementById("BodyText").style.display='none';}
});

  /*if(confirm("Use old colors?")){

    //next step
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    chrome.tabs.sendMessage(tabs[0].id, stringy);


      });
    chrome.storage.local.get(null,function (obj){
      console.log(JSON.stringify(obj));
      window.alert(JSON.stringify(obj));
    });
  };*/



//*******************************************************//
/*Copied stuff https://eecs.blog/making-a-browser-extension/
window.addEventListener('load', (event) => {
//Initialize extension to the stored values.
chrome.storage.sync.get(['color'], function(color) {
setColor(color.color);
});
document.getElementById("inputText").addEventListener("change", event =>{
//Get color.
const color = event.target.value;
//Set color.
setColor(color);
//Save color.
chrome.storage.sync.set({'color': color}, function(){});
});
});
function colorchanged(color, id)
{
//Display the selected color.
document.getElementById("headingText").innerHTML = color;
//Send color to web page in tab.
chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
chrome.tabs.sendMessage(tabs[0].id, color);
});
}
*/