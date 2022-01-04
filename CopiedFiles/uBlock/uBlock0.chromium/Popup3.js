//!!!!!!!!!!!! THE PROBLEM IS THE FUCKING SAVE!!!!!!!

 LOADsave = localStorage.getItem('FastVideoSpeedload');
let tabURL = '';

document.getElementById("SpeedValue").addEventListener("change", SpeedChanged);

function SpeedChanged(e){
  console.log(this.value);
      localStorage.clear();
      //console.log('Storage cleared.');
    localStorage.setItem('FastVideoSpeedload', this.value);
    console.log("Storage changed to "+this.value);

  document.getElementById("SpeedTxt").innerHTML = 'Video is playing at '+ this.value+'x speed';
  chrome.tabs.query({}, function (tabs){
  chrome.tabs.sendMessage(tabs[0].id, this.value);
  let tabURL = tabs[0].url;
  console.log(tabURL);
    })
};
if (LOADsave) {
  document.getElementById("SpeedTxt").innerHTML = 'Save file has video playing at '+ LOADsave+'x speed';
}else {
  document.getElementById("SpeedTxt").innerHTML = 'No Saved Speed';
}
