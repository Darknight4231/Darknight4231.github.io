
  let audioContext;

  try {
     audioContext =
      new (window.AudioContext || window.webkitAudioContext)();
      console.log("AudioContext Defined, starting.");
  } catch (error) {
    console.log("AudioContext startup unsuccessful");
    window.alert(
      `Sorry, but your browser doesn't support the Web Audio API!`
    );
  }

/*
Defaults for all biquadFilter properties
biquadFilter.detune = 0;
biquadFilter.q = 1;
biquadFilter.frequency.value = 350;
biquadFilter.gain.value = 0;
*/

if (navigator.mediaDevices) {
  console.log('navigator exists');
    navigator.mediaDevices.getUserMedia({audio:true}).then(function (stream) {
      console.log('audioexists');


            let audioCtx = new AudioContext();
            let source = audioCtx.createMediaStreamSource(stream);
            let reverbNode;
            let biquadFilter = audioCtx.createBiquadFilter();

            biquadFilter.type = 'highpass';
            biquadFilter.detune = 0;
            biquadFilter.q = 1;
            biquadFilter.frequency.value = 180;
            biquadFilter.gain.value = 0;

            /*
function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++)        {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

reverbNode = audioContext.createConvolver();
  // impulseResponse is defined in another Pen
  // It's a base64 encoded string.
  // Convert it to a binary array first
  var reverbSoundArrayBuffer = base64ToArrayBuffer(impulseResponse);
  audioContext.decodeAudioData(reverbSoundArrayBuffer,
    function(buffer) {
      reverbNode.buffer = buffer;
    },
    function(e) {
      alert("Error when decoding audio data" + e.err);
    }
  );*/



            source.connect(biquadFilter);
            biquadFilter.connect(audioCtx.destination);
      });
    };
