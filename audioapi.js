/*
let audioCtx;

try {
   audioCtx =
    new (window.AudioContext || window.webkitAudioContext)();
    console.log("AudioContext Defined, starting.");
} catch (error) {
  console.log("AudioContext startup unsuccessful");
  window.alert(
    `Sorry, but your browser doesn't support the Web Audio API!`
  );
}

if (audioCtx !== undefined) {
  /* Our code goes here */

  let OSCON = 0;

  const Gainvalue = document.getElementById("Volume");
  const Frequ = document.getElementById("Freq");
  const freqtxt = document.getElementById("freqvaltxt");
  const WaveVer = document.getElementById("WaveVer");
  const DetuneRange = document.getElementById("Detune");
  const Detunetext = document.getElementById("Detunetxt");


  //making a dynamicsCompressor, it aids by restraining decibel values to a threshold, as well as ensuring no instant ear rape.
  let Compressor = audioCtx.createDynamicsCompressor();
/*
only one not included -- it's just an identifier.

DynamicsCompressorNode.reduction Read only
Is a float representing the amount of gain reduction currently applied by the Compressor to the signal.
*/

  Compressor.threshold.setValueAtTime(-50, audioCtx.currentTime);
  //Read only   Is a k-rate AudioParam representing the decibel value above which the compression will start taking effect.
  Compressor.knee.setValueAtTime(40, audioCtx.currentTime);
  //Read only   Is a k-rate AudioParam containing a decibel value representing the range above the threshold where the curve smoothly transitions to the compressed portion.
  Compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
  //Read only   Is a k-rate AudioParam representing the amount of change, in dB, needed in the input for a 1 dB change in the output.
  Compressor.attack.setValueAtTime(0, audioCtx.currentTime);
  //Read only   Is a k-rate AudioParam representing the amount of time, in seconds, required to reduce the gain by 10 dB.
  Compressor.release.setValueAtTime(0.25, audioCtx.currentTime);
  //Read only   Is a k-rate AudioParam representing the amount of time, in seconds, required to increase the gain by 10 dB.


  const HEY = document.querySelectorAll('.Radio');
  const StartDoc = document.getElementById("Start");
  StartDoc.addEventListener('click', Start);

  const gainNode = audioCtx.createGain();
  const gainNode2 = console.log("GainNode created");

  const gainNode3 = audioCtx.createGain();
  const gainNode4 = console.log("GainNode created");

  const oscillator = audioCtx.createOscillator();
  const oscillator2 = console.log("Oscillator created");

  const OscConnect = oscillator.connect(gainNode);
  const OscConnect2 = console.log("oscillator connected to GainNode");

  const GainConnect = gainNode.connect(audioCtx.destination);
  const GainConnect2 = console.log("GainNode connected to audioCtx.destination");


  //event listener for gain rangebar changes.
  Gainvalue.onchange = function(){
    gainchange=Gainvalue.value;
  };
  //event listener for Frequency rangebar changes.
  Frequ.onchange = function(){
    Freqchange();
  };
  //listener for Oscillator Distortion changes.
  DetuneRange.onchange = function() {
    oscillator.detune = DetuneRange.value;
    console.log(DetuneRange.value);
    Detunetxt.innerHTML = (DetuneRange.value+" (in cents)");
  };

  const Schumann = document.getElementById("Schumann");
  Schumann.onclick = function(){
   oscillator.frequency.setValueAtTime(7.83, audioCtx.currentTime);
   console.log("Schumann on");
   freqtxt.innerHTML = "7.83";
  };
  //Event listener for Wavetype selection changes.
  /*WaveVer.onchange = function(){
      oscillator.type = WaveVer.value;
  };*/
    //function to change frequency of oscillator. Dependant on event listener input.
    function Freqchange(){
     oscillator.frequency.setValueAtTime(Frequ.value, audioCtx.currentTime);
     freqtxt.innerHTML = Frequ.value;
    };
    //function to change volume of Gain node. Dependant on event listener input.
    function gainchange(e) {
      gainNode.gain.setValueAtTime(e/100, audioCtx.currentTime);
    };

    OscConnect;
    OscConnect2;
    gainNode.connect(Compressor);
    Compressor.connect(audioCtx.destination);

    document.getElementById('poo').addEventListener('click', (event) => {
     for (var i = 0; i < HEY.length; i++) {
       if (HEY[i].checked) {
         console.log(HEY[i].value+" Checked");
         oscillator.type = HEY[i].value;
       }
      }
    });

//This function is what Starts and stops the whole thing. Until the start button is first pressed, nothing will be on but gainNodes at the most.
  function Start() {
    //This first IF statement starts the oscillator if it hasn't been started already.
    if (OSCON == 0){
    oscillator.start();
    oscillator2;
    OSCON = 1;
    console.log("oscillator Started");
   }
   if (StartDoc.innerHTML == "Start oscillator") {
     //unmute function
     gainNode3.connect(audioCtx.destination);
     StartDoc.innerHTML ="Stop";
     return;

   } else {
     //mute function
     gainNode3.disconnect(audioCtx.destination);
     StartDoc.innerHTML = "Start oscillator";
     return;
   }



/*  const Gainvalue = document.getElementById("Volume");
  const Frequ = document.getElementById("Freq");
  const freqtxt = document.getElementById("freqvaltxt");
  const WaveVer = document.getElementById("WaveVer");
*/
  console.log("Finished Setup.");
};
