//Content scripts cannot use tabs.get or tabs.update.

//When a message is received execute the receivedMessage function
chrome.runtime.onMessage.addListener(receivedMessage);
function receivedMessage(message, sender, response){
  switch (message) {
    case 'Run':
    chrome.storage.sync.get('VidSpeed', (data) => {console.log(data.VidSpeed);
          try {
            let Vids = document.querySelectorAll('video');
              for (i = 0; i < Vids.length; i++) {
                Vids[i].playbackRate = data.VidSpeed;
              }
            console.log(Vids);
         }catch (e) {
           chrome.runtime.lastError
            console.log("Caught Error --  "+e);
          } finally {
            console.log(data.VidSpeed);
            console.log('finished running');
          chrome.storage.sync.get('iFrames',  (data) => {
           if (data.iFrames='on') {
            if (document.querySelectorAll('iframe').length !=0) {
              console.log(document.querySelectorAll('iframe'));
              let qsav = document.querySelectorAll('iframe');
              for (i = 0; i < qsav.length; i++) {
                try {
                  console.log(qsav.length+" "+qsav+" "+qsav[i].contentDocument.querySelectorAll('video').length);
                  let Vids = qsav[i].contentDocument.querySelectorAll('video');
                    for (i = 0; i < Vids.length; i++) {
                      Vids[i].playbackRate = data.VidSpeed;
                    }
                  console.log(Vids);
               }catch (e) {
                  console.log("Caught Error --  "+e);
                } finally {
                  console.log(data.VidSpeed);
                  console.log('finished running');
                }
              }
            }
          }
        });
       }
      });
      break;
      default:
    console.log(data.VidSpeed);
    }
  }
