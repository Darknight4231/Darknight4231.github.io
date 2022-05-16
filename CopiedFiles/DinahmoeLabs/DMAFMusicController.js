DMAF.Processors.AbstractMusicController = function() {
    this.player = new DMAF.Processors.BeatPatternPlayer();
};
DMAF.Processors.AbstractMusicController.prototype.NEXT_BAR = "nextBar";
DMAF.Processors.AbstractMusicController.prototype.NEXT_CUE = "nextCue";
DMAF.Processors.AbstractMusicController.prototype.CURRENT_BEAT = "currentBeat";
DMAF.Processors.AbstractMusicController.prototype.NEXT_BEAT = "nextBeat";
DMAF.Processors.AbstractMusicController.prototype.NEXT_BEAT_2 = "nextBeat2";
DMAF.Processors.AbstractMusicController.prototype.NEXT_BEAT_3 = "nextBeat3";
DMAF.Processors.AbstractMusicController.prototype.NEXT_BEAT_4 = "nextBeat4";
DMAF.Processors.AbstractMusicController.prototype.UPBEAT_2 = "upbeat2";
DMAF.Processors.AbstractMusicController.prototype.UPBEAT_3 = "upbeat3";
DMAF.Processors.AbstractMusicController.prototype.UPBEAT_4 = "upbeat4";
DMAF.Processors.AbstractMusicController.prototype.FIRST_BAR = "firstBar";
DMAF.Processors.AbstractMusicController.prototype.SYNC = "sync";
DMAF.Processors.AbstractMusicController.prototype.SYNC_CURRENT = "syncsync";
DMAF.Processors.AbstractMusicController.prototype.NONE = "none";
DMAF.Processors.AbstractMusicController.prototype.CLEAR_PENDING = true;
DMAF.Processors.AbstractMusicController.prototype.KEEP_PENDING = false;
DMAF.Processors.AbstractMusicController.prototype.REPLACE = true;
DMAF.Processors.AbstractMusicController.prototype.ADD = false;
DMAF.Processors.AbstractMusicController.prototype.LOOP = true;
DMAF.Processors.AbstractMusicController.prototype.SINGLE_SHOT = false;

DMAF.Processors.AbstractMusicController.prototype.NAME = "AbstractMusicController";

