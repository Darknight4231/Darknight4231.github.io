//Content scripts cannot use tabs.get or tabs.update.

//When a message is received execute the receivedMessage function
chrome.runtime.onMessage.addListener(receivedMessage);



function receivedMessage(message, sender, response){
  let parsing = JSON.parse(message);
  console.log(message);
  console.log(parsing);
          try {
            let Vids = document.querySelectorAll('video');
              for (i = 0; i < Vids.length; i++) {
                Vids[i].playbackRate = parseFloat(parsing[0]);
              }
            console.log(Vids);
         }catch (e) {
           chrome.runtime.lastError
            console.log("Caught Error --  "+e);
          } finally {
            console.log(parseFloat(parsing[0]));
            console.log('finished running');
           if (parsing[1]='on') {
            if (document.querySelectorAll('iframe').length !=0) {
              console.log(document.querySelectorAll('iframe'));
              let qsav = document.querySelectorAll('iframe');
              for (i = 0; i < qsav.length; i++) {
                try {
                  console.log(qsav.length+" "+qsav+" "+qsav[i].contentDocument.querySelectorAll('video').length);
                  let Vids = qsav[i].contentDocument.querySelectorAll('video');
                    for (i = 0; i < Vids.length; i++) {
                      Vids[i].playbackRate = parseFloat(parsing[0]);
                    }
                  console.log(Vids);
               }catch (e) {
                  console.log("Caught Error --  "+e);
                } finally {
                  console.log(parseFloat(parsing[0]));
                  console.log('finished running');
                }
              }
            }
          }
       }
    console.log(parseFloat(parsing[0]));
  }
