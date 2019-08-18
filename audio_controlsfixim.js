var AudioSample = {
};//is this an object? Yes it is

AudioSample.gainNode = null;
//Gain must be changed through JS

AudioSample.play = function() {
  this.gainNode = context.createGain();
  var source = context.createBufferSource();
  source.buffer = BUFFERS.techno;
  //this selects a default buffer... techno?
  //BUFFERS is a default identifier, for default loaded buffers right?

  source.connect(this.gainNode);
  this.gainNode.connect(context.destination);
  source.start(0);
  this.source = source;
};

AudioSample.changeVolume = function(e) {
  var volume = e.value;//useless var ? No, it can be referenced
  //elsewhere to show the actual volume, fraction gets the
  //actual volume numerically for JS to output
  var fraction = parseInt(e.value)/parseInt(e.max);

  this.gainNode.gain.value = fraction;
};

AudioSample.stop = function() {
  this.source.stop(0);
};

AudioSample.toggle = function() {
  this.playing ? this.stop() : this.play();
  this.playing = !this.playing;
  };
