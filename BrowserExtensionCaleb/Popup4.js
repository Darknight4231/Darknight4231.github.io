//!!!!!!!!!!!! THE PROBLEM IS THE FUCKING SAVE!!!!!!!
document.getElementById("SpeedValue").addEventListener("change", SpeedChanged);

function SpeedChanged(e){
  console.log("Storage attempting to set to  "+this.value);
  chrome.storage.sync.set({'VidSpeed': this.value},function() {});
  console.log("Storage set to "+this.value);
  document.getElementById("SpeedTxt").innerHTML = 'Video is playing at '+ this.value+'x speed';

  chrome.tabs.query({currentWindow: true, active:true}, function (tabs){
      chrome.tabs.sendMessage(tabs[0].id, 'Run');
  });
};

chrome.storage.sync.get('VidSpeed', (data) => {
document.getElementById("SpeedTxt").innerHTML = 'Video is playing at '+ data.VidSpeed+'x speed';
});
