document.getElementById("Check").addEventListener("Change",()=>{
  chrome.storage.sync.set({'iFrames': this.value},function() {document.getElementById('Check').value=this.value});
})
chrome.storage.sync.get('iFrames',(data)=>{
  if (document.getElementById('Check').value='on') {
  document.getElementById('Check').value='on';
  }
});