DMAF.Processors.AbstractMusicController.prototype.onEvent = function(event) {
    DMAF.error("onEvent not overriden in AbstractMusicController");
};
DMAF.Processors.AbstractMusicController.prototype.songPosition = function(mode, offset) {
    var position;
    switch (mode) {
    case this.NEXT_BAR:
        position = new DMAF.Processors.BeatPosition(this.player.getNextBar(), 1);
        break;
    case this.NEXT_CUE:
        //                  not implemented
        break;
    case this.CURRENT_BEAT:
        position = new DMAF.Processors.BeatPosition(this.player.getCurrentBar(), this.player.getCurrentBeat());
        break;
    case this.NEXT_BEAT:
        if (this.player.getCurrentBeat() === this.player.getBeatsPerBar()) {
            position = new DMAF.Processors.BeatPosition(this.player.getNextBar(), 1);
        } else {
            position = new DMAF.Processors.BeatPosition(this.player.getCurrentBar(), this.player.getNextBeat());
        }
        break;
    case this.NEXT_BEAT_2:
        if (this.player.getCurrentBeat() < 2) {
            position = new DMAF.Processors.BeatPosition(this.player.getCurrentBar(), 2);
        } else {
            position = new DMAF.Processors.BeatPosition(this.player.getNextBar(), 2);
        }
        break;
    case this.NEXT_BEAT_3:
        if (this.player.getCurrentBeat() < 3) {
            position = new DMAF.Processors.BeatPosition(this.player.getCurrentBar(), 3);
        } else {
            position = new DMAF.Processors.BeatPosition(this.player.getNextBar(), 3);
        }
        break;
    case this.NEXT_BEAT_4:
        if (this.player.getCurrentBeat() < 4) {
            position = new DMAF.Processors.BeatPosition(this.player.getCurrentBar(), 4);
        } else {
            position = new DMAF.Processors.BeatPosition(this.player.getNextBar(), 4);
        }
        break;
    default:
        DMAF.error("Unknown mode: " + mode);
        break;
    }
    if (offset) {
        position.addOffset(offset);
    }
    //console.log("songPosition mode " + mode + ", " + position.bar + ", " + position.beat);
    return position;
};
DMAF.Processors.AbstractMusicController.prototype.patternPosition = function(mode, offset) {
    //console.log("patternPosition mode " + mode);
    var position;

    switch (mode) {
    case this.NEXT_BEAT:
        if (this.player.getCurrentPatternBeat() === this.player.getBeatsPerBar()) {
            position = new DMAF.Processors.BeatPosition(this.player.getNextPatternBar(), 1);
        } else {
            position = new DMAF.Processors.BeatPosition(this.player.getCurrentPatternBar(), this.player.getNextPatternBeat());
        }
        break;
    case this.UPBEAT_2:
        position = new DMAF.Processors.BeatPosition(0, 2);
        break;
    case this.UPBEAT_3:
        position = new DMAF.Processors.BeatPosition(0, 3);
        break;
    case this.UPBEAT_4:
        position = new DMAF.Processors.BeatPosition(0, 4);
        break;
    case this.FIRST_BAR:
        position = new DMAF.Processors.BeatPosition(1, 1);
        break;
    case this.SYNC:
        if (this.player.getCurrentPatternBeat() === this.player.getBeatsPerBar()) {
            position = new DMAF.Processors.BeatPosition(this.player.getNextPatternBar(), 1);
        } else {
            position = new DMAF.Processors.BeatPosition(this.player.getCurrentPatternBar(), this.player.getNextPatternBeat());
        }
        break;
    }
    if (offset) {
        position.addOffset(offset);
    }
    return position;
};
DMAF.Processors.AbstractMusicController.prototype.clearPosition = function(mode, offset) {
    //console.log("clearPosition mode " + mode);
    var position;

    switch (mode) {
    case this.NEXT_BAR:
        position = new DMAF.Processors.BeatPosition(this.player.getNextBar(), 1);
        break;
    case this.NEXT_CUE:
        //                  not implemented
        break;
    case this.NEXT_BEAT:
        if (this.player.getCurrentBeat() === this.player.getBeatsPerBar()) {
            position = new DMAF.Processors.BeatPosition(this.player.getNextBar(), 1);
        } else {
            position = new DMAF.Processors.BeatPosition(this.player.getCurrentBar(), this.player.getNextBeat());
        }
        break;
    case this.NEXT_BEAT_2:
        if (this.player.getCurrentBeatTime() < 2) {
            position = new DMAF.Processors.BeatPosition(this.player.getCurrentBar(), 2);
        } else {
            position = new DMAF.Processors.BeatPosition(this.player.getNextBar(), 2);
        }
        break;
    case this.NEXT_BEAT_3:
        if (this.player.getCurrentBeatTime() < 3) {
            position = new DMAF.Processors.BeatPosition(this.player.getCurrentBar(), 3);
        } else {
            position = new DMAF.Processors.BeatPosition(this.player.getNextBar(), 3);
        }
        break;
    case this.NEXT_BEAT_4:
        if (this.player.getCurrentBeatTime() < 4) {
            position = new DMAF.Processors.BeatPosition(this.player.getCurrentBar(), 4);
        } else {
            position = new DMAF.Processors.BeatPosition(this.player.getNextBar(), 4);
        }
        break;
    case this.NONE:
        position = new DMAF.Processors.BeatPosition(0, 0);
        break;
    }

    if (offset) {
        position.addOffset(offset);
    }
    return position;
};
DMAF.Processors.AbstractMusicController.prototype.offset = function(bar, beat) {
    var offset;
    offset = new DMAF.Processors.BeatPosition(bar, beat);
    return offset;
};
//****************************************************************************************************************************
//****************************************************************************************************************************
//****************************************************************************************************************************
DMAF.Processors.getMusicController = function() {
    if (!DMAF.MusicController) {
        DMAF.MusicController = new DMAF.Processors.MusicController();
        DMAF.MusicController.init();
    }
    return DMAF.MusicController;
};

DMAF.Processors.MusicController = function() {
    DMAF.Processors.AbstractMusicController.call(this);
};
DMAF.Processors.MusicController.prototype = new DMAF.Processors.AbstractMusicController();
DMAF.Processors.MusicController.prototype.PROCESSOR_ID = "MUSIC_CONTROLLER";
DMAF.Processors.MusicController.prototype.NAME = "MusicController";

