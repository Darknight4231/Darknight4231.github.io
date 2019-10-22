/*
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

if (audioContext !== undefined) {
  /* Our code goes here */

  let OSCON = 0;

  const Gainvalue = document.getElementById("Volume");
  const Frequ = document.getElementById("Freq");
  const freqtxt = document.getElementById("freqvaltxt");
  const WaveVer = document.getElementById("WaveVer");
  const DetuneRange = document.getElementById("Detune");
  const Detunetext = document.getElementById("Detunetxt");



  const HEY = document.querySelectorAll('.Radio');
  const StartDoc = document.getElementById("Start");
  StartDoc.addEventListener('click', Start);

  const gainNode = audioContext.createGain();
  const gainNode2 = console.log("GainNode created");

  const oscillator = audioContext.createOscillator();
  const oscillator2 = console.log("Oscillator created");

  const OscConnect = oscillator.connect(gainNode);
  const OscConnect2 = console.log("oscillator connected to GainNode");

  const GainConnect = gainNode.connect(audioContext.destination);
  const GainConnect2 = console.log("GainNode connected to audioContext.destination");


  //event listener for gain rangebar changes.
  Gainvalue.onchange = function(){
    gainchange(Gainvalue.value);
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
   oscillator.frequency.setValueAtTime(7.83, audioContext.currentTime);
   console.log("Schumann on");
   freqtxt.innerHTML = "7.83";
  };
  //Event listener for Wavetype selection changes.
  /*WaveVer.onchange = function(){
      oscillator.type = WaveVer.value;
  };*/
    //function to change frequency of oscillator. Dependant on event listener input.
    function Freqchange(){
     oscillator.frequency.setValueAtTime(Frequ.value, audioContext.currentTime);
     freqtxt.innerHTML = Frequ.value;
    };
    //function to change volume of Gain node. Dependant on event listener input.
    function gainchange(e) {
      gainNode.gain.setValueAtTime(e/100, audioContext.currentTime);
    };

    OscConnect;
    OscConnect2;

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
     gainNode.connect(audioContext.destination);
     StartDoc.innerHTML ="Stop";
     return;

   } else {
     //mute function
     gainNode.disconnect(audioContext.destination);
     StartDoc.innerHTML = "Start oscillator";
     return;
   }
//  };

/*  const Gainvalue = document.getElementById("Volume");
  const Frequ = document.getElementById("Freq");
  const freqtxt = document.getElementById("freqvaltxt");
  const WaveVer = document.getElementById("WaveVer");
*/
  console.log("Finished Setup.");
};
