var VolumeSample = {
};

VolumeSample.gainNode = null;


VolumeSample.play = function() {
  if(!context.createGain)
    context.createGain = context.createGainNode;
  this.gainNode = context.createGain();
  var source = context.createBufferSource();
  source.buffer = BUFFERS.techno;

  //connect to gain node
  source.connect(this.gainNode);
  //connect gainNode to destination
  this.gainNode.connect(context.destination);
  //Begin playback in a loop
  source.loop = true;
  if(!source.start)
    source.start = source.noteOn; //old browser compatability?
  source.start(0);  //start at 0 in file
  this.source = source;
  //this sets the source for the VolumeSample to the new
  //buffer source created by JS in the .play function.
};

VolumeSample.changeVolume = function(e) {
  var volume = e.value;
  var fraction = parseInt(e.value)/parseInt(e.max);

  this.gainNode.gain.value = fraction;
  //using linear increase ^
};

VolumeSample.stop = function() {
  if(!this.source.stop)
    this.source.stop = source.noteOff;
  this.source.stop(0);
};

//toggle play/stop
VolumeSample.toggle = function() {
  this.playing ? this.stop() : this.play();
  this.playing = !this.playing;
}