DMAF.Processors.MusicController.prototype.init = function(projectData) {
    this.data = DMAF.Data.ProjectData();
    this.structure = DMAF.Data.MusicStructure;
};
DMAF.Processors.MusicController.prototype.getTransition = function(transitionType) {
    var transitionName = transitionType + "_0_" + this.player.nextBeat;
    return this.getPattern(transitionName);
};
DMAF.Processors.MusicController.prototype.getPattern = function(patternName) {
    if (this.data[patternName]) {
        return this.data[patternName];
    } else {
        console.error("patternName does not exist: " + patternName);
        return this.data.empty_pattern;
    }
};
DMAF.Processors.MusicController.prototype.proceedAddPattern = function(pattern, channel) {
    var mainController = DMAF.getController();

    if(!pattern || !pattern.patternId){
        DMAF.error("Could not find pattern for channel", channel);
        return;
    }

    var instrument = pattern.patternId.split("__")[0];
    instrument = instrument.replace("_weird", "");
    instrument = instrument.replace("_half", "");
    if(instrument !== "fx_for_walking" && instrument !== "pad_es2_warm"){
       instrument = instrument.replace("_w", "");
    }
    if(instrument === "cello_pluck_bass_h"){
       instrument = "cello_pluck_bass";
    }

    if(mainController.loadedInstruments[instrument]){
        setTimeout(function(){
            DMAF.getCore().dispatch("loadComplete_" + instrument);
        },50);
    }

    if(channel && pattern.patternId !== DMAF.getController().patternUtil[channel+"Slot"].currentPattern && pattern.patternId !== "deselected" && !DMAF.getController().patternUtil.mutedChannels[channel]){
        return;
    }

        //console.log("adding pattern", pattern.patternId, "at patt pos", this.patternPosition(this.NEXT_BEAT).bar, this.patternPosition(this.NEXT_BEAT).beat, "song pos", this.songPosition(this.NEXT_BEAT).bar, this.songPosition(this.NEXT_BEAT).beat, "current pos", this.player.songPosition.bar, this.player.songPosition.beat)

    this.player.addPattern({
            beatPattern: pattern,
            beatChannel: channel,
            addAtSongPosition: this.songPosition(this.NEXT_BEAT),
            patternStartPosition: this.patternPosition(this.NEXT_BEAT),
            clearPending: this.CLEAR_PENDING,
            replaceActivePatterns: this.REPLACE,
            setAsCurrent: false,
            loop: true,
            clearPosition: this.clearPosition(this.NEXT_BEAT)
        });
};
DMAF.Processors.MusicController.prototype.proceedAddPatternNewStructure = function(empty_pattern, pattern, channel) {

        var mainController = DMAF.getController();
        this.player.addPattern({
            beatPattern: empty_pattern,
            beatChannel: channel,
            addAtSongPosition: this.songPosition(this.NEXT_BAR),
            patternStartPosition: this.patternPosition(this.FIRST_BAR),
            clearPending: this.CLEAR_PENDING,
            replaceActivePatterns: this.REPLACE,
            setAsCurrent: true,
            loop: this.SINGLE_SHOT,
            clearPosition: this.clearPosition(this.NEXT_BAR)
        });
        this.player.addPattern({
            beatPattern: pattern,
            beatChannel: channel,
            addAtSongPosition: this.songPosition(this.NEXT_BAR, this.offset(1, 0)),
            patternStartPosition: this.patternPosition(this.FIRST_BAR),
            clearPending: this.KEEP_PENDING,
            replaceActivePatterns: this.REPLACE,
            setAsCurrent: true,
            loop: this.LOOP,
            clearPosition: this.clearPosition(this.NEXT_BAR, this.offset(0, 1))
        });
};
DMAF.Processors.MusicController.prototype.proceedAddStructure = function(empty_pattern, pattern, channel) {
   // console.log("Added new structure 1", pattern.patternId)
        this.player.addPattern({
            beatPattern: empty_pattern,
            beatChannel: channel,
            addAtSongPosition: this.songPosition(this.NEXT_BAR),
            patternStartPosition: this.patternPosition(this.FIRST_BAR),
            clearPending: this.CLEAR_PENDING,
            replaceActivePatterns: this.REPLACE,
            setAsCurrent: false,
            loop: this.SINGLE_SHOT,
            clearPosition: this.clearPosition(this.NEXT_BAR)
        });
        this.player.addPattern({
            beatPattern: pattern,
            beatChannel: channel,
            addAtSongPosition: this.songPosition(this.NEXT_BAR, this.offset(1, 0)),
            patternStartPosition: this.patternPosition(this.FIRST_BAR),
            clearPending: this.KEEP_PENDING,
            replaceActivePatterns: this.REPLACE,
            setAsCurrent: false,
            loop: true,
            clearPosition: this.clearPosition(this.NEXT_BAR, this.offset(1, 0)),
            useAsTransposePattern: true
        });
};
DMAF.Processors.MusicController.prototype.proceedAddInstantStructure = function(pattern, channel) {
   // console.log("Added new structure 2", pattern.patternId)
        this.player.addPattern({
            beatPattern: pattern,
            beatChannel: channel,
            addAtSongPosition: this.songPosition(this.NEXT_BEAT),
            patternStartPosition: this.patternPosition(this.NEXT_BEAT),
            clearPending: this.CLEAR_PENDING,
            replaceActivePatterns: this.REPLACE,
            setAsCurrent: false,
            loop: true,
            clearPosition: this.clearPosition(this.NEXT_BAR),
            useAsTransposePattern: true
        });
};
DMAF.Processors.MusicController.prototype.musicEvent = function(trigger, actionTime, channel) {
    //console.log("MUSIC EVENT", trigger)
    var triggerSplit = trigger.split("_");
    var synthName = "";
    for (var i = 0; i < triggerSplit.length - 1; i++) {
        synthName += triggerSplit[i];
    }
    var pattern;

    if (trigger.split("__")[0] === "structure") {
        if (trigger.split("__")[2] === "noDelay") {
            //pattern = this.data.getPattern(trigger.replace("__noDelay", ""), channel, "instantMasterStucture");
            this.proceedAddInstantStructure(new this.structure[trigger.replace("__noDelay", "")](), "structure");
        } else {
            this.proceedAddStructure(new DMAF.Processors.BeatPattern('empty_pattern', new DMAF.Processors.BeatPosition(1, 1), new DMAF.Processors.BeatPosition(9, 1)), new this.structure[trigger](), "structure");
            //pattern = this.data.getPattern(trigger, channel, "masterStructure");
        }

        return;
    }

    if (trigger.split("_")[0] === "newStructure") {
        trigger = trigger.replace("newStructure_", "");
        pattern = this.data.getPattern(trigger, channel || synthName, "newStructure");
        return;
    }

    //TRIGGER PATTERNS
    switch (trigger) {
    case "setMasterPattern":
        this.player.addPattern({
            beatPattern: new DMAF.Processors.BeatPattern('master', new DMAF.Processors.BeatPosition(1, 1), new DMAF.Processors.BeatPosition(9, 1)),
            beatChannel: "master",
            addAtSongPosition: this.songPosition(this.NEXT_BAR),
            patternStartPosition: this.patternPosition(this.FIRST_BAR),
            clearPending: this.CLEAR_PENDING,
            replaceActivePatterns: this.REPLACE,
            setAsCurrent: true,
            loop: true,
            clearPosition: this.clearPosition(this.NEXT_BEAT)
        });
        break;
    case "setMasterPatternAtCurrentPosition":
        this.player.addInstantPattern({
            beatPattern: new DMAF.Processors.BeatPattern('master', new DMAF.Processors.BeatPosition(1, 1), new DMAF.Processors.BeatPosition(9, 1)),
            beatChannel: "master",
            addAtSongPosition: new DMAF.Processors.BeatPosition(this.player.songPosition.bar, this.player.songPosition.beat),
            patternStartPosition: new DMAF.Processors.BeatPosition(this.player.songPosition.bar, this.player.songPosition.beat),
            clearPending: this.CLEAR_PENDING,
            replaceActivePatterns: this.REPLACE,
            setAsCurrent: true,
            loop: true,
            clearPosition: this.clearPosition(this.NEXT_BEAT)
        });
        break;
    case "empty_pattern":
    case "mute_mute":
        //console.error("mute pattern", channel);
        pattern = this.data.getPattern("empty_pattern", channel);
        break;
    case "startClock":
        this.player.startClock(actionTime + 30, DMAF.tempo, 4);
        break;
    case "stopClock":
        this.player.stopClock();
        break;
    default:
        //DMAF.debug("adding pattern", trigger);
        pattern = this.data.getPattern(trigger, channel || synthName);
        break;
    }
};
