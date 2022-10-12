function colorchanged(e){
  //document.querySelector("p").innerHTML = this.value;
  let stringy = JSON.stringify({color:this.value, id:this.id});
  //let stringy = JSON.stringify({this.id:this.value})
  document.getElementById("headingText").innerHTML = 'Color is now '+ this.value;
  //Send color to web page in tab.
  chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
  chrome.tabs.sendMessage(tabs[0].id, stringy);
  //chrome.storage.sync.set({'color':this.value,'id':this.id})
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
  });
*/

/*
Using Chrome storage to actually get something done.
  chrome.storage.sync.get('VidSpeed', (data) => {})
  chrome.storage.sync.set({'VidSpeed': this.value},function() {});
*/
  //This first checks to see if elements exist in the webpage, then adds EventListeners where needed.
  if(document.querySelector('aside')){document.getElementById("Aside").addEventListener("input", colorchanged);}else{document.getElementById("AsideDiv").style.display='none';}
  if(document.querySelector('h1')){document.getElementById("Header1Text").addEventListener("input", colorchanged);}else{document.getElementById("H1Div").style.display='none';}
  if(document.querySelector('h2')){document.getElementById("Header2Text").addEventListener("input", colorchanged);}else{document.getElementById("H2Div").style.display='none';}
  if(document.querySelector('h3')){document.getElementById("Header3Text").addEventListener("input", colorchanged);}else{document.getElementById("H3Div").style.display='none';}
  if(document.querySelector('h4')){document.getElementById("Header4Text").addEventListener("input", colorchanged);}else{document.getElementById("H4Div").style.display='none';}
  if(document.querySelector('h5')){document.getElementById("Header5Text").addEventListener("input", colorchanged);}else{document.getElementById("H5Div").style.display='none';}
  if(document.querySelector('h6')){document.getElementById("Header6Text").addEventListener("input", colorchanged);}else{document.getElementById("H6Div").style.display='none';}
  if(document.querySelector('div')){document.getElementById("divinput").addEventListener("input", colorchanged);document.getElementById("divinputtxt").addEventListener("input", colorchanged);}else{document.getElementById("Div").style.display='none';}
  if(document.querySelector('p')){document.getElementById("pinput").addEventListener('input', colorchanged);}else{document.getElementById('pinput').style.display='none';}
  if(document.querySelector('body')){document.getElementById("bodyBackground").addEventListener("input", colorchanged);document.getElementById("BodyText").addEventListener("input", colorchanged);}else{document.getElementById("bodyBackground").style.display='none';document.getElementById("BodyText").style.display='none';}
});
