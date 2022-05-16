//!!!!!!!!!!!! THE PROBLEM IS THE FUCKING SAVE!!!!!!!

document.getElementById("SpeedValue").addEventListener("change", SpeedChanged);

function SpeedChanged(e){
  console.log("Storage attempting to set to  "+this.value);
  chrome.storage.sync.set({'VidSpeed': this.value},function() {console.log('The value is '+ this.value);});
  console.log("Storage set to "+this.value);
  document.getElementById("SpeedTxt").innerHTML = 'Video is playing at '+ this.value+'x speed';

  chrome.tabs.query({}, function (tabs){
    for (var i = 0; i < tabs.length; i++) {
      chrome.tabs.sendMessage(tabs[i].id, 'Run');
    }
  });
};
