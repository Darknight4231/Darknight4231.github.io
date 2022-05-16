DMAF.AudioNodes.Distortion = function(e, f) {
    if (!isNaN(f)) {
        f = Math.max(f, -1);
        f = Math.min(f, 1)
    } else {
        f = 0
    }
    if (!isNaN(e)) {
        e = Math.max(e, 0);
        e = Math.min(e, 1)
    } else {
        e = 1
    }
    var d = DMAF.context,
        c = d.createWaveShaper(),
        b = d.createGain(),
        a = d.createGain();
    b.connect(c);
    c.connect(a);
    this.input = b;
    this.distortion = c;
    this.output = a;
    this.setGain(e);
    this.setShape(f)
};
DMAF.AudioNodes.Distortion.prototype.connect = function(a) {
    this.output.connect(a)
};
DMAF.AudioNodes.Distortion.prototype.activate = function(a) {
    if (!a) {
        this.input.disconnect();
        this.input.connect(this.output)
    } else {
        this.input.disconnect();
        this.input.connect(this.distortion)
    }
};
DMAF.AudioNodes.Distortion.prototype.setGain = function(a) {
    a = Math.max(a, 0);
    a = Math.min(a, 1);
    this.input.gain.value = a
};
DMAF.AudioNodes.Distortion.prototype.setShape = function(a) {
    a = Math.max(a, -1);
    a = Math.min(a, 1)
};
DMAF.AudioNodes.Filter = function(c, d) {
    var b = DMAF.context.createBiquadFilter(),
        h = DMAF.context.createGain(),
        a = DMAF.context.createGain(),
        c = c || "lowpass",
        g = d.frequency || 0,
        f = d.q || 0,
        e = d.gain || 0;
    h.connect(b);
    b.connect(a);
    b.Q.value = f;
    b.gain.value = e;
    this.filter = b;
    this.input = h;
    this.output = a;
    this.q = b.Q;
    this.frequency = b.frequency;
    this.gain = b.gain;
    this.setFilterType(c);
    this.setFrequency(g);
    if (b.type === undefined) {
        console.log("Found no filter of type: " + c + ", setting to lowpass");
        b.type = "lowpass"
    }
};
DMAF.AudioNodes.Filter.prototype.connect = function(a) {
    this.output.connect(a)
};
DMAF.AudioNodes.Filter.prototype.activate = function(a) {
    if (!a) {
        this.input.disconnect();
        this.input.connect(this.output)
    } else {
        this.input.disconnect();
        this.input.connect(this.filter)
    }
};
DMAF.AudioNodes.Filter.prototype.setQ = function(a) {
    this.filter.Q.value = a
};
DMAF.AudioNodes.Filter.prototype.setGain = function(a) {
    a = Math.max(a, -46);
    a = Math.min(a, 6);
    this.filter.gain.value = a
};
DMAF.AudioNodes.Filter.prototype.setFrequency = function(a) {
    a = Math.max(a, 20);
    a = Math.min(a, 20000);
    this.filter.frequency.cancelScheduledValues(0);
    this.filter.frequency.value = a;
    this.filter.frequency.setValueAtTime(a, DMAF.context.currentTime)
};
DMAF.AudioNodes.Filter.prototype.setFilterType = function(b) {
    //if (!isNaN(b)) {
    //    b = Math.max(b, 0);
    //    b = Math.min(b, 7);
    //    this.filter.type = b;
    //    return
    //}
    var a = this.filter.type;
    this.filter.type = this.filterTypes[b];
    if (this.filter.type === undefined) {
        filter.type = a
    }
};
DMAF.AudioNodes.Filter.prototype.filterTypes = {
    lowpass: "lowpass",
    highpass: "highpass",
    bandpass: "bandpass",
    lowshelf: "lowshelf",
    highshelf: "highshelf",
    peaking: "peaking",
    notch: "notch",
    allpass: "allpass"
};
DMAF.AudioNodes.SlapbackDelay = function(b) {
    var e = DMAF.context.createGain(),
        d = DMAF.context.createDelay(),
        c = DMAF.context.createGain(),
        a = DMAF.context.createGain(),
        f = DMAF.context.createGain();
    d.delayTime.value = parseFloat(b.delayTime);
    c.gain.value = parseFloat(b.feedback);
    f.gain.value = parseFloat(b.wetLevel);
    e.connect(d);
    e.connect(a);
    d.connect(c);
    d.connect(f);
    c.connect(d);
    f.connect(a);
    this.input = e;
    this.output = a;
    this.delayNode = d;
    this.feedbackNode = c;
    this.wetLevel = f
};
DMAF.AudioNodes.SlapbackDelay.prototype.connect = function(a) {
    this.output.connect(a)
};
DMAF.AudioNodes.SlapbackDelay.prototype.setAutomatableProperty = function(c, b, a) {
    if (c === "bypass") {
        this.activate(b)
    } else {
        if (c === "level") {
            this.wetLevel.gain.value = b
        } else {
            if (c === "feedback") {
                this.feedbackNode.gain.value = b
            } else {
                if (c === "delay") {
                    this.delayNode.delayTime.value = b
                }
            }
        }
    }
};
DMAF.AudioNodes.SlapbackDelay.prototype.activate = function(a) {
    if (!a) {
        this.input.disconnect();
        this.input.connect(this.output)
    } else {
        this.input.disconnect();
        this.input.connect(this.delayNode);
        this.input.connect(this.output)
    }
};
DMAF.AudioNodes.SlapbackDelay.prototype.setLevel = function(a) {
    a = Math.max(0, a);
    a = Math.min(1, a);
    this.wetLevel.gain.value = a
};
DMAF.AudioNodes.SlapbackDelay.prototype.setFeedback = function(a) {
    a = Math.max(0, level);
    a = Math.min(1, level);
    this.feedbackNode.gain.value = a
};
DMAF.AudioNodes.SlapbackDelay.prototype.setDelay = function(a) {
    this.delayNode.delayTime.value = a
};
DMAF.AudioNodes.StereoDelay = function(i) {
    var n = DMAF.context.createGain(),
        c = DMAF.context.createChannelSplitter(2),
        o = new DMAF.AudioNodes.BpmDelay(),
        l = new DMAF.AudioNodes.BpmDelay(),
        j = DMAF.context.createGain(),
        h = DMAF.context.createGain(),
        f = DMAF.context.createChannelMerger(),
        e = DMAF.context.createGain(),
        k = DMAF.context.createGain();
    var g = i.subdivisionL;
    var a = i.subdivisionR;
    var b = parseFloat(i.feedback);
    var m = parseFloat(i.wetLevel);
    if (i.filterOn == 1) {
        var d = DMAF.context.createBiquadFilter();
        d.type = "highpass";
        d.frequency.value = parseFloat(i.filterFrequency);
        n.connect(d);
        d.connect(c)
    } else {
        n.connect(c)
    }
    c.connect(o.delay, 0, 0);
    c.connect(l.delay, 1, 0);
    o.delay.connect(j);
    l.delay.connect(h);
    j.connect(l.delay);
    h.connect(o.delay);
    o.delay.connect(f, 0, 0);
    l.delay.connect(f, 0, 1);
    f.connect(k);
    k.connect(e);
    n.connect(e);
    o.setDelayValue(g);
    l.setDelayValue(a);
    j.gain.value = b;
    h.gain.value = b;
    k.gain.value = m;
    this.input = n;
    this.output = e;
    this.firstNode = c;
    this.delayFeedbackL = j;
    this.delayFeedbackR = h;
    this.wetLevel = k;
    this.delayL = o;
    this.delayR = l
};
DMAF.AudioNodes.StereoDelay.prototype.connect = function(a) {
    this.output.connect(a)
};
DMAF.AudioNodes.StereoDelay.prototype.setAutomatableProperty = function(c, b, a) {
    if (c === "bypass") {
        this.activate(b)
    } else {
        if (c === "level") {
            this.wetLevel.gain.value = b
        } else {
            if (c === "feedback") {
                this.delayFeedbackL.gain.value = b;
                this.delayFeedbackR.gain.value = b
            }
        }
    }
};
DMAF.AudioNodes.StereoDelay.prototype.activate = function(a) {
    if (!a) {
        this.input.disconnect();
        this.input.connect(this.output)
    } else {
        this.input.disconnect();
        this.input.connect(this.firstNode);
        this.input.connect(this.output)
    }
};
DMAF.AudioNodes.StereoDelay.prototype.setLevel = function(a) {
    a = Math.max(0, a);
    a = Math.min(1, a);
    this.wetLevel.gain.value = a
};
DMAF.AudioNodes.StereoDelay.prototype.setFeedback = function(a) {
    a = Math.max(0, a);
    a = Math.min(1, a);
    this.delayFeedbackL.gain.value = a;
    this.delayFeedbackR.gain.value = a
};
DMAF.AudioNodes.StereoDelay.prototype.setTempo = function(a) {
    this.delayL.setTempo(a);
    this.delayR.setTempo(a)
};
DMAF.AudioNodes.StereoDelay.prototype.setDelayIndex = function(a, b) {
    this.delayL.setDelayIndex(a);
    if (b) {
        this.delayR.setDelayIndex(b)
    } else {
        this.delayR.setDelayIndex(b)
    }
};
DMAF.AudioNodes.StereoDelay.prototype.setSubdivision = function(a, b) {
    this.delayL.setDelayValue(a);
    if (b) {
        this.delayR.setDelayValue(b)
    } else {
        this.delayR.setDelayValue(a)
    }
};
DMAF.AudioNodes.PingPongDelay = function(f) {
    var j = DMAF.context.createGain(),
        i = DMAF.context.createGain(),
        a = DMAF.context.createChannelSplitter(2),
        e = DMAF.context.createGain(),
        g = DMAF.context.createGain(),
        k = new DMAF.AudioNodes.BpmDelay(),
        h = new DMAF.AudioNodes.BpmDelay(),
        d = DMAF.context.createChannelMerger(),
        c = DMAF.context.createGain();
    j.connect(a);
    a.connect(e, 0, 0);
    a.connect(e, 1, 0);
    e.gain.value = 0.5;
    e.connect(i);
    if (f.filterOn == 1) {
        var b = DMAF.context.createBiquadFilter();
        b.type = "highpass";
        b.frequency.value = parseFloat(f.filterFrequency);
        i.connect(b);
        b.connect(k.delay)
    } else {
        i.connect(k.delay)
    }
    g.connect(k.delay);
    k.delay.connect(h.delay);
    h.delay.connect(g);
    k.delay.connect(d, 0, 0);
    h.delay.connect(d, 0, 1);
    d.connect(c);
    j.connect(c);
    k.setDelayValue(f.subdivision);
    h.setDelayValue(f.subdivision);
    g.gain.value = parseFloat(f.feedback);
    i.gain.value = parseFloat(f.wetLevel);
    this.input = j;
    this.output = c;
    this.firstNode = a;
    this.wetLevel = i;
    this.feedbackLevel = g;
    this.wetLevel = i;
    this.delayL = k;
    this.delayR = h
};
DMAF.AudioNodes.PingPongDelay.prototype.connect = function(a) {
    this.output.connect(a)
};
DMAF.AudioNodes.PingPongDelay.prototype.setAutomatableProperty = function(c, b, a) {
    if (c === "bypass") {
        this.activate(b)
    } else {
        if (c === "level") {
            this.wetLevel.gain.value = b
        } else {
            if (c === "feedback") {
                this.feedbackLevel.gain.value = b
            }
        }
    }
};
DMAF.AudioNodes.PingPongDelay.prototype.activate = function(a) {
    if (!a) {
        this.input.disconnect();
        this.input.connect(this.output)
    } else {
        this.input.disconnect();
        this.input.connect(this.firstNode);
        this.input.connect(this.output)
    }
};
DMAF.AudioNodes.PingPongDelay.prototype.setLevel = function(a) {
    a = Math.max(0, a);
    a = Math.min(1, a);
    this.wetLevel.gain.value = a
};
DMAF.AudioNodes.PingPongDelay.prototype.setFeedback = function(a) {
    a = Math.max(0, a);
    a = Math.min(1, a);
    this.feedbackLevel.gain.value = a
};
DMAF.AudioNodes.PingPongDelay.prototype.setTempo = function(a) {
    this.delayL.setTempo(a);
    this.delayR.setTempo(a)
};
DMAF.AudioNodes.PingPongDelay.prototype.setDelayIndex = function(a, b) {
    this.delayL.setDelayIndex(a);
    if (b) {
        this.delayR.setDelayIndex(b)
    } else {
        this.delayR.setDelayIndex(b)
    }
};
DMAF.AudioNodes.PingPongDelay.prototype.setSubdivision = function(a, b) {
    this.delayL.setDelayValue(a);
    if (b) {
        this.delayR.setDelayValue(b)
    } else {
        this.delayR.setDelayValue(a)
    }
};
DMAF.AudioNodes.Convolver = function(d) {
    var b = DMAF.context.createConvolver(),
        h = DMAF.context.createGain(),
        f = DMAF.context.createGain(),
        g = DMAF.context.createBiquadFilter(),
        c = DMAF.context.createBiquadFilter(),
        e = DMAF.context.createGain(),
        a = DMAF.context.createGain();
    var i = new XMLHttpRequest();
    i.open("GET", d.impulse, true);
    i.responseType = "arraybuffer";
    i.onreadystatechange = function() {
        if (i.readyState === 4) {
            if (i.status < 300 && i.status > 199 || i.status === 302) {
                DMAF.context.decodeAudioData(i.response, function(j) {
                    b.buffer = j
                }, function(j) {
                    if (j) {
                        console.error("error decoding data: " + j)
                    }
                })
            }
        }
    };
    i.send(null);
    g.type = "highpass";
    if (d.lowCutHz != null) {
        g.frequency.value = parseFloat(d.lowCutHz)
    } else {
        g.frequency.value = 20
    }
    c.type = "lowpass";
    if (d.highCutHz != null) {
        c.frequency.value = parseFloat(d.highCutHz)
    } else {
        c.frequency.value = DMAF.context.sampleRate / 2
    }
    f.gain.value = parseFloat(d.dryLevel);
    e.gain.value = parseFloat(d.wetLevel);
    h.connect(g);
    g.connect(c);
    c.connect(b);
    b.connect(e);
    e.connect(a);
    h.connect(f);
    f.connect(a);
    this.input = h;
    this.output = a;
    this.filterLo = g;
    this.filterHi = c;
    this.dryLevel = f;
    this.wetLevel = e;
    this.convolver = b
};
DMAF.AudioNodes.Convolver.prototype.connect = function(a) {
    this.output.connect(a)
};
DMAF.AudioNodes.Convolver.prototype.setAutomatableProperty = function(c, b, a) {
    if (a != null) {
        if (c === "bypass") {
            this.activate(b)
        } else {
            if (c === "level") {
                this.output.gain.setTargetAtTime(b, DMAF.context.currentTime + a, a * 0.63)
            } else {
                if (c === "wetLevel") {
                    this.wetLevel.gain.setTargetAtTime(b, DMAF.context.currentTime + a, a * 0.63)
                } else {
                    if (c === "dryLevel") {
                        this.dryLevel.gain.setTargetAtTime(b, DMAF.context.currentTime + a, a * 0.63)
                    }
                }
            }
        }
    } else {
        if (c === "bypass") {
            this.activate(b)
        } else {
            if (c === "level") {
                this.output.gain.value = b
            } else {
                if (c === "wetLevel") {
                    this.wetLevel.gain.value = b
                } else {
                    if (c === "dryLevel") {
                        this.dryLevel.gain.value = b
                    }
                }
            }
        }
    }
};
DMAF.AudioNodes.Convolver.prototype.activate = function(a) {
    if (!a) {
        this.input.disconnect();
        this.input.connect(this.output)
    } else {
        this.input.disconnect();
        this.input.connect(this.filterLo);
        this.input.connect(this.dryLevel)
    }
};
DMAF.AudioNodes.Convolver.prototype.setLevel = function(a) {
    a = Math.max(0, a);
    a = Math.min(1, a);
    this.output.gain.value = a
};
DMAF.AudioNodes.Convolver.prototype.setDryLevel = function(a) {
    a = Math.max(0, a);
    a = Math.min(1, a);
    this.dryLevel.gain.value = a
};
DMAF.AudioNodes.Convolver.prototype.setWetLevel = function(a) {
    a = Math.max(0, a);
    a = Math.min(1, a);
    this.wetLevel.gain.value = a
};
DMAF.AudioNodes.BpmDelay = function() {
    this.delay = DMAF.context.createDelay();
    this.tempo = DMAF.Processors.getMusicController().player.tempo;
    this.noteDivision = this.times[6];
    DMAF.Processors.getMusicController().player.tempoObservers.push(this);
    this.updateDelayTime()
};
DMAF.AudioNodes.BpmDelay.prototype.setTempo = function(a) {
    this.tempo = a;
    this.updateDelayTime()
};
DMAF.AudioNodes.BpmDelay.prototype.setDelayValue = function(a) {
    var b = 6;
    if (a == "32") {
        b = 0
    } else {
        if (a == "16T") {
            b = 1
        } else {
            if (a == "32D") {
                b = 2
            } else {
                if (a == "16") {
                    b = 3
                } else {
                    if (a == "8T") {
                        b = 4
                    } else {
                        if (a == "16D") {
                            b = 5
                        } else {
                            if (a == "8") {
                                b = 6
                            } else {
                                if (a == "4T") {
                                    b = 7
                                } else {
                                    if (a == "8D") {
                                        b = 8
                                    } else {
                                        if (a == "4") {
                                            b = 9
                                        } else {
                                            if (a == "2T") {
                                                b = 10
                                            } else {
                                                if (a == "4D") {
                                                    b = 11
                                                } else {
                                                    if (a == "2") {
                                                        b = 12
                                                    } else {
                                                        if (a == "2D") {
                                                            b = 13
                                                        } else {
                                                            console.error("bad BPM index")
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    this.setDelayIndex(b)
};
DMAF.AudioNodes.BpmDelay.prototype.setDelayIndex = function(a) {
    this.noteDivision = this.times[a];
    this.updateDelayTime()
};
DMAF.AudioNodes.BpmDelay.prototype.updateDelayTime = function() {
    var a = 60 * this.noteDivision / this.tempo;
    this.delay.delayTime.value = a
};
DMAF.AudioNodes.BpmDelay.prototype.times = [1 / 8, (1 / 4) * 2 / 3, (1 / 8) * 3 / 2, 1 / 4, (1 / 2) * 2 / 3, (1 / 4) * 3 / 2, 1 / 2, 1 * 2 / 3, (1 / 2) * 3 / 2, 1, 2 * 2 / 3, 1 * 3 / 2, 2, 3];
DMAF.AudioNodes.WahWah = function(d) {
    var g = DMAF.context.createGain(),
        a = new DMAF.AudioNodes.EnvelopeFollower(0.003, 0.5, this, cb_setSweep),
        f = DMAF.context.createBiquadFilter(),
        e = DMAF.context.createBiquadFilter(),
        c = DMAF.context.createGain();
    var b = d.ebableAutoMode;
    f = DMAF.context.createBiquadFilter();
    f.type = "bandpass";
    f.Q.value = 1;
    f.frequency.value = 100;
    e = DMAF.context.createBiquadFilter();
    e.type = "peaking";
    e.Q.value = 5;
    e.frequency.value = 100;
    e.gain.value = 20;
    if (b) {
        g.connect(a.input)
    }
    g.connect(f);
    f.connect(e);
    e.connect(c);
    this.input = g;
    this.output = c;
    this.filterBp = f;
    this.filterPeaking = e;
    this.envelopeFollower = a;
    this.enableAutoMode = b;
    this.baseFrequency = parseFloat(d.baseFrequency);
    this.excursionOctaves = parseInt(d.excursionOctaves);
    this.excursionFrequency = this.baseFrequency * Math.pow(2, this.excursionOctaves);
    this.sweep = parseFloat(d.sweep);
    this.resonance = parseFloat(d.resonance);
    this.sensitivity = Math.pow(10, parseFloat(d.sensitivity));
    this.output.gain.value = 5;
    this.filterBp.frequency.value = this.baseFrequency + this.excursionFrequency * this.sweep;
    this.filterPeaking.frequency.value = this.baseFrequency + this.excursionFrequency * this.sweep;
    if (this.enableAutoMode) {
        this.setAutomode(this.enableAutoMode)
    }
};

function cb_setSweep(a, b) {
    a.setSweep(b)
}
DMAF.AudioNodes.WahWah.prototype.connect = function(a) {
    this.output.connect(a)
};
DMAF.AudioNodes.WahWah.prototype.setAutomatableProperty = function(c, b, a) {
    if (c === "bypass") {
        this.activate(b)
    } else {
        if (c === "baseFrequency") {
            this.baseFrequency = b;
            this.excursionFrequency = Math.min(DMAF.context.sampleRate / 2, this.baseFrequency * Math.pow(2, this.excursionOctaves));
            this.filterBp.frequency.value = this.baseFrequency + this.excursionFrequency * this.sweep;
            this.filterPeaking.frequency.value = this.baseFrequency + this.excursionFrequency * this.sweep
        } else {
            if (c === "sensitivity") {
                this.sensitivity = Math.pow(10, b)
            }
        }
    }
};
DMAF.AudioNodes.WahWah.prototype.activate = function(a) {
    if (!a) {
        this.input.disconnect();
        this.input.connect(this.output)
    } else {
        this.input.disconnect();
        this.input.connect(this.filterBp);
        if (this.enableAutoMode) {
            this.input.connect(this.envelopeFollower.input)
        }
    }
};
DMAF.AudioNodes.WahWah.prototype.setBaseFrequency = function(a) {
    this.baseFrequency = 50 * Math.pow(10, a * 2);
    this.excursionFrequency = Math.min(DMAF.context.sampleRate / 2, this.baseFrequency * Math.pow(2, this.excursionOctaves));
    this.filterBp.frequency.value = this.baseFrequency + this.excursionFrequency * this.sweep;
    this.filterPeaking.frequency.value = this.baseFrequency + this.excursionFrequency * this.sweep
};
DMAF.AudioNodes.WahWah.prototype.setExcursionOctaves = function(a) {
    this.excursionOctaves = a;
    this.excursionFrequency = Math.min(DMAF.context.sampleRate / 2, this.baseFrequency * Math.pow(2, this.excursionOctaves));
    this.filterBp.frequency.value = this.baseFrequency + this.excursionFrequency * this.sweep;
    this.filterPeaking.frequency.value = this.baseFrequency + this.excursionFrequency * this.sweep
};
DMAF.AudioNodes.WahWah.prototype.setSweep = function(a) {
    a = Math.max(0, a);
    a = Math.min(1, a);
    this.sweep = Math.pow(a, this.sensitivity);
    this.filterBp.frequency.value = this.baseFrequency + this.excursionFrequency * this.sweep;
    this.filterPeaking.frequency.value = this.baseFrequency + this.excursionFrequency * this.sweep
};
DMAF.AudioNodes.WahWah.prototype.setSensitivity = function(a) {
    a = Math.max(-1, a);
    a = Math.min(1, a);
    this.sensitivity = Math.pow(10, a)
};
DMAF.AudioNodes.WahWah.prototype.setResonance = function(a) {
    this.filterPeaking.Q.value = a
};
DMAF.AudioNodes.WahWah.prototype.setAutomode = function(a) {
    this.enableAutoMode = a;
    if (this.enableAutoMode) {
        this.input.connect(this.envelopeFollower.input);
        this.envelopeFollower.start()
    } else {
        this.envelopeFollower.stop();
        this.input.disconnect();
        this.input.connect(this.filterBp)
    }
};
DMAF.AudioNodes.WahWah.prototype.getBaseFrequency = function() {
    return this.baseFrequency
};
DMAF.AudioNodes.WahWah.prototype.getExcursionOctaves = function() {
    return this.excursionOctaves
};
DMAF.AudioNodes.WahWah.prototype.getSweep = function() {
    return this.sweep
};
DMAF.AudioNodes.WahWah.prototype.getSensitivity = function() {
    return this.sensitivity
};
DMAF.AudioNodes.WahWah.prototype.getResonance = function() {
    return this.resonance
};
DMAF.AudioNodes.WahWah.prototype.getAutomode = function() {
    return this.enableAutoMode
};
DMAF.AudioNodes.Overdrive = function(c) {
    var e = DMAF.context.createGain(),
        d = DMAF.context.createGain(),
        f = DMAF.context.createWaveShaper(),
        a = DMAF.context.createGain(),
        b = DMAF.context.createGain();
    e.connect(d);
    d.connect(f);
    f.connect(a);
    a.connect(b);
    this.input = e;
    this.inputDrive = d;
    this.waveshaper = f;
    this.outputGain = a;
    this.output = b;
    this.k_nSamples = 8192;
    this.ws_table = new Float32Array(this.k_nSamples);
    this.drive = parseFloat(c.drive);
    this.algorithmIndex = parseInt(c.algorithmIndex);
    this.outputGainLevel = parseFloat(c.outputGain);
    this.curveAmount = parseFloat(c.curveAmount);
    this.inputDrive.gain.value = Math.pow(10, this.drive / 20);
    this.outputGain.gain.value = Math.pow(10, this.outputGainLevel / 20);
    this.setAlgorithm(this.algorithmIndex)
};
DMAF.AudioNodes.Overdrive.prototype.setAutomatableProperty = function(c, b, a) {
    if (c === "bypass") {
        this.activate(b)
    } else {
        if (c === "drive") {
            this.inputDrive.gain.value = Math.pow(10, b / 20)
        } else {
            if (c === "outputGain") {
                this.outputGain.gain.value = Math.pow(10, b / 20)
            } else {
                if (c === "curveAmount") {
                    this.setCurveAmount(b)
                }
            }
        }
    }
};
DMAF.AudioNodes.Overdrive.prototype.connect = function(a) {
    this.output.connect(a)
};
DMAF.AudioNodes.Overdrive.prototype.activate = function(a) {
    if (!a) {
        this.input.disconnect();
        this.input.connect(this.output)
    } else {
        this.input.disconnect();
        this.input.connect(this.inputDrive)
    }
};
DMAF.AudioNodes.Overdrive.prototype.setDrive = function(a) {
    a = Math.max(0, a);
    a = Math.min(1, a);
    this.drive = -6 + 106 * a;
    this.inputDrive.gain.value = Math.pow(10, this.drive / 20)
};
DMAF.AudioNodes.Overdrive.prototype.setCurveAmount = function(a) {
    this.curveAmount = Math.max(0, a);
    this.curveAmount = Math.min(1, a);
    switch (this.algorithmIndex) {
        case 0:
            DMAF.AudioNodes.Overdrive.curveAlgo0(this.curveAmount, this.k_nSamples, this.ws_table);
            break;
        case 1:
            DMAF.AudioNodes.Overdrive.curveAlgo1(this.curveAmount, this.k_nSamples, this.ws_table);
            break;
        case 2:
            DMAF.AudioNodes.Overdrive.curveAlgo2(this.curveAmount, this.k_nSamples, this.ws_table);
            break;
        case 3:
            DMAF.AudioNodes.Overdrive.curveAlgo3(this.curveAmount, this.k_nSamples, this.ws_table);
            break;
        case 4:
            DMAF.AudioNodes.Overdrive.curveAlgo4(this.curveAmount, this.k_nSamples, this.ws_table);
            break;
        case 5:
            DMAF.AudioNodes.Overdrive.curveAlgo5(this.curveAmount, this.k_nSamples, this.ws_table);
            break
    }
    this.waveshaper.curve = this.ws_table
};
DMAF.AudioNodes.Overdrive.prototype.setOutputGain = function(a) {
    a = Math.max(0, a);
    a = Math.min(1, a);
    this.outputGainLevel = -26 + 31 * a;
    this.outputGain.gain.value = Math.pow(10, this.outputGainLevel / 20)
};
DMAF.AudioNodes.Overdrive.prototype.setAlgorithm = function(a) {
    this.algorithmIndex = Math.max(0, a);
    this.algorithmIndex = Math.min(5, a);
    this.setCurveAmount(this.curveAmount)
};
DMAF.AudioNodes.Overdrive.prototype.getDrive = function() {
    return this.drive
};
DMAF.AudioNodes.Overdrive.prototype.getAlgorithm = function() {
    return this.algorithmIndex
};
DMAF.AudioNodes.Overdrive.prototype.getCurveAmount = function() {
    return this.curveAmount
};
DMAF.AudioNodes.Overdrive.prototype.getWsTable = function() {
    return this.wsTable
};
DMAF.AudioNodes.Overdrive.prototype.getOutputGain = function() {
    return this.outputGainLevel
};
DMAF.AudioNodes.Overdrive.curveAlgo0 = function(e, c, f) {
    if ((e >= 0) && (e < 1)) {
        var b = 2 * e / (1 - e);
        for (var d = 0; d < c; d += 1) {
            var a = d * 2 / c - 1;
            f[d] = (1 + b) * a / (1 + b * Math.abs(a))
        }
    }
};
DMAF.AudioNodes.Overdrive.curveAlgo1 = function(d, b, e) {
    for (var c = 0; c < b; c += 1) {
        var a = c * 2 / b - 1;
        var f = (0.5 * Math.pow((a + 1.4), 2)) - 1;
        if (f >= 0) {
            f *= 5.8
        } else {
            f *= 1.2
        }
        e[c] = DMAF.Utils.tanh(f)
    }
};
DMAF.AudioNodes.Overdrive.curveAlgo2 = function(d, b, e) {
    d = 1 - d;
    for (var c = 0; c < b; c += 1) {
        var a = c * 2 / b - 1;
        var f;
        if (a < 0) {
            f = -Math.pow(Math.abs(a), d + 0.04)
        } else {
            f = Math.pow(a, d)
        }
        e[c] = DMAF.Utils.tanh(f * 2)
    }
};
DMAF.AudioNodes.Overdrive.curveAlgo3 = function(d, b, f) {
    d = 1 - d;
    if (d > 0.99) {
        d = 0.99
    }
    for (var c = 0; c < b; c += 1) {
        var a = c * 2 / b - 1;
        var e = Math.abs(a);
        var g;
        if (e < d) {
            g = e
        } else {
            if (e > d) {
                g = d + (e - d) / (1 + Math.pow((e - d) / (1 - d), 2))
            } else {
                if (e > 1) {
                    g = e
                }
            }
        }
        f[c] = DMAF.Utils.sign(a) * g * (1 / ((d + 1) / 2))
    }
};
DMAF.AudioNodes.Overdrive.curveAlgo4 = function(d, b, e) {
    for (var c = 0; c < b; c += 1) {
        var a = c * 2 / b - 1;
        if (a < -0.08905) {
            e[c] = (-3 / 4) * (1 - (Math.pow((1 - (Math.abs(a) - 0.032857)), 12)) + (1 / 3) * (Math.abs(a) - 0.032847)) + 0.01
        } else {
            if (a >= -0.08905 && a < 0.320018) {
                e[c] = (-6.153 * (a * a)) + 3.9375 * a
            } else {
                e[c] = 0.630035
            }
        }
    }
};
DMAF.AudioNodes.Overdrive.curveAlgo5 = function(d, b, e) {
    d = 2 + Math.round(d * 14);
    var f = Math.round(Math.pow(2, d - 1));
    for (var c = 0; c < b; c += 1) {
        var a = c * 2 / b - 1;
        e[c] = Math.round(a * f) / f
    }
};
DMAF.AudioNodes.LFO = function(a, b, f, g, d, e, h) {
    this.SR = a;
    this.buffer_size = 256;
    this.type = b;
    this.frequency = f;
    this.offset = g;
    this.oscillation = d;
    this.phase = 0;
    this.phaseInc = 2 * Math.PI * this.frequency * this.buffer_size / this.SR;
    var c = DMAF.context.createJavaScriptNode(this.buffer_size, 1, 1);
    c.onaudioprocess = process_lfo(this);
    this.jsNode = c;
    this.obj = e;
    this.callback = h
};
process_lfo = function(b) {
    function a(c) {
        b.compute()
    }
    return a
};
DMAF.AudioNodes.LFO.prototype.connect = function(a) {
    this.jsNode.connect(a)
};
DMAF.AudioNodes.LFO.prototype.setFrequency = function(a) {
    this.frequency = Math.max(0, a);
    this.frequency = Math.min(20, a);
    this.phaseInc = 2 * Math.PI * this.frequency * this.buffer_size / this.SR
};
DMAF.AudioNodes.LFO.prototype.setOscillation = function(a) {
    this.oscillation = a
};
DMAF.AudioNodes.LFO.prototype.setOffset = function(a) {
    this.offset = a
};
DMAF.AudioNodes.LFO.prototype.setPhase = function(a) {
    this.phase = a
};
DMAF.AudioNodes.LFO.prototype.compute = function() {
    this.phase += this.phaseInc;
    if (this.phase > 2 * Math.PI) {
        this.phase = 0
    }
    this.callback(this.obj, this.offset + this.oscillation * Math.sin(this.phase))
};
DMAF.AudioNodes.EnvelopeFollower = function(a, b, d, f) {
    this.buffersize = 256;
    this.SR = DMAF.context.sampleRate;
    var e = DMAF.context.createGain(),
        c = DMAF.context.createJavaScriptNode(this.buffersize, 1, 1);
    e.connect(c);
    this.mixBuffer = new Float32Array(this.buffersize);
    this.attackC = Math.exp(-1 / a * this.SR / this.buffersize);
    this.releaseC = Math.exp(-1 / b * this.SR / this.buffersize);
    this.envelope = 0;
    this.obj = d;
    this.callback = f;
    c.onaudioprocess = process_envelope(this);
    this.input = e;
    this.jsNode = c
};
DMAF.AudioNodes.EnvelopeFollower.prototype.connect = function(a) {
    this.jsNode.connect(a)
};
DMAF.AudioNodes.EnvelopeFollower.prototype.compute = function(d) {
    var c = d.inputBuffer.getChannelData(0).length;
    var a = d.inputBuffer.numberOfChannels;
    if (a > 1) {
        var f;
        var e = 0;
        var g = 0;
        var b;
        for (b = 0; b < c; ++b) {
            for (e = 0; e < a; ++e) {
                f = d.inputBuffer.getChannelData(e)[b];
                g += (f * f) / a
            }
        }
    } else {
        var f;
        var g = 0;
        for (var b = 0; b < c; ++b) {
            f = d.inputBuffer.getChannelData(0)[b];
            g += f * f
        }
    }
    g = Math.sqrt(g);
    if (this.envelope < g) {
        this.envelope *= this.attackC;
        this.envelope += (1 - this.attackC) * g
    } else {
        this.envelope *= this.releaseC;
        this.envelope += (1 - this.releaseC) * g
    }
    this.callback(this.obj, this.envelope)
};
DMAF.AudioNodes.EnvelopeFollower.prototype.start = function() {
    this.jsNode.connect(DMAF.context.destination);
    this.jsNode.onaudioprocess = process_envelope(this)
};
DMAF.AudioNodes.EnvelopeFollower.prototype.stop = function() {
    this.jsNode.disconnect();
    this.jsNode.onaudioprocess = null
};
process_envelope = function(b) {
    function a(c) {
        b.compute(c)
    }
    return a
};
DMAF.AudioNodes.Chorus = function(g) {
    var j = DMAF.context.createGain(),
        i = DMAF.context.createGain(),
        a = DMAF.context.createChannelSplitter(2),
        e = DMAF.context.createDelay(),
        b = DMAF.context.createDelay(),
        f = DMAF.context.createGain(),
        h = DMAF.context.createGain(),
        d = DMAF.context.createChannelMerger(2),
        c = DMAF.context.createGain();
    i.gain.value = 0.6934;
    j.connect(i);
    i.connect(c);
    i.connect(a);
    a.connect(e, 0);
    a.connect(b, 1);
    e.connect(f);
    b.connect(h);
    f.connect(b);
    h.connect(e);
    e.connect(d, 0, 0);
    b.connect(d, 0, 1);
    d.connect(c);
    this.currentFrequency = parseFloat(g.frequency);
    this.currentDelay = parseFloat(g.delay);
    this.currentDepth = parseFloat(g.depth);
    this.input = j;
    this.attenuator = i;
    this.splitter = a;
    this.delayL = e;
    this.delayR = b;
    this.feedbackGainNodeLR = f;
    this.feedbackGainNodeRL = h;
    this.currentDepth = 1;
    this.output = c;
    this.lfoL = new DMAF.AudioNodes.LFO(DMAF.context.sampleRate, "sin", this.currentFrequency, this.currentDelay, this.currentDelay * this.currentDepth, this, DMAF.AudioNodes.Chorus.cb_setDelayL);
    this.lfoR = new DMAF.AudioNodes.LFO(DMAF.context.sampleRate, "sin", this.currentFrequency, this.currentDelay, this.currentDelay * this.currentDepth, this, DMAF.AudioNodes.Chorus.cb_setDelayR);
    this.lfoR.setPhase(Math.PI / 2);
    this.lfoL.connect(DMAF.context.destination);
    this.lfoR.connect(DMAF.context.destination);
    this.delayL.delayTime = this.currentDelay;
    this.delayR.delayTime = this.currentDelay;
    this.feedbackGainNodeLR.gain.value = parseFloat(g.feedback);
    this.feedbackGainNodeRL.gain.value = parseFloat(g.feedback)
};
DMAF.AudioNodes.Chorus.prototype.connect = function(a) {
    this.output.connect(a)
};
DMAF.AudioNodes.Chorus.cb_setDelayL = function(a, b) {
    a.delayL.delayTime.value = b
};
DMAF.AudioNodes.Chorus.cb_setDelayR = function(a, b) {
    a.delayR.delayTime.value = b
};
DMAF.AudioNodes.Chorus.prototype.setAutomatableProperty = function(c, b, a) {
    if (c === "bypass") {
        this.activate(b)
    } else {
        if (c === "depth") {
            this.currentDepth = b;
            this.lfoL.setOscillation(this.currentDepth * this.currentDelay);
            this.lfoR.setOscillation(this.currentDepth * this.currentDelay)
        } else {
            if (c === "frequency") {
                this.currentFrequency = b;
                this.lfoL.setFrequency(this.currentFrequency);
                this.lfoR.setFrequency(this.currentFrequency)
            } else {
                if (c === "feedback") {
                    this.feedbackGainNodeLR.gain.value = b;
                    this.feedbackGainNodeRL.gain.value = b
                }
            }
        }
    }
};
DMAF.AudioNodes.Chorus.prototype.activate = function(a) {
    if (!a) {
        this.input.disconnect();
        this.input.connect(this.output)
    } else {
        this.input.disconnect();
        this.input.connect(this.attenuator)
    }
};
DMAF.AudioNodes.Chorus.prototype.setDepth = function(a) {
    this.currentDepth = a;
    this.lfoL.setOscillation(this.currentDepth * this.currentDelay);
    this.lfoR.setOscillation(this.currentDepth * this.currentDelay)
};
DMAF.AudioNodes.Chorus.prototype.setRate = function(a) {
    this.currentFrequency = 8 * a;
    this.lfoL.setFrequency(this.currentFrequency);
    this.lfoR.setFrequency(this.currentFrequency)
};
DMAF.AudioNodes.Chorus.prototype.setFeedback = function(a) {
    this.feedbackGainNodeLR.gain.value = a;
    this.feedbackGainNodeRL.gain.value = a
};
DMAF.AudioNodes.Chorus.prototype.setDelay = function(a) {
    this.currentDelay = 0.0002 * Math.pow(10, a * 2);
    this.lfoL.setOffset(this.currentDelay);
    this.lfoR.setOffset(this.currentDelay);
    this.setDepth(this.currentDepth)
};
DMAF.AudioNodes.Chorus.prototype.getDepth = function() {
    return this.currentDepth
};
DMAF.AudioNodes.Chorus.prototype.getDelay = function() {
    return this.currentDelay
};
DMAF.AudioNodes.Chorus.prototype.getFeedback = function() {
    return this.feedbackGainNodeLR.gain.value
};
DMAF.AudioNodes.Chorus.prototype.getRate = function() {
    return this.currentFrequency
};
DMAF.AudioNodes.Compressor = function(d) {
    var b = DMAF.context.createDynamicsCompressor(),
        e = DMAF.context.createGain(),
        c = DMAF.context.createGain(),
        a = DMAF.context.createGain();
    b.threshold = parseFloat(d.threshold);
    b.knee = parseFloat(d.knee);
    b.ratio = parseFloat(d.ratio);
    b.attack = parseFloat(d.attack);
    b.release = parseFloat(d.release);
    e.connect(b);
    b.connect(c);
    c.connect(a);
    this.input = e;
    this.output = a;
    this.dynamicsCompressor = b;
    this.makeupGain = c;
    this.autoMakeup = d.autoMakeup;
    if (this.autoMakeup) {
        this.setAutomakeupState(this.autoMakeup)
    }
};
DMAF.AudioNodes.Compressor.prototype.connect = function(a) {
    this.output.connect(a)
};
DMAF.AudioNodes.Compressor.prototype.activate = function(a) {
    if (!a) {
        this.input.disconnect();
        this.input.connect(this.output)
    } else {
        this.input.disconnect();
        this.input.connect(this.dynamicsCompressor)
    }
};
DMAF.AudioNodes.Compressor.prototype.setThreshold = function(a) {
    a = Math.max(0, a);
    a = Math.min(1, a);
    this.dynamicsCompressor.threshold.value = -100 * a;
    if (this.autoMakeup) {
        this.setMakeup(this.computeMakeup())
    }
};
DMAF.AudioNodes.Compressor.prototype.setRatio = function(a) {
    a = Math.max(1, a);
    a = Math.min(50, a);
    this.dynamicsCompressor.ratio.value = a;
    if (this.autoMakeup) {
        this.setMakeup(this.computeMakeup())
    }
};
DMAF.AudioNodes.Compressor.prototype.setKnee = function(a) {
    a = Math.max(1, a);
    a = Math.min(40, a);
    this.dynamicsCompressor.knee.value = a;
    if (this.dynamicsCompressor.autoMakeup) {
        this.setMakeup(this.computeMakeup())
    }
};
DMAF.AudioNodes.Compressor.prototype.setAttack = function(a) {
    a = Math.max(0, a);
    a = Math.min(1, a);
    this.dynamicsCompressor.attack.value = 0.001 * Math.pow(10, 3 * a)
};
DMAF.AudioNodes.Compressor.prototype.setRelease = function(a) {
    a = Math.max(0, a);
    a = Math.min(1, a);
    this.dynamicsCompressor.release.value = 0.001 * Math.pow(10, 3 * a)
};
DMAF.AudioNodes.Compressor.prototype.setMakeup = function(a) {
    a = Math.max(1, a);
    this.makeupGain.gain.value = a
};
DMAF.AudioNodes.Compressor.prototype.setAutomakeupState = function(a) {
    if (a) {
        this.autoMakeup = true;
        this.setMakeup(this.computeMakeup())
    } else {
        this.automakeup = false
    }
};
DMAF.AudioNodes.Compressor.prototype.computeMakeup = function() {
    var a = 4;
    return -(this.dynamicsCompressor.threshold.value - this.dynamicsCompressor.threshold.value / this.dynamicsCompressor.ratio.value) / a
};
DMAF.AudioNodes.Compressor.prototype.getThreshold = function() {
    return this.dynamicsCompressor.threshold.value
};
DMAF.AudioNodes.Compressor.prototype.getRatio = function() {
    return this.dynamicsCompressor.ratio.value
};
DMAF.AudioNodes.Compressor.prototype.getKnee = function() {
    return this.dynamicsCompressor.knee.value
};
DMAF.AudioNodes.Compressor.prototype.getAttack = function() {
    return this.dynamicsCompressor.attack.value
};
DMAF.AudioNodes.Compressor.prototype.getRelease = function() {
    return this.dynamicsCompressor.release.value
};
DMAF.AudioNodes.Compressor.prototype.getMakeup = function() {
    return this.makeupGain.gain.value
};
DMAF.AudioNodes.Compressor.prototype.getReduction = function() {
    return this.dynamicsCompressor.reduction
};
DMAF.AudioNodes.Cabinet = function(c) {
    var e = new DMAF.AudioNodes.Convolver({
            impulse: c.impulsePath,
            dryLevel: 0,
            wetLevel: 1
        }),
        d = DMAF.context.createGain(),
        b = DMAF.context.createGain(),
        a = DMAF.context.createGain();
    d.connect(e.input);
    e.connect(b);
    b.connect(a);
    this.input = d;
    this.output = a;
    this.makeup = b;
    this.colvolver = e;
    this.makeup.gain.value = Math.pow(10, c.makeUpGain / 20)
};
DMAF.AudioNodes.Cabinet.prototype.connect = function(a) {
    this.output.connect(a)
};
DMAF.AudioNodes.Cabinet.prototype.activate = function(a) {
    if (!a) {
        this.input.disconnect();
        this.input.connect(this.output)
    } else {
        this.input.disconnect();
        this.input.connect(this.colvolver.input)
    }
};
DMAF.AudioNodes.Equalizer = function(k) {
    var n = DMAF.context.createGain(),
        f = DMAF.context.createGain();
    var a = parseInt(k.sections);
    var e = new Array(a);
    var b = Math.log(80) / Math.log(10);
    var d = Math.log(DMAF.context.sampleRate / 2) / Math.log(10);
    var o = (d - b) / (a - 1);
    var m;
    var c = n;
    for (var j = 0; j < a; ++j) {
        var h = DMAF.context.createBiquadFilter();
        h.type = "peaking";
        h.frequency.value = Math.pow(10, b + o * j);
        c.connect(h);
        c = h;
        e[j] = h
    }
    c.connect(f);
    e[0].type = 1;
    e[a - 1].type = 0;
    for (var j = 0; j < a; ++j) {
        if (k["section" + j + "_frequency"] != null) {
            e[j].frequency.value = parseFloat(k["section" + j + "_frequency"])
        }
        if (k["section" + j + "_q"] != null) {
            e[j].Q.value = parseFloat(k["section" + j + "_q"])
        }
        if (k["section" + j + "_gain"] != null) {
            e[j].gain.value = parseFloat(k["section" + j + "_gain"])
        }
    }
    var l = 100;
    var g = new Float32Array(l);
    b = Math.log(20) / Math.log(10);
    o = (d - b) / (l - 1);
    for (var j = 0; j < l; ++j) {
        g[j] = Math.pow(10, b + o * j)
    }
    this.input = n;
    this.output = f;
    this.nbands = a;
    this.filters = e;
    this.nFrequencyPoints = l;
    this.cb = null;
    this.plotFrequencies = g;
    this.frequencyResponse = new Float32Array(this.nFrequencyPoints);
    this.frequencyResponseTemp = new Float32Array(this.nFrequencyPoints);
    this.phaseResponseTemp = new Float32Array(this.nFrequencyPoints);
    this.refreshFrequencyResponse()
};
DMAF.AudioNodes.Equalizer.prototype.connect = function(a) {
    this.output.connect(a)
};
DMAF.AudioNodes.Equalizer.prototype.activate = function(a) {
    if (!a) {
        this.input.disconnect();
        this.input.connect(this.output)
    } else {
        this.input.disconnect();
        this.input.connect(this.filters[0])
    }
};
DMAF.AudioNodes.Equalizer.prototype.setGain = function(a, b) {
    b = Math.max(0, b);
    b = Math.min(1, b);
    b = -60 + 120 * b;
    this.filters[a].gain.value = b;
    this.refreshFrequencyResponse()
};
DMAF.AudioNodes.Equalizer.prototype.setFrequency = function(a, b) {
    b = Math.max(0, b);
    b = Math.min(1, b);
    b = Math.pow(10, (Math.log(DMAF.context.sampleRate / 2) / Math.log(10)) * b);
    this.filters[a].frequency.value = b;
    this.refreshFrequencyResponse()
};
DMAF.AudioNodes.Equalizer.prototype.setQ = function(b, a) {
    a = Math.max(0, a);
    a = Math.min(1, a);
    a = 1 + 10 * a;
    this.filters[b].Q.value = a;
    this.refreshFrequencyResponse()
};
DMAF.AudioNodes.Equalizer.prototype.refreshFrequencyResponse = function() {
    if (this.cb == null) {
        return
    }
    this.filters[0].getFrequencyResponse(this.plotFrequencies, this.frequencyResponseTemp, this.phaseResponseTemp);
    for (var b = 0; b < this.nFrequencyPoints; ++b) {
        this.frequencyResponse[b] = this.frequencyResponseTemp[b]
    }
    for (var a = 1; a < this.nbands; ++a) {
        this.filters[a].getFrequencyResponse(this.plotFrequencies, this.frequencyResponseTemp, this.phaseResponseTemp);
        for (var b = 0; b < this.nFrequencyPoints; ++b) {
            this.frequencyResponse[b] *= this.frequencyResponseTemp[b]
        }
    }
    for (var b = 0; b < this.nFrequencyPoints; ++b) {
        this.frequencyResponse[b] = 20 * (Math.log(this.frequencyResponse[b]) / Math.log(10))
    }
    this.cb(this.plotFrequencies, this.frequencyResponse)
};
DMAF.AudioNodes.Equalizer.prototype.setGraphCallback = function(a) {
    this.cb = a;
    this.cb(this.plotFrequencies, this.frequencyResponse)
};
DMAF.AudioNodes.FxGroup = function(b) {
    var c = DMAF.context.createGain(),
        a = DMAF.context.createGain();
    this.input = c;
    this.output = a;
    this.innerEffects = []
};
DMAF.AudioNodes.FxGroup.prototype.connect = function(a) {
    this.output.connect(a)
};
DMAF.AudioNodes.FxGroup.prototype.getAutomatableProperties = function(a) {
    return this.innerEffects[parseInt(a)].effectNode
};
DMAF.AudioNodes.FxGroup.prototype.init = function() {
    var a = this.innerEffects.length;
    if (a > 0) {
        this.input.connect(this.innerEffects[0].effectNode.input);
        this.innerEffects[a - 1].effectNode.connect(this.output)
    }
};
DMAF.AudioNodes.FxGroup.prototype.activate = function(a) {
    if (!a) {
        this.input.disconnect();
        this.input.connect(this.output)
    } else {
        this.input.disconnect();
        this.input.connect(this.innerEffects[0].effectNode.input);
        this.init()
    }
};
DMAF.AudioNodes.Phaser = function(l) {
    var m = DMAF.context.createGain(),
        a = DMAF.context.createChannelSplitter(2),
        f = DMAF.context.createGain(),
        b = DMAF.context.createGain(),
        d = DMAF.context.createChannelMerger(2),
        c = DMAF.context.createGain(),
        e = DMAF.context.createGain();
    var k = [];
    var h = [];
    m.connect(a);
    var j = a;
    var g = a;
    k[0] = DMAF.context.createBiquadFilter();
    h[0] = DMAF.context.createBiquadFilter();
    k[0].type = 7;
    h[0].type = 7;
    a.connect(k[0], 0, 0);
    a.connect(h[0], 1, 0);
    for (var i = 1; i < 4; ++i) {
        k[i] = DMAF.context.createBiquadFilter();
        h[i] = DMAF.context.createBiquadFilter();
        k[i].type = 7;
        h[i].type = 7;
        j.connect(k[i]);
        g.connect(h[i]);
        j = h[i];
        g = h[i]
    }
    j.connect(f);
    g.connect(b);
    f.connect(k[0]);
    b.connect(h[0]);
    j.connect(d, 0, 0);
    g.connect(d, 0, 1);
    m.connect(e);
    d.connect(e);
    this.currentFrequency = parseFloat(l.frequency);
    this.baseModulationFrequency = 700;
    this.currentDepth = parseFloat(l.depth);
    this.currentStereoPhase = parseFloat(l.stereoPhase);
    this.currentFeedback = parseFloat(l.feedback);
    this.input = m;
    this.splitter = a;
    this.filtersL = k;
    this.filtersR = h;
    this.feedbackGainNodeL = f;
    this.feedbackGainNodeR = b;
    this.filteredSignal = c;
    this.output = e;
    this.lfoL = new DMAF.AudioNodes.LFO(DMAF.context.sampleRate, "sin", this.currentFrequency, this.baseModulationFrequency, this.baseModulationFrequency * this.currentDepth, this, DMAF.AudioNodes.Phaser.cb_setAllpassFrequencyL);
    this.lfoR = new DMAF.AudioNodes.LFO(DMAF.context.sampleRate, "sin", this.currentFrequency, this.baseModulationFrequency, this.baseModulationFrequency * this.currentDepth, this, DMAF.AudioNodes.Phaser.cb_setAllpassFrequencyR);
    this.lfoR.setPhase(this.currentStereoPhase * Math.PI / 180);
    this.lfoL.connect(DMAF.context.destination);
    this.lfoR.connect(DMAF.context.destination);
    f.gain.value = 0.4;
    b.gain.value = 0.4
};
DMAF.AudioNodes.Phaser.cb_setAllpassFrequencyL = function(b, c) {
    for (var a = 0; a < 4; ++a) {
        b.filtersL[a].frequency.value = c
    }
};
DMAF.AudioNodes.Phaser.cb_setAllpassFrequencyR = function(b, c) {
    for (var a = 0; a < 4; ++a) {
        b.filtersR[a].frequency.value = c
    }
};
DMAF.AudioNodes.Phaser.prototype.connect = function(a) {
    this.output.connect(a)
};
DMAF.AudioNodes.Phaser.prototype.setAutomatableProperty = function(c, b, a) {
    if (c === "bypass") {
        this.activate(b)
    } else {
        if (c === "depth") {
            this.currentDepth = b;
            this.lfoL.setOscillation(this.baseModulationFrequency * this.currentDepth);
            this.lfoR.setOscillation(this.baseModulationFrequency * this.currentDepth)
        } else {
            if (c === "frequency") {
                this.currentFrequency = b;
                this.lfoL.setFrequency(this.currentFrequency);
                this.lfoR.setFrequency(this.currentFrequency)
            } else {
                if (c === "feedback") {
                    this.feedbackGainNodeL.gain.value = b;
                    this.feedbackGainNodeR.gain.value = b
                }
            }
        }
    }
};
DMAF.AudioNodes.Phaser.prototype.activate = function(a) {
    if (!a) {
        this.input.disconnect();
        this.input.connect(this.output)
    } else {
        this.input.disconnect();
        this.input.connect(this.output);
        this.input.connect(this.splitter)
    }
};
DMAF.AudioNodes.Phaser.prototype.setDepth = function(a) {
    this.currentDepth = a;
    this.lfoL.setOscillation(this.baseModulationFrequency * this.currentDepth);
    this.lfoR.setOscillation(this.baseModulationFrequency * this.currentDepth)
};
DMAF.AudioNodes.Phaser.prototype.setRate = function(a) {
    this.currentFrequency = 0.1 + 10.9 * a;
    this.lfoL.setFrequency(this.currentFrequency);
    this.lfoR.setFrequency(this.currentFrequency)
};
DMAF.AudioNodes.Phaser.prototype.setBaseFrequency = function(a) {
    this.baseModulationFrequency = 500 + 1000 * a;
    this.lfoL.setOffset(this.baseModulationFrequency);
    this.lfoR.setOffset(this.baseModulationFrequency);
    this.setDepth(this.currentDepth)
};
DMAF.AudioNodes.Phaser.prototype.setFeedback = function(a) {
    this.feedbackGainNodeL.gain.value = a;
    this.feedbackGainNodeR.gain.value = a
};
DMAF.AudioNodes.Phaser.prototype.setStereoPhase = function(a) {
    this.currentStereoPhase = a * 180;
    var b = this.lfoL.phase + this.currentStereoPhase * Math.PI / 180;
    b = DMAF.Utils.fmod(b, 2 * Math.PI);
    this.lfoR.setPhase(b)
};
DMAF.AudioNodes.Tremolo = function(c) {
    var g = DMAF.context.createGain(),
        d = DMAF.context.createChannelSplitter(2),
        b = DMAF.context.createGain(),
        f = DMAF.context.createGain(),
        e = DMAF.context.createChannelMerger(2),
        a = DMAF.context.createGain();
    g.connect(d);
    d.connect(b, 0);
    d.connect(f, 1);
    b.connect(e, 0, 0);
    f.connect(e, 0, 1);
    e.connect(a);
    this.currentFrequency = parseFloat(c.frequency);
    this.intensity = parseFloat(c.intensity);
    this.currentStereoPhase = parseFloat(c.stereoPhase);
    this.input = g;
    this.splitter = d;
    this.amplitudeL = b;
    this.amplitudeR = f;
    this.output = a;
    this.lfoL = new DMAF.AudioNodes.LFO(DMAF.context.sampleRate, "sin", this.currentFrequency, 1 - (this.intensity / 2), this.intensity, this, DMAF.AudioNodes.Tremolo.cb_setAmplitudeL);
    this.lfoR = new DMAF.AudioNodes.LFO(DMAF.context.sampleRate, "sin", this.currentFrequency, 1 - (this.intensity / 2), this.intensity, this, DMAF.AudioNodes.Tremolo.cb_setAmplitudeR);
    this.lfoR.setPhase(this.currentStereoPhase * Math.PI / 180);
    this.lfoL.connect(DMAF.context.destination);
    this.lfoR.connect(DMAF.context.destination)
};
DMAF.AudioNodes.Tremolo.cb_setAmplitudeL = function(a, b) {
    a.amplitudeL.gain.value = b
};
DMAF.AudioNodes.Tremolo.cb_setAmplitudeR = function(a, b) {
    a.amplitudeR.gain.value = b
};
DMAF.AudioNodes.Tremolo.prototype.connect = function(a) {
    this.output.connect(a)
};
DMAF.AudioNodes.Tremolo.prototype.setAutomatableProperty = function(c, b, a) {
    if (c === "bypass") {
        this.activate(b)
    } else {
        if (c === "intensity") {
            this.intensity = b;
            this.lfoL.setOffset(1 - (this.intensity / 2));
            this.lfoR.setOffset(1 - (this.intensity / 2));
            this.lfoR.setOscillation(this.intensity);
            this.lfoL.setOscillation(this.intensity)
        } else {
            if (c === "frequency") {
                this.currentFrequency = b;
                this.lfoL.setFrequency(this.currentFrequency);
                this.lfoR.setFrequency(this.currentFrequency)
            } else {
                if (c === "feedback") {
                    this.feedbackGainNodeLR.gain.value = b;
                    this.feedbackGainNodeRL.gain.value = b
                }
            }
        }
    }
};
DMAF.AudioNodes.Tremolo.prototype.activate = function(a) {
    if (!a) {
        this.input.disconnect();
        this.input.connect(this.output)
    } else {
        this.input.disconnect();
        this.input.connect(this.splitter)
    }
};
DMAF.AudioNodes.Tremolo.prototype.setIntensity = function(a) {
    this.intensity = a;
    this.lfoL.setOffset(1 - (this.intensity / 2));
    this.lfoR.setOffset(1 - (this.intensity / 2));
    this.lfoR.setOscillation(this.intensity);
    this.lfoL.setOscillation(this.intensity)
};
DMAF.AudioNodes.Tremolo.prototype.setRate = function(a) {
    this.currentFrequency = 0.1 + 10.9 * a;
    this.lfoL.setFrequency(this.currentFrequency);
    this.lfoR.setFrequency(this.currentFrequency)
};
DMAF.AudioNodes.Tremolo.prototype.setStereoPhase = function(a) {
    this.currentStereoPhase = a * 180;
    var b = this.lfoL.phase + this.currentStereoPhase * Math.PI / 180;
    b = DMAF.Utils.fmod(b, 2 * Math.PI);
    this.lfoR.setPhase(b)
};
DMAF.AudioNodes.AutoFilter = function(b) {
    var d = DMAF.context.createGain(),
        c = DMAF.context.createBiquadFilter(),
        a = DMAF.context.createGain();
    d.connect(c);
    c.connect(a);
    if (b.type === "lowpass") {
        c.type = "lowpass"
    } else {
        if (b.type === "highpass") {
            c.type = "highpass"
        } else {
            if (b.type === "bandpass") {
                c.type = "bandpass"
            } else {
                if (b.type === "lowshelf") {
                    c.type = "lowshelf"
                } else {
                    if (b.type === "highshelf") {
                        c.type = "highshelf"
                    } else {
                        if (b.type === "peaking") {
                            c.type = "peaking"
                        } else {
                            if (b.type === "notch") {
                                c.type = "notch"
                            } else {
                                if (b.type === "allpass") {
                                    c.type = "allpass"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    c.frequency.value = parseFloat(b.frequency);
    c.Q.value = parseFloat(b.resonance);
    c.gain.value = parseFloat(b.gain);
    this.input = d;
    this.filter = c;
    this.output = a
};
DMAF.AudioNodes.AutoFilter.prototype.connect = function(a) {
    this.output.connect(a)
};
DMAF.AudioNodes.AutoFilter.prototype.setAutomatableProperty = function(c, b, a) {
    if (a != null) {
        if (c === "bypass") {
            this.activate(b)
        } else {
            if (c === "frequency") {
                this.filter.frequency.setTargetAtTime(b, DMAF.context.currentTime + a, a * 0.63)
            } else {
                if (c === "resonance") {
                    this.filter.Q.setTargetAtTime(b, DMAF.context.currentTime + a, a * 0.63)
                } else {
                    if (c === "gain") {
                        this.filter.gain.setTargetAtTime(b, DMAF.context.currentTime + a, a * 0.63)
                    }
                }
            }
        }
    } else {
        if (c === "bypass") {
            this.activate(b)
        } else {
            if (c === "frequency") {
                this.filter.frequency.value = b
            } else {
                if (c === "resonance") {
                    this.filter.Q.value = b
                } else {
                    if (c === "gain") {
                        this.filter.gain.value = b
                    }
                }
            }
        }
    }
};
DMAF.AudioNodes.AutoFilter.prototype.activate = function(a) {
    if (!a) {
        this.input.disconnect();
        this.input.connect(this.output)
    } else {
        this.input.disconnect();
        this.input.connect(this.filter)
    }
};
DMAF.masterVolume = 0.25;
(function() {
    try {
        if(window.AudioContext) {
            DMAF.context = new AudioContext();
        } else {
            DMAF.context = new webkitAudioContext();
        }

        DMAF.context.master = DMAF.context.createGain();
        DMAF.context.master.gain.value = DMAF.masterVolume;
        DMAF.context.compressor = DMAF.context.createDynamicsCompressor();
        DMAF.context.master.connect(DMAF.context.compressor);
        DMAF.context.compressor.connect(DMAF.context.destination);
        var b = DMAF.context.createBufferSource();
        var a = DMAF.context.createBuffer(1, 100, 44100);
        b.buffer = a;
        b.start(0);
        DMAF.contextAvailable = true;
        if (!DMAF.fileFormat) {
            console.log("Can't play audio format!");
            DMAF.contextAvailable = false;
        }
    } catch (c) {
        DMAF.status = c.message;
        DMAF.contextAvailable = false;
        DMAF.webAudioDNE = true
    }
}());
DMAF.running = false;
DMAF.actionsLoaded = false;
DMAF.active = false;
DMAF.Framework = function() {
    var a;
    if (!DMAF.contextAvailable) {
        a = {}
    } else {
        if (!DMAF.active) {
            DMAF.init()
        }
        a = DMAF.getCore()
    }
    return a
};
DMAF.checkIfReady = function() {
    if (DMAF.actionsLoaded && DMAF.active) {
        DMAF.running = true;
        DMAF.startTime = DMAF.context.currentTime * 1000;
        DMAF.getController().onEvent("dmaf_init", 0, {});
        DMAF.getController().dispatchPendingEvents()
    }
};
DMAF.init = function() {
    DMAF.Core = DMAF.getCore();
    DMAF.Controller = DMAF.getController();
    DMAF.SoundManager = DMAF.Managers.getSoundManager();
    DMAF.BeatPatternPlayer = new DMAF.Processors.BeatPatternPlayer();
    DMAF.ActionManager = DMAF.Managers.getActionManager();
    DMAF.AssetsManager = DMAF.Managers.getAssetsManager();
    DMAF.active = true;
    DMAF.checkIfReady()
};
DMAF.debug = function(b, a) {
    DMAF.getCore().debug(b, a)
};
DMAF.error = function(b, a) {
    DMAF.getCore().error(b, a)
};
DMAF.setMasterVolume = function(b) {
    if (typeof b == "number") {
        if (b < -46) {
            b = -46
        } else {
            if (b > 0) {
                b = 0
            }
        }
        DMAF.masterVolume = b;
        var c = DMAF.Managers.getSoundManager().activeSoundInstances;
        for (var a in c) {
            c[a].setVolume()
        }
    }
};
DMAF.mute = function() {
    DMAF.setMasterVolume(-46);
    DMAF.context.master.gain.value = 0
};
DMAF.unMute = function() {
    DMAF.setMasterVolume(0);
    DMAF.context.master.gain.value = 0.25
};
DMAF.Actions.AbstractAction = function() {};
DMAF.Actions.SoundGenericPlay = function(a) {
    DMAF.Actions.AbstractAction.call(this);
    this.soundId = a.soundId;
    this.soundFile = a.soundFile;
    this.volume = a.volume;
    this.pan = a.pan;
    this.multiSuffix = a.multiSuffix;
    this.preListen = a.preListen;
    this.softLoop = a.softLoop;
    this.loopLength = a.loopLength;
    this.delay = a.delay;
    this.bus = a.bus;
    this.priority = a.priority;
    this.timingCorrection = a.timingCorrection;
    this.reTrig = a.reTrig;
    this.trigger = a.trigger;
    this.returnEvent = a.returnEvent;
    this.returnEventTime = a.returnEventTime;
    this.type = "SOUNDGENERIC_PLAY"
};
DMAF.Actions.SoundGenericPlay.prototype = new DMAF.Actions.AbstractAction();
DMAF.Actions.SoundGenericPlay.prototype.execute = function() {
    if (this.soundId === "multi") {
        DMAF.debug("setting sound id to " + this.trigger);
        this.soundId = this.trigger
    }
    var a;
    a = DMAF.Managers.getSoundManager().getSoundInstance(this.soundId);
    if (!a) {
        a = DMAF.Factories.getSoundInstanceFactory().create("GENERIC", this.soundId);
        a.priority = this.priority;
        a.volume = this.volume;
        a.setVolume();
        a.pan = this.pan;
        a.preListen = this.preListen;
        a.softLoop = (this.softLoop === "true");
        a.loopLength = this.loopLength;
        a.returnEvent = this.returnEvent;
        a.priority = this.priority;
        a.timingCorrection = this.timingCorrection;
        a.reTrig = this.reTrig;
        a.returnEventTime = this.returnEventTime;
        DMAF.Managers.getSoundManager().addSoundInstance(a, this.soundId)
    }
    if (this.soundFile == "multi") {
        a.soundFile = this.trigger
    } else {
        a.soundFile = this.soundFile
    }
    a.play(this.actionTime)
};
DMAF.Actions.SoundBasicPlay = function(a) {
    DMAF.Actions.AbstractAction.call(this);
    this.soundId = a.soundId;
    this.file = a.file;
    this.volume = a.volume;
    this.preListen = a.preListen;
    this.priority = a.priority;
    this.timingCorrection = a.timingCorrection;
    this.type = "SOUNDBASIC_PLAY"
};
DMAF.Actions.SoundBasicPlay.prototype = new DMAF.Actions.AbstractAction();
DMAF.Actions.SoundBasicPlay.prototype.execute = function() {
    var c = DMAF.Utils.createUID();
    var a = DMAF.Factories.getSoundInstanceFactory().create("BASIC", c);
    a.volume = this.volume;
    a.setVolume();
    a.file = this.file;
    a.preListen = this.preListen;
    a.timingCorrection = this.timingCorrection;
    a.priority = this.priority;
    a.soundId = this.soundId;
    DMAF.Managers.getSoundManager().addSoundInstance(a, this.soundId + "." + c);
    var b = function(d) {
        d.target.removeEventListener("finished", b);
        DMAF.Managers.getSoundManager().removeSoundInstance(d.target.soundId + "." + d.target.instanceId)
    };
    a.addEventListener("finished", b);
    a.play(this.actionTime)
};
DMAF.Actions.SoundStepPlay = function(a) {
    DMAF.Actions.AbstractAction.call(this);
    this.soundId = a.soundId;
    this.soundFiles = a.soundFiles;
    this.iterator = a.iterator;
    this.volume = a.volume;
    this.preListen = a.preListen;
    this.priority = a.priority;
    this.timingCorrection = a.timingCorrection;
    this.reTrig = a.reTrig;
    this.type = "SOUNDBASIC_PLAY"
};
DMAF.Actions.SoundStepPlay.prototype = new DMAF.Actions.AbstractAction();
DMAF.Actions.SoundStepPlay.prototype.execute = function() {
    var a;
    a = DMAF.Managers.getSoundManager().getSoundInstance(this.soundId);
    if (!a) {
        a = DMAF.Factories.getSoundInstanceFactory().create("STEP", this.soundId);
        a.iterator = DMAF.Factories.getIteratorFactory().createIterator(this.iterator, this.soundFiles);
        a.volume = this.volume;
        a.setVolume();
        a.priority = this.priority;
        a.preListen = this.preListen;
        a.soundFiles = this.soundFiles;
        a.timingCorrection = this.timingCorrection;
        a.soundId = this.soundId;
        a.reTrig = this.reTrig;
        DMAF.Managers.getSoundManager().addSoundInstance(a, this.soundId)
    }
    a.play(this.actionTime)
};
DMAF.Actions.SoundStop = function(a) {
    DMAF.Actions.AbstractAction.call(this);
    this.target = a.target;
    this.targets = a.targets;
    this.delay = a.delay;
    this.type = "SOUND_STOP"
};
DMAF.Actions.SoundStop.prototype = new DMAF.Actions.AbstractAction();
DMAF.Actions.SoundStop.prototype.prepareTimeout = function(a) {
    return function() {
        a.stop()
    }
};
DMAF.Actions.SoundStop.prototype.execute = function() {
    var d, c, b, a, e;
    if (this.target) {
        d = DMAF.Managers.getSoundManager().getActiveSoundInstances(this.target);
        if (this.delay > 0) {
            for (c = 0; c < d.length; c++) {
                e = setTimeout(this.prepareTimeout(d[c]), this.delay);
                DMAF.Managers.getSoundManager().pendingStopActions.push(e)
            }
        } else {
            for (b = 0; b < d.length; b++) {
                d[b].stop()
            }
        }
    }
    if (this.targets) {
        for (c = 0; c < this.targets.length; c++) {
            d = DMAF.Managers.getSoundManager().getActiveSoundInstances(this.targets[c]);
            if (this.delay > 0) {
                for (a = 0; a < d.length; a++) {
                    e = setTimeout(this.prepareTimeout(d[a]), this.delay);
                    DMAF.Managers.getSoundManager().pendingStopActions.push(e)
                }
            } else {
                for (b = 0; b < d.length; b++) {
                    d[b].stop()
                }
            }
        }
    }
};
DMAF.Actions.TransformProcessorCreate = function(a) {
    DMAF.Actions.AbstractAction.call(this);
    this.properties = a;
    this.targetType = a.targetType;
    this.targetParameter = a.targetParameter;
    this.target = a.target;
    this.value = a.value;
    this.shape = a.shape;
    this.ratio = a.ratio;
    this.duration = a.duration;
    this.delay = a.delay;
    this.type = "TRANSFORM_CREATE"
};
DMAF.Actions.TransformProcessorCreate.prototype = new DMAF.Actions.AbstractAction();
DMAF.Actions.TransformProcessorCreate.prototype.execute = function() {
    var a = DMAF.Factories.getProcessorInstanceFactory().create("TRANSFORM", this.properties);
    a.execute()
};
DMAF.Actions.MacroProcessorCreate = function(a) {
    DMAF.Actions.AbstractAction.call(this);
    this.properties = a
};
DMAF.Actions.MacroProcessorCreate.prototype = new DMAF.Actions.AbstractAction();
DMAF.Actions.MacroProcessorCreate.prototype.execute = function() {
    var a = DMAF.Factories.getProcessorInstanceFactory().create("MACRO", this.properties);
    a.execute(this.parameters.value)
};
DMAF.Processors.BeatPatternInstance = function(b, a) {
    this._removeAtSongPosition = null;
    this.events = [];
    this.player = b;
    this.beatPattern = a.beatPattern;
    if (!a.beatPattern) {
        console.error("Found no BeatPattern for channel", a.beatChannel, ". Please check MIDI file.");
        return
    }
    this.beatPatternId = a.beatPattern.patternId;
    this.beatChannel = a.beatChannel;
    this.setAddAtSongPosition(a.addAtSongPosition);
    if (a.loop && a.patternStartPosition.getInBeats() === a.beatPattern.getEndPosition().getInBeats()) {
        this.setPatternPosition(this.beatPattern.getStartPosition())
    } else {
        this.setPatternPosition(a.patternStartPosition)
    }
    this.replaceActivePatterns = a.replaceActivePatterns;
    this.setAsCurrent = a.setAsCurrent;
    this.loop = a.loop;
    this.clearPosition = a.clearPosition;
    this.initRemoveAtSongPosition()
};
DMAF.Processors.BeatPatternInstance.prototype.NAME = "BeatPatternInstance";
DMAF.Processors.BeatPatternInstance.prototype.getAddAtSongPosition = function() {
    return this._addAtSongPosition
};
DMAF.Processors.BeatPatternInstance.prototype.setAddAtSongPosition = function(a) {
    this._addAtSongPosition = new DMAF.Processors.BeatPosition(a.bar, a.beat, this.player.beatsPerBar)
};
DMAF.Processors.BeatPatternInstance.prototype.getPatternPosition = function() {
    return this._patternPosition
};
DMAF.Processors.BeatPatternInstance.prototype.setPatternPosition = function(a) {
    this._patternPosition = new DMAF.Processors.BeatPosition(a.bar, a.beat, this.player.beatsPerBar)
};
DMAF.Processors.BeatPatternInstance.prototype.getRemoveAtSongPosition = function() {
    return this._removeAtSongPosition
};
DMAF.Processors.BeatPatternInstance.prototype.setRemoveAtSongPosition = function(a) {
    this._removeAtSongPosition = new DMAF.Processors.BeatPosition(a.bar, a.beat, this.player.getBeatsPerBar())
};
DMAF.Processors.BeatPatternInstance.prototype.initRemoveAtSongPosition = function() {
    if (!this.loop) {
        this.setRemoveAtSongPosition(this.getAddAtSongPosition());
        var a = (this.beatPattern.getEndPosition().getInBeats() - this.getPatternPosition().getInBeats());
        this.getRemoveAtSongPosition().addOffset(new DMAF.Processors.BeatPosition(0, a))
    } else {
        this.setRemoveAtSongPosition(new DMAF.Processors.BeatPosition(999999, 1, this.player.getBeatsPerBar()))
    }
};
DMAF.Processors.BeatPatternInstance.prototype.gotoNextBeat = function() {
    this.getPatternPosition().gotoNextBeat();
    this.getPatternPosition().beatsPerBar = this.player.beatsPerBar;
    if (this.loop && this.getPatternPosition().bar == this.beatPattern.getEndPosition().bar && this.getPatternPosition().beat == this.beatPattern.getEndPosition().beat) {
        this.setPatternPosition(this.beatPattern.getStartPosition())
    }
};
DMAF.Processors.BeatPatternInstance.prototype.executeEvents = function(c, d) {
    this.events = this.beatPattern.getEvents(this.getPatternPosition().bar);
    for (var a = 0; a < this.events.length; a++) {
        var b = this.events[a];
        if (b.getBeat() == this.getPatternPosition().beat) {
            b.execute(c, d)
        }
    }
};
DMAF.Processors.BeatPattern = function(c, b, a) {
    this.events = {};
    this.cuePoints = [];
    this.patternId = c;
    this._startPosition = b || new DMAF.Processors.BeatPosition(0, 0);
    this._endPosition = a || new DMAF.Processors.BeatPosition(0, 0)
};
DMAF.Processors.BeatPattern.prototype.NAME = "BeatPattern";
DMAF.Processors.BeatPattern.prototype.getEndPosition = function() {
    return this._endPosition
};
DMAF.Processors.BeatPattern.prototype.setEndPosition = function(a) {
    this._endPosition = new DMAF.Processors.BeatPosition(a.bar, a.beat)
};
DMAF.Processors.BeatPattern.prototype.getStartPosition = function() {
    return this._startPosition
};
DMAF.Processors.BeatPattern.prototype.setStartPosition = function(a) {
    this._startPosition = new DMAF.Processors.BeatPosition(a.bar, a.beat)
};
DMAF.Processors.BeatPattern.prototype.getEvents = function(c) {
    var b = [];
    if (this.events[c]) {
        for (var a = 0; a < this.events[c].length; a++) {
            b.push(this.events[c][a])
        }
    }
    return b
};
DMAF.Processors.BeatPattern.prototype.addEvent = function(b, a, d) {
    var c = new DMAF.Processors.SynthEvent(b, a, d);
    this.addToEvents(c)
};
DMAF.Processors.BeatPattern.prototype.addSubPattern = function(b, a) {
    for (var c = 0; c < b.events.length; c++) {
        var d = b.events[c];
        this.addEvent(d.eventName, new DMAF.Processors.BeatPosition((d.bar + a.bar - 1), (d.beat + a.beat - 1)))
    }
};
DMAF.Processors.BeatPattern.prototype.addToEvents = function(a) {
    if (!this.events[a.getBar()]) {
        this.events[a.getBar()] = []
    }
    this.events[a.getBar()].push(a);
    if (this.patternId.indexOf("user_pattern") != -1) {
        DMAF.debug(this.patternId + " added event to dictionary ")
    }
};
DMAF.Processors.BeatPattern.prototype.clearAll = function() {
    this.events = {};
    this.cuePoints = [];
    DMAF.debug(this.patternId + " cleared ")
};
DMAF.Processors.BeatPosition = function(c, b, d, a) {
    this.bar = c;
    this.beat = b;
    this.tick = a || 1;
    this.beatsPerBar = d || 4;
    this.beatCount = this.beat + ((this.bar - 1) * this.beatsPerBar)
};
DMAF.Processors.BeatPosition.prototype.getInBeats = function() {
    var a = this.beat + ((this.bar - 1) * this.beatsPerBar);
    return a
};
DMAF.Processors.BeatPosition.prototype.gotoNextBeat = function() {
    if (this.beat === this.beatsPerBar) {
        this.bar++;
        this.beat = 1;
        this.beatCount++
    } else {
        this.beat++;
        this.beatCount++
    }
};
DMAF.Processors.BeatPosition.prototype.addOffset = function(a) {
    this.beat = this.beat + a.beat;
    while (this.beat > this.beatsPerBar) {
        this.bar++;
        this.beat = this.beat - this.beatsPerBar
    }
    this.bar = this.bar + a.bar
};
DMAF.Processors.BeatEvent = function(b, a, c) {
    this._eventName = b;
    this._bar = a.bar;
    this._beat = a.beat;
    this._tick = a.tick;
    this._beatsPerBar = a.beatsPerBar;
    this._data = c
};
DMAF.Processors.BeatEvent.prototype.NAME = "BeatEvent";
DMAF.Processors.BeatEvent.prototype.getEventName = function() {
    return this._eventName
};
DMAF.Processors.BeatEvent.prototype.setEventName = function(a) {
    this._eventName = a
};
DMAF.Processors.BeatEvent.prototype.getBar = function() {
    return this._bar
};
DMAF.Processors.BeatEvent.prototype.setBar = function(a) {
    this._bar = a
};
DMAF.Processors.BeatEvent.prototype.getBeat = function() {
    return this._beat
};
DMAF.Processors.BeatEvent.prototype.setBeat = function(a) {
    this._beat = a
};
DMAF.Processors.BeatEvent.prototype.getTick = function() {
    return this._tick
};
DMAF.Processors.BeatEvent.prototype.setTick = function(a) {
    this._tick = a
};
DMAF.Processors.BeatEvent.prototype.getData = function() {
    return this._data
};
DMAF.Processors.BeatEvent.prototype.setData = function(a) {
    this._data = a
};
DMAF.Processors.BeatEvent.prototype.getBeatsPerBar = function() {
    return this._beatsPerBar
};
DMAF.Processors.BeatEvent.prototype.setBeatsPerBar = function(a) {
    this._beatsPerBar = a
};
DMAF.Processors.BeatEvent.prototype.execute = function(a, b) {
    a = a + (this.getTick() * (b / 480));
    DMAF.getController().onInternalEvent(this.getEventName(), a, this.getData())
};
DMAF.Processors.SynthEvent = function(b, a, c) {
    this._eventName = b;
    this._bar = a.bar;
    this._beat = a.beat;
    this._tick = a.tick;
    this._beatsPerBar = a.beatsPerBar;
    this._data = c
};
DMAF.Processors.SynthEvent.prototype.NAME = "SynthEvent";
DMAF.Processors.SynthEvent.prototype.getEventName = function() {
    return this._eventName
};
DMAF.Processors.SynthEvent.prototype.setEventName = function(a) {
    this._eventName = a
};
DMAF.Processors.SynthEvent.prototype.getBar = function() {
    return this._bar
};
DMAF.Processors.SynthEvent.prototype.setBar = function(a) {
    this._bar = a
};
DMAF.Processors.SynthEvent.prototype.getBeat = function() {
    return this._beat
};
DMAF.Processors.SynthEvent.prototype.setBeat = function(a) {
    this._beat = a
};
DMAF.Processors.SynthEvent.prototype.getTick = function() {
    return this._tick
};
DMAF.Processors.SynthEvent.prototype.setTick = function(a) {
    this._tick = a
};
DMAF.Processors.SynthEvent.prototype.getData = function() {
    return this._data
};
DMAF.Processors.SynthEvent.prototype.setData = function(a) {
    this._data = a
};
DMAF.Processors.SynthEvent.prototype.getBeatsPerBar = function() {
    return this._beatsPerBar
};
DMAF.Processors.SynthEvent.prototype.setBeatsPerBar = function(a) {
    this._beatsPerBar = a
};
DMAF.Processors.SynthEvent.prototype.execute = function(b, c) {
    b = b + (this.getTick() * (c / 480));
    var a = this.getData();
    a.noteEndTime = (b + ((a.e * (c / 480)) / 1000)) - b;
    DMAF.getController().onInternalEvent(this.getEventName(), b, a)
};
DMAF.Processors.BeatPatternPlayer = function() {
    this.newTempo = 120;
    this.tempo = 120;
    this._beatsPerBar = 4;
    this.newBeats = 4;
    this.beatLength = (60 / this.tempo) * 1000;
    this.barLength = this.beatLength * this._beatsPerBar;
    this.clockState = this.STOPPED;
    this.preListen = 100;
    this.pendingExternalEvents = [];
    this.tempoUpdated = false;
    this.currentBar = 0;
    this.soundManager = DMAF.Managers.getSoundManager();
    this.songPosition = new DMAF.Processors.BeatPosition(0, 0);
    this.pendingPatterns = [];
    this.activePatterns = [];
    this.tempoObservers = [];
    this.currentPattern = new DMAF.Processors.BeatPatternInstance(this, {
        beatPattern: new DMAF.Processors.BeatPattern("master", new DMAF.Processors.BeatPosition(0, 4), new DMAF.Processors.BeatPosition(1, 1)),
        beatChannel: "master",
        addAtSongPosition: new DMAF.Processors.BeatPosition(0, 4),
        patternStartPosition: new DMAF.Processors.BeatPosition(0, 4),
        clearPending: true,
        replaceActivePatterns: true,
        setAsCurrent: true,
        loop: true,
        clearPosition: new DMAF.Processors.BeatPosition(1, 1)
    })
};
DMAF.Processors.BeatPatternPlayer.prototype.PROCESSOR_ID = "BEATPATTERNPLAYER";
DMAF.Processors.BeatPatternPlayer.prototype.getBeatsPerBar = function() {
    return this._beatsPerBar
};
DMAF.Processors.BeatPatternPlayer.prototype.setBeatsPerBar = function(a) {
    if (a !== this._beatsPerBar) {
        this._beatsPerBar = a;
        this.beatLength = (60 / this.tempo) * 1000;
        this.barLength = this.beatLength * this.beatsPerBar;
        this.newBeats = a
    }
};
DMAF.Processors.BeatPatternPlayer.prototype.getCurrentBar = function() {
    return this.songPosition.bar
};
DMAF.Processors.BeatPatternPlayer.prototype.getNextBar = function() {
    return this.getCurrentBar() + 1
};
DMAF.Processors.BeatPatternPlayer.prototype.setCurrentBarTime = function(a) {
    this._currentBarTime = a
};
DMAF.Processors.BeatPatternPlayer.prototype.getCurrentBarTime = function() {
    return this._currentBarTime
};
DMAF.Processors.BeatPatternPlayer.prototype.getNextBarTime = function() {
    return this.currentBarTime + this.barLength
};
DMAF.Processors.BeatPatternPlayer.prototype.getCurrentBeat = function() {
    return this.songPosition.beat
};
DMAF.Processors.BeatPatternPlayer.prototype.getNextBeat = function() {
    var a = this.getCurrentBeat() + 1;
    if (a > this.getBeatsPerBar()) {
        a = 1
    }
    return a
};
DMAF.Processors.BeatPatternPlayer.prototype.setCurrentBeatTime = function(a) {
    this._currentBeatTime = a;
    this._nextBeatTime = a + this.beatLength
};
DMAF.Processors.BeatPatternPlayer.prototype.getCurrentBeatTime = function() {
    return this._currentBeatTime
};
DMAF.Processors.BeatPatternPlayer.prototype.setCurrentSixteenthTime = function(a) {
    this._currentSixteenthTime = a;
    this._nextSixteenthTime = a + (this.beatLength / 4)
};
DMAF.Processors.BeatPatternPlayer.prototype.getNextSixteenthTime = function() {
    return this._nextSixteenthTime
};
DMAF.Processors.BeatPatternPlayer.prototype.setNextBeatTime = function(a) {
    this._nextBeatTime = a;
    this._currentBeatTime = a - this.beatLength
};
DMAF.Processors.BeatPatternPlayer.prototype.getNextBeatTime = function() {
    return this._nextBeatTime
};
DMAF.Processors.BeatPatternPlayer.prototype.getTempo = function() {
    return this.tempo
};
DMAF.Processors.BeatPatternPlayer.prototype.setTempo = function(a) {
    if (a != this.tempo) {
        this.tempo = a;
        this.beatLength = (60 / this.tempo) * 1000;
        this.barLength = this.beatLength * this.beatsPerBar;
        this.tempoUpdated = true;
        this.newTempo = a;
        var b;
        for (b = 0; b < this.tempoObservers.length; ++b) {
            this.tempoObservers[b].setTempo(this.tempo)
        }
    }
};
DMAF.Processors.BeatPatternPlayer.prototype.getCurrentPatternBar = function() {
    var a;
    if (!this.currentPattern) {
        a = 0
    } else {
        a = this.currentPattern.getPatternPosition().bar
    }
    return a
};
DMAF.Processors.BeatPatternPlayer.prototype.getNextPatternBar = function() {
    return this.getCurrentPatternBar() + 1
};
DMAF.Processors.BeatPatternPlayer.prototype.getCurrentPatternBeat = function() {
    var a;
    if (!this.currentPattern) {
        a = 0
    } else {
        a = this.currentPattern.getPatternPosition().beat
    }
    return a
};
DMAF.Processors.BeatPatternPlayer.prototype.getNextPatternBeat = function() {
    return this.getCurrentPatternBeat() + 1
};
DMAF.Processors.BeatPatternPlayer.prototype.getCurrentPatternId = function() {
    var a;
    if (!this.currentPattern) {
        a = "none"
    } else {
        a = this.currentPattern.beatPatternId
    }
    return a
};
DMAF.Processors.BeatPatternPlayer.prototype.addPattern = function(c) {
    if (this.clockState === this.RUNNING) {
        var b = new DMAF.Processors.BeatPatternInstance(this, c);
        if (c.clearPending) {
            if (c.beatChannel === "main") {
                this.pendingPatterns = []
            } else {
                for (var a = 0; a < this.pendingPatterns.length; a++) {
                    if (this.pendingPatterns[a].beatChannel === c.beatChannel) {
                        this.pendingPatterns.splice(a, 1);
                        a--
                    }
                }
            }
        }
        if (c.useAsTransposePattern) {
            b.useAsTransposePattern = true
        }
        this.pendingPatterns.push(b)
    } else {}
};
DMAF.Processors.BeatPatternPlayer.prototype.addInstantPattern = function(c) {
    var b = new DMAF.Processors.BeatPatternInstance(this, c);
    for (var a = 0; a < this.activePatterns.length; a++) {
        if (this.activePatterns[a].beatChannel === c.beatChannel) {
            this.activePatterns.splice(a, 1);
            a--
        }
    }
    this.activePatterns.push(b);
    if (c.setAsCurrent) {
        this.currentPattern = b
    }
};
DMAF.Processors.BeatPatternPlayer.prototype.updateActivePatterns = function() {
    var b, f, e, d, c, a;
    for (e = 0; e < this.pendingPatterns.length; e++) {
        f = this.pendingPatterns[e].getAddAtSongPosition();
        if (f.bar === this.songPosition.bar && f.beat === this.songPosition.beat) {
            b = this.pendingPatterns[e];
            this.pendingPatterns.splice(e, 1);
            e--;
            if (b.replaceActivePatterns) {
                for (d = 0; d < this.activePatterns.length; d++) {
                    if (b.beatChannel === "main") {
                        this.activePatterns[d].setRemoveAtSongPosition(b.clearPosition)
                    } else {
                        if (b.beatChannel === this.activePatterns[d].beatChannel) {
                            this.activePatterns[d].setRemoveAtSongPosition(b.clearPosition)
                        } else {}
                    }
                }
            }
            for (c = 0; c < this.activePatterns.length; c++) {
                if (this.activePatterns[c].beatPatternId === b.beatPatternId) {
                    this.activePatterns.splice(c, 1);
                    break
                }
            }
            if (b.useAsTransposePattern) {
                DMAF.debug("adding as transpose master", b);
                if (this.activePatterns[0] && this.activePatterns[0].useAsTransposePattern) {
                    this.activePatterns.splice(0, 1)
                }
                this.activePatterns.unshift(b)
            } else {
                this.activePatterns.push(b)
                var instrument = b.beatPatternId.split("__")[0];
                instrument = instrument.replace("_weird", "");
                instrument = instrument.replace("_half", "");
                if (instrument !== "fx_for_walking" && instrument !== "pad_es2_warm") {
                    instrument = instrument.replace("_w", "");
                }
                if (instrument === "cello_pluck_bass_h") {
                    instrument = "cello_pluck_bass";
                }

                DMAF.getCore().dispatch("visual__" + b.beatChannel + "__" + instrument);
            }
            if (b.setAsCurrent) {
                this.currentPattern = b
            }
        }
    }
    for (a = 0; a < this.activePatterns.length; a++) {
        if (this.activePatterns[a].getRemoveAtSongPosition().bar === this.songPosition.bar && this.activePatterns[a].getRemoveAtSongPosition().beat === this.songPosition.beat) {
            this.activePatterns.splice(a, 1);
            a--
        }
    }
};
DMAF.Processors.BeatPatternPlayer.prototype.removePattern = function(b, a) {
    if (this.activePatterns[b.patternId]) {
        this.activePatterns[b.patternId].removeAtSongPosition = a
    }
};
DMAF.Processors.BeatPatternPlayer.prototype.clearBeatChannel = function(c, a) {
    DMAF.debug("clear clearBeatChannel " + c);
    for (var b = 0; b < this.activePatterns.length; b++) {
        if (this.pendingPatterns[b].beatChannel === c) {
            this.pendingPatterns[b].removeAtSongPosition = a
        }
    }
    for (b = 0; b < this.activePatterns.length; b++) {
        if (this.activePatterns[b].beatChannel === c) {
            this.activePatterns[b].removeAtSongPosition = a
        }
    }
};
DMAF.Processors.BeatPatternPlayer.prototype.clearActivePatterns = function(a) {
    for (var b = 0; b < this.activePatterns.length; b++) {
        this.activePatterns[b].removeAtSongPosition = a
    }
};
DMAF.Processors.BeatPatternPlayer.prototype.executeEvents = function(b) {
    for (var a = 0; a < this.activePatterns.length; a++) {
        this.activePatterns[a].executeEvents(b, this.beatLength)
    }
};
DMAF.Processors.BeatPatternPlayer.prototype.RUNNING = "running";
DMAF.Processors.BeatPatternPlayer.prototype.PAUSED = "paused";
DMAF.Processors.BeatPatternPlayer.prototype.STOPPED = "stopped";
DMAF.Processors.BeatPatternPlayer.prototype.startClock = function(c, b, a) {
    if (this.clockState !== this.RUNNING) {
        this.beatsPerBar = a;
        this.setTempo(b);
        this.songPosition = new DMAF.Processors.BeatPosition(0, this.getBeatsPerBar(), this.getBeatsPerBar());
        this.setNextBeatTime(c);
        this.setCurrentSixteenthTime(c);
        this.currentFrame = 0;
        this.currentFrameTime = c;
        this.previousFrameTime = this.currentFrameTime;
        this.nextFrameTime = this.currentFrameTime + (1000 / DMAF.FPS);
        DMAF.Managers.getCheckTimeManager().addFrameListener("checkBeat", this.checkBeat, this);
        this.clockState = this.RUNNING
    } else {
        this.newTempo = b;
        this.newBeats = a
    }
};
DMAF.Processors.BeatPatternPlayer.prototype.stopClock = function() {
    this.clockState = this.STOPPED;
    this.pendingPatterns = [];
    for (var a in this.activePatterns) {
        if (this.activePatterns.hasOwnProperty(a)) {
            this.activePatterns[a].setPatternPosition(new DMAF.Processors.BeatPosition(0, 4, this.getBeatsPerBar()))
        }
    }
    this.activePatterns = [];
    this.songPosition = new DMAF.Processors.BeatPosition(0, 0);
    DMAF.Managers.getCheckTimeManager().removeFrameListener("checkBeat")
};
DMAF.Processors.BeatPatternPlayer.prototype.pauseClock = function() {
    this.clockState = this.PAUSED
};
DMAF.Processors.BeatPatternPlayer.prototype.resumeClock = function() {
    this.clockState = this.RUNNING
};
DMAF.Processors.BeatPatternPlayer.prototype.checkBeat = function(b) {
    var a = DMAF.context.currentTime * 1000;
    if (a >= this.getNextBeatTime() - DMAF.preListen) {
        this.updateBeat(this.getNextBeatTime())
    }
    if (DMAF.dispatchFrames && a >= this.getNextSixteenthTime()) {
        //DMAF.getCore().dispatch("frame_" + (this.currentFrame % DMAF.FPS));
        this.currentFrame++;
        this.setCurrentSixteenthTime(this.getNextSixteenthTime())
    }
};
DMAF.Processors.BeatPatternPlayer.prototype.updateBeat = function(b) {
    this.songPosition.gotoNextBeat();
    if (this.songPosition.beat == 1) {
        this.currentBarTime = b;
        if (this.newTempo != this.tempo) {
            this.setTempo(this.newTempo)
        }
        if (this.newBeats != this.beatsPerBar) {
            this.beatsPerBar = this.newBeats;
            this.songPosition.beatsPerBar = this.beatsPerBar
        }
    }
    this.setCurrentBeatTime(b);
    for (var a in this.activePatterns) {
        if (this.activePatterns.hasOwnProperty(a)) {
            this.activePatterns[a].gotoNextBeat()
        }
    }
    this.updateActivePatterns();
    this.executeEvents(b);
    //DMAF.getCore().dispatch("beat", {
    //    beat: this.songPosition.bar,
    //    subbeat: this.songPosition.beat
    //})
};
DMAF.Processors.BeatPatternPlayer.prototype.gotoNextBeat = function(b) {
    this.songPosition.gotoNextBeat();
    for (var a in this.activePatterns) {
        if (this.activePatterns.hasOwnProperty(a)) {
            this.activePatterns[a].gotoNextBeat()
        }
    }
    this.updateActivePatterns();
    this.executeEvents(b)
};
DMAF.CoreInstance = function() {
    EventDispatcher.call(this);
    this.activeObjects = {};
    this.buttonListeners = {};
    this.pendingButtons = [];
    this.pendingObjects = [];
    this.debugging = false;
    if (!DMAF.contextAvailable) {} else {
        this.enabled = true
    }
};
DMAF.CoreInstance.prototype = new EventDispatcher();
DMAF.CoreInstance.prototype.constructor = DMAF.CoreInstance;
DMAF.CoreInstance.prototype.debugOn = function(a) {
    if (!a) {
        a = "debug"
    }
    switch (a) {
        case "error":
            this.debugging = false;
            this.errorDebugging = true;
            break;
        case "debug":
            this.debugging = true;
            this.errorDebugging = true;
            break
    }
    DMAF.error("DMAF error debug is on");
    DMAF.debug("DMAF debug is on")
};
DMAF.CoreInstance.prototype.debugOff = function() {
    DMAF.debug("DMAF debug is off");
    this.debugging = false;
    this.errorDebugging = false
};
DMAF.CoreInstance.prototype.debug = function(b, a) {
    if (this.debugging) {
        if (b && a) {
            console.log((DMAF.context.currentTime * 1000 - DMAF.startTime) + ": ", b, a)
        } else {
            console.log((DMAF.context.currentTime * 1000 - DMAF.startTime) + ": ", b)
        }
    }
};
DMAF.CoreInstance.prototype.error = function(b, a) {
    if (this.errorDebugging) {
        if (b && a) {
            console.log((DMAF.context.currentTime * 1000 - DMAF.startTime) + ": ", b, a)
        } else {
            console.log((DMAF.context.currentTime * 1000 - DMAF.startTime) + ": ", b)
        }
    }
};
DMAF.CoreInstance.prototype.enable = function() {
    if (!DMAF.contextAvailable) {
        return
    }
    this.enabled = true;
    DMAF.debug("DMAF enabled")
};
DMAF.CoreInstance.prototype.disable = function() {
    this.enabled = false;
    DMAF.Managers.getSoundManager().stopAllSounds();
    DMAF.debug("DMAF disabled")
};
DMAF.SoundActionFactory = null;
DMAF.SoundInstanceFactory = null;
DMAF.SynthActionFactory = null;
DMAF.SynthInstanceFactory = null;
DMAF.IteratorFactory = null;
DMAF.EffectsFactory = null;
DMAF.ProcessorActionFactory = null;
DMAF.ProcessorInstanceFactory = null;
DMAF.AudioBusFactory = null;
DMAF.Factories.getSynthInstanceFactory = function() {
    if (DMAF.SynthInstanceFactory === null) {
        DMAF.SynthInstanceFactory = new DMAF.Factories.SynthInstanceFactory()
    }
    return DMAF.SynthInstanceFactory
};
DMAF.Factories.getSynthActionFactory = function() {
    if (DMAF.SynthActionFactory === null) {
        DMAF.SynthActionFactory = new DMAF.Factories.SynthActionFactory()
    }
    return DMAF.SynthActionFactory
};
DMAF.Factories.getSoundActionFactory = function() {
    if (DMAF.SoundActionFactory === null) {
        DMAF.SoundActionFactory = new DMAF.Factories.SoundActionFactory()
    }
    return DMAF.SoundActionFactory
};
DMAF.Factories.getSoundInstanceFactory = function() {
    if (DMAF.SoundInstanceFactory === null) {
        DMAF.SoundInstanceFactory = new DMAF.Factories.SoundInstanceFactory()
    }
    return DMAF.SoundInstanceFactory
};
DMAF.Factories.getProcessorInstanceFactory = function() {
    if (DMAF.ProcessorInstanceFactory === null) {
        DMAF.ProcessorInstanceFactory = new DMAF.Factories.ProcessorInstanceFactory()
    }
    return DMAF.ProcessorInstanceFactory
};
DMAF.Factories.getProcessorActionFactory = function() {
    if (DMAF.ProcessorActionFactory === null) {
        DMAF.ProcessorActionFactory = new DMAF.Factories.ProcessorActionFactory()
    }
    return DMAF.ProcessorActionFactory
};
DMAF.Factories.getIteratorFactory = function() {
    if (DMAF.IteratorFactory === null) {
        DMAF.IteratorFactory = new DMAF.Factories.IteratorFactory()
    }
    return DMAF.IteratorFactory
};
DMAF.Factories.getEffectsFactory = function() {
    if (DMAF.EffectsFactory === null) {
        DMAF.EffectsFactory = new DMAF.Factories.EffectsFactory()
    }
    return DMAF.EffectsFactory
};
DMAF.Factories.getAudioBusFactory = function() {
    if (DMAF.AudioBusFactory === null) {
        DMAF.AudioBusFactory = new DMAF.Factories.AudioBusFactory()
    }
    return DMAF.AudioBusFactory
};
DMAF.Factories.SoundActionFactory = function() {
    this.factoryMap = {};
    this.registerCoreTypes()
};
DMAF.Factories.SoundActionFactory.prototype.registerCoreTypes = function() {
    this.factoryMap.SOUNDGENERIC_PLAY = DMAF.Actions.SoundGenericPlay;
    this.factoryMap.SOUNDBASIC_PLAY = DMAF.Actions.SoundBasicPlay;
    this.factoryMap.SOUNDSTEP_PLAY = DMAF.Actions.SoundStepPlay;
    this.factoryMap.SOUND_STOP = DMAF.Actions.SoundStop
};
DMAF.Factories.SoundActionFactory.prototype.create = function(d, c) {
    if (!this.factoryMap[d]) {
        DMAF.debug("DMAFError: Could not create sound action, unknown type: " + d);
        return
    }
    var b = this.factoryMap[d];
    var a = new b(c);
    return a
};
DMAF.Factories.ProcessorActionFactory = function() {
    this.factoryMap = {};
    this.registerCoreTypes()
};
DMAF.Factories.ProcessorActionFactory.prototype.registerCoreTypes = function() {
    this.factoryMap.TRANSFORM_CREATE = DMAF.Actions.TransformProcessorCreate;
    this.factoryMap.MACRO_CREATE = DMAF.Actions.MacroProcessorCreate
};
DMAF.Factories.ProcessorActionFactory.prototype.create = function(d, c) {
    if (!this.factoryMap[d]) {
        DMAF.debug("DMAFError: Could not create processor action, unknown type: " + d);
        return
    }
    var b = this.factoryMap[d];
    var a = new b(c);
    return a
};
DMAF.Factories.SoundInstanceFactory = function(a) {
    this.factoryMap = {};
    this.registerCoreTypes()
};
DMAF.Factories.SoundInstanceFactory.prototype.registerCoreTypes = function() {
    this.factoryMap.GENERIC = DMAF.Sounds.SoundGeneric;
    this.factoryMap.BASIC = DMAF.Sounds.SoundBasic;
    this.factoryMap.STEP = DMAF.Sounds.SoundStep
};
DMAF.Factories.SoundInstanceFactory.prototype.create = function(b, d) {
    if (!this.factoryMap[b]) {
        DMAF.debug("DMAFError: Could not create sound instance, unknown type: " + b);
        return
    }
    var c = this.factoryMap[b];
    var a = new c(d);
    return a
};
DMAF.Factories.ProcessorInstanceFactory = function() {
    this.factoryMap = {};
    this.registerCoreTypes()
};
DMAF.Factories.ProcessorInstanceFactory.prototype.registerCoreTypes = function() {
    this.factoryMap.TRANSFORM = DMAF.Processors.TransformProcessor;
    this.factoryMap.MACRO = DMAF.Processors.MacroProcessor
};
DMAF.Factories.ProcessorInstanceFactory.prototype.create = function(c, b) {
    if (!this.factoryMap[c]) {
        DMAF.debug("DMAFError: Could not create processor instance, unknown type: " + c);
        return
    }
    var d = this.factoryMap[c];
    var a = new d(b);
    return a
};
DMAF.Factories.IteratorFactory = function() {
    this.createIterator = function(c, a) {
        var b;
        switch (c) {
            case "ROUND_ROBIN":
                b = new DMAF.Iterators.RoundRobinIterator(a);
                break;
            case "RANDOM":
                b = new DMAF.Iterators.RandomNextIterator(a);
                break;
            case "RANDOM_FIRST":
                b = new DMAF.Iterators.RandomFirstIterator(a);
                break;
            case "SHUFFLE":
                b = new DMAF.Iterators.ShuffleIterator(a);
                break;
            default:
                b = new DMAF.Iterators.RandomFirstIterator(a);
                DMAF.debug("DMAFWarning: using default iterator");
                break
        }
        return b
    }
};
DMAF.Factories.EffectsFactory = function() {
    this.factoryMap = {};
    this.registerCoreTypes()
};
DMAF.Factories.EffectsFactory.prototype.registerCoreTypes = function() {
    this.factoryMap.CHORUS = DMAF.AudioNodes.Chorus;
    this.factoryMap.OVERDRIVE = DMAF.AudioNodes.Overdrive;
    this.factoryMap.WAHWAH = DMAF.AudioNodes.WahWah;
    this.factoryMap.COMPRESSOR = DMAF.AudioNodes.Compressor;
    this.factoryMap.CABINET = DMAF.AudioNodes.Cabinet;
    this.factoryMap.EQUALIZER = DMAF.AudioNodes.Equalizer;
    this.factoryMap.FXGROUP = DMAF.AudioNodes.FxGroup;
    this.factoryMap.PHASER = DMAF.AudioNodes.Phaser;
    this.factoryMap.TREMOLO = DMAF.AudioNodes.Tremolo;
    this.factoryMap.STEREODELAY = DMAF.AudioNodes.StereoDelay;
    this.factoryMap.SLAPBACK = DMAF.AudioNodes.SlapbackDelay;
    this.factoryMap.PINGPONG = DMAF.AudioNodes.PingPongDelay;
    this.factoryMap.AUTOFILTER = DMAF.AudioNodes.AutoFilter;
    this.factoryMap.CONVOLVER = DMAF.AudioNodes.Convolver
};
DMAF.Factories.EffectsFactory.prototype.create = function(d, c) {
    if (!this.factoryMap[d]) {
        DMAF.debug("DMAFError: Could not create effect, unknown type: " + d);
        return
    }
    var b = this.factoryMap[d];
    var a = new b(c);
    return a
};
DMAF.Factories.AudioBusFactory = function(a) {
    this.factoryMap = {};
    this.registerCoreTypes()
};
DMAF.Factories.AudioBusFactory.prototype.registerCoreTypes = function() {
    this.factoryMap.AUDIOBUS_CREATE = DMAF.Actions.AudioBusCreate
};
DMAF.Factories.AudioBusFactory.prototype.create = function(d, c) {
    if (!this.factoryMap[d]) {
        DMAF.debug("DMAFError: Could not create audio bus, unknown type: " + d);
        return
    }
    var b = this.factoryMap[d];
    var a = new b(c);
    return a
};
DMAF.Iterators.StepSoundIterator = function(a) {
    this.actIndex = 0;
    this.array = a;
    var b = this;
    this.getRandom = function() {
        return Math.floor((Math.random() * (b.array.length)) - 1e-13)
    }
};
DMAF.Iterators.RoundRobinIterator = function(a) {
    DMAF.Iterators.StepSoundIterator.call(this, a);
    this.actIndex = -1;
    var b = this;
    this.getNext = function() {
        b.actIndex++;
        if (b.actIndex >= b.array.length) {
            b.actIndex = 0
        }
        return b.array[b.actIndex]
    }
};
DMAF.Iterators.StepSoundIterator.prototype = new DMAF.Iterators.StepSoundIterator();
DMAF.Iterators.RandomNextIterator = function(a) {
    DMAF.Iterators.StepSoundIterator.call(this, a);
    var b = this;
    this.getNext = function() {
        b.actIndex = b.getRandom();
        return b.array[b.actIndex]
    }
};
DMAF.Iterators.RandomNextIterator.prototype = new DMAF.Iterators.StepSoundIterator();
DMAF.Iterators.RandomFirstIterator = function(a) {
    DMAF.Iterators.RoundRobinIterator.call(this, a);
    this.actIndex = this.getRandom()
};
DMAF.Iterators.RandomFirstIterator.prototype = new DMAF.Iterators.RoundRobinIterator();
DMAF.Iterators.ShuffleIterator = function(a) {
    DMAF.Iterators.StepSoundIterator.call(this, a);
    this.previousSoundIndex = -1;
    this.soundIsPlayed = [];
    var b = this;
    this.getNext = function() {
        b.actIndex = b.getRandom();
        b.checkIfSoundsRemain();
        while (true) {
            if (b.soundIsPlayed[b.actIndex] === false && b.previousSoundIndex !== b.actIndex) {
                break
            } else {
                b.actIndex = b.getRandom()
            }
        }
        b.previousSoundIndex = b.actIndex;
        b.soundIsPlayed[b.actIndex] = true;
        return b.array[b.actIndex]
    }
};
DMAF.Iterators.ShuffleIterator.prototype = new DMAF.Iterators.StepSoundIterator();
DMAF.Iterators.ShuffleIterator.prototype.resetSounds = function() {
    for (var a = 0; a < this.array.length; a++) {
        this.soundIsPlayed[a] = false
    }
};
DMAF.Iterators.ShuffleIterator.prototype.checkIfSoundsRemain = function() {
    for (var a = 0; a < this.array.length; a++) {
        if (this.soundIsPlayed[a] === false) {
            return
        }
    }
    this.resetSounds()
};
DMAF.Managers.SoundManager = function() {
    this.activeSoundElements = [];
    this.idleSoundElements = [];
    this.activeSoundInstances = {};
    for (var a = 0; a < DMAF.voiceCount; a++) {
        this.idleSoundElements.push(new Audio())
    }
};
DMAF.Managers.SoundManager.prototype.pendingStopActions = [];
DMAF.Managers.SoundManager.prototype.getSoundInstance = function(a) {
    if (this.activeSoundInstances[a] != undefined) {
        return this.activeSoundInstances[a]
    } else {
        return false
    }
};
DMAF.Managers.SoundManager.prototype.getActiveSoundInstances = function(b) {
    var c = [];
    for (var a in this.activeSoundInstances) {
        if (a.split(".")[0] === b) {
            c.push(this.activeSoundInstances[a])
        }
    }
    return c
};
DMAF.Managers.SoundManager.prototype.removeSoundInstance = function(a) {
    if (this.activeSoundInstances[a] != undefined) {
        delete this.activeSoundInstances[a];
        return true
    } else {
        return false
    }
};
DMAF.Managers.SoundManager.prototype.addSoundInstance = function(a, b) {
    if (this.activeSoundInstances[b] == undefined) {
        this.activeSoundInstances[b] = a
    }
};
DMAF.Managers.SoundManager.prototype.addIdleSoundElement = function(a) {
    this.idleSoundElements.push(a)
};
DMAF.Managers.SoundManager.prototype.addActiveSoundElement = function(a) {
    this.activeSoundElements.push(a)
};
DMAF.Managers.SoundManager.prototype.removeActiveElement = function(c) {
    for (var b = 0; b < this.activeSoundElements.length; b++) {
        if (this.activeSoundElements[b].id === c) {
            var a = this.activeSoundElements.splice(b, 1)[0];
            this.addIdleSoundElement(a);
            return
        }
    }
    DMAF.error("DMAFError: couldn't find element in active array: " + event.target.id)
};
DMAF.Managers.SoundManager.prototype.onSoundError = function(a) {
    DMAF.error(a, a.srcElement)
};
DMAF.Managers.SoundManager.prototype.getIdleSoundElement = function(c) {
    if (this.idleSoundElements.length > 0) {
        for (var a = 0; a < this.idleSoundElements.length; a++) {
            if (this.idleSoundElements[a].src === c) {
                var b = this.idleSoundElements.splice(a, 1)[0];
                return b
            }
        }
        var b = this.idleSoundElements.splice(0, 1)[0];
        b.src = c;
        return b
    }
    DMAF.debug("DMAFError: out of elements, call canceled");
    return false
};
DMAF.Managers.SoundManager.prototype.startSound = function(d, c, b, e, a) {
    if (!d.id) {
        DMAF.debug("DMAFWarning: no id assigned to element, will not be able to stop manually", d)
    }
    d.gainNode.gain.value = c;
    d.start(0);
    return true
};
DMAF.CheckTimeManager = null;
DMAF.Managers.getCheckTimeManager = function() {
    if (!DMAF.CheckTimeManager) {
        DMAF.CheckTimeManager = new DMAF.Managers.CheckTimeManager()
    }
    return DMAF.CheckTimeManager
};
DMAF.Managers.CheckTimeManager = function() {
    this.pendingArray = []
};
DMAF.Managers.CheckTimeManager.prototype.checkFunctionTime = function(e, f, c, b, a) {
    var h;
    if (a && typeof a !== "array") {
        h = a;
        h.actionTime = e;
        h.caller = b;
        h.action = f
    } else {
        h = a ? a : [];
        h.unshift(e);
        h.unshift(b);
        h.unshift(f)
    }
    var d = DMAF.context.currentTime * 1000;
    if (e > d + DMAF.preListen) {
        var g = e - d - DMAF.preListen;
        c.push(setTimeout(this.runAction, g, h))
    } else {
        this.runAction(h)
    }
};
DMAF.Managers.CheckTimeManager.prototype.runAction = function(c) {
    var a, d, b;
    if (c instanceof Array) {
        a = arguments[0];
        d = arguments[0].shift();
        b = arguments[0].shift()
    } else {
        d = c.action;
        b = c.caller;
        a = [c]
    }
    d.apply(b, a)
};
DMAF.Managers.CheckTimeManager.prototype.checkEventTime = function(a, d, f, g, b) {
    var c = DMAF.context.currentTime * 1000;
    if (!g) {
        g = DMAF.getController().onEvent
    }
    if (!b) {
        b = DMAF.getController()
    }
    if (d > c + DMAF.preListen) {
        var e = d - c - DMAF.preListen;
        this.pendingArray.push(setTimeout((function() {
            return function() {
                g.apply(b, [a, d, f])
            }
        }()), e))
    } else {
        g.apply(b, [a, d, f])
    }
};
DMAF.Managers.CheckTimeManager.prototype.dropPendingArray = function(a) {
    if (a instanceof Array) {
        while (a.length > 0) {
            clearTimeout(a.pop())
        }
        a = []
    }
};
DMAF.Managers.CheckTimeManager.prototype.addFrameListener = function(f, c, a) {
    var d = DMAF.Managers.getCheckTimeManager();
    var b = d.listeners,
        e = d.contexts;
    if (c && typeof c === "function") {
        e[f] = a;
        b[f] = c
    }
    if (!d.frameIntervalRunning) {
        d.startFrameInterval()
    }
};
DMAF.Managers.CheckTimeManager.prototype.removeFrameListener = function(a) {
    if (this.listeners[a]) {
        delete this.listeners[a]
    }
};
DMAF.Managers.CheckTimeManager.prototype.contexts = {};
DMAF.Managers.CheckTimeManager.prototype.listeners = {};
DMAF.Managers.CheckTimeManager.prototype.frameInterval = null;
DMAF.Managers.CheckTimeManager.prototype.frameIntervalRunning = false;
DMAF.Managers.CheckTimeManager.prototype.startFrameInterval = function() {
    if (!this.frameIntervalRunning) {
        DMAF.Utils.requestNextFrame.call(window, this.executeFrameListeners);
        this.frameIntervalRunning = true
    }
};
DMAF.Managers.CheckTimeManager.prototype.executeFrameListeners = function() {
    var a = DMAF.Managers.getCheckTimeManager().listeners,
        c = DMAF.Managers.getCheckTimeManager().contexts;
    for (var b in a) {
        a[b].call(c[b])
    }
    DMAF.Utils.requestNextFrame.call(window, DMAF.Managers.getCheckTimeManager().executeFrameListeners)
};
DMAF.Managers.ActionManager = function() {
    this.triggers = {};
    this.actionProperties = {};
    this.buttonActions = {};
    this.init()
};
DMAF.Managers.ActionManager.prototype.init = function() {
    var a = new XMLHttpRequest();
    a.open("GET", DMAF.actionsXMLsrc, true);
    a.onreadystatechange = function() {
        if (a.readyState === 4) {
            if (a.status > 199 && a.status < 300 || a.status === 304) {
                if (a.responseXML) {
                    DMAF.Managers.parseActionXML(a.responseXML)
                } else {
                    console.log("ERROR: Config file is unavailable or malformed!")
                }
            }
        }
    };
    a.send(null)
};
DMAF.Managers.ActionManager.prototype.addTrigger = function(a, b) {
    if (this.triggers[a] === undefined) {
        this.triggers[a] = []
    }
    this.triggers[a].push(b)
};
DMAF.Managers.ActionManager.prototype.onEvent = function(a, d, c) {
    if (this.triggers[a] === undefined) {
        DMAF.error("no actions for trigger: " + a);
        return
    }
    var e = this.triggers[a];
    for (var b = 0; b < e.length; b++) {
        if (e[b].delay && e[b].delay > 0) {
            e[b].actionTime = d + e[b].delay
        } else {
            e[b].actionTime = d
        }
        e[b].trigger = a;
        if (c) {
            e[b].parameters = c
        }
        e[b].execute()
    }
};
DMAF.Managers.AssetsManager = function() {
    this.activeAssetsLibraries = {};
    this.pendingAssetsLibraries = {};
    this.loadedSounds = {};
    this.registerLibraries(DMAF.libraryXMLList);
    this.pendingLoads = [];
    this.loader = new Audio();
    this.preloadsInProgress = 0;
    this.arrayBuffers = {};
};
DMAF.Managers.AssetsManager.prototype.getSound = function(d, callback, context) {
    if (!this.loadedSounds[d]) {
        return false
    } else {
        var a = DMAF.context.createBufferSource();
        a.stopped = false;
        var that = this;
        if (this.loadedSounds[d] === "arraybuffer") {
            DMAF.context.decodeAudioData(this.arrayBuffers[d], function onSuccess(buffer) {
                that.loadedSounds[d] = buffer;
                a.buffer = buffer;
                a.gainNode = DMAF.context.createGain();
                a.connect(a.gainNode);
                a.gainNode.connect(DMAF.context.master);
                callback.apply(context, [a]);
            }, function onError() {
                console.log("couldn't decode audio", that.arrayBuffers[d]);
            });
            return;
        } else {
            try {
                a.buffer = this.loadedSounds[d]
            } catch (c) {
                DMAF.error("Sound not fully loaded", d)
            }
        }
        a.gainNode = DMAF.context.createGain();
        a.connect(a.gainNode);
        a.gainNode.connect(DMAF.context.master);
        callback.apply(context, [a]);
    }
    var b = DMAF.Managers.getSoundManager().getIdleSoundElement(this.loadedSounds[d]);
    if (b !== false) {
        return b
    } else {
        if (!this.loadedSounds[d]) {
            DMAF.error("DMAFError: sound not loaded, or not defined in the library: " + d);
            return false
        } else {
            DMAF.debug("DMAFError: sound not fully loaded: " + this.loadedSounds[d].name);
            return false
        }
    }
};
DMAF.Managers.AssetsManager.prototype.proceedLoadingQue = function(c) {
    var b = DMAF.Managers.getAssetsManager();
    if (c.target.response && c.target.decode === undefined) {
        DMAF.context.decodeAudioData(c.target.response, function(d) {
            b.loadedSounds[c.target.name] = d
        }, function() {
            DMAF.error("error decoding audio data, corrupt or missing file? ");
            b.loadedSounds[c.target.name] = false
        })
    } else if (c.target.response && c.target.decode === false) {
        b.arrayBuffers[c.target.name] = c.target.response;
        b.loadedSounds[c.target.name] = "arraybuffer";
    } else {
        DMAF.debug("proceeding loading que after failed load", c.target.name);
        b.loadedSounds[c.target.name] = false
    }
    b.loading = false;
    if (b.pendingLoads.length > 0) {
        var a = b.pendingLoads.pop();
        if (a !== undefined) {
            b.initSound(a.path, a.name)
        } else {
            DMAF.debug("Loading que empty")
        }
    }
};
DMAF.Managers.AssetsManager.prototype.checkIfLoading = function() {
    if (this.preloadsInProgress === 0 && this.loading === false) {
        return false
    } else {
        console.log("is loading");
        return true
    }
};
DMAF.Managers.AssetsManager.prototype.initSound = function(c, a) {
    if (this.loading) {
        this.pendingLoads.unshift({
            path: c,
            name: a
        });
        return
    }
    this.loading = true;
    var b = new XMLHttpRequest();
    b.open("GET", c, true);
    b.responseType = "arraybuffer";
    b.name = a;
    b.decode = false;
    b.onload = this.proceedLoadingQue;
    this.loadedSounds[a] = b;
    b.send()
};
DMAF.Managers.AssetsManager.prototype.loadLibrary = function(b) {
    var d = DMAF.Managers.getAssetsManager();
    if (b instanceof Array) {
        var c = {};
        for (var a = 0; a < b.length; a++) {
            d.activeAssetsLibraries[b[a]] = {
                src: b[a]
            };
            DMAF.debug("starting loading of library: " + b[a]);
            var e = new XMLHttpRequest();
            e.open("GET", b[a], true);
            e.onreadystatechange = function() {
                if (e.readyState === 4) {
                    if (e.status > 199 && e.status < 300 || e.status === 304) {
                        DMAF.Managers.parseSoundXML(e.responseXML)
                    }
                }
            };
            e.send(null);
            delete d.pendingAssetsLibraries[b[a]]
        }
    } else {
        d.activeAssetsLibraries[b] = {
            src: b
        };
        DMAF.debug("starting loading of library: " + b);
        var e = new XMLHttpRequest();
        e.open("GET", b, false);
        e.onreadystatechange = function() {
            if (e.readyState === 4) {
                if (e.status > 199 && e.status < 300 || e.status === 304) {
                    DMAF.Managers.parseSoundXML(e.responseXML)
                }
            }
        };
        e.send(null);
        delete d.pendingAssetsLibraries[b]
    }
};
DMAF.Managers.AssetsManager.prototype.registerLibraries = function(e) {
    for (var b = 0; b < e.length; b++) {
        var a = e[b][0];
        var c;
        if (e[b][1] === false) {
            c = e[b][1]
        } else {
            c = true
        }
        var d;
        if (e[b][2]) {
            d = e[b][2]
        } else {
            if (!c) {
                DMAF.error("DMAFError: library " + a + " is without loading event")
            }
        }
        this.pendingAssetsLibraries[a] = {
            src: a
        };
        if (c) {
            this.loadLibrary(a)
        } else {
            DMAF.getController().addInternalEvent(d, this.loadLibrary, [a])
        }
    }
};
DMAF.Managers.AssetsManager.prototype.getBuffer = function(b, callback, context) {
    var a = DMAF.Managers.getAssetsManager().loadedSounds[b];
    if (a === false) {
        callback.apply(context, [false]);
        return;
    } else {
        if (a !== undefined && a === "arraybuffer") {
            DMAF.context.decodeAudioData(DMAF.Managers.getAssetsManager().arrayBuffers[b], function onSuccess(buffer) {
                DMAF.Managers.getAssetsManager().loadedSounds[b] = buffer;
                callback.apply(context, [buffer]);
            }, function onError() {
                console.log("failed to decode audio data", DMAF.Managers.getAssetsManager().arrayBuffers[b]);
            });
            return;
        } else if (a !== undefined && !(a instanceof XMLHttpRequest)) {
            callback.apply(context, [a]);
        } else {
            if (this.loading) {
                this.pendingLoads.unshift({
                    path: DMAF.soundsPath + b + DMAF.fileFormat,
                    name: b
                });
                return;
            }
            this.loading = true;
            var c = new XMLHttpRequest();
            c.open("GET", DMAF.soundsPath + b + DMAF.fileFormat, true);
            c.responseType = "arraybuffer";
            c.name = b;
            c.onload = this.proceedLoadingQue;
            this.loadedSounds[b] = c;
            c.send();
            callback.apply(context, ["loading"]);
            return;
        }
    }
};
DMAF.Managers.AssetsManager.prototype.preloadSamples = function(a, c) {
    if (!a && typeof a !== "array") {
        return
    }

    function d(e) {
        var g = [];
        var f = e.length;
        for (var k = 0; k < f; k++) {
            for (var h = k + 1; h < f; h++) {
                if (e[k] === e[h]) {
                    h = ++k
                }
            }
            g.push(e[k])
        }
        return g
    }
    a = d(a);
    var b = this;
    this.preloadsInProgress++;
    (function() {
        var e = 0;
        var j = a.length;
        var f = c;
        var l = function() {
            if (e === j) {
                DMAF.getCore().dispatch("loadComplete_" + f);
                b.preloadsInProgress--
            }
        };
        var h = function(m) {
            if (m) {
                b.proceedLoadingQue(m);
                var n = function() {
                    if (b.loadedSounds[m.target.name]) {
                        var o = b.loadedSounds[m.target.name].getChannelData === undefined ? false : true;
                        return o
                    } else {
                        return true
                    }
                };
                var i = function() {
                    if (n()) {
                        e++;
                        l()
                    } else {
                        setTimeout(i, 20)
                    }
                };
                i();
                return
            }
            e++;
            l()
        };
        for (var g = 0; g < j; g++) {
            if (DMAF.Managers.getAssetsManager().loadedSounds[a[g]] === undefined) {
                var k = new XMLHttpRequest();
                k.open("GET", DMAF.soundsPath + a[g] + DMAF.fileFormat, true);
                k.responseType = "arraybuffer";
                k.name = a[g];
                k.onload = h;
                b.loadedSounds[a[g]] = k;
                k.send()
            } else {
                if (DMAF.Managers.getAssetsManager().loadedSounds[a[g]] instanceof XMLHttpRequest) {
                    DMAF.Managers.getAssetsManager().loadedSounds[a[g]].onreadystatechange = (function() {
                        return function(i) {
                            if (i.target.readyState === 4 && i.target.status > 199 && i.target.status < 305) {
                                h(i)
                            }
                        }
                    })()
                } else {
                    h()
                }
            }
        }
    }())
};
DMAF.Managers.AudioBusManager = function() {
    this.activeAudioBusInstances = {}
};
DMAF.Managers.AudioBusManager.prototype.addAudioBusInstance = function(a) {
    if (!this.activeAudioBusInstances[a.instanceId]) {
        this.activeAudioBusInstances[a.instanceId] = a
    }
};
DMAF.Managers.AudioBusManager.prototype.removeAudioBusInstance = function(a) {
    if (this.activeAudioBusInstances[a]) {
        delete this.activeAudioBusInstances[a]
    }
};
DMAF.Managers.AudioBusManager.prototype.getAudioBusInstance = function(a) {
    if (this.activeAudioBusInstances[a]) {
        return this.activeAudioBusInstances[a]
    } else {
        return false
    }
};
DMAF.Managers.getActionManager = function() {
    if (!DMAF.ActionManager) {
        DMAF.ActionManager = new DMAF.Managers.ActionManager()
    }
    return DMAF.ActionManager
};
DMAF.Managers.getSoundManager = function() {
    if (!DMAF.SoundManager) {
        DMAF.SoundManager = new DMAF.Managers.SoundManager()
    }
    return DMAF.SoundManager
};
DMAF.Managers.getSynthManager = function() {
    if (!DMAF.SynthManager) {
        DMAF.SynthManager = new DMAF.Managers.SynthManager()
    }
    return DMAF.SynthManager
};
DMAF.Managers.getAssetsManager = function() {
    if (!DMAF.AssetsManager) {
        DMAF.AssetsManager = new DMAF.Managers.AssetsManager()
    }
    return DMAF.AssetsManager
};
DMAF.Managers.getAudioBusManager = function() {
    if (!DMAF.AudioBusManager) {
        DMAF.AudioBusManager = new DMAF.Managers.AudioBusManager()
    }
    return DMAF.AudioBusManager
};
DMAF.Managers.parseActionXML = function(t) {
    var d, g, I, H, G, e, w, n, f = t.getElementsByTagName("sound");
    for (H = 0; H < f.length; H++) {
        d = f[H].getAttribute("action");
        n = f[H];
        switch (d) {
            case "SOUNDGENERIC_PLAY":
                e = n.getAttribute("triggers");
                w = e.split(",");
                for (I = 0; I < w.length; I++) {
                    g = {
                        soundId: n.getElementsByTagName("soundId")[0].textContent,
                        soundFile: n.getElementsByTagName("soundFile")[0].textContent,
                        volume: parseInt(n.getElementsByTagName("volume")[0].textContent, 10),
                        pan: parseInt(n.getElementsByTagName("pan")[0].textContent, 10),
                        preListen: parseInt(n.getElementsByTagName("preListen")[0].textContent, 10),
                        reTrig: isNaN(parseInt(n.getElementsByTagName("reTrig")[0].textContent, 10)) ? n.getElementsByTagName("reTrig")[0].textContent : parseInt(n.getElementsByTagName("reTrig")[0].textContent, 10),
                        softLoop: n.getElementsByTagName("softLoop")[0].textContent,
                        loopLength: parseInt(n.getElementsByTagName("loopLength")[0].textContent, 10),
                        bus: n.getElementsByTagName("bus")[0].textContent,
                        delay: parseInt(n.getElementsByTagName("delay")[0].textContent, 10),
                        priority: parseInt(n.getElementsByTagName("priority")[0].textContent, 10),
                        timingCorrection: n.getElementsByTagName("timingCorrection")[0].textContent,
                        trigger: w[I]
                    };
                    d = DMAF.Factories.getSoundActionFactory().create("SOUNDGENERIC_PLAY", g);
                    DMAF.Managers.getActionManager().addTrigger(w[I], d)
                }
                break;
            case "SOUNDSTEP_PLAY":
                e = n.getAttribute("triggers");
                w = e.split(",");
                for (I = 0; I < w.length; I++) {
                    var v = [],
                        x = n.getElementsByTagName("soundFiles")[0],
                        C = x.getElementsByTagName("sound");
                    for (G = 0; G < C.length; G++) {
                        v.push(C[G].textContent)
                    }
                    g = {
                        soundId: n.getElementsByTagName("soundId")[0].textContent,
                        soundFiles: v,
                        volume: parseInt(n.getElementsByTagName("volume")[0].textContent, 10),
                        preListen: parseInt(n.getElementsByTagName("preListen")[0].textContent, 10),
                        reTrig: isNaN(parseInt(n.getElementsByTagName("reTrig")[0].textContent, 10)) ? n.getElementsByTagName("reTrig")[0].textContent : parseInt(n.getElementsByTagName("reTrig")[0].textContent, 10),
                        iterator: n.getElementsByTagName("generator")[0].textContent,
                        priority: parseInt(n.getElementsByTagName("priority")[0].textContent, 10),
                        timingCorrection: n.getElementsByTagName("timingCorrection")[0].textContent,
                        trigger: w[I],
                        bus: n.getElementsByTagName("bus")[0].textContent,
                        pan: parseInt(n.getElementsByTagName("pan")[0].textContent, 10),
                        loopLength: parseInt(n.getElementsByTagName("loopLength")[0].textContent, 10),
                        delay: parseInt(n.getElementsByTagName("delay")[0].textContent, 10)
                    };
                    d = DMAF.Factories.getSoundActionFactory().create("SOUNDSTEP_PLAY", g);
                    DMAF.Managers.getActionManager().addTrigger(w[I], d)
                }
                break;
            case "SOUNDBASIC_PLAY":
                e = n.getAttribute("triggers");
                w = e.split(",");
                for (I = 0; I < w.length; I++) {
                    g = {
                        soundId: n.getElementsByTagName("soundId")[0].textContent,
                        file: n.getElementsByTagName("soundFile")[0].textContent,
                        volume: parseInt(n.getElementsByTagName("volume")[0].textContent, 10),
                        pan: parseInt(n.getElementsByTagName("pan")[0].textContent, 10),
                        preListen: parseInt(n.getElementsByTagName("preListen")[0].textContent, 10),
                        timingCorrection: n.getElementsByTagName("timingCorrection")[0].textContent,
                        priority: parseInt(n.getElementsByTagName("priority")[0].textContent, 10),
                        trigger: w[I],
                        bus: n.getElementsByTagName("bus")[0].textContent
                    };
                    d = DMAF.Factories.getSoundActionFactory().create("SOUNDBASIC_PLAY", g);
                    DMAF.Managers.getActionManager().addTrigger(w[I], d)
                }
                break;
            case "SOUND_STOP":
                e = n.getAttribute("triggers");
                w = e.split(",");
                for (I = 0; I < w.length; I++) {
                    var A = [],
                        u, p;
                    p = n.getElementsByTagName("targets")[0];
                    if (!p) {
                        u = n.getElementsByTagName("target")
                    } else {
                        u = p.getElementsByTagName("target")
                    }
                    u = p.getElementsByTagName("target");
                    for (G = 0; G < u.length; G++) {
                        A.push(u[G].textContent)
                    }
                    if (A.length > 0) {
                        g = {
                            targets: A,
                            delay: parseInt(n.getElementsByTagName("delay")[0].textContent, 10),
                            trigger: w[I]
                        }
                    } else {
                        g = {
                            target: n.getElementsByTagName("target")[0].textContent,
                            delay: parseInt(n.getElementsByTagName("delay")[0].textContent, 10),
                            trigger: w[I]
                        }
                    }
                    d = DMAF.Factories.getSoundActionFactory().create("SOUND_STOP", g);
                    DMAF.Managers.getActionManager().addTrigger(w[I], d)
                }
                break;
            case "GUITAR_CREATE":
                e = n.getAttribute("triggers");
                w = e.split(",");
                for (I = 0; I < w.length; I++) {
                    var m = n.getElementsByTagName("stringModes")[0];
                    var D = m.getElementsByTagName("sampleMapGroup");
                    var B = {};
                    for (var r = 0; r < D.length; ++r) {
                        var E = D[r].getAttribute("id");
                        var q = E.split("_")[1];
                        if (!B[q]) {
                            B[q] = {};
                            B[q].maps = {}
                        }
                        var L = D[r].getElementsByTagName("sampleMap");
                        for (var N = 0; N < L.length; ++N) {
                            var b = parseInt(L[N].getElementsByTagName("velocityLow")[0].textContent, 10) || 0;
                            var F = parseInt(L[N].getElementsByTagName("velocityHigh")[0].textContent, 10) || 127;
                            B[q].maps[L[N].getElementsByTagName("sampleMapName")[0].textContent] = {
                                velocityLow: b,
                                velocityHigh: F,
                                style: E.split("_")[0]
                            }
                        }
                    }
                    var K = DMAF.Managers.parseEffectsXML(n.getElementsByTagName("effects")[0]);
                    var l = n.getElementsByTagName("bus")[0];
                    g = {
                        effects: K,
                        stringMaps: B,
                        instanceId: n.getElementsByTagName("instanceId")[0].textContent,
                        bus: l ? l.textContent : undefined,
                        ignoreNoteEnd: n.getElementsByTagName("ignoreNoteEnd")[0].textContent === "true" ? true : false,
                        ampAttackTime: parseInt(n.getElementsByTagName("ampAttackTime")[0].textContent, 10),
                        ampDecayTime: parseInt(n.getElementsByTagName("ampDecayTime")[0].textContent, 10),
                        ampReleaseTime: parseInt(n.getElementsByTagName("ampReleaseTime")[0].textContent, 10),
                        ampSustainLevel: parseFloat(n.getElementsByTagName("ampSustainLevel")[0].textContent),
                        ampVelocityRatio: parseFloat(n.getElementsByTagName("ampVelocityRatio")[0].textContent),
                        loop: n.getElementsByTagName("loop")[0].textContent === "true" ? true : false,
                        filterOn: n.getElementsByTagName("filterOn")[0].textContent === "true" ? true : false,
                        filterAttackTime: parseInt(n.getElementsByTagName("filterAttackTime")[0].textContent, 10),
                        filterDecayTime: parseInt(n.getElementsByTagName("filterDecayTime")[0].textContent, 10),
                        filterReleaseTime: parseInt(n.getElementsByTagName("filterReleaseTime")[0].textContent, 10),
                        filterADSRAmount: parseFloat(n.getElementsByTagName("filterADSRAmount")[0].textContent),
                        filterSustainLevel: parseFloat(n.getElementsByTagName("filterSustainLevel")[0].textContent),
                        filterVelocityRatio: parseFloat(n.getElementsByTagName("filterVelocityRatio")[0].textContent),
                        filterQ: parseFloat(n.getElementsByTagName("filterQ")[0].textContent),
                        filterGain: parseFloat(n.getElementsByTagName("filterGain")[0].textContent),
                        filterFrequency: parseFloat(n.getElementsByTagName("filterFrequency")[0].textContent),
                        volume: parseInt(n.getElementsByTagName("volume")[0].textContent, 10),
                    };
                    if (g.bus === undefined) {
                        g.bus = "master"
                    }
                    d = DMAF.Factories.getSynthActionFactory().create("GUITAR_CREATE", g);
                    DMAF.Managers.getActionManager().addTrigger(w[I], d)
                }
                break;
            case "DRUMS_CREATE":
                e = n.getAttribute("triggers");
                w = e.split(",");
                for (I = 0; I < w.length; I++) {
                    var h = {},
                        D;
                    D = n.getElementsByTagName("sampleMap");
                    for (G = 0; G < D.length; G++) {
                        var b = parseInt(D[G].getElementsByTagName("velocityLow")[0].textContent, 10) || 0;
                        var F = parseInt(D[G].getElementsByTagName("velocityHigh")[0].textContent, 10) || 127;
                        h[D[G].getElementsByTagName("sampleMapName")[0].textContent] = {
                            velocityLow: b,
                            velocityHigh: F
                        }
                    }
                    var l = n.getElementsByTagName("bus")[0];
                    g = {
                        sampleMaps: h,
                        effects: K,
                        instanceId: n.getElementsByTagName("instanceId")[0].textContent,
                        bus: l ? l.textContent : undefined,
                        ignoreNoteEnd: n.getElementsByTagName("ignoreNoteEnd")[0].textContent === "true" ? true : false,
                        ampAttackTime: parseInt(n.getElementsByTagName("ampAttackTime")[0].textContent, 10),
                        ampDecayTime: parseInt(n.getElementsByTagName("ampDecayTime")[0].textContent, 10),
                        ampReleaseTime: parseInt(n.getElementsByTagName("ampReleaseTime")[0].textContent, 10),
                        ampSustainLevel: parseFloat(n.getElementsByTagName("ampSustainLevel")[0].textContent),
                        ampVelocityRatio: parseFloat(n.getElementsByTagName("ampVelocityRatio")[0].textContent),
                        loop: n.getElementsByTagName("loop")[0].textContent === "true" ? true : false,
                        filterOn: n.getElementsByTagName("filterOn")[0].textContent === "true" ? true : false,
                        filterAttackTime: parseInt(n.getElementsByTagName("filterAttackTime")[0].textContent, 10),
                        filterDecayTime: parseInt(n.getElementsByTagName("filterDecayTime")[0].textContent, 10),
                        filterReleaseTime: parseInt(n.getElementsByTagName("filterReleaseTime")[0].textContent, 10),
                        filterADSRAmount: parseFloat(n.getElementsByTagName("filterADSRAmount")[0].textContent),
                        filterSustainLevel: parseFloat(n.getElementsByTagName("filterSustainLevel")[0].textContent),
                        filterVelocityRatio: parseFloat(n.getElementsByTagName("filterVelocityRatio")[0].textContent),
                        filterQ: parseFloat(n.getElementsByTagName("filterQ")[0].textContent),
                        filterGain: parseFloat(n.getElementsByTagName("filterGain")[0].textContent),
                        filterFrequency: parseFloat(n.getElementsByTagName("filterFrequency")[0].textContent),
                        volume: parseInt(n.getElementsByTagName("volume")[0].textContent, 10),
                    };
                    if (g.bus === undefined) {
                        g.bus = "master"
                    }
                    d = DMAF.Factories.getSynthActionFactory().create("DRUMS_CREATE", g);
                    DMAF.Managers.getActionManager().addTrigger(w[I], d)
                }
                break;
            case "SYNTH_CREATE":
                e = n.getAttribute("triggers");
                w = e.split(",");
                for (I = 0; I < w.length; I++) {
                    var h = {},
                        D;
                    D = n.getElementsByTagName("sampleMap");
                    for (G = 0; G < D.length; G++) {
                        var b = parseInt(D[G].getElementsByTagName("velocityLow")[0].textContent, 10) || 0;
                        var F = parseInt(D[G].getElementsByTagName("velocityHigh")[0].textContent, 10) || 127;
                        var s = D[G].getElementsByTagName("sampleMapName")[0].textContent;
                        if (s !== "") {
                            h[s] = {
                                velocityLow: b,
                                velocityHigh: F
                            }
                        } else {
                            h[n.getElementsByTagName("instanceId")[0].textContent] = {
                                velocityLow: b,
                                velocityHigh: F
                            }
                        }
                    }
                    var K = DMAF.Managers.parseEffectsXML(n.getElementsByTagName("effects")[0]);
                    var l = n.getElementsByTagName("bus")[0];
                    g = {
                        sampleMaps: h,
                        effects: K,
                        instanceId: n.getElementsByTagName("instanceId")[0].textContent,
                        bus: l ? l.textContent : undefined,
                        ignoreNoteEnd: n.getElementsByTagName("ignoreNoteEnd")[0].textContent === "true" ? true : false,
                        ampAttackTime: parseInt(n.getElementsByTagName("ampAttackTime")[0].textContent, 10),
                        ampDecayTime: parseInt(n.getElementsByTagName("ampDecayTime")[0].textContent, 10),
                        ampReleaseTime: parseInt(n.getElementsByTagName("ampReleaseTime")[0].textContent, 10),
                        ampSustainLevel: parseFloat(n.getElementsByTagName("ampSustainLevel")[0].textContent),
                        ampVelocityRatio: parseFloat(n.getElementsByTagName("ampVelocityRatio")[0].textContent),
                        loop: n.getElementsByTagName("loop")[0].textContent === "true" ? true : false,
                        filterOn: n.getElementsByTagName("filterOn")[0].textContent === "true" ? true : false,
                        filterAttackTime: parseInt(n.getElementsByTagName("filterAttackTime")[0].textContent, 10),
                        filterDecayTime: parseInt(n.getElementsByTagName("filterDecayTime")[0].textContent, 10),
                        filterReleaseTime: parseInt(n.getElementsByTagName("filterReleaseTime")[0].textContent, 10),
                        filterADSRAmount: parseFloat(n.getElementsByTagName("filterADSRAmount")[0].textContent),
                        filterSustainLevel: parseFloat(n.getElementsByTagName("filterSustainLevel")[0].textContent),
                        filterVelocityRatio: parseFloat(n.getElementsByTagName("filterVelocityRatio")[0].textContent),
                        filterQ: parseFloat(n.getElementsByTagName("filterQ")[0].textContent),
                        filterGain: parseFloat(n.getElementsByTagName("filterGain")[0].textContent),
                        filterFrequency: parseFloat(n.getElementsByTagName("filterFrequency")[0].textContent),
                        volume: parseInt(n.getElementsByTagName("volume")[0].textContent, 10),
                    };
                    if (g.bus === undefined) {
                        g.bus = "master"
                    }
                    d = DMAF.Factories.getSynthActionFactory().create("SYNTH_CREATE", g);
                    DMAF.Managers.getActionManager().addTrigger(w[I], d)
                }
                break;
            case "AUDIOBUS_CREATE":
                e = n.getAttribute("triggers");
                w = e.split(",");
                for (I = 0; I < w.length; I++) {
                    var K = DMAF.Managers.parseEffectsXML(n.getElementsByTagName("effects")[0]);
                    g = {
                        effects: K,
                        instanceId: n.getElementsByTagName("instanceId")[0].textContent,
                        output: n.getElementsByTagName("output")[0].textContent,
                        volume: n.getElementsByTagName("volume")[0].textContent,
                        pan: n.getElementsByTagName("pan")[0].textContent
                    };
                    if (g.output === undefined) {
                        g.output = "master"
                    }
                    d = DMAF.Factories.getAudioBusFactory().create("AUDIOBUS_CREATE", g);
                    DMAF.Managers.getActionManager().addTrigger(w[I], d)
                }
                break;
            default:
                if (f[H].getAttribute("action") !== undefined) {
                    DMAF.debug("could not find action: ", f[H])
                }
                break
        }
    }
    f = t.getElementsByTagName("processor");
    for (H = 0; H < f.length; H++) {
        d = f[H].getAttribute("action");
        n = f[H];
        switch (d) {
            case "TRANSFORM_CREATE":
                e = n.getAttribute("triggers");
                w = e.split(",");
                for (I = 0; I < w.length; I++) {
                    var A = [],
                        u, p;
                    p = n.getElementsByTagName("targets")[0];
                    if (p) {
                        u = p.getElementsByTagName("target");
                        for (G = 0; G < u.length; G++) {
                            A.push(u[G].textContent)
                        }
                    }
                    if (A.length) {
                        g = {
                            targetType: n.getElementsByTagName("targetType")[0].textContent,
                            targetParameter: n.getElementsByTagName("targetParameter")[0].textContent,
                            targets: A,
                            value: parseFloat(n.getElementsByTagName("value")[0].textContent),
                            ratio: parseFloat(n.getElementsByTagName("ratio")[0].textContent),
                            shape: n.getElementsByTagName("shape")[0].textContent,
                            duration: parseFloat(n.getElementsByTagName("duration")[0].textContent),
                            delay: parseFloat(n.getElementsByTagName("delay")[0].textContent),
                            trigger: w[I]
                        }
                    } else {
                        var a = n.getElementsByTagName("target")[0].textContent;
                        if (a == "multi") {
                            var z = n.getElementsByTagName("suffix")[0].textContent;
                            a = w[I].replace(z, "")
                        }
                        g = {
                            targetType: n.getElementsByTagName("targetType")[0].textContent,
                            targetParameter: n.getElementsByTagName("targetParameter")[0].textContent,
                            target: a,
                            value: parseFloat(n.getElementsByTagName("value")[0].textContent),
                            ratio: parseInt(n.getElementsByTagName("ratio")[0].textContent),
                            shape: n.getElementsByTagName("shape")[0].textContent,
                            duration: parseFloat(n.getElementsByTagName("duration")[0].textContent),
                            delay: parseFloat(n.getElementsByTagName("delay")[0].textContent),
                            trigger: w[I]
                        }
                    }
                    d = DMAF.Factories.getProcessorActionFactory().create("TRANSFORM_CREATE", g);
                    DMAF.Managers.getActionManager().addTrigger(w[I], d)
                }
                break;
            case "MACRO_CREATE":
                var J = n.getElementsByTagName("name")[0].textContent;
                var O = n.getElementsByTagName("initValue")[0].textContent;
                e = n.getAttribute("triggers");
                w = e.split(",");
                for (I = 0; I < w.length; I++) {
                    var y = n.getElementsByTagName("targets")[0];
                    var c = y.getElementsByTagName("target");
                    for (var M = 0; M < c.length; ++M) {
                        var o = c[M];
                        g = {
                            targetType: o.getElementsByTagName("targetType")[0].textContent,
                            targetId: o.getElementsByTagName("targetId")[0].textContent,
                            targetParameter: o.getElementsByTagName("targetParameter")[0].textContent,
                            transitionTime: o.getElementsByTagName("transitionTime")[0].textContent,
                            shape: o.getElementsByTagName("shape")[0].textContent,
                            transitionTime: o.getElementsByTagName("transitionTime")[0].textContent,
                            minValue: parseFloat(o.getElementsByTagName("minValue")[0].textContent),
                            maxValue: parseFloat(o.getElementsByTagName("maxValue")[0].textContent)
                        };
                        d = DMAF.Factories.getProcessorActionFactory().create("MACRO_CREATE", g);
                        DMAF.Managers.getActionManager().addTrigger(w[I], d)
                    }
                }
                break;
            default:
                if (n.getAttribute("action") !== undefined) {
                    DMAF.debug("could not find action: ", n)
                }
                break
        }
    }
    DMAF.actionsLoaded = true;
    DMAF.checkIfReady()
};
DMAF.Managers.parseSoundXML = function(b) {
    var c = b.getElementsByTagName("file"),
        a;
    for (a = 0; a < c.length; a++) {
        var e = c[a].getAttribute("name");
        var d = c[a].textContent;
        DMAF.Managers.getAssetsManager().initSound(d, e)
    }
};
DMAF.Managers.parseEffectsXML = function(g) {
    var c = [];
    if (g == undefined) {
        return c
    }
    var b = g.getElementsByTagName("effect");
    var h = [];
    for (var f = 0; f < b.length; ++f) {
        if (b[f].parentNode == g) {
            h.push(b[f])
        }
    }
    for (var a = 0; a < h.length; ++a) {
        var e = {};
        e.type = h[a].getAttribute("type");
        e.params = [];
        var j = h[a].getElementsByTagName("parameter");
        var d = [];
        for (var f = 0; f < j.length; ++f) {
            if (j[f].parentNode == h[a]) {
                d.push(j[f])
            }
        }
        for (var k = 0; k < d.length; ++k) {
            if (e.type == "FXGROUP" && d[k].getAttribute("name") == "innerEffects") {
                e.params.innerEffects = this.parseEffectsXML(d[k])
            } else {
                e.params[d[k].getAttribute("name")] = d[k].textContent
            }
        }
        c.push(e)
    }
    return c
};
DMAF.Processors.AbstractProcessor = function() {};
DMAF.Processors.activeTransforms = [];
DMAF.Processors.noTransformsInProgress = true;
DMAF.Processors.transformResolution = 1000 / 30;
DMAF.Processors.transformTimer = null;
DMAF.Processors.TransformProcessor = function(a) {
    DMAF.Processors.AbstractProcessor.call(this);
    this.targetType = a.targetType;
    this.targetParameter = a.targetParameter;
    this.target = a.target;
    this.value = a.value;
    this.shape = a.shape;
    this.ratio = a.ratio;
    this.duration = a.duration / 1000;
    this.delay = a.delay;
    this.type = "TRANSFORM_CREATE"
};
DMAF.Processors.TransformProcessor.prototype = new DMAF.Processors.AbstractProcessor();
DMAF.Processors.TransformProcessor.prototype.execute = function() {
    var d = DMAF.getDynamicValueRetriever().getTargetInstance(this.targetType + ":" + this.target);
    if (!d) {
        return
    }
    var b = this.targetParameter.split(":");
    if (b.length == 1) {
        if (this.shape === "linear") {
            d.setAutomatableProperty(b[0], this.value)
        } else {
            if (this.shape === "exponential") {
                d.setAutomatableProperty(b[0], this.value, this.duration)
            }
        }
    } else {
        var c = d.getAutomatableProperties(b[0]);
        for (var a = 1; a < b.length - 1; a++) {
            c = c.getAutomatableProperties(b[a])
        }
        if (this.shape === "linear") {
            c.setAutomatableProperty(b[b.length - 1], this.value)
        } else {
            if (this.shape === "exponential") {
                c.setAutomatableProperty(b[b.length - 1], this.value, this.duration)
            }
        }
    }
};
DMAF.Processors.processTransforms = function() {
    for (var c = DMAF.Processors.activeTransforms.length - 1; c >= 0; c--) {
        var b = DMAF.Processors.activeTransforms[c];
        if (b.endValue - b.startValue === 0) {
            DMAF.Processors.activeTransforms.splice(c, 1)
        }
        var a = b.startValue + ((b.endValue - b.startValue) * ((DMAF.context.currentTime * 1000 - b.startTime) / (b.endTime - b.startTime)));
        if ((b.endValue - b.startValue >= 0) && a > b.endValue) {
            if (b.that.targetParameter === "volume") {
                b.targetElement.setVolume(b.endValue)
            } else {
                b.targetElement[b.that.targetParameter] = b.endValue
            }
            DMAF.Processors.activeTransforms.splice(c, 1)
        } else {
            if ((b.endValue - b.startValue < 0) && a < b.endValue) {
                if (b.that.targetParameter === "volume") {
                    b.targetElement.setVolume(b.endValue)
                } else {
                    b.targetElement[b.that.targetParameter] = b.endValue
                }
                DMAF.Processors.activeTransforms.splice(c, 1)
            } else {
                if (b.that.targetParameter === "volume") {
                    b.targetElement.setVolume(a)
                } else {
                    b.targetElement[b.that.targetParameter] = a
                }
            }
        }
    }
    if (DMAF.Processors.activeTransforms.length <= 0) {
        clearInterval(DMAF.Processors.transformTimer);
        DMAF.Processors.noTransformsInProgress = true
    }
};
DMAF.Processors.MacroProcessor = function(a) {
    DMAF.Processors.AbstractProcessor.call(this);
    this.targetType = a.targetType;
    this.targetId = a.targetId;
    this.targetParameter = a.targetParameter;
    this.shape = a.shape;
    this.transitionTime = a.transitionTime;
    this.minValue = a.minValue;
    this.maxValue = a.maxValue;
    this.type = "MACRO_CREATE"
};
DMAF.Processors.MacroProcessor.prototype = new DMAF.Processors.AbstractProcessor();
DMAF.Processors.MacroProcessor.prototype.execute = function(d) {
    var e = DMAF.getDynamicValueRetriever().getTargetInstance(this.targetType + ":" + this.targetId);
    if (!e) {
        return
    }
    var b = this.targetParameter.split(":");
    var f = this.minValue + (this.maxValue - this.minValue) * d;
    if (b.length == 1) {
        if (this.shape === "linear") {
            e.setAutomatableProperty(b[0], f)
        } else {
            if (this.shape === "exponential") {
                e.setAutomatableProperty(b[0], f, this.transitionTime)
            }
        }
    } else {
        var c = e.getAutomatableProperties(b[0]);
        for (var a = 1; a < b.length - 1; a++) {
            c = c.getAutomatableProperties(b[a])
        }
        if (this.shape === "linear") {
            c.setAutomatableProperty(b[b.length - 1], f)
        } else {
            if (this.shape === "exponential") {
                c.setAutomatableProperty(b[b.length - 1], f, this.transitionTime)
            }
        }
    }
};
DMAF.Sounds.SoundAbstract = function(a) {
    EventDispatcher.call(this);
    this.soundManager = DMAF.Managers.getSoundManager();
    this.instanceId = a
};
DMAF.Sounds.SoundAbstract.prototype = new EventDispatcher();
DMAF.Sounds.SoundAbstract.prototype.constructor = DMAF.Sounds.AbstractSound;
DMAF.Sounds.SoundAbstract.prototype.stop = function() {
    this.sound.pause();
    DMAF.Managers.getSoundManager().removeActiveElement(this.sound.id);
    DMAF.Managers.getSoundManager().removeSoundInstance(this.soundId + "." + this.instanceId)
};
DMAF.Sounds.SoundAbstract.prototype.setVolume = function(b) {
    var a;
    if (typeof b == "number" && !isNaN(b)) {
        if (b < -46) {
            b = -46
        } else {
            if (b > 0) {
                b = 0
            }
        }
        this.volume = b;
        this.jsVolume = DMAF.Utils.dbToJSVolume(b + DMAF.masterVolume);
        if (this.sound) {
            this.sound.gainNode.gain.value = this.jsVolume
        } else {
            if (this.sounds) {
                for (a = 0; a < this.sounds.lentgh; a++) {
                    this.sounds[a].gainNode.gain.value = this.jsVolume
                }
            }
        }
    } else {
        this.jsVolume = DMAF.Utils.dbToJSVolume(this.volume + DMAF.masterVolume);
        if (this.sound) {
            this.sound.gainNode.gain.value = this.jsVolume
        } else {
            if (this.sounds) {
                for (a = 0; a < this.sounds.lentgh; a++) {
                    this.sounds[a].gainNode.gain.value = this.jsVolume
                }
            }
        }
    }
};
DMAF.Sounds.SoundGeneric = function(b) {
    DMAF.Sounds.SoundAbstract.call(this, b);
    this.sound = null;
    this.sounds = [];
    this.currentFile = "";
    this.soundLength = 0;
    this.loading = false;
    this.playing = false;
    this.currentPosition = 0;
    this.previousActionTime = 0;
    this.currentActionTime = 0;
    this.pendingPlayArray = [];
    this.pendingSoftLoopArr = [];
    var a = this
};
DMAF.Sounds.SoundGeneric.prototype = new DMAF.Sounds.SoundAbstract();
DMAF.Sounds.SoundGeneric.prototype.stop = function() {
    DMAF.Managers.getCheckTimeManager().dropPendingArray(this.pendingSoftLoopArr);
    this.playing = false;
    for (var a = this.sounds.length - 1; a >= 0; a--) {
        if (!this.sounds[a].stopped) {
            this.sounds[a].stop(0);
        }
        this.sounds[a].stopped = true;
        this.sounds.splice(a, 1)
    }
};
DMAF.Sounds.SoundGeneric.prototype.play = function(b) {
    if (this.loading) {
        return
    }
    var a = DMAF.Managers.getCheckTimeManager();
    a.dropPendingArray(this.pendingStopArray);
    if (this.sounds.length > 0) {
        if (this.reTrig === 0 || this.reTrig === "true") {
            a.dropPendingArray(this.pendingPlayArray)
        } else {
            if (typeof this.reTrig == "number" && this.reTrig > 0) {
                a.dropPendingArray(this.pendingPlayArray);
                if ((b - this.reTrig) > this.previousActionTime) {
                    this.previousActionTime = b
                } else {
                    return
                }
            } else {
                if (this.softLoop === true) {
                    this.previousActionTime = b
                } else {
                    return
                }
            }
        }
    } else {
        this.previousActionTime = b
    }
    a.checkFunctionTime(b, this.proceedPlay, this.pendingPlayArray, this)
};
DMAF.Sounds.SoundGeneric.prototype.onSoundEnded = function(b) {
    for (var a = this.sounds.length - 1; a >= 0; a--) {
        if (this.sounds[a].playbackState === 3) {
            this.sounds.splice(a, 1)
        }
    }
};
DMAF.Sounds.SoundGeneric.prototype.proceedPlay = function(a) {
    if (this.softLoop && this.timingCorrection === "PLAY") {
        DMAF.Managers.getCheckTimeManager().checkFunctionTime((DMAF.context.currentTime * 1000 + this.loopLength), this.play, this.pendingSoftLoopArr, this)
    } else {
        if (this.softLoop) {
            DMAF.Managers.getCheckTimeManager().checkFunctionTime((a + this.loopLength), this.play, this.pendingSoftLoopArr, this)
        }
    }
    DMAF.Managers.getAssetsManager().getSound(this.soundFile, this.doPlay, this);
};

DMAF.Sounds.SoundGeneric.prototype.doPlay = function(bufferSource) {
    this.sound = bufferSource;
    if (this.sound === false) {
        return;
    }
    this.sound.id = DMAF.Utils.createUID();
    DMAF.debug("generic sound " + this.sound.src + " id set to: " + this.sound.id);
    this.sound.parentInstance = this;
    this.sound.priority = this.priority;
    this.sound.gainNode.gain.value = this.jsVolume;
    this.sound.start(0);
    this.playing = true;
    this.sounds.push(this.sound);
    if (this.sound.buffer) {
        DMAF.Managers.getCheckTimeManager().checkFunctionTime((DMAF.context.currentTime * 1000) + (this.sound.buffer.duration * 1000) + 200, this.onSoundEnded, [], this)
    }
};
DMAF.Sounds.SoundStep = function(a) {
    DMAF.Sounds.SoundGeneric.call(this, a);
    this.sound = null;
    this.sounds = [];
    this.currentFile = "";
    this.soundLength = 0;
    this.playing = false;
    this.loading = false
};
DMAF.Sounds.SoundStep.prototype = new DMAF.Sounds.SoundGeneric();
DMAF.Sounds.SoundStep.prototype.getSoundFile = function() {
    var a = this.iterator.getNext();
    return a
};
DMAF.Sounds.SoundStep.prototype.stop = function() {
    DMAF.Managers.getCheckTimeManager().dropPendingArray(this.pendingSoftLoopArr);
    this.playing = false;
    for (var a = this.sounds.length - 1; a >= 0; a--) {
        this.sounds[a].stop(0);
        this.sounds.splice(a, 1)
    }
};
DMAF.Sounds.SoundStep.prototype.play = function(b) {
    var a = DMAF.Managers.getCheckTimeManager();
    a.dropPendingArray(this.pendingStopArray);
    if (this.sounds.length > 0) {
        if (this.reTrig === 0 || this.reTrig === "true") {
            a.dropPendingArray(this.pendingPlayArray)
        } else {
            if (typeof this.reTrig == "number" && this.reTrig > 0) {
                a.dropPendingArray(this.pendingPlayArray);
                if ((b - this.reTrig) > this.previousActionTime) {
                    this.previousActionTime = b
                } else {
                    return
                }
            } else {
                return
            }
        }
    } else {
        this.previousActionTime = b
    }
    a.checkFunctionTime(b, this.proceedPlay, this.pendingPlayArray, this)
};
DMAF.Sounds.SoundStep.prototype.proceedPlay = function(b) {
    this.currentFile = this.getSoundFile();
    DMAF.Managers.getAssetsManager().getSound(this.currentFile, this.doPlay, this);
}

DMAF.Sounds.SoundStep.prototype.doPlay = function(bufferSource) {
    this.sound = bufferSource;
    if (this.sound === false) {
        return
    }
    this.sound.id = DMAF.Utils.createUID();
    this.sound.parentInstance = this;
    this.sound.priority = this.priority;
    var c = this.soundManager.startSound(this.sound, this.jsVolume, b, this.timingCorrection, this.preListen);
    if (c) {
        this.playing = true;
        var a = this;
        this.sounds.push(this.sound)
    } else {
        DMAF.debug("DMAFError: couldn't start sound step (proceedplay)")
    }
};
DMAF.Sounds.SoundBasic = function(b) {
    DMAF.Sounds.SoundAbstract.call(this, b);
    this.sound = null;
    this.file = "";
    this.soundLength = 0;
    this.preListen = 0;
    this.playStartPosition = 0;
    this.timingCorrection = "PLAY";
    this.loading = false;
    var a = this
};
DMAF.Sounds.SoundBasic.prototype = new DMAF.Sounds.SoundAbstract();
DMAF.Sounds.SoundBasic.prototype.play = function(d) {
    if (this.loading) {
        return
    }
    var a = DMAF.Managers.getCheckTimeManager();
    a.dropPendingArray(this.pendingStopArray);
    DMAF.Managers.getAssetsManager().getSound(this.file, this.doPlay, this);
}

DMAF.Sounds.SoundBasic.prototype.doPlay = function(bufferSource) {
    this.sound = bufferSource;
    if (this.sound === false) {
        return
    }
    if (this.sound.ended || this.sound.readyState === 4) {
        this.currentFile = this.sound.src;
        this.soundLength = this.sound.duration;
        this.previousActionTime = d;
        a.checkFunctionTime(d, this.proceedPlay, this.pendingPlayArray, this)
    } else {
        this.loading = true;
        var c = this;
        var b = function(f) {
            c.loading = false;
            f.target.removeEventListener("canplaythrough", b, false);
            if (!c.sound) {
                DMAF.debug("DMAFWarning: error fetching sound element: " + c.currentFile)
            }
            c.previousActionTime = d;
            a.checkFunctionTime(d, c.proceedPlay, c.pendingPlayArray, c)
        };
        this.sound.addEventListener("canplaythrough", b, false)
    }
};
DMAF.Sounds.SoundBasic.prototype.onSoundEnded = function(b) {
    var a = b.target.parentInstance;
    DMAF.Managers.getSoundManager().removeActiveElement(b.target.id);
    a.sound.removeEventListener("ended", a.onSoundEnded);
    a.sound = null;
    a.dispatch("finished")
};
DMAF.Sounds.SoundBasic.prototype.proceedPlay = function(a) {
    this.sound.id = DMAF.Utils.createUID();
    this.sound.parentInstance = this;
    this.sound.priority = this.priority;
    this.sound.addEventListener("ended", this.onSoundEnded);
    var b = DMAF.Managers.getSoundManager().startSound(this.sound, this.jsVolume, a, this.timingCorrection);
    if (!b) {
        console.error("Is the following function implemented? CHECK ME.");
        onEnded()
    }
};
DMAF.AudioBus = function(a) {
    this.instanceId = a.instanceId;
    this.outputBus = a.output;
    this.volume = a.volume;
    this.pan = a.pan;
    this.input = DMAF.context.createGain();
    this.output = DMAF.context.createGain();
    var b = this.input;
    this.effects = DMAF.createEffectsRecursive(this.input, a.effects);
    if (this.effects.length > 0) {
        b = this.effects[this.effects.length - 1].effectNode
    }
    b.connect(this.output);
    if (this.outputBus === "master") {
        this.output.connect(DMAF.context.master)
    } else {
        this.output.connect(DMAF.Managers.getAudioBusManager().getAudioBusInstance(this.outputBus).input)
    }
};
DMAF.AudioBus.prototype.getAutomatableProperties = function(a) {
    if (a.substring(0, 2) == "fx") {
        return this.effects[parseInt(a.substring(2))].effectNode
    }
};
DMAF.AudioBus.prototype.setAutomatableProperty = function(c, b, a) {
    if (a != null) {
        if (c === "volume") {
            this.output.gain.setTargetAtTime(parseFloat(b), DMAF.context.currentTime + a, a * 0.63)
        }
    } else {
        if (c === "volume") {
            this.output.gain.value = parseFloat(b)
        }
    }
};
DMAF.Actions.AudioBusCreate = function(a) {
    this.instanceId = a.instanceId;
    this.properties = a
};
DMAF.Actions.AudioBusCreate.prototype.execute = function(b) {
    var a = DMAF.Managers.getAudioBusManager().getAudioBusInstance(this.instanceId);
    if (!a) {
        a = new DMAF.AudioBus(this.properties);
        DMAF.Managers.getAudioBusManager().addAudioBusInstance(a)
    }
};
DMAF.Synth.SynthNote = function(b, e, c, d) {
    this.ampAttack = 0;
    this.ampDecay = 0.01;
    this.ampSustain = 1;
    this.ampRelease = 0.01;
    this.ampVelocityRatio = 1;
    this.velocity = 1;
    this.filterOn = false;
    this.filterAttack = 0;
    this.filterRelease = 0.01;
    this.filterDecay = 0.01;
    this.filterSustain = 1;
    this.filterFrequency = 0;
    this.filterADSRAmount = 1;
    this.filterVelocityRatio = 0;
    this.q = 0;
    this.filterGain = 0;
    this.filterType = "lowpass";
    this.midiNote = 64;
    this.stopped = false;
    if (d !== undefined) {
        this.sampleGain = d
    }
    if (e) {
        if (e.ampAttack !== undefined) {
            this.ampAttack = e.ampAttack
        }
        if (e.ampDecay !== undefined) {
            this.ampDecay = e.ampDecay;
            this.ampDecay = Math.max(this.ampDecay, 0.01)
        }
        if (e.ampSustain !== undefined) {
            this.ampSustain = e.ampSustain
        }
        if (e.ampRelease !== undefined) {
            this.ampRelease = e.ampRelease;
            this.ampRelease = Math.max(this.ampRelease, 0.01)
        }
        if (e.ampVelocityRatio !== undefined) {
            this.ampVelocityRatio = e.ampVelocityRatio
        }
        if (e.velocity !== undefined) {
            this.velocity = e.velocity
        }
        if (e.midiNote !== undefined) {
            this.midiNote = e.midiNote
        }
        if (e.filterAttackTime !== undefined) {
            this.filterAttack = e.filterAttackTime
        }
        if (e.filterDecayTime !== undefined) {
            this.filterDecay = e.filterDecayTime;
            this.filterDecay = Math.max(this.filterDecay, 0.01)
        }
        if (e.filterSustainLevel !== undefined) {
            this.filterSustain = e.filterSustainLevel
        }
        if (e.filterReleaseTime !== undefined) {
            this.filterRelease = e.filterReleaseTime;
            this.filterRelease = Math.max(this.filterRelease, 0.01)
        }
        if (e.filterFrequency !== undefined) {
            this.filterFrequency = e.filterFrequency
        }
        if (e.filterADSRAmount !== undefined) {
            this.filterADSRAmount = e.filterADSRAmount
        }
        if (e.filterVelocityRatio !== undefined) {
            this.filterVelocityRatio = e.filterVelocityRatio
        }
        if (e.q !== undefined) {
            this.q = e.q
        }
        if (e.filterType !== undefined) {
            this.filterType = e.filterType
        }
        if (e.midiNote !== undefined) {
            this.midiNote = e.midiNote
        }
        if (e.filterOn !== undefined) {
            this.filterOn = e.filterOn
        }
        if (e.filterGain !== undefined) {
            this.filterGain = e.filterGain
        }
    }
    this.ampAttackConstant = this.ampAttack / 1.4;
    this.ampDecayConstant = this.ampDecay / 1.4;
    this.ampReleaseConstant = this.ampRelease / 1.4;
    this.filterAttackConstant = this.filterAttack / 1.4;
    this.filterDecayConstant = this.filterDecay / 1.4;
    this.filterReleaseConstant = this.filterRelease / 1.4;
    this.filterSustain = Math.pow(this.filterSustain, 4);
    this.oscillator = DMAF.context.createBufferSource();
    this.oscillator.buffer = b;
    if (e.loop === true) {
        this.oscillator.loop = true
    }
    this.ampADSR = DMAF.context.createGain();
    this.ampADSR.gain.value = 0;
    if (e.filterOn) {
        var a = DMAF.Utils.MIDIToFrequency((this.filterFrequency * 12) + this.midiNote);
        this.filter = new DMAF.AudioNodes.Filter(this.filterType, {
            frequency: a,
            q: this.q,
            gain: this.filterGain
        });
        this.oscillator.connect(this.filter.input);
        this.filter.connect(this.ampADSR);
        if (c) {
            this.ampADSR.connect(c)
        } else {
            this.ampADSR.connect(DMAF.context.output)
        }
    } else {
        this.oscillator.connect(this.ampADSR);
        if (c) {
            this.ampADSR.connect(c)
        } else {
            this.ampADSR.connect(DMAF.context.output)
        }
    }
};
DMAF.Synth.SynthNote.prototype.play = function(c) {
    var f = c + this.ampAttack,
        i = 1 - this.ampVelocityRatio + this.velocity * this.ampVelocityRatio;
    i *= this.sampleGain;
    var g = Math.pow((this.ampSustain * i), 2),
        h = c + this.filterAttack,
        b = 1 - this.filterVelocityRatio + this.velocity * this.filterVelocityRatio,
        d = this.filterADSRAmount * b,
        a = this.filterFrequency + d,
        e = this.filterFrequency + (this.filterSustain * d);
    a = DMAF.Utils.MIDIToFrequency((a * 12) + this.midiNote);
    e = DMAF.Utils.MIDIToFrequency((e * 12) + this.midiNote);
    this.filterFrequency = DMAF.Utils.MIDIToFrequency((this.filterFrequency * 12) + this.midiNote);
    if (this.filterOn) {
        if (a < this.filter.frequency.value) {
            a = this.filter.frequency.value
        }
    }
    a = Math.max(a, 20);
    a = Math.min(a, 20000);
    e = Math.max(e, 20);
    e = Math.min(e, 20000);
    if (this.ampAttack > 0) {
        this.ampADSR.gain.cancelScheduledValues(c);
        this.ampADSR.gain.setTargetAtTime(i, c, this.ampAttackConstant)
    } else {
        this.ampADSR.gain.cancelScheduledValues(c);
        this.ampADSR.gain.value = i;
        this.ampADSR.gain.setValueAtTime(i, c)
    }
    if (this.ampSustain < 1) {
        if (this.ampAttack > 0) {
            this.ampADSR.gain.cancelScheduledValues(f);
            this.ampADSR.gain.setTargetAtTime(g, f, this.ampDecayConstant)
        } else {
            this.ampADSR.gain.setTargetAtTime(g, f, this.ampDecayConstant)
        }
    }
    if (this.filterOn) {
        if (this.filterAttack > 0) {
            this.filter.frequency.cancelScheduledValues(c);
            this.filter.frequency.setTargetAtTime(a, c, this.filterAttackConstant)
        } else {
            this.filter.frequency.cancelScheduledValues(c);
            this.filter.frequency.value = a;
            this.filter.frequency.setValueAtTime(a, c)
        }
        if (this.filterSustain < 1) {
            if (this.filterAttack > 0) {
                this.filter.frequency.cancelScheduledValues(h);
                this.filter.frequency.setTargetAtTime(e, h, this.filterDecayConstant)
            } else {
                this.filter.frequency.setTargetAtTime(e, h, this.filterDecayConstant)
            }
        }
    } else {} if (this.endTime) {
        this.ampADSR.gain.cancelScheduledValues(this.endTime);
        this.ampADSR.gain.setTargetAtTime(0, this.endTime, this.ampReleaseConstant);
        if (this.filterOn) {
            this.filter.frequency.cancelScheduledValues(this.endTime);
            this.filter.frequency.setTargetAtTime(this.filterFrequency, this.endTime, this.filterReleaseConstant)
        }
    }
    this.oscillator.start(c)
};
DMAF.Synth.SynthNote.prototype.stop = function(b, a) {
    if (this.stopped) {
        return;
    }
    this.stopped = true;
    this.oscillator.stop(b + (this.ampRelease * 8));
    if (a) {
        this.ampADSR.gain.cancelScheduledValues(b);
        this.ampADSR.gain.setTargetAtTime(0, b, this.ampReleaseConstant);
        if (this.filterOn) {
            this.filter.frequency.cancelScheduledValues(b);
            this.filter.frequency.setTargetAtTime(this.filterFrequency, b, this.filterReleaseConstant)
        }
    }
};
DMAF.Synth.SynthInstance = function(d) {
    this.ampAttackTime = d.ampAttackTime / 1000 || 0;
    this.ampReleaseTime = d.ampReleaseTime / 1000 || 0;
    this.ampDecayTime = d.ampDecayTime / 1000 || 0;
    this.ampSustainLevel = d.ampSustainLevel !== undefined ? d.ampSustainLevel : 1;
    this.ampVelocityRatio = d.ampVelocityRatio !== undefined ? d.ampVelocityRatio : 1;
    this.filterAttackTime = d.filterAttackTime / 1000 || 0;
    this.filterReleaseTime = d.filterReleaseTime / 1000 || 0;
    this.filterDecayTime = d.filterDecayTime / 1000 || 0;
    this.filterSustainLevel = d.filterSustainLevel !== undefined ? d.filterSustainLevel : 1;
    this.filterFrequency = d.filterFrequency || 0;
    this.filterADSRAmount = d.filterADSRAmount !== undefined ? d.filterADSRAmount : 1;
    this.filterVelocityRatio = d.filterVelocityRatio || 0;
    this.filterType = 0;
    this.filterQ = d.filterQ || 0;
    this.filterGain = d.filterGain || 0;
    this.filterOn = d.filterOn;
    this.sampleMaps = d.sampleMaps;
    this.instanceId = d.instanceId;
    this.ignoreNoteEnd = d.ignoreNoteEnd;
    this.loop = d.loop;
    this.activeNotes = {};
    this.noteOnGuards = {};
    this.volume = DMAF.Utils.dbToWAVolume(d.volume);
    this.noteInput = DMAF.context.createGain();
    this.output = DMAF.context.createGain();
    if (d.output) {
        this.noteInput.connect(this.output);
        this.output.connect(d.output)
    } else {
        var e = this.noteInput;
        this.effects = DMAF.createEffectsRecursive(e, d.effects);
        if (this.effects.length > 0) {
            e = this.effects[this.effects.length - 1].effectNode
        }
        e.connect(this.output);
        if (d.bus === "master") {
            this.output.connect(DMAF.context.master)
        } else {
            this.output.connect(DMAF.Managers.getAudioBusManager().getAudioBusInstance(d.bus).input)
        }
    }
    this.isSustainOn = false;
    this.sustainNotes = [];
    var b, f, a;
    this.robinMemory = {};
    this.sampleMap = [];
    var c = [];
    for (f in this.sampleMaps) {
        if (f === "multi") {
            f = this.instanceId;
            this.sampleMaps[f] = this.sampleMaps.multi;
            delete this.sampleMaps.multi
        }
        this.robinMemory[f] = {};
        a = DMAF.Managers.getSynthManager().getSampleMap(f);
        for (b in a) {
            this.sampleMap.push(a[b]);
            c.push(a[b].sample)
        }
    }
    DMAF.Managers.getAssetsManager().preloadSamples(c, this.instanceId);
    DMAF.Managers.getCheckTimeManager().addFrameListener(this.instanceId, this.runDisposeCheck, this)
};
DMAF.Synth.SynthInstance.prototype.getAutomatableProperties = function(a) {
    if (a.substring(0, 2) == "fx") {
        return this.effects[parseInt(a.substring(2))].effectNode
    }
};
DMAF.Synth.SynthInstance.prototype.setAutomatableProperty = function(c, b, a) {
    if (a != null) {
        if (c === "volume") {
            this.output.gain.setTargetAtTime(parseFloat(b), DMAF.context.currentTime + a, a * 0.63)
        }
    } else {
        if (c === "volume") {
            this.output.gain.value = parseFloat(b)
        } else {
            if (c === "ampAttackTime") {
                this.ampAttackTime = parseFloat(b)
            } else {
                if (c === "ampDecayTime") {
                    this.ampDecayTime = parseFloat(b)
                } else {
                    if (c === "ampSustainLevel") {
                        this.ampSustainLevel = parseFloat(b)
                    } else {
                        if (c === "ampReleaseTime") {
                            this.ampReleaseTime = parseFloat(b)
                        } else {
                            if (c === "filterAttackTime") {
                                this.filterAttackTime = parseFloat(b)
                            } else {
                                if (c === "filterDecayTime") {
                                    this.filterDecayTime = parseFloat(b)
                                } else {
                                    if (c === "filterSustainLevel") {
                                        this.filterSustainLevel = parseFloat(b)
                                    } else {
                                        if (c === "filterReleaseTime") {
                                            this.filterReleaseTime = parseFloat(b)
                                        } else {
                                            if (c === "filterFrequency") {
                                                this.filterFrequency = parseFloat(b)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
DMAF.Synth.SynthInstance.prototype.play = function(b) {
    this.b = b;
    if (b.midiNote) {
        if (this.noteOnGuards[b.midiNote]) {
            this.stop(b)
        }
        this.noteOnGuards[b.midiNote] = true
    }
    var e;
    for (var s in this.sampleMaps) {
        if (this.sampleMaps[s].velocityLow <= b.velocity && b.velocity <= this.sampleMaps[s].velocityHigh) {
            if (b.style) {
                if (this.sampleMaps[s].style === b.style) {
                    this.sampleMap = DMAF.Managers.getSynthManager().getSampleMap(s);
                    e = s
                }
            } else {
                this.sampleMap = DMAF.Managers.getSynthManager().getSampleMap(s);
                e = s
            }
        }
    }
    if (e === null && b.style) {
        console.error("Found no sample map for velocity", b.velocity, "in instance", this.instanceId, "with style", b.style, ", data is", b, ", this.sampleMaps are", this.sampleMaps)
    }
    var k = [];
    this.o = [];
    this.f = [];
    for (var n in this.sampleMap) {
        if (this.sampleMap.hasOwnProperty(n)) {
            var l = this.sampleMap[n],
                c = DMAF.Utils.toMIDINote;
            if (b.midiNote >= c(l.lowEnd) && b.midiNote <= c(l.highEnd)) {
                k.push(l.sample);
                this.o.push(DMAF.Utils.MIDIToFrequency(DMAF.Utils.toMIDINote(l.baseNote)));
                if (l.sampleGain !== undefined) {
                    this.f.push(DMAF.Utils.dbToWAVolume(parseInt(l.sampleGain, 10)))
                } else {
                    this.f.push(1)
                }
            }
        }
    }
    this.m = {
            ampAttack: this.ampAttackTime,
            ampDecay: this.ampDecayTime,
            ampSustain: this.ampSustainLevel,
            ampRelease: this.ampReleaseTime,
            velocity: Math.pow(b.velocity / 127, 1.2),
            ampVelocityRatio: this.ampVelocityRatio,
            filterOn: this.filterOn,
            filterAttackTime: this.filterAttackTime,
            filterReleaseTime: this.filterReleaseTime,
            filterDecayTime: this.filterDecayTime,
            filterSustainLevel: this.filterSustainLevel,
            filterFrequency: this.filterFrequency,
            filterADSRAmount: this.filterADSRAmount,
            filterVelocityRatio: this.filterVelocityRatio,
            filterType: this.filterType,
            q: this.filterQ,
            filterGain: this.filterGain,
            midiNote: b.midiNote,
            loop: this.loop
        };
    this.a = DMAF.Utils.MIDIToFrequency(b.midiNote);
    if (k.length === 0) {
        return false
    }
    var q;
    this.i = 0;
    if (k.length === 1) {
        q = k[0]
    } else {
        if (this.robinMemory[e][b.midiNote] === undefined) {
            this.robinMemory[e][b.midiNote] = 0;
            q = k[0]
        } else {
            var h = this.robinMemory[e][b.midiNote];
            ++h;
            if (h === k.length) {
                h = 0
            }
            this.robinMemory[e][b.midiNote] = h;
            this.i = h;
            q = k[h]
        }
    }
    if (q !== undefined) {
        DMAF.Managers.getAssetsManager().getBuffer(q, this.doPlay, this);
    } else {
        DMAF.error("SAMPLE MAP ERROR: found no sample for: " + this.instanceId + " in sample map at midiNote: " + b.midiNote);
        return false
    }
}

DMAF.Synth.SynthInstance.prototype.doPlay = function(buffer) {
    var p = buffer;
    if (!p) {
        DMAF.error("MISSING FILE ERROR: found no sound file");
        return false
    } else {
        if (p === "loading") {
            DMAF.debug("TIMING ERROR: file is still loading");
            return false
        }
    }
    var d = new DMAF.Synth.SynthNote(p, this.m, this.noteInput, this.f[this.i]),
        g = p.length / DMAF.context.sampleRate;
    d.actionTime = this.b.actionTime / 1000;
    if (this.ignoreNoteEnd) {
        d.disposeTime = d.actionTime + g
    } else {
        if (this.loop) {
            d.disposeTime = d.actionTime + this.b.noteEndTime + (this.ampReleaseTime / 1000)
        } else {
            d.disposeTime = Math.min(d.actionTime + this.b.noteEndTime + (this.ampReleaseTime / 1000), d.actionTime + g)
        }
        d.endTime = d.disposeTime
    }
    d.oscillator.playbackRate.value = this.a / this.o[this.i];
    if (!this.activeNotes[this.b.midiNote]) {
        this.activeNotes[this.b.midiNote] = []
    }
    this.activeNotes[this.b.midiNote].push(d);
    this.sustainNotes.push(d);
    d.play(d.actionTime);
    d.stop(d.disposeTime);
    return true
};
DMAF.Synth.SynthInstance.prototype.stop = function(c) {
    if (c.midiNote) {
        delete this.noteOnGuards[c.midiNote]
    }
    if (this.isSustainOn) {
        for (var d = 0; d < this.sustainNotes.length; ++d) {
            if (c.midiNote === this.sustainNotes[d].midiNote) {
                return
            }
        }
    }
    if (this.ignoreNoteEnd) {
        return
    }
    var b;
    if (c.midiNote) {
        for (var a in this.activeNotes) {
            for (b = this.activeNotes[a].length - 1; b >= 0; b--) {
                if (this.activeNotes[a][b].midiNote && this.activeNotes[a][b].midiNote === c.midiNote) {
                    this.activeNotes[a][b].stop(c.actionTime / 1000 || DMAF.context.currentTime, true);
                    this.activeNotes[a].splice(b, 1);
                    return
                }
            }
        }
    } else {
        if (c.midiNote) {
            if (this.activeNotes[c.midiNote]) {
                for (b = this.activeNotes[c.midiNote].length - 1; b >= 0; b--) {
                    this.activeNotes[c.midiNote][b].stop(c.actionTime / 1000 || 0);
                    this.activeNotes[c.midiNote].splice(b, 1)
                }
            }
        }
    }
};
DMAF.Synth.SynthInstance.prototype.stopAll = function(c) {
    var b;
    for (var a in this.activeNotes) {
        for (b = this.activeNotes[a].length - 1; b >= 0; b--) {
            this.activeNotes[a][b].stop(DMAF.context.currentTime, true);
            this.activeNotes[a].splice(b, 1)
        }
    }
};
DMAF.Synth.SynthInstance.prototype.setLevel = function(b, a) {
    if (b === "reset") {
        this.output.gain.value = this.volume;
        return
    }
    if (a) {
        this.output.gain.value = DMAF.Utils.dbToWAVolume(b)
    } else {
        this.output.gain.value = b
    }
};
DMAF.Synth.SynthInstance.prototype.runDisposeCheck = function() {
    var a, d, b, c;
    a = DMAF.context.currentTime;
    for (d in this.activeNotes) {
        if (this.activeNotes.hasOwnProperty(d) && this.activeNotes[d] instanceof Array) {
            c = this.activeNotes[d].length;
            for (b = c - 1; b >= 0; b--) {
                if (this.activeNotes[d][b].disposeTime <= a) {
                    this.activeNotes[d].splice(b, 1)
                }
            }
        }
    }
};
DMAF.Synth.SynthInstance.prototype.setSustain = function(a) {
    this.isSustainOn = (a >= 64) ? true : false;
    if (!this.isSustainOn) {
        for (var b = 0; b < this.sustainNotes.length; ++b) {
            this.stop(this.sustainNotes[b])
        }
        this.sustainNotes = []
    }
};
DMAF.Synth.SynthInstance.prototype.handleControllerMessage = function(a) {
    switch (a.cc) {
        case 64:
            this.setSustain(a.value);
            break;
        default:
            console.log("Unknow controller message " + JSON.stringify(a))
    }
};
DMAF.Synth.SynthInstance.prototype.message = function(a) {
    switch (a.type) {
        case "noteOn":
            this.play(a);
            break;
        case "noteOff":
            this.stop(a);
            break;
        case "controller":
            this.handleControllerMessage(a);
            break;
        default:
            DMAF.debug("Message recieved in synth", a);
            break
    }
};
DMAF.Synth.GuitarInstance = function(e) {
    this.input = DMAF.context.createGain();
    this.output = DMAF.context.createGain();
    this.currentNotes = {};
    this.synths = {};
    this.instanceId = e.instanceId;
    var h = DMAF.Factories.getSynthInstanceFactory();
    for (var d in e.stringMaps) {
        var c = e;
        c.sampleMaps = e.stringMaps[d].maps;
        c.output = this.input;
        this.synths[d] = h.create("SYNTH", c)
    }
    var f = this.input;
    this.effects = DMAF.createEffectsRecursive(this.input, e.effects);
    if (this.effects.length > 0) {
        f = this.effects[this.effects.length - 1].effectNode
    }
    f.connect(this.output);
    this.setLevel(e.volume, true);
    if (e.bus === "master") {
        this.output.connect(DMAF.context.master)
    } else {
        this.output.connect(DMAF.Managers.getAudioBusManager().getAudioBusInstance(e.bus).input)
    }
    this.instanceId = e.instanceId;
    this.sampleMap = [];
    for (var d in e.stringMaps) {
        for (var g in e.stringMaps[d].maps) {
            var a = DMAF.Managers.getSynthManager().getSampleMap(g);
            for (var b in a) {
                this.sampleMap.push(a[b]);
                DMAF.Managers.getAssetsManager().getBuffer(a[b].sample)
            }
        }
    }
    DMAF.Managers.getCheckTimeManager().addFrameListener(this.instanceId, this.runDisposeCheck, this)
};
DMAF.Synth.GuitarInstance.prototype.getAutomatableProperties = function(a) {
    if (a.substring(0, 2) == "fx") {
        return this.effects[parseInt(a.substring(2))].effectNode
    }
};
DMAF.Synth.GuitarInstance.prototype.setAutomatableProperty = function(d, c, a) {
    if (d === "filterFrequency") {
        for (var b in this.synths) {
            this.synths[b].filterFrequency = parseFloat(c)
        }
    }
};
DMAF.createEffectsRecursive = function(c, f) {
    var g = DMAF.Factories.getEffectsFactory();
    var e = [];
    for (var a = 0; a < f.length; a++) {
        var d = f[a];
        var b = {};
        b.type = f[a].type;
        b.effectNode = g.create(d.type, d.params);
        if (b.type == "FXGROUP") {
            b.effectNode.innerEffects = this.createEffectsRecursive(b.effectNode.input, d.params.innerEffects);
            b.effectNode.init()
        }
        if (parseInt(d.params.active) == 1) {
            b.effectNode.activate(true)
        } else {
            b.effectNode.activate(false)
        }
        e.push(b);
        c.connect(b.effectNode.input);
        c = b.effectNode
    }
    return e
};
DMAF.Synth.GuitarInstance.prototype.play = function(g) {
    g.string = g.string || (g.channel + 1);
    g.type = "noteOn";
    var b = false,
        h;
    if (this.currentNotes[g.string]) {
        h = {
            type: "noteOff",
            midiNote: this.currentNotes[g.string].midiNote,
            string: g.string,
            actionTime: g.actionTime
        };
        b = true
    }
    var f = [];
    if (b) {
        f = ["legato", "normal", "muted", "damped"]
    } else {
        f = ["normal", "muted", "damped", "legato"]
    }
    for (var c in f) {
        if (!f.hasOwnProperty(c)) {
            continue
        }
        g.style = f[c];
        var a = this.synths[g.string].play(g);
        if (!a) {
            continue
        }
        if (h) {
            var e = DMAF.Processors.getMusicController().player.activePatterns;
            for (var d = 0; d < e.length; d++) {
                if (e[d].beatChannel === this.instanceId) {} else {
                    this.stop(h)
                }
            }
        }
        if (g.style === "normal" || g.style === "legato") {
            this.currentNotes[g.string] = {
                midiNote: g.midiNote
            }
        }
        break
    }
};
DMAF.Synth.GuitarInstance.prototype.stop = function(d) {
    d.string = d.string || (d.channel + 1);
    var c = ["normal", "legato", "damped", "muted"];
    for (var a in c) {
        if (!c.hasOwnProperty(a)) {
            continue
        }
        var b = c[a];
        if (!this.synths[d.string]) {
            continue
        }
        this.synths[d.string].stop(d)
    }
    delete this.currentNotes[d.string]
};
DMAF.Synth.GuitarInstance.prototype.stopAll = function(b) {
    for (var a in this.synths) {
        if (this.synths.hasOwnProperty(a)) {
            this.synths[a].stopAll()
        }
    }
};
DMAF.Synth.GuitarInstance.prototype.setLevel = function(c, b) {
    for (var a in this.synths) {
        if (this.synths.hasOwnProperty(a)) {
            this.synths[a].setLevel(c, b)
        }
    }
};
DMAF.Synth.GuitarInstance.prototype.runDisposeCheck = function() {
    for (var a in this.synths) {
        if (this.synths.hasOwnProperty(a)) {
            this.synths[a].runDisposeCheck()
        }
    }
};
DMAF.Synth.GuitarInstance.prototype.message = function(a) {
    switch (a.type) {
        case "noteOn":
            this.play(a);
            break;
        case "noteOff":
            this.stop(a);
            break;
        case "controller":
            this.play();
            break;
        default:
            DMAF.debug("Message recieved in synth", a);
            break
    }
};
DMAF.Synth.DrumsInstance = function(c) {
    this.sampleMaps = c.sampleMaps;
    this.currentNotes = {};
    var d = DMAF.Factories.getSynthInstanceFactory();
    this.synthInstance = d.create("SYNTH", c);
    this.instanceId = c.instanceId;
    this.setLevel(c.volume);
    var b, e, a;
    this.sampleMap = [];
    for (e in this.sampleMaps) {
        a = DMAF.Managers.getSynthManager().getSampleMap(e);
        for (b in a) {
            this.sampleMap.push(a[b]);
            DMAF.Managers.getAssetsManager().getBuffer(a[b].sample)
        }
    }
    DMAF.Managers.getCheckTimeManager().addFrameListener(this.instanceId, this.runDisposeCheck, this)
};
DMAF.Synth.DrumsInstance.prototype.getAutomatableProperties = function(a) {
    if (a.substring(0, 2) == "fx") {
        return this.synthInstance.effects[parseInt(a.substring(2))].effectNode
    }
};
DMAF.Synth.DrumsInstance.prototype.setAutomatableProperty = function(c, b, a) {
    if (c === "filterFrequency") {
        this.synthInstance.filterFrequency = parseFloat(b)
    }
};
DMAF.Synth.DrumsInstance.prototype.play = function(f) {
    for (var e in this.sampleMaps) {
        if (this.sampleMaps[e].velocityLow <= f.velocity && f.velocity <= this.sampleMaps[e].velocityHigh) {
            this.sampleMap = DMAF.Managers.getSynthManager().getSampleMap(e)
        }
    }
    for (var a in this.sampleMap) {}
    console.log("play " + f.midiNote);
    return;
    var c, b;
    if (f.style) {
        c = f.style;
        b = this.styleToNote(f.style);
        if (!b) {
            return
        }
    } else {
        if (f.midiNote) {
            b = f.midiNote;
            c = this.noteToStyle(f.midiNote);
            if (!c) {
                return
            }
        }
    }
    var d = {
        actionTime: f.actionTime,
        midiNote: b,
        velocity: f.velocity,
        type: "noteOn",
        noteEndTime: f.noteEndTime
    };
    if (this.currentNotes[c]) {
        this.stop({
            midiNote: this.currentNotes[c],
            style: c
        });
        delete this.currentNotes[c]
    }
    if (c.search("hihat") != -1) {
        if (this.currentNotes.hihat_open) {
            this.stop({
                midiNote: this.currentNotes.hihat_open,
                style: "hihat_open"
            });
            delete this.currentNotes.hihat_open
        }
        if (this.currentNotes.hihat_closed) {
            this.stop({
                midiNote: this.currentNotes.hihat_closed,
                style: "hihat_closed"
            });
            delete this.currentNotes.hihat_closed
        }
        if (this.currentNotes.hihat_half_open) {
            this.stop({
                midiNote: this.currentNotes.hihat_half_open,
                style: "hihat_half_open"
            });
            delete this.currentNotes.hihat_half_open
        }
        if (this.currentNotes.alt_hihat_closed) {
            this.stop({
                midiNote: this.currentNotes.alt_hihat_closed,
                style: "alt_hihat_closed"
            });
            delete this.currentNotes.alt_hihat_closed
        }
    }
    this.currentNotes[c] = f.midiNote;
    this.synthInstances[c].play(d)
};
DMAF.Synth.DrumsInstance.prototype.stop = function(c) {
    console.log("stop " + c.midiNote);
    return;
    var b = {
        midiNote: c.midiNote
    };
    var a = c.style;
    if (!a) {
        a = this.noteToStyle(c.midiNote)
    }
    this.synthInstances[a].stop(b)
};
DMAF.Synth.DrumsInstance.prototype.stopAll = function(b) {
    for (var a in this.synths) {
        if (this.synths.hasOwnProperty(a)) {
            this.synths[a].stopAll()
        }
    }
};
DMAF.Synth.DrumsInstance.prototype.setLevel = function(b, a) {
    this.synthInstance.setLevel(b, a)
};
DMAF.Synth.DrumsInstance.prototype.runDisposeCheck = function() {
    this.synthInstance.runDisposeCheck()
};
DMAF.Synth.DrumsInstance.prototype.message = function(a) {
    switch (a.type) {
        case "noteOn":
            this.play(a);
            break;
        case "noteOff":
            this.stop(a);
            break;
        case "controller":
            this.play();
            break;
        default:
            DMAF.debug("Message recieved in drums synth", a);
            break
    }
};
DMAF.Managers.SynthManager = function() {
    this.activeSynthInstances = {};
    this.sampleMap = DMAF.Data.SampleMap
};
DMAF.Managers.SynthManager.prototype.addSynthInstance = function(a) {
    if (!this.activeSynthInstances[a.instanceId]) {
        this.activeSynthInstances[a.instanceId] = a
    }
};
DMAF.Managers.SynthManager.prototype.removeSynthInstance = function(a) {
    if (this.activeSynthInstances[a]) {
        delete this.activeSynthInstances[a]
    }
};
DMAF.Managers.SynthManager.prototype.getActiveInstance = function(a) {
    if (this.activeSynthInstances[a]) {
        return this.activeSynthInstances[a]
    } else {
        return false
    }
};
DMAF.Managers.SynthManager.prototype.getSampleMap = function(a) {
    if (this.sampleMap[a]) {
        return this.sampleMap[a]
    } else {
        DMAF.error("SAMPLE MAP ERROR: Couldn't find any sampleMap with the id " + a);
        return false
    }
};
DMAF.Factories.SynthInstanceFactory = function() {
    this.factoryMap = {};
    this.registerCoreTypes()
};
DMAF.Factories.SynthInstanceFactory.prototype.registerCoreTypes = function() {
    this.factoryMap.SYNTH = DMAF.Synth.SynthInstance;
    this.factoryMap.GUITAR = DMAF.Synth.GuitarInstance;
    this.factoryMap.DRUMS = DMAF.Synth.DrumsInstance
};
DMAF.Factories.SynthInstanceFactory.prototype.create = function(c, b) {
    if (!this.factoryMap[c]) {
        DMAF.error("DMAFError: Could not create synth instance, unknown type: " + c);
        return
    }
    var d = this.factoryMap[c];
    var a = new d(b);
    return a
};
DMAF.Actions.SynthInstanceCreate = function(a) {
    this.instanceId = a.instanceId;
    this.properties = a
};
DMAF.Actions.SynthInstanceCreate.prototype.execute = function() {
    var a;
    if (this.instanceId === "multi") {
        this.properties.instanceId = this.trigger;
        a = DMAF.Managers.getSynthManager().getActiveInstance(this.trigger)
    } else {
        a = DMAF.Managers.getSynthManager().getActiveInstance(this.instanceId)
    }
    if (!a) {
        var b = DMAF.Factories.getSynthInstanceFactory();
        a = b.create("SYNTH", this.properties);
        DMAF.Managers.getSynthManager().addSynthInstance(a);
        a.setLevel(this.properties.volume, true)
    }
    if (this.parameters) {
        this.parameters.actionTime = this.actionTime;
        a.message(this.parameters)
    }
};
DMAF.Actions.GuitarInstanceCreate = function(a) {
    this.instanceId = a.instanceId;
    this.properties = a
};
DMAF.Actions.GuitarInstanceCreate.prototype.execute = function() {
    var a;
    if (this.instanceId === "multi") {
        this.properties.instanceId = this.trigger;
        a = DMAF.Managers.getSynthManager().getActiveInstance(this.trigger)
    } else {
        a = DMAF.Managers.getSynthManager().getActiveInstance(this.instanceId)
    }
    if (!a) {
        var b = DMAF.Factories.getSynthInstanceFactory();
        a = b.create("GUITAR", this.properties);
        DMAF.Managers.getSynthManager().addSynthInstance(a);
        a.setLevel(this.properties.volume, true)
    }
    if (this.parameters) {
        a.message({
            actionTime: this.actionTime,
            midiNote: this.parameters.midiNote,
            velocity: this.parameters.velocity,
            type: this.parameters.type,
            string: this.parameters.string,
            noteEndTime: this.parameters.noteEndTime,
            channel: this.parameters.channel,
            sustain: this.parameters.sustain
        })
    }
};
DMAF.Actions.DrumsInstanceCreate = function(a) {
    this.instanceId = a.instanceId;
    this.properties = a
};
DMAF.Actions.DrumsInstanceCreate.prototype.execute = function() {
    var a;
    if (this.instanceId === "multi") {
        this.properties.instanceId = this.trigger;
        a = DMAF.Managers.getSynthManager().getActiveInstance(this.trigger)
    } else {
        a = DMAF.Managers.getSynthManager().getActiveInstance(this.instanceId)
    }
    if (!a) {
        var b = DMAF.Factories.getSynthInstanceFactory();
        a = b.create("DRUMS", this.properties);
        DMAF.Managers.getSynthManager().addSynthInstance(a);
        a.setLevel(this.properties.volume, true)
    }
    if (this.parameters) {
        a.message({
            actionTime: this.actionTime,
            midiNote: this.parameters.midiNote,
            velocity: this.parameters.velocity,
            type: this.parameters.type,
            noteEndTime: this.parameters.noteEndTime,
            channel: this.parameters.channel,
            sustain: this.parameters.sustain
        })
    }
};
DMAF.Factories.SynthActionFactory = function() {
    this.factoryMap = {};
    this.registerCoreTypes()
};
DMAF.Factories.SynthActionFactory.prototype.registerCoreTypes = function() {
    this.factoryMap.SYNTH_CREATE = DMAF.Actions.SynthInstanceCreate;
    this.factoryMap.GUITAR_CREATE = DMAF.Actions.GuitarInstanceCreate;
    this.factoryMap.DRUMS_CREATE = DMAF.Actions.DrumsInstanceCreate
};
DMAF.Factories.SynthActionFactory.prototype.create = function(d, c) {
    if (!this.factoryMap[d]) {
        DMAF.error("DMAFError: Could not create synth action, unknown type: " + d);
        return
    }
    var b = this.factoryMap[d];
    var a = new b(c);
    return a
};
DMAF.Utils.ids = [];
DMAF.Utils.createUID = function() {
    var a = Math.floor(Math.random() * 100000);
    while (DMAF.Utils.ids[a]) {
        a = Math.floor(Math.random() * 100000)
    }
    DMAF.Utils.ids[a] = true;
    return a
};
DMAF.getController = function() {
    if (!DMAF.Controller) {
        DMAF.Controller = new DMAF.ControllerInstance()
    }
    return DMAF.Controller
};
DMAF.getCore = function() {
    if (!DMAF.Core) {
        DMAF.Core = new DMAF.CoreInstance()
    }
    return DMAF.Core
};
DMAF.DynamicValueRetriever = null;
DMAF.Utils.DynamicValueRetriever = function() {};
DMAF.Utils.DynamicValueRetriever.prototype.getTargetInstance = function(b) {
    var a = b.split(":");
    var c;
    switch (a[0]) {
        case "sound":
            c = DMAF.Managers.getSoundManager().getActiveSoundInstances(a[1]);
            break;
        case "synth":
            c = DMAF.Managers.getSynthManager().getActiveInstance(a[1]);
            break;
        case "bus":
            c = DMAF.Managers.getAudioBusManager().getAudioBusInstance(a[1]);
            break
    }
    return c
};
DMAF.Utils.DynamicValueRetriever.prototype.getValueFromString = function(b) {
    console.log("I'M NOT TESTED YET!");
    var a = b.split(":");
    var d;
    switch (a[0]) {
        case "sound":
            d = DMAF.Managers.getSoundManager().getActiveSoundInstances(a[1]);
            break
    }
    var c;
    if (d["get" + a[2][0].toUpperCase() + a[2].slice(1)]) {
        c = d["get" + a[2][0].toUpperCase() + a[2].slice(1)]()
    } else {
        c = d[a[2]]
    }
    return c
};
DMAF.Utils.DynamicValueRetriever.prototype.setValueFromString = function(a, b) {
    console.log("IMPLEMENT ME!")
};
DMAF.getDynamicValueRetriever = function() {
    if (!DMAF.DynamicValueRetriever) {
        DMAF.DynamicValueRetriever = new DMAF.Utils.DynamicValueRetriever()
    }
    return DMAF.DynamicValueRetriever
};
DMAF.Utils.dbToJSVolume = function(a) {
    var b = Math.max(0, Math.round(100 * Math.pow(2, a / 6)) / 100);
    b = Math.min(1, b);
    return b
};
DMAF.Utils.dbToWAVolume = function(a) {
    var b = Math.max(0, Math.round(100 * Math.pow(2, a / 6)) / 100);
    return b
};
DMAF.Utils.toMIDINote = function(f) {
    var e, d, c, b, a;
    if (f[1] === "#" || f[1].toLowerCase() === "s") {
        d = f[0].toLowerCase() + "sharp";
        a = 2
    } else {
        if (f[1] === "b") {
            d = f[0].toLowerCase() + "flat";
            a = 2
        } else {
            d = f[0].toLowerCase();
            a = 1
        }
    }
    d = DMAF.Utils.logicMIDIMap[d];
    if (f[a] === "-") {
        b = ((0 - parseInt(f[a + 1], 10)) + 2) * 12
    } else {
        b = (parseInt(f[a], 10) + 2) * 12
    }
    e = b + d;
    return e
};
DMAF.Utils.MIDIToFrequency = function(a) {
    return 8.1757989156 * Math.pow(2, a / 12)
};
DMAF.Utils.logicMIDIMap = {
    cflat: -1,
    c: 0,
    csharp: 1,
    dflat: 1,
    d: 2,
    dsharp: 3,
    eflat: 3,
    e: 4,
    esharp: 5,
    fflat: 4,
    f: 5,
    fsharp: 6,
    gflat: 6,
    g: 7,
    gsharp: 8,
    aflat: 8,
    a: 9,
    asharp: 10,
    bflat: 10,
    b: 11,
    bsharp: 12
};
DMAF.Utils.requestNextFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(a) {
        window.setTimeout(a, 1000 / 60)
    }
})();
DMAF.Utils.fmod = function(b, h) {
    var e, f, g = 0,
        d = 0,
        c = 0,
        a = 0;
    e = b.toExponential().match(/^.\.?(.*)e(.+)$/);
    g = parseInt(e[2], 10) - (e[1] + "").length;
    e = h.toExponential().match(/^.\.?(.*)e(.+)$/);
    d = parseInt(e[2], 10) - (e[1] + "").length;
    if (d > g) {
        g = d
    }
    f = (b % h);
    if (g < -100 || g > 20) {
        c = Math.round(Math.log(f) / Math.log(10));
        a = Math.pow(10, c);
        return (f / a).toFixed(c - g) * a
    } else {
        return parseFloat(f.toFixed(-g))
    }
};
DMAF.Utils.tanh = function(a) {
    return (Math.exp(a) - Math.exp(-a)) / (Math.exp(a) + Math.exp(-a))
};
DMAF.Utils.sign = function(a) {
    if (a == 0) {
        return 1
    } else {
        return Math.abs(a) / a
    }
};
