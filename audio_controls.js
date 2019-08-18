
/* remember that #is for ids and .is for classes*/

//var audiofiles = new AudioContext();
//var source = audiofiles.createMediaElementSource();



  const audiofiles = document.getElementById('audiofiles');
//  const track = audiofiles.createMediaElementSource('audiofiles');
  var playpause = document.getElementById('playpausebutton');
  var volume = document.getElementById('volume');

  function switchState() {
    if (audiofiles.paused == true) {
      audiofiles.play();
      playpause.innerHTML = "Pause";
    } else {
      audiofiles.pause();
      playpause.innerHTML = "Play";
    }
  };

  function checkKey(e) {
    if (e.keycode == 32 ) { //spacebar
      switchState();
    }
    if (e.key == "a") {

    }
  };

  function endfunction(e) {
      playpause.innerHTML = "Play";
      console.log('Hello!');
      console.log(audiofiles.trackList);
  };

  function volchange(e) {

  };

  playpause.addEventListener("click", function() {
    switchState();
  }, false);

  //track.connect(gainNode);
  //gainNode.connect(track.destination);

  window.addEventListener( "keypress", checkKey, false );
  audiofiles.addEventListener ("ended", endfunction);
  volume.addEventListener("change", volchange);

//  gainNode.connect(audioCtx.destination);
//  source.connect(gainNode);

/*So, to be able to change anything such as the volume or tracks, we need to first access
the Web Audio API, by grabbing grabbing the audio source (audio element) and sending or piping
it into the audioContext element source API, as follows. It is easiest to do it in two variables,
similar to how you would make a canvas element.

var AUDIOELEMENT = document.getElementById("AUDIOSOURCEHERE");
var track = audioContext.createMediaElementSource('first var, AUDIOELEMENT here');
*/



/*
THIS WAS COPIED FROM https://www.html5rocks.com/en/tutorials/webaudio/intro/
It's information regarding the web audio API, this is an example on how to set up
 an audio element to pass through a gain node to change volume according to the
 connected input range element.

var VolumeSample = {
};

// Gain node needs to be mutated by volume control.
VolumeSample.gainNode = null;

VolumeSample.play = function() {
  if (!context.createGain)
    context.createGain = context.createGainNode;
  this.gainNode = context.createGain();
  var source = context.createBufferSource();
  source.buffer = BUFFERS.techno;

  // Connect source to a gain node
  source.connect(this.gainNode);
  // Connect gain node to destination
  this.gainNode.connect(context.destination);
  // Start playback in a loop
  source.loop = true;
  if (!source.start)
    source.start = source.noteOn;
  source.start(0);
  this.source = source;
};

VolumeSample.changeVolume = function(element) {
  var volume = element.value;
  var fraction = parseInt(element.value) / parseInt(element.max);
  // Let's use an x*x curve (x-squared) since simple linear (x) does not
  // sound as good.
  this.gainNode.gain.value = fraction * fraction;
};

VolumeSample.stop = function() {
  if (!this.source.stop)
    this.source.stop = source.noteOff;
  this.source.stop(0);
};

VolumeSample.toggle = function() {
  this.playing ? this.stop() : this.play();
  this.playing = !this.playing;
};*/
