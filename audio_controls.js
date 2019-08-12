window.onload = function() {

/* remember that #is for ids and .is for classes */

  var audiofiles = document.getElementById('audiofiles');
//  var track = audioContext.createMediaElementSource('audiofiles');
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

  playpause.addEventListener('click', function() {
    switchState();
  }, false);

  window.addEventListener( "keypress", checkKey, false );
  audiofiles.addEventListener ("ended", endfunction);
  volume.addEventListener("change", volchange);
}

/*So, to be able to change anything such as the volume or tracks, we need to first access
the Web Audio API, by grabbing grabbing the audio source (audio element) and sending or piping
it into the audioContext element source API, as follows. It is easiest to do it in two variables,
similar to how you would make a canvas element.

var AUDIOELEMENT = document.getElementById("AUDIOSOURCEHERE");
var track = audioContext.createMediaElementSource('first var, AUDIOELEMENT here');
*/
