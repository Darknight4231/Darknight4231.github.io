document.getElementById("Check").addEventListener("Change",()=>{
  chrome.storage.sync.set({'iFrames': this.value},function() {});
})
