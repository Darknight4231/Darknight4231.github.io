//!!!!!!!!!!!! THE PROBLEM IS THE FUCKING SAVE!!!!!!!
document.getElementById("SpeedValue").addEventListener("change", SpeedChanged);

let array = [];
chrome.storage.sync.get('VidSpeed', (data) => {array[0]=data.VidSpeed;});
chrome.storage.sync.get('iFrames',  (data) => {array[1]=data.iFrames;});

function SpeedChanged(e){
  try {
    array[2]='Changed in popup menu';
    if (isFinite(this.value)) {
      array[0]=this.value;
      console.log('NUMBER IS FINITE '+this.value);
        console.log("Storage attempting to set to  "+this.value);
        chrome.storage.sync.set({'VidSpeed': this.value},() => {});
        console.log("Storage set to "+this.value);
        document.getElementById("SpeedTxt").innerHTML = 'Video is playing at '+ this.value+'x speed';

      } else{
        array[1]=e;
    }
  } catch (e) {
    console.log('Error');
    console.log(e);
  } finally {
     message = JSON.stringify(array);
    chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
   }
};

chrome.storage.sync.get('VidSpeed', (data) => {
document.getElementById("SpeedTxt").innerHTML = 'Video is playing at '+ data.VidSpeed+'x speed';
});

document.getElementById("Check").addEventListener("change",()=>{
  chrome.storage.sync.set({'iFrames': this.value},function() {
    //document.getElementById('Check').value=this.value;
    SpeedChanged(this.value);});
})

chrome.storage.sync.get('iFrames',(data)=>{
  if (document.getElementById('Check').value='on') {
  document.getElementById('Check').value='on';
  }
});
