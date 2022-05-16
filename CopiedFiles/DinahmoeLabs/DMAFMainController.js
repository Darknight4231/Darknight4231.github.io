DMAF.ControllerInstance = function() {
    //console.log("version 3");
    DMAF.getCore().addEventListener("*", this.onExternalEvent);

    //mute if not visible
    var handleVisibilityChange = function() {
        if (document.webkitHidden) {
            //DMAF.getCore().dispatch("muteButtonPressed");
            //console.log("page not visible, calling musicOff on myself")
            DMAF.getCore().dispatch("musicOff");
        } else {
            DMAF.getCore().dispatch("musicOn");
        }
    }
    document.addEventListener("webkitvisibilitychange", handleVisibilityChange, false);

    this.inTheater = false;
    this.currentInstruments = {};

    this.internalEvents = {};
    this.pendingEvents = [];

    this.isMobile = false;
    /*
     * Project specific
     */
    this.transpose = true;
    this.mode = 0;
    this.keyNote = 9;
    this.centerNote = 0;
    this.baseNote = 0;
    //1-12, 12 = C, 1 = C#
    var baseNote = this.baseNote;
    this.notesCurrentlyPlaying = {};
    this.scaleNames = ["OFF", "major", "mixolydian", "dorian", "naturalMinor", "majorPentatonic", "minorPentatonic", "harmonicMinor", "phrygian", "lydian", "locrian", "doubleHarmonic", "halfDim"];
    this.scales = {
        //              1       2       3   4       5        6       7
        OFF: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        major: [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0],
        harmonicMinor: [0, 1, 0, 0, -1, 0, 1, 0, 0, -1, 1, 0],
        naturalMinor: [0, 1, 0, 0, -1, 0, 1, 0, 0, -1, 0, -1],
        majorPentatonic: [0, 1, 0, 1, 0, -1, 1, 0, 1, 0, -1, 1],
        minorPentatonic: [0, -1, 1, 0, -1, 0, 1, 0, -1, 1, 0, -1],
        dorian: [0, 1, 0, 0, -1, 0, 1, 0, 1, 0, 0, -1],
        phrygian: [0, 0, -1, 0, -1, 0, 1, 0, 0, -1, 0, -1],
        lydian: [0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
        mixolydian: [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, -1],
        locrian: [0, 0, -1, 0, -1, 0, 0, -1, 0, -1, 0, -1],
        doubleHarmonic: [0, 0, -1, 1, 0, 0, 1, 0, 0, -1, 1, 0],
        halfDim: [0, 1, 0, 0, -1, 0, 0, -1, 0, -1, 0, -1]
    };

    this.patternUtil = new this.patternUtils();
    this.patternUtil.setRandomizationParameter({
        name: "intensity",
        value: Math.random() * 0.25 + 0.1
    });
    this.patternDispatchTimer = null;
    var that = this;

    this.lookingForFirstNote = false;
    this.firstNotes = [];
    this.loadedInstruments = {};
    this.waitingForChannel = {};

    this.musicOn = false;

    this.intensityInterval = 1;
    this.muteInterval = 1;
    this.structureInterval = 1;
    this.patternInterval = 1;

    this.currentBeat = 0;
    this.visualCallback = function() {
        //console.log("no callback set");
    };


    DMAF.getCore().randomizeInstrument = function(channel) {
        var instruments = this.getInstrumentStructure()[0][channel];
        var instrumentCategoryIndex = Math.floor(Math.random() * (instruments.length - 0.00001));
        var instrumentIndex = Math.floor(Math.random() * (instruments[instrumentCategoryIndex].length - 0.00001));
        var instrumentPatterns = this.getPatternsForInstrument(instruments[instrumentCategoryIndex][instrumentIndex]);
        var patternNames = Object.keys(instrumentPatterns);
        var patternIndex = Math.floor(Math.random() * (patternNames.length - 0.00001));
        this.dispatch("unmute_" + ["comp", "drums", "bass", "other"].indexOf(channel));
        this.startPattern(patternNames[patternIndex], channel);
    };

    DMAF.getCore().setVisualCallback = function(callback) {
        DMAF.getController().visualCallback = callback;
    };

    DMAF.getCore().randomizeAmbience = function() {
        var ambienceNames = this.getAmbienceNames(),
            randomAmbience = ambienceNames[Math.floor(Math.random() * (ambienceNames.length - 0.00001))];
        this.startAmbience("amb_" + randomAmbience);
    };

    DMAF.getCore().randomizeStructure = function() {
        //var structures = this.getInstrumentStructure()[0]["structure"][0],
        var mode = that.patternUtil.parameters["struct"];
        switch (mode) {
            case "0":
                mode = "minor";
                break;
            case "0.5":
                mode = "all";
                break;
            case "1":
                mode = "major";
                break;
        }
        var structures = that.patternUtil.getStructureOfType(mode),
            randomStructure = structures[Math.floor(Math.random() * (structures.length - 0.00001))];
        this.dispatch(randomStructure);

        this.dispatch("musicOff");
        var self = this;
        setTimeout(function() {
            self.dispatch("musicOn");
            if(that.patternUtil.mutedChannels["amb"] === true){
                self.dispatch("mute_4");
            }
        }, 2000);
    };

    //returns a list of ambience names.
    //the naming has changed troughout the project. Sometimes amb_ is used prepended to the ambience name, and sometimes not
    DMAF.getCore().getAmbienceNames = function() {
        var ambs = [],
            allNames = Object.keys(DMAF.Data.InstrumentMeta);
        for (var i = 0; i < allNames.length; i++) {
            if (allNames[i].search("amb_") !== -1) {
                ambs.push(allNames[i].replace("amb_", ""));
            }
        }
        return ambs;
    };

    //used when selecting a pattern with the rotaries in the GUI
    DMAF.getCore().startPattern = function(pattern, channel) {
        pattern = DMAF.getCore().findVariationFor(pattern, channel);
        that.patternUtil.startSpecifiedPattern(pattern, channel);
    };

    //used when selecting an ambience with the ambience rotary
    DMAF.getCore().startAmbience = function(pattern) {
        DMAF.getCore().dispatch(pattern);
    };

    //don't know if this is used anymore, but it will take a pattern in the for "bassdist_plink__a" and return "bassdist_plink__a_3" etc.
    DMAF.getCore().findVariationFor = function(pattern, channel) {
        var channels = ["comp", "drums", "bass", "other"];
        if (!isNaN(channel)) {
            channel = channels[channel];
        }
        pattern = pattern + "_" + that.patternUtil.getVariationForPattern(pattern, channel);
        return pattern;
    };

    //returns an array with all the possible intensity levels for the provided pattern
    DMAF.getCore().getVariationsFor = function(pattern) {
        return that.patternUtil.getVariationsForPattern(pattern);
    };

    //returns the available patterns for the provided instrument
    DMAF.getCore().getPatternsForInstrument = function(instrument) {
        return that.patternUtil.getPatternsForInstrument(instrument);
    };

    //the function is used to get the music data that is saved to the database for the first animation of a tree
    //it's basically the state of the framework that we need to restore it and play it in the exact same way
    DMAF.getCore().getTreeMusicData = function(json) {
        var data = that.patternUtil.getSelectedPatterns();
        data.intensities = {
            slot1: that.patternUtil.compSlot.intensity,
            slot2: that.patternUtil.drumsSlot.intensity,
            slot3: that.patternUtil.bassSlot.intensity,
            slot4: that.patternUtil.otherSlot.intensity,
            amb: that.patternUtil.ambSlot.intensity
        };
        data.mutes = that.patternUtil.mutedChannels;
        data.baseNote = that.baseNote;
        data.keyNote = that.keyNote;
        data.mode = that.mode;
        data.ambience = that.patternUtil.ambSlot.currentAmbience;
        data.structure = that.structure === undefined ? "deselected" : that.structure;
        data.wet = that.wet === undefined ? 0.2 : that.wet;
        data.transpose = that.transposeValue === undefined ? 0 : that.transposeValue;
        if (json) {
            return JSON.stringify(data);
        } else {
            return data;
        }
    };

    //restore the state of the framework with saved music data
    DMAF.getCore().setMusicData = function(data) {
        var numInstrumentsLoaded = 0;
        var numInstrumentsToWaitFor = 0;
        var loadEventNotSent = true;
        var prepareForTreePlayback = function(e) {
            DMAF.getCore().removeEventListener(e.type, prepareForTreePlayback);
            numInstrumentsLoaded++;
            if (numInstrumentsLoaded === numInstrumentsToWaitFor) {
                DMAF.getCore().dispatch("readyToPlayTree");
            }
        };

        var checkIfAllLoaded = function() {
            var allLoaded = true;
            for (var i = 1; i < 5; i++) {
                var instrument = data["slot" + i].split("__")[0];
                instrument = instrument.replace("_weird", "");
                instrument = instrument.replace("_half", "");
                if (instrument !== "fx_for_walking" && instrument !== "pad_es2_warm") {
                    instrument = instrument.replace("_w", "");
                }
                if (instrument === "cello_pluck_bass_h") {
                    instrument = "cello_pluck_bass";
                }
                if (!that.loadedInstruments[instrument]) {
                    allLoaded = false;
                }
            }
            if (allLoaded && loadEventNotSent) {
                DMAF.getCore().dispatch("readyToPlayTree");
                loadEventNotSent = false;
                return true;
            }

        };

        if (data.wet && data.wet !== "default") {
            DMAF.getCore().dispatch("wet_" + data.wet);
        }
        if (data.transpose && data.transpose !== "default") {
            DMAF.getCore().dispatch("transpose_" + data.transpose);
        }
        var slots = ["slot1", "slot2", "slot3", "slot4"];
        var channels = ["comp", "drums", "bass", "other"];

        for (var i = 0; i < slots.length; i++) {
            if (data[slots[i]]) {
                if (data[slots[i]] === "deselected") {
                    that.patternUtil.startSpecifiedPattern("empty_pattern", channels[i]);
                    that.patternUtil.mutedChannels[channels[i]] = true;
                } else {
                    //start preloading
                    var instrument = data[slots[i]].split("__")[0];
                    instrument = instrument.replace("_weird", "");
                    instrument = instrument.replace("_half", "");
                    if (instrument !== "fx_for_walking" && instrument !== "pad_es2_warm") {
                        instrument = instrument.replace("_w", "");
                    }
                    if (instrument === "cello_pluck_bass_h") {
                        instrument = "cello_pluck_bass";
                    }
                    if (that.loadedInstruments[instrument]) {
                        checkIfAllLoaded();
                    } else {
                        numInstrumentsToWaitFor++;
                        DMAF.getCore().addEventListener("loadComplete_" + instrument, prepareForTreePlayback);
                        DMAF.getCore().dispatch(instrument);
                    }
                    if (!data.mutes[channels[i]]) {
                        that.patternUtil.mutedChannels[channels[i]] = false;
                    } else {
                        that.patternUtil.mutedChannels[channels[i]] = true;
                    }
                    that.patternUtil.startSpecifiedPattern(data[slots[i]], channels[i]);
                }
            }
        }

        if (data.ambience) {
            if (data.ambience === "deselected" || data.mutes.amb) {
                DMAF.getCore().dispatch("amb_stop");
                that.patternUtil.ambSlot.currentAmbience = data.ambience;
                that.patternUtil.ambSlot.selectedAmbience = data.ambience;
            } else {

                numInstrumentsToWaitFor++;
                //load all sfx
                DMAF.getCore().addEventListener("loadComplete_ambienceSpecial", prepareForTreePlayback);
                DMAF.Managers.getAssetsManager().preloadSamples(that.ambiencesToLoad, "ambienceSpecial");

                if (!data.mutes.amb) {
                    DMAF.getController().patternUtil.mutedChannels.amb = false;
                    DMAF.getCore().dispatch("amb_" + data.ambience);
                } else {
                    DMAF.getController().patternUtil.mutedChannels.amb = true;
                    DMAF.getCore().dispatch("amb_stop");
                }
                that.patternUtil.ambSlot.currentAmbience = data.ambience;
                that.patternUtil.ambSlot.selectedAmbience = data.ambience;
            }
        }

        if (data.mutes.comp === true) {
            that.patternUtil.muteChannel(0);
        }
        if (data.mutes.drums === true) {
            that.patternUtil.muteChannel(1);
        }
        if (data.mutes.bass === true) {
            that.patternUtil.muteChannel(2);
        }
        if (data.mutes.other === true) {
            that.patternUtil.muteChannel(3);
        }
        if (data.mutes.amb === true) {
            that.patternUtil.muteChannel(4);
        }

        if (data.intensities) {
            that.patternUtil.compSlot.intensity = data.intensities.slot1 === undefined ? 0.5 : parseFloat(data.intensities.slot1);
            that.patternUtil.drumsSlot.intensity = data.intensities.slot2 === undefined ? 0.5 : parseFloat(data.intensities.slot2);
            that.patternUtil.bassSlot.intensity = data.intensities.slot3 === undefined ? 0.5 : parseFloat(data.intensities.slot3);
            that.patternUtil.otherSlot.intensity = data.intensities.slot4 === undefined ? 0.5 : parseFloat(data.intensities.slot4);
            that.patternUtil.ambSlot.intensity = data.intensities.amb === undefined ? 0.5 : parseFloat(data.intensities.amb);
            DMAF.getCore().dispatch("intensity_amb_" + parseFloat(data.intensities.amb));
        }

        that.baseNote = data.baseNote;
        that.originalBaseNote = data.baseNote;
        that.keyNote = data.keyNote;
        that.mode = data.mode;
        that.originalMode = data.mode;

        if (data.structure && data.structure !== "default" && data.structure !== "deselected") {
            DMAF.getCore().dispatch(data.structure + "__noDelay");
            that.originalStructure = data.structure;
        }

        DMAF.getCore().dispatch("amb_hardStop");
    };

    //returns the intensity (0-1) of a slot/channel
    DMAF.getCore().getIntensity = function(slot) {
        return that.patternUtil[slot + "Slot"].intensity;
    };

    //used by the GUI to populate the rotaries
    DMAF.getCore().getInstrumentStructure = function() {
        var functions = ["comp", "drums", "bass", "other", "amb", "structure"];
        var meta = DMAF.Data.InstrumentMeta;
        var folders = {};
        //extract the instruments and categorize them
        for (var instrument in meta) {
            if (meta.hasOwnProperty(instrument)) {
                if (!folders[meta[instrument].func]) {
                    folders[meta[instrument].func] = {};
                }
                if (!folders[meta[instrument].func][meta[instrument].category]) {
                    folders[meta[instrument].func][meta[instrument].category] = [];
                }
                folders[meta[instrument].func][meta[instrument].category].push(instrument);
            }
        }

        //make the whole thing into an array that is reasonably loopable
        var returnArray = [],
            returnObject = {};
        for (var i = 0; i < functions.length; i++) {
            //make an array for each function/slot/channel
            returnObject[functions[i]] = [];
            if (folders[functions[i]]) {
                //move 'em to the array
                for (var instrument in folders[functions[i]]) {
                    if (instrument === "top") {
                        for (var j = 0; j < folders[functions[i]][instrument].length; j++) {
                            //add the instrument (top level)
                            returnObject[functions[i]].push(folders[functions[i]][instrument][j]);
                        }
                    } else {
                        //add the whole array (this is a folder)
                        returnObject[functions[i]].push(folders[functions[i]][instrument]);
                    }
                }
            }
            if (i === 5) {
                //sort structures based on mood. If middle ground (5) mixo should be put before dorian
                var structs = returnObject[functions[i]][0];
                structs.sort(function(a, b) {
                    var metaA = parseInt(meta[a].properties["0"].replace("mood_", ""), 10);
                    var metaB = parseInt(meta[b].properties["0"].replace("mood_", ""), 10);
                    if (metaA === 5 && metaB === 5) {
                        if (a.search("mixolydian") !== -1) {
                            return -1;
                        } else {
                            return 1;
                        }
                    } else {
                        //console.log(meta,"is",a , "bigger than", b, metaA, metaB, metaA > metaB ? 1 : -1
                        return metaA > metaB ? 1 : -1;
                    }
                });
            }
        }

        return [returnObject, folders];
    };
};
DMAF.ControllerInstance.prototype.onInternalEvent = function(trigger, eventTime, params) {
    //do nothing if the framework is disabled
    if (trigger === "soundOn") {
        DMAF.unMute();
    }
    if (!DMAF.getCore().enabled) {
        return;
    }
    switch (trigger) {
        case "empty_pattern":
            DMAF.Processors.getMusicController().musicEvent("empty_pattern", eventTime, params.channel);
            break;

        default:
            if (DMAF.running) {
                DMAF.getController().onEvent(trigger, eventTime, params);
            } else {
                DMAF.getController().pendingEvents.push({
                    trigger: trigger,
                    eventTime: eventTime,
                    params: params
                });
            }
            break;
    }
};
DMAF.ControllerInstance.prototype.onExternalEvent = function(event, params) {
    //do nothing if the framework is disabled
    if (event.type === "soundOn") {
        DMAF.unMute();
    }

    if (!DMAF.getCore().enabled) {
        return;
    }

    var trigger = event.type;
    var eventTime = DMAF.context.currentTime * 1000;
    if (trigger.search("frame") === -1 && trigger !== "beat") {
        //console.log(trigger, params);
    }
    if (DMAF.running) {
        DMAF.getController().onEvent(trigger, eventTime, params);
    } else {
        DMAF.getController().pendingEvents.push({
            trigger: trigger,
            eventTime: eventTime
        });
    }
};
DMAF.ControllerInstance.prototype.addInternalEvent = function(type, listener, array) {
    this.internalEvents[type] = {
        listener: listener,
        array: array
    };
};
DMAF.ControllerInstance.prototype.removeInternalEvent = function(type) {
    delete this.internalEvents[type];
};
DMAF.ControllerInstance.prototype.dispatchPendingEvents = function() {
    for (var i = 0; i < this.pendingEvents.length; i++) {
        var event = this.pendingEvents[i];
        DMAF.getController().onEvent(event.trigger, event.eventTime, event.params);
    }
};
DMAF.ControllerInstance.prototype.onEvent = function(trigger, eventTime, parameters) {
    var channels = ["comp", "drums", "bass", "other", "ambience"];

    if(trigger === "isMobile"){
        this.isMobile = true;
    }

    //if(trigger === "loadGlobal" && this.isMobile){
    //    return;
    //}

    //are there internal event waiting for this dispatch?
    if (this.internalEvents[trigger]) {
        this.internalEvents[trigger].listener(this.internalEvents[trigger].array);
    }

    if (trigger.search("visual__") !== -1) {
        var splitTrigger = trigger.split("__");
        if (splitTrigger[1] !== "master") {
            this.currentInstruments[splitTrigger[1]] = splitTrigger[2];
        }
        return;
    }

    //first note event stuff, used to update the GUI
    if (trigger.search("loadComplete_") !== -1) {
        var triggerToLookFor = trigger.replace("loadComplete_", "");
        this.lookingForFirstNote = true;
        this.loadedInstruments[triggerToLookFor] = true;
        //we want to listen to this instruments first note!
        this.firstNotes.push(triggerToLookFor);
    }

    if (this.lookingForFirstNote) {
        for (var i = 0; i < this.firstNotes.length; i++) {
            if (trigger.search(this.firstNotes[i]) !== -1) {
                var hit = this.firstNotes.splice(i, 1);
                if (this.firstNotes.length === 0) {
                    this.lookingForFirstNote = false;
                }
                //DMAF.getCore().dispatch("firstNote_" + hit);
                if (DMAF.Data.InstrumentMeta[hit] && DMAF.Data.InstrumentMeta[hit].func) {
                    DMAF.getCore().dispatch("firstNote_" + DMAF.Data.InstrumentMeta[hit].func);
                }
            }
        }
    }

    var triggerSplit = trigger.split("_")[0];

    //flow related
    switch (trigger) {
        case "muteButtonPressed":
            DMAF.context.master.gain.cancelScheduledValues(0);
            DMAF.context.master.gain.setTargetAtTime(0, 0, 0.2);
            break;
        case "unmuteButtonPressed":
            DMAF.context.master.gain.cancelScheduledValues(0);
            DMAF.context.master.gain.setTargetAtTime(DMAF.masterVolume, 0, 0.5);
            break;
    }

    //misc
    switch (triggerSplit) {
        //used by the transpose slider in the music tool
        /*case "transpose":
            this.baseNote = this.centerNote + parseInt(trigger.split("_")[1], 10);
            this.keyNote = this.centerNote + (9 + parseInt(trigger.split("_")[1], 10));
            this.transposeValue = trigger.split("_")[1];
            this.originalBaseNote = this.baseNote;
            return;*/
        //the wet slider in the music tool
        case "wet":
            DMAF.Managers.getActionManager().onEvent("wet", eventTime, {
                value: trigger.split("_")[1]
            });
            this.wet = trigger.split("_")[1];
            return;
            //the instensity sliders in the music tool
        case "intensity":
            var slot = trigger.split("_")[1];
            if (isNaN(slot)) {
                this.patternUtil[slot + "Slot"].intensity = parseFloat(trigger.split("_")[2]);

                if (slot === "amb") {
                    var instance = DMAF.Managers.getSoundManager().getSoundInstance(this.patternUtil.ambSlot.currentAmbience);
                    if (instance) {
                        //these are set in db, so this is a bit of a hack. Oops.
                        for (var sound in instance.sounds) {
                            instance.sounds[sound].gainNode.gain.cancelScheduledValues(DMAF.context.currentTime);
                            //var volume = DMAF.Utils.dbToWAVolume(-26 + 26 * parseFloat(trigger.split("_")[2]) - 12);
                            //instance.sounds[sound].gainNode.gain.setTargetAtTime(volume, DMAF.context.currentTime, 0.1);
                        }
                        instance.setVolume(-16 + 9 * parseFloat(trigger.split("_")[2]) - 6);
                    }
                }

                //TODO: Make me a real boy
                this.patternUtil.startPattern("slider_3_" + slot + "_" + trigger.split("_")[2]);
            }

            return;
            //used to triggering new ambiences. Stops the current one if there is one playing and starts the new one
        case "amb":
            if (trigger.split("_")[1] === "stop") {
                var instance = DMAF.Managers.getSoundManager().getSoundInstance(this.patternUtil.ambSlot.currentAmbience);
                var theAmbience = this.patternUtil.ambSlot.currentAmbience;
                var that = this;
                if (instance) {
                    for (var sound in instance.sounds) {
                        //instance.sounds[sound].gainNode.gain.setTargetAtTime(0, DMAF.context.currentTime, 0.01);
                    }
                    instance.setVolume(-16 + 9 * 0 - 6);
                    //stop after fade out
                    setTimeout((function() {
                        return function() {
                            //make sure we're not stopping the current ambience!
                            if (that.patternUtil.ambSlot.currentAmbience !== theAmbience) {
                                instance.stop();
                            }
                        };
                    })(), 200);

                }
                return;
            } else if(trigger.split("_")[1] === "hardStop") {
                var instance = DMAF.Managers.getSoundManager().getSoundInstance(this.patternUtil.ambSlot.currentAmbience);
                instance.stop();
            } else {
                if (this.patternUtil.ambSlot.currentAmbience) {
                    if (this.patternUtil.ambSlot.currentAmbience !== trigger.replace("amb_", "")) {
                        DMAF.getCore().dispatch("amb_stop");
                    }
                }

                this.patternUtil.ambSlot.currentAmbience = trigger.replace("amb_", "");
                DMAF.getCore().dispatch(this.patternUtil.ambSlot.currentAmbience);
                var instance = DMAF.Managers.getSoundManager().getSoundInstance(this.patternUtil.ambSlot.currentAmbience);
                if (instance) {
                    for (var sound in instance.sounds) {
                        instance.sounds[sound].gainNode.gain.cancelScheduledValues(DMAF.context.currentTime);
                        //instance.sounds[sound].gainNode.gain.setValueAtTime(0, DMAF.context.currentTime);
                        //var volume = DMAF.Utils.dbToWAVolume(-26 + 26 * this.patternUtil.ambSlot.intensity - 12);
                        //instance.sounds[sound].gainNode.gain.setTargetAtTime(volume, DMAF.context.currentTime, 0.01);
                    }
                    instance.setVolume(-16 + 9 * this.patternUtil.ambSlot.intensity - 6);
                }
                return;
            }
            break;
            //mute/unmute channels
        case "mute":
            this.patternUtil.muteChannel(parseInt(trigger.split("_")[1], 10));
            if (trigger.split("_")[1] !== "4") {
                DMAF.Processors.getMusicController().musicEvent("empty_pattern", eventTime, channels[trigger.split("_")[1]]);
            } else {
                var ambienceInstance = DMAF.Managers.getSoundManager().getSoundInstance(this.patternUtil.ambSlot.currentAmbience);
                if (ambienceInstance) {
                    ambienceInstance.stop();
                }
            }
            return;
        case "unmute":
            this.patternUtil.unmuteChannel(parseInt(trigger.split("_")[1], 10));
            if (trigger.split("_")[1] !== "4") {
                this.patternUtil.startPattern("last_played_pattern_" + trigger.split("_")[1]);
            } else {
                if (DMAF.Processors.getMusicController().player.clockState === "running") {
                    DMAF.getCore().dispatch(this.patternUtil.ambSlot.currentAmbience);
                }
                return;
            }
            return;
            //filters
        case "character":
        case "rhythm":
        case "weird":
        case "complexity":
            this.patternUtil.setRandomizationParameter({
                name: triggerSplit,
                value: trigger.split("_")[1]
            });
            return;
        case "struct":
            this.struct = trigger.split("_")[1];
            this.patternUtil.setRandomizationParameter({
                name: triggerSplit,
                value: trigger.split("_")[1]
            });
            return;
            //don't think this is used no more..
        case "randomKey":
            var key = (Math.floor(Math.random() * 12) - 6);
            this.baseNote = key;
            this.keyNote = (9 + key) % 12;
            this.originalBaseNote = this.baseNote;
            return;
    }

    //if the trigger has a __ it means it's a new structure (chord progression) pattern
    if (trigger.split("__")[0] === "structure" && trigger.split("__").length !== 1) {
        this.mode = this.scaleNames.indexOf(trigger.split("__")[1].split("_")[0]);
        this.mode = Math.max(this.mode, 0);
        this.structure = trigger.replace("__noDelay", "");
        this.originalStructure = this.structure;
        this.originalMode = this.mode;
        DMAF.Processors.getMusicController().musicEvent(this.structure + "__noDelay", eventTime, "structure");
        return;
    } else if (trigger.split("__")[0] === "structure") { //if it doesn't it's an event from one of those patterns
        this.baseNote = parameters.n - 45 + (this.keyNote - 9);
        return;
    }

    //transpose
    switch (trigger) {
        case "drums_strom":
        case "drums_single":
        case "drums_strom_half":
        case "drumset_soft":
        case "drumset_soft_half":
        case "drums_tonecraft":
        case "drums_tonecraft_half":
        case "drums_cr78":
        case "drums_cr78_half":
        case "tom_brushes":
        case "tom_brushes_half":
        case "synth_chickenfolk_pans":
        case "fx_hans_brix":
        case "fx_pong":
        case "fx_tricity":
        case "drums_robyn_beat":
        case "drums_robyn_beat_half":
        case "perc_prepared":
        case "fx_for_walking":
        case "perc_paper":
        case "perc_paper_half":
        case "perc_metal":
        case "perc_can":
            if (parameters) {
                parameters = {
                    midiNote: parameters.n,
                    type: parameters.t,
                    velocity: parameters.v,
                    noteEndTime: parameters.noteEndTime
                };
            }
            break;
        default:
            if (parameters) {
                if (parameters.n) {
                    //create a new object to avoid modifying original note data
                    parameters = {
                        midiNote: parameters.n,
                        type: parameters.t,
                        velocity: parameters.v,
                        noteEndTime: parameters.noteEndTime
                    };
                    if (this.transpose) {
                        parameters.midiNote += parseInt(this.baseNote, 10);
                    }

                    var transposedNote = (parameters.midiNote % 12) - this.keyNote;
                    if (transposedNote < 0) {
                        transposedNote += 12;
                    }
                    var scaleIndexToUse = transposedNote % 12;
                    var modifier = this.scales[this.scaleNames[this.mode]][scaleIndexToUse];
                    parameters.midiNote += modifier;
                }
            }
    }

    //if we've come this far without returning and there's a __, let's try starting a pattern with that
    if (trigger.split("__").length > 1) {
        //console.log("sending to MUSIC CONTROLLER", trigger, parameters)
        if (trigger.split("__")[0] === "undefined") {
            DMAF.error("Got pattern with undefined in it", trigger);
            return;
        }
        var channel = null;
        if (parameters) {
            channel = parameters.channel;
        }
        DMAF.Processors.getMusicController().musicEvent(trigger, eventTime, channel);
        return;
    }

    switch (trigger) {
        //used by Google DAT to control the music flow
        case "musicOn":
            this.musicOn = true;
            DMAF.Processors.getMusicController().musicEvent("startClock", eventTime);
            DMAF.Processors.getMusicController().musicEvent("setMasterPattern", eventTime);
            DMAF.getCore().dispatch("intensity_comp_" + this.patternUtil.compSlot.intensity);
            DMAF.getCore().dispatch("intensity_drums_" + this.patternUtil.drumsSlot.intensity);
            DMAF.getCore().dispatch("intensity_bass_" + this.patternUtil.bassSlot.intensity);
            DMAF.getCore().dispatch("intensity_other_" + this.patternUtil.otherSlot.intensity);
            DMAF.getCore().dispatch("intensity_amb_" + this.patternUtil.ambSlot.intensity);
            DMAF.getCore().dispatch("amb_" + this.patternUtil.ambSlot.currentAmbience);
            DMAF.getCore().dispatch(this.structure + "__noDelay");
            if(this.patternUtil.mutedChannels["amb"] === true){
                DMAF.getCore().dispatch("mute_4");
            }
            return;
        case "musicOff":
            this.musicOn = false;
            //console.log("got", trigger, "stopping playback")
            DMAF.Processors.getMusicController().musicEvent("stopClock", eventTime);
            var ambience = DMAF.Managers.getSoundManager().getSoundInstance(this.patternUtil.ambSlot.currentAmbience);
            if (ambience) {
                ambience.stop();
            }
            return;

            //the generate score button is handled here! Important one.
        case "generateScore":
            DMAF.Processors.getMusicController().musicEvent("stopClock", eventTime);
            //randomize key
            var key = (Math.floor(Math.random() * 12) - 6);
            this.baseNote = this.centerNote + key;
            this.keyNote = this.centerNote + ((9 + key) % 12);

            //randomize mutes
            this.patternUtil.randomizeMutes();

            DMAF.Processors.getMusicController().musicEvent("startClock", eventTime);
            DMAF.Processors.getMusicController().musicEvent("setMasterPattern", eventTime);
            this.patternUtil.generateScore();
            this.originalMode = this.mode;
            this.originalStructure = this.structure;
            this.originalBaseNote = this.baseNote;
            this.firstNotes = [];
            return;
        default:
            break;
    }
    //console.log("SENDING TO ACTION MANAGER", trigger);
    for (var category in this.currentInstruments) {
        if (this.currentInstruments[category] === trigger) {
            this.visualCallback(category);
            break;
        }
    }
    DMAF.Managers.getActionManager().onEvent(trigger, eventTime, parameters);
};



//This one keeps track of the state of the five slots; comp, drums, bass, other, amb (ambience)
//It does also the following:
// - filtering of instruments, ambences and structures based on the meta data found in InstrumentMeta.js
// - randomization of musical scores (randomize 4 instruments and patterns, one ambience,
//      a structure and then decide which instruments should be muted)
// - starting patterns and handling muting
// - Switch the state of the framework when doing it internally (like when playing a branch)
DMAF.ControllerInstance.prototype.patternUtils = function() {

    var currentComp, currentDrum, currentBass, currentOther, instrumentMeta = DMAF.Data.InstrumentMeta,
        sampleMap = DMAF.Data.SampleMap,
        patterns = DMAF.Processors.getMusicController().data.availablePatterns,
        structures = DMAF.Data.MusicStructure,
        that = this;

    this.compSlot = {};
    this.compSlot.intensity = 0.5;
    this.drumsSlot = {};
    this.drumsSlot.intensity = 0.5;
    this.bassSlot = {};
    this.bassSlot.intensity = 0.5;
    this.otherSlot = {};
    this.otherSlot.intensity = 0.5;
    this.ambSlot = {};
    this.ambSlot.intensity = 0.5;
    this.compSlot.currentPattern = "deselected";
    this.drumsSlot.currentPattern = "deselected";
    this.bassSlot.currentPattern = "deselected";
    this.otherSlot.currentPattern = "deselected";
    this.ambSlot.currentAmbience = "deselected";
    this.ambSlot.selectedAmbience = "deselected";

    this.parameters = {};
    this.parameters.intensity = 0.2;
    this.filteredInstruments = [];

    //sets parameters used when randomizing the score
    //the filters in the music interface are passed to this one
    this.setRandomizationParameter = function(parameter) {
        this.parameters[parameter.name] = parameter.value;
    };

    //returns the current patterns for the four slots and the ambience.
    //the naming has changed troughout the project, so it's not consistent =/
    //slot1 = comp
    //slot2 = drums
    //slot3 = bass
    //slot4 = other
    //ambience = amb
    this.getSelectedPatterns = function() {
        return {
            slot1: this.compSlot.currentPattern || "deselected",
            slot2: this.drumsSlot.currentPattern || "deselected",
            slot3: this.bassSlot.currentPattern || "deselected",
            slot4: this.otherSlot.currentPattern || "deselected",
            ambience: this.ambSlot.currentAmbience || "deselected"
        };
    };

    //pass this an instrument name and you get the available patterns for that instrument
    this.getPatternsForInstrument = function(instrument) {
        if (instrument === "muted") {
            //console.log("Got 'muted', bad old data")
        }
        var patternVariations = {};
        var usedCache = false;
        if (this.cache) {
            //loop the 4 cache categories and check their variations
            if (this.cache[instrument]) {
                patternVariations = this.cache[instrument];
                usedCache = true;
            }
        } else {
            this.cache = {};
            var types = ["comp", "drums", "bass", "other"];
            var foundPatterns, instrumentType, type, pattern, i;
            var length, pieces, p, o, patternStyleName;
            var patternsLength = patterns.length;
            for (var j = 0; j < types.length; j++) {
                instrumentType = types[j];
                foundPatterns = [];
                instrumentArray = that[instrumentType + "Instruments"];
                length = instrumentArray.length;
                //loopa alla patten och cacha
                for (i = 0; i < length; i++) {
                    for (p = 0; p < patternsLength; p++) {
                        if (patterns[p].search(instrumentArray[i]) !== -1) {
                            patternSplit = patterns[p].split("__");
                            patternName = patternSplit[0];
                            if (patternName === instrumentArray[i]) {
                                pieces = patternSplit[1].split("_");
                                patternStyle = pieces[0];
                                patternStyleName = patternName + "__" + patternStyle;
                                patternVariation = pieces[1];
                                if (!patternVariations[patternStyleName]) {
                                    patternVariations[patternStyleName] = [];
                                }
                                patternVariations[patternStyleName].push(patternVariation);
                                if (!this.cache[instrumentArray[i]]) {
                                    this.cache[instrumentArray[i]] = {};
                                }
                                if (!this.cache[instrumentArray[i]][patternStyleName]) {
                                    this.cache[instrumentArray[i]][patternStyleName] = [];
                                }
                                this.cache[instrumentArray[i]][patternStyleName].push(patternVariation);
                            }
                        }
                    }
                }
                for (o in patternVariations) {
                    if (patternVariations.hasOwnProperty(o)) {
                        foundPatterns.push(o);
                    }
                }
                this.cache[instrumentType] = {
                    patterns: foundPatterns,
                    variations: patternVariations
                };
            }
        }
        if (this.cache[instrument]) {
            patternVariations = this.cache[instrument];
            if (!patternVariations) {
                DMAF.error("found instrument in sampleMap that doesn't match any patterns:", instrument);
                return;
            }
        } else {
            DMAF.error("found instrument in sampleMap that doesn't match any patterns:", instrument);
            return;
        }
        return patternVariations;
    };

    //used to decide just how intense a pattern is on a scale 0 to 1.
    this.getPatternIndexRatio = function(patternToLookUp, instrumentType) {
        var finalPattern;
        if (patternToLookUp !== "muted") {
            patternToLookUp = patternToLookUp.split("__")[0] + "__" + patternToLookUp.split("__")[1].split("_")[0];
        } else {
            //console.log("got 'muted', bad old data")
            return;
        }
        //find the relevant styles for the chosen instrument
        var patternSplit, patternName, instrumentArray, patternStyle, patternVariations = {},
        foundPatterns = [],
            i, o;


        //går igen om alla instrument och hämtar styles för dem === lång tid
        if (instrumentType) {

            if (!this.cache) {
                this.cache = {};
            }
            if (this.cache[instrumentType]) {
                foundPatterns = this.cache[instrumentType].patterns;
                patternVariations = this.cache[instrumentType].variations;
            } else {
                this.cache = {};
                var types = ["comp", "drums", "bass", "other"];
                var foundPatterns, instrumentType, type, pattern, i;
                var length, pieces, p, o, patternStyleName;
                var patternsLength = patterns.length;
                for (var j = 0; j < types.length; j++) {
                    instrumentType = types[j];
                    foundPatterns = [];
                    instrumentArray = that[instrumentType + "Instruments"];
                    length = instrumentArray.length;
                    //loopa alla patten och cacha
                    for (i = 0; i < length; i++) {
                        for (p = 0; p < patternsLength; p++) {
                            if (patterns[p].search(instrumentArray[i]) !== -1) {
                                patternSplit = patterns[p].split("__");
                                if (patternSplit.length > 1) {
                                    patternName = patternSplit[0];
                                    if (patternName === instrumentArray[i]) {
                                        pieces = patternSplit[1].split("_");
                                        patternStyle = pieces[0];
                                        patternStyleName = patternName + "__" + patternStyle;
                                        patternVariation = pieces[1];
                                        if (!patternVariations[patternStyleName]) {
                                            patternVariations[patternStyleName] = [];
                                        }
                                        patternVariations[patternStyleName].push(patternVariation);
                                        if (!this.cache[instrumentArray[i]]) {
                                            this.cache[instrumentArray[i]] = {};
                                        }
                                        if (!this.cache[instrumentArray[i]][patternStyleName]) {
                                            this.cache[instrumentArray[i]][patternStyleName] = [];
                                        }
                                        this.cache[instrumentArray[i]][patternStyleName].push(patternVariation);
                                    }
                                }
                            }
                        }
                    }
                    for (o in patternVariations) {
                        if (patternVariations.hasOwnProperty(o)) {
                            foundPatterns.push(o);
                        }
                    }
                    this.cache[instrumentType] = {
                        patterns: foundPatterns,
                        variations: patternVariations
                    };
                }
            }
        }
        return foundPatterns.indexOf(patternToLookUp); /* / (foundPatterns.length - 1);*/
    };

    //used to start patterns. Saves the pattern as the current pattern for the channel/slot and starts the pattern if the channel is not muted
    this.startSpecifiedPattern = function(pattern, channel) {
        this[channel + "Slot"]["currentPattern"] = pattern;
        if (!this.mutedChannels[channel]) {
            DMAF.getController().onInternalEvent(this[channel + "Slot"].currentPattern, DMAF.context.currentTime, {
                channel: channel
            });
        }

        //set the pattern ratio to make sure the same instrument is used if other parameters change
        if (!pattern) {
            return;
        }
        pattern = pattern.substring(0, pattern.length - 2)
        this[channel + "Slot"][4] = this.getPatternIndexRatio(pattern, channel);
    };

    //give this a pattern name (eg. "bassdist_plink__a") and it returns the intensity level corresponding to the slots' intensity level
    this.getVariationForPattern = function(pattern, slot) {
        var variations = this.getVariationsForPattern(pattern);
        var theSlot = this[slot + "Slot"];
        var intensity;
        if (theSlot) {
            intensity = theSlot.intensity || 0.2;
        } else {
            //console.error("No such slot", slot);
            return;
        }
        var variation = variations[Math.floor(intensity * (variations.length - 1))];
        return variation;
    };

    //give this a pattern name (eg. "bassdist_plink__a") and it returns an array with the available intensity levels for that pattern
    this.getVariationsForPattern = function(patternToFind) {
        var patternVariations = [];
        for (var pattern in patterns) {
            patternSplit = patterns[pattern].split("__");
            if (patternSplit.length > 1) {
                patternName = patternSplit[0];
                patternStyle = patternSplit[1].split("_")[0];
                patternVariation = patternSplit[1].split("_")[1];
                if (patternName + "__" + patternStyle === patternToFind) {

                    patternVariations.push(patternVariation);
                }
            }

        }
        return patternVariations;
    };

    //designed to return a pattern based on the instrumentType you pass (comp, bass...).
    this.getPattern = function(choiceRatio, variationIndex, instrumentType) {
        var finalPattern;

        //find the relevant styles for the chosen instrument
        var patternSplit, patternName, instrumentArray, patternStyle, patternVariations = {},
        foundPatterns = [],
            i, o;

        if (instrumentType) {
            if (!this.cache) {
                this.cache = {};
            }
            if (this.cache[instrumentType]) {
                foundPatterns = this.cache[instrumentType].patterns;
                patternVariations = this.cache[instrumentType].variations;
            } else {
                instrumentArray = that[instrumentType + "Instruments"];
                for (var i = 0; i < instrumentArray.length; i++) {
                    for (var pattern in patterns) {
                        patternSplit = patterns[pattern].split("__");
                        if (patternSplit.length > 1) {
                            patternName = patternSplit[0];
                            patternStyle = patternSplit[1].split("_")[0];
                            patternVariation = patternSplit[1].split("_")[1];
                            if (patternName === instrumentArray[i]) {
                                if (!patternVariations[patternName + "__" + patternStyle]) {
                                    patternVariations[patternName + "__" + patternStyle] = [];
                                }
                                patternVariations[patternName + "__" + patternStyle].push(patternVariation);
                                if (!this.cache[instrumentArray[i]]) {
                                    this.cache[instrumentArray[i]] = {};
                                }
                                if (!this.cache[instrumentArray[i]][patternName + "__" + patternStyle]) {
                                    this.cache[instrumentArray[i]][patternName + "__" + patternStyle] = [];
                                }
                                this.cache[instrumentArray[i]][patternName + "__" + patternStyle].push(patternVariation);
                            }
                        }

                    }
                }
                for (o in patternVariations) {
                    if (patternVariations.hasOwnProperty(o)) {
                        foundPatterns.push(o);
                    }
                }
                this.cache[instrumentType] = {}
                this.cache[instrumentType].patterns = foundPatterns;
                this.cache[instrumentType].variations = patternVariations;
            }
        } else {
            if (!this.allCache) {
                for (var pattern in patterns) {
                    patternSplit = patterns[pattern].split("__");
                    if (patternSplit.length > 1) {
                        patternName = patternSplit[0];
                        patternStyle = patternSplit[1].split("_")[0];
                        patternVariation = patternSplit[1].split("_")[1];

                        if (!patternVariations[patternName + "__" + patternStyle]) {
                            patternVariations[patternName + "__" + patternStyle] = [];
                        }
                        patternVariations[patternName + "__" + patternStyle].push(patternVariation);
                        if (!this.cache[instrumentArray[i]]) {
                            this.cache[instrumentArray[i]] = {};
                        }
                        if (!this.cache[instrumentArray[i]][patternName + "__" + patternStyle]) {
                            this.cache[instrumentArray[i]][patternName + "__" + patternStyle] = [];
                        }
                        this.cache[instrumentArray[i]][patternName + "__" + patternStyle].push(patternVariation);
                    }

                }
                for (o in patternVariations) {
                    if (patternVariations.hasOwnProperty(o)) {
                        foundPatterns.push(o);
                    }
                }
                this.allCache = {};
                this.allCache.patterns = foundPatterns;
                this.allCache.variations = patternVariations;
            } else {
                foundPatterns = this.allCache.patterns;
                patternVariations = this.allCache.variations;
            }
        }
        if (foundPatterns.length < 1) {
            //console.error("No patterns found for " + variationIndex + " in " + instrumentType);
            return;
        }

        //choose one of the found styles
        var styleChoice = foundPatterns[choiceRatio];

        //choose one of the found variations
        //console.log("pattern variations", patternVariations, styleChoice, Math.floor(variationIndex * (patternVariations[styleChoice].length - 0.001)) + 1);
        //var variationChoice = Math.floor(variationIndex * (patternVariations[styleChoice].length - 0.001)) + 1;
        var variationChoice = Math.floor(this[instrumentType + "Slot"].intensity * (patternVariations[styleChoice].length - 0.001)) + 1;

        //concat to the final pattern
        var finalPattern = styleChoice + "_" + variationChoice;
        return finalPattern;
    };

    //returns an array with the available instruments of the provided type (bass, other...)
    this.getInstrumentsOfFunc = function(func) {

        var array = [],
            data = instrumentMeta,
            instrument;

        if (func === "all") {
            for (instrument in data) {
                if (data.hasOwnProperty(instrument)) {
                    array.push(instrument);
                }
            }
        } else {
            for (instrument in data) {
                if (data.hasOwnProperty(instrument)) {
                    if (data[instrument].func === func) {
                        array.push(instrument);
                    }
                }
            }
        }
        return array;
    };

    //sorting function used by Array objects to sort their instruments
    this.instrumentSort = function(a, b) {
        var data = instrumentMeta;
        if (data[a].properties[0] < data[b].properties[0]) {
            return -1;
        } else if (data[a].properties[0] > data[b].properties[0]) {
            return 1;
        } else {
            return 0;
        }
    };

    //used to randomize which slots/channels should be muted when generating a score
    //some silter settings in the GUI will cause certain channels to always be muted or unmuted
    this.randomizeMutes = function(options) {
        var safeChannels = [],
            muteChannels = [];
        if (this.parameters.weird === "1") {
            safeChannels.push(3); //other
        }
        if (this.parameters.rhythm === "1") {
            safeChannels.push(1); //drums
        } else if (this.parameters.rhythm === "0") {
            muteChannels.push(1); //drums
        }

        //make the comp channel safe if we don't any safe ones yet
        if (this.parameters.complexity === "0") {
            safeChannels.push(0); //comp
            //perfom mute
            for (var i = 0; i < 4; i++) {
                if (safeChannels.indexOf(i) !== -1) { //is this a safe channel?
                    DMAF.getCore().dispatch("unmute_" + i);
                } else { //is it a definate mute?
                    DMAF.getCore().dispatch("mute_" + i);
                }
            }
            return;
        }

        //if we've gotten this far and have no safe ones yet...
        if (safeChannels.length === 0) {
            safeChannels.push(0); //comp
        }


        if (this.parameters.complexity === "1") {
            //make another one/two safe ones
            while (safeChannels.length < 3) {
                channel = Math.floor(Math.random() * 3.99);
                if (safeChannels.indexOf(channel) === -1) {
                    safeChannels.push(channel);
                }
            }
        }


        //go mute!
        for (var i = 0; i < 4; i++) {
            if (safeChannels.indexOf(i) !== -1) { //is this a safe channel?
                DMAF.getCore().dispatch("unmute_" + i);
            } else if (muteChannels.indexOf(i) !== -1) { //is it a definate mute?
                DMAF.getCore().dispatch("mute_" + i);
            } else {
                //better let chance decide then...
                //let the chance be reduced for each safe instrument
                if (Math.round(Math.random() > (safeChannels.length * Math.random()))) {
                    safeChannels.push(i);
                    DMAF.getCore().dispatch("unmute_" + i);
                } else {
                    DMAF.getCore().dispatch("mute_" + i);
                }
            }
        }
    };

    this.muteChannel = function(channel) {
        switch (channel) {
            case 0:
                this.mutedChannels.comp = true;
                DMAF.Processors.getMusicController().musicEvent("empty_pattern", DMAF.context.currentTime, "comp");
                break;
            case 1:
                this.mutedChannels.drums = true;
                DMAF.Processors.getMusicController().musicEvent("empty_pattern", DMAF.context.currentTime, "drums");
                break;
            case 2:
                this.mutedChannels.bass = true;
                DMAF.Processors.getMusicController().musicEvent("empty_pattern", DMAF.context.currentTime, "bass");
                break;
            case 3:
                this.mutedChannels.other = true;
                DMAF.Processors.getMusicController().musicEvent("empty_pattern", DMAF.context.currentTime, "other");
                break;
            case 4:
                this.mutedChannels.amb = true;
                break;
        }
    };

    this.unmuteChannel = function(channel) {
        switch (channel) {
            case 0:
                this.mutedChannels.comp = false;
                break;
            case 1:
                this.mutedChannels.drums = false;
                break;
            case 2:
                this.mutedChannels.bass = false;
                break;
            case 3:
                this.mutedChannels.other = false;
                break;
            case 4:
                this.mutedChannels.amb = false;
                break;
        }
    };

    //state for the mutes
    this.mutedChannels = {
        comp: false,
        drums: false,
        bass: false,
        other: false,
        amb: false
    };

    //get arrays with all the different instruments.
    this.bassInstruments = this.getInstrumentsOfFunc("bass");
    this.compInstruments = this.getInstrumentsOfFunc("comp");
    this.drumsInstruments = this.getInstrumentsOfFunc("drums");
    this.otherInstruments = this.getInstrumentsOfFunc("other");
    this.allInstruments = this.getInstrumentsOfFunc("all");
    //sort 'em
    this.bassInstruments.sort(this.instrumentSort);
    this.compInstruments.sort(this.instrumentSort);
    this.drumsInstruments.sort(this.instrumentSort);
    this.otherInstruments.sort(this.instrumentSort);
    this.allInstruments.sort(this.instrumentSort);

    //filters instruments based on the filter settings in the GUI
    this.filterInstruments = function(parameters) {

        var channel, that = this;
        var instr = [this.compInstruments, this.drumsInstruments, this.bassInstruments, this.otherInstruments /*, DMAF.getCore().getAmbienceNames()*/ ];
        //make sure the ambience names have 'amb_' prepended
        /*for(var amb = 0; amb < instr[4].length; amb++){
            instr[4][amb] = "amb_" + instr[4][amb];
        }*/

        var filteredInstruments = [];
        var getInstrumentsWithPropertyValue = function(property, instruments, value) {
            var returnArray = [];
            for (var i = instruments.length - 1; i >= 0; i--) { //loop trough the relevant instruments
                if (instrumentMeta[instruments[i]].properties) { // make sure we have meta
                    for (var j = 0; j < instrumentMeta[instruments[i]].properties.length; j++) { //check the properties...
                        if (instrumentMeta[instruments[i]].properties[j].split("_")[0] === property) { //we want the right prop..
                            var propValue = instrumentMeta[instruments[i]].properties[j].split("_")[1];
                            if (value === propValue) {
                                returnArray.push(instruments[i]);
                                break;
                            }
                        }
                    }
                }
            }
            if (!returnArray.length) {
                var randNum = Math.random() * (instruments.length - 1);
                var totalyRandom = instruments[Math.floor(randNum)];
                returnArray.push(totalyRandom);
            }
            return returnArray;
        };

        for (var t = 0; t < instr.length; t++) {
            var instrumentsToPickFrom = instr[t].slice();

            var notMuted = true;
            if (this.parameters.character === "1") {
                instrumentsToPickFrom = getInstrumentsWithPropertyValue("character", instrumentsToPickFrom, "9");
            } else if (this.parameters.character === "0") {
                instrumentsToPickFrom = getInstrumentsWithPropertyValue("character", instrumentsToPickFrom, "0");
            }
            if (instrumentsToPickFrom[0] === "deselected") {
                notMuted = false;
            }
            if (this.parameters.weird === "1" && notMuted) {
                instrumentsToPickFrom = getInstrumentsWithPropertyValue("weird", instrumentsToPickFrom, "9");
                this.unmuteChannel(3);
            } else if (this.parameters.weird === "0" && notMuted) {
                instrumentsToPickFrom = getInstrumentsWithPropertyValue("weird", instrumentsToPickFrom, "0");
            }
            if (instrumentsToPickFrom[0] === "deselected") {
                notMuted = false;
            }
            if (this.parameters.rhythm === "1" && notMuted) {
                instrumentsToPickFrom = getInstrumentsWithPropertyValue("drive", instrumentsToPickFrom, "9");
            } else if (this.parameters.rhythm === "0" && notMuted) {
                instrumentsToPickFrom = getInstrumentsWithPropertyValue("drive", instrumentsToPickFrom, "0");
            }

            filteredInstruments.push(instrumentsToPickFrom);
        }
        return filteredInstruments;
    };

    //filters structures (chord progressions)
    this.getStructureOfType = function(type) {
        var structuresIn = {
            major: [],
            minor: [],
            all: []
        };
        for (structure in structures) {
            //exctract the structures scale/mode
            var mode = structure.split("__")[1].split("_")[0];
            //find it's index...
            var index = DMAF.getController().scaleNames.indexOf(mode);
            //sort it.
            if (index === 1) {
                structuresIn.major.push(structure);
            } else if (index === 4) {
                structuresIn.minor.push(structure);
            }
            structuresIn.all.push(structure);
        }
        //return the propper scales
        if (structuresIn[type]) {
            return structuresIn[type];
        } else {
            return structuresIn.all;
        }
    };

    //this is the one that is run every time the generate button in the GUI is pressed.
    this.generateScore = function() {

        //pick a structure
        var structuresToChoseFrom;
        if (this.parameters.struct === "1") {
            structuresToChoseFrom = this.getStructureOfType("major");
        } else if (this.parameters.struct === "0") {
            structuresToChoseFrom = this.getStructureOfType("minor");
        } else {
            structuresToChoseFrom = this.getStructureOfType();
        }
        var chosenStructure = structuresToChoseFrom[Math.round(Math.random() * (structuresToChoseFrom.length - 1))];
        //dispatch the new structure
        DMAF.getCore().dispatch(chosenStructure);

        //pick an ambience
        var getAmbienceWithPropertyValue = function(property, ambs, value) {
            var returnArray = [];
            for (var i = ambs.length - 1; i >= 0; i--) { //loop trough the relevant ambs
                if (instrumentMeta[ambs[i]].properties) { // make sure we have meta
                    for (var j = 0; j < instrumentMeta[ambs[i]].properties.length; j++) { //check the properties...
                        if (instrumentMeta[ambs[i]].properties[j].split("_")[0] === property) { //we want the right prop..
                            var propValue = instrumentMeta[ambs[i]].properties[j].split("_")[1];
                            if (value === propValue) {
                                returnArray.push(ambs[i]);
                                break;
                            }
                        }
                    }
                }
            }
            if (!returnArray.length) {
                var totalyRandom = ambs[Math.floor(Math.random() * (ambs.length - 1))];
                returnArray.push(totalyRandom);
            }
            return returnArray;
        };

        var ambiencesToChoseFrom = DMAF.getCore().getAmbienceNames(),
            notMuted = true;

        //make sure the ambience names have 'amb_' prepended
        for (var amb = 0; amb < ambiencesToChoseFrom.length; amb++) {
            ambiencesToChoseFrom[amb] = "amb_" + ambiencesToChoseFrom[amb];
        }

        if (this.parameters.character === "1") {
            ambiencesToChoseFrom = getAmbienceWithPropertyValue("character", ambiencesToChoseFrom, "9");
        } else if (this.parameters.character === "0") {
            ambiencesToChoseFrom = getAmbienceWithPropertyValue("character", ambiencesToChoseFrom, "0");
        }
        if (ambiencesToChoseFrom[0] === "deselected") {
            notMuted = false;
        }
        if (this.parameters.weird === "1" && notMuted) {
            ambiencesToChoseFrom = getAmbienceWithPropertyValue("weird", ambiencesToChoseFrom, "9");
            this.unmuteChannel(3);
        } else if (this.parameters.weird === "0" && notMuted) {
            ambiencesToChoseFrom = getAmbienceWithPropertyValue("weird", ambiencesToChoseFrom, "0");
        }
        if (ambiencesToChoseFrom[0] === "deselected") {
            notMuted = false;
        }
        if (this.parameters.rhythm === "1" && notMuted) {
            ambiencesToChoseFrom = getAmbienceWithPropertyValue("drive", ambiencesToChoseFrom, "9");
        } else if (this.parameters.rhythm === "0" && notMuted) {
            ambiencesToChoseFrom = getAmbienceWithPropertyValue("drive", ambiencesToChoseFrom, "0");
        }

        var chosenAmbience = ambiencesToChoseFrom[Math.round(Math.random() * (ambiencesToChoseFrom.length - 1))];
        //dispatch the new structure
        DMAF.getCore().dispatch("amb_" + chosenAmbience);
        DMAF.getCore().dispatch("intensity_amb_0.2");

        //randomize 4 instruments
        var instrumentsToPickFrom = this.filterInstruments(this.properties);
        for (var k = 0; k < instrumentsToPickFrom.length; k++) {
            var stylesToPickFrom = [];
            for (var i = instrumentsToPickFrom[k].length - 1; i >= 0; i--) {
                var styles = this.getPatternsForInstrument(instrumentsToPickFrom[k][i]);
                for (var j in styles) {
                    stylesToPickFrom.push(j);
                }
            };
            //get a random style for the instrument
            var patternStyle = stylesToPickFrom[Math.round(Math.random() * (stylesToPickFrom.length - 1))];
            //find a variation for the style
            var channel;
            switch (k) {
                case 0:
                    channel = "comp";
                    break;
                case 1:
                    channel = "drums";
                    break;
                case 2:
                    channel = "bass";
                    break;
                case 3:
                    channel = "other";
                    break;
                default:
                    //do nothing
                    continue;
            }
            if (this.parameters.complexity === "0") {
                this[channel + "Slot"].intensity = 0.2;
            } else {
                this[channel + "Slot"].intensity = 0.5;
            }
            var pattern = DMAF.getCore().findVariationFor(patternStyle, channel);
            if (pattern && pattern.search("undefined") !== -1) {
                this[channel + "Slot"].currentPattern = "deselected";
                continue;
            }
            this.startSpecifiedPattern(pattern, channel);
        }

        return;
    };

    //the first function that first served as some kind of randomization function itself. It has since then gone trough
    //many many many changes. I think I'll comment it further within.
    this.startPattern = function(trigger) {
        var sliderNumber, sliderValue, sliderFunction, triggerSplit, instruments, instrument, pattern, value2, value3, value4, slot, channel;

        //trigger was in the format "slider_3_other_0.54" when we first made prototypes. That was because we were experimenting with
        //the filters and individual controls of the different slots/channels, which at the time were sliders.
        //Since then the handling of the filters has been moved to onEvent, but this remains because it's
        //used by other functions that hasn't been updated to use the onEvent syntax...
        triggerSplit = trigger.split("_");
        sliderNumber = triggerSplit[1];
        sliderFunction = triggerSplit[2];
        sliderValue = triggerSplit[3];

        //classic massive switch in the spirit of all dinahmoe projects. :)
        //we check the sliderFunction to see what the slider affects
        //this.patternUtil.startPattern("slider_3_" + slot + "_" + trigger.split("_")[2]);
        switch (sliderFunction) {
            //we had a pattern slider, not sure if this is anymore, but it's all kept anyway. "Don't touch that dial".
            case "pattern":
                switch (triggerSplit[3]) {
                    case "0":
                        if (!this.mutedChannels.comp && this.compSlot["currentPattern"]) {
                            DMAF.getController().onInternalEvent(this.compSlot["currentPattern"], DMAF.context.currentTime, {
                                channel: "comp"
                            });
                        }
                        return;
                    case "1":
                        if (!this.mutedChannels.drums && this.drumsSlot["currentPattern"]) {
                            DMAF.getController().onInternalEvent(this.drumsSlot["currentPattern"], DMAF.context.currentTime, {
                                channel: "drums"
                            });
                        }
                        return;
                    case "2":
                        if (!this.mutedChannels.bass && this.bassSlot["currentPattern"]) {
                            DMAF.getController().onInternalEvent(this.bassSlot["currentPattern"], DMAF.context.currentTime, {
                                channel: "bass"
                            });
                        }
                        return;
                    case "3":
                        if (!this.mutedChannels.other && this.otherSlot["currentPattern"]) {
                            DMAF.getController().onInternalEvent(this.otherSlot["currentPattern"], DMAF.context.currentTime, {
                                channel: "other"
                            });
                        }
                        return;
                    default:
                        return;
                }
                break;
                //we had global sliders that affected values for all channels, such as intensity and what not
            case "global":
                if (sliderNumber === "1") {
                    DMAF.getCore().dispatch("mode_" + (Math.floor(sliderValue * 6) + 1));
                    return;
                }
                if (sliderNumber === "8") {
                    var structurePatterns = Object.keys(structures);
                    var structurePattern = structurePatterns[Math.floor(sliderValue * (structurePatterns.length - 1))];
                    DMAF.getCore().dispatch(structurePattern);
                    if (!this.mutedChannels.comp) {
                        DMAF.getController().onInternalEvent("newStructure_" + this.compSlot.currentPattern, DMAF.context.currentTime, {
                            channel: "comp"
                        });
                    }
                    if (!this.mutedChannels.drums) {
                        DMAF.getController().onInternalEvent("newStructure_" + this.drumsSlot.currentPattern, DMAF.context.currentTime, {
                            channel: "drums"
                        });
                    }
                    if (!this.mutedChannels.bass) {
                        DMAF.getController().onInternalEvent("newStructure_" + this.bassSlot.currentPattern, DMAF.context.currentTime, {
                            channel: "bass"
                        });
                    }
                    if (!this.mutedChannels.other) {
                        DMAF.getController().onInternalEvent("newStructure_" + this.otherSlot.currentPattern, DMAF.context.currentTime, {
                            channel: "other"
                        });
                    }
                    return;
                }
                this.compSlot[sliderNumber] = sliderValue;
                this.bassSlot[sliderNumber] = sliderValue;
                this.drumsSlot[sliderNumber] = sliderValue;
                this.otherSlot[sliderNumber] = sliderValue;

                if (this.bassSlot["4"]) {
                    slot = this.bassSlot;
                    instruments = that.bassInstruments;
                    instrument = instruments[Math.floor(slot[4] * (instruments.length))];
                    slot["currentPattern"] = slot.intensity === "0" ? "empty_pattern" : this.getPattern(slot[4], slot.intensity, "bass");
                    if (!this.mutedChannels.bass) {
                        DMAF.getController().onInternalEvent(slot["currentPattern"], DMAF.context.currentTime, {
                            channel: "bass"
                        });
                    }
                }
                if (this.compSlot["4"]) {
                    slot = this.compSlot;
                    instruments = that.compInstruments;
                    instrument = instruments[Math.floor(slot[4] * (instruments.length))];
                    slot["currentPattern"] = slot.intensity === "0" ? "empty_pattern" : this.getPattern(slot[4], slot.intensity, "comp");
                    if (!this.mutedChannels.comp) {
                        DMAF.getController().onInternalEvent(slot["currentPattern"], DMAF.context.currentTime, {
                            channel: "comp"
                        });
                    }
                }
                if (this.drumsSlot["4"]) {
                    slot = this.drumsSlot;
                    instruments = that.drumsInstruments;
                    instrument = instruments[Math.floor(slot[4] * (instruments.length))];
                    slot["currentPattern"] = slot.intensity === "0" ? "empty_pattern" : this.getPattern(slot[4], slot.intensity, "drums");
                    if (!this.mutedChannels.drums) {
                        DMAF.getController().onInternalEvent(slot["currentPattern"], DMAF.context.currentTime, {
                            channel: "drums"
                        });
                    }
                }
                if (this.otherSlot["4"]) {
                    slot = this.otherSlot;
                    instruments = that.otherInstruments;
                    instrument = instruments[Math.floor(slot[4] * (instruments.length))];
                    slot["currentPattern"] = slot.intensity === "0" ? "empty_pattern" : this.getPattern(slot[4], slot.intensity, "other");
                    if (!this.mutedChannels.other) {
                        DMAF.getController().onInternalEvent(slot["currentPattern"], DMAF.context.currentTime, {
                            channel: "other"
                        });
                    }
                }
                return;
                //the individual slots' controls. We check to see if the slot has the "4" property set, and if so it's passed on
                //to the end of this function where a pattern is started is based on the new values
            case "comp":
                this.compSlot[sliderNumber] = sliderValue;
                if (this.compSlot["4"]) {
                    slot = this.compSlot;
                    channel = "comp";
                    break;
                } else {
                    return;
                }
            case "drums":
                this.drumsSlot[sliderNumber] = sliderValue;
                if (this.drumsSlot["4"]) {
                    slot = this.drumsSlot;
                    channel = "drums";
                    break;
                } else {
                    return;
                }
            case "bass":
                this.bassSlot[sliderNumber] = sliderValue;
                if (this.bassSlot["4"]) {
                    slot = this.bassSlot;
                    channel = "bass";
                    break;
                } else {
                    return;
                }
            case "other":
                this.otherSlot[sliderNumber] = sliderValue;
                if (this.otherSlot["4"]) {
                    slot = this.otherSlot;
                    channel = "other";
                    break;
                } else {
                    return;
                }
            default:
                DMAF.error("unknow slider: " + sliderFunction);
                return;
        }
        //start new patterns based on the new slider values for the affected slot
        //instruments = that.getInstrumentsOfFunc(channel);
        //instruments.sort(that.instrumentSort);
        //instrument = instruments[Math.floor(slot[4] * (instruments.length))];
        slot["currentPattern"] = slot.intensity === "0" ? "empty_pattern" : this.getPattern(slot[4], slot.intensity, channel);
        if (!this.mutedChannels[channel]) {
            DMAF.getController().onInternalEvent(slot["currentPattern"], DMAF.context.currentTime, {
                channel: channel
            });
        }

    };

    //change the state of the framework based on the saved data of an animation
    this.changeMusicData = function(data) {
        if (data.slot1) {
            if (data.slot1 === "deselected") {
                this.startSpecifiedPattern("empty_pattern", "comp");
                this.mutedChannels.comp = true;
            } else {
                if (!data.mutes.comp) {
                    DMAF.getController().patternUtil.mutedChannels.comp = false;
                } else {
                    DMAF.getController().patternUtil.mutedChannels.comp = true;
                }
                this.startSpecifiedPattern(data.slot1, "comp");
            }
        }
        if (data.slot2) {
            if (data.slot2 === "deselected") {
                this.startSpecifiedPattern("empty_pattern", "drums");
                this.mutedChannels.drums = true;
            } else {
                if (!data.mutes.drums) {
                    DMAF.getController().patternUtil.mutedChannels.drums = false;
                } else {
                    DMAF.getController().patternUtil.mutedChannels.drums = true;
                }
                this.startSpecifiedPattern(data.slot2, "drums");
            }
        }
        if (data.slot3) {
            if (data.slot3 === "deselected") {
                this.startSpecifiedPattern("empty_pattern", "bass");
                this.mutedChannels.bass = true;
            } else {
                if (!data.mutes.bass) {
                    DMAF.getController().patternUtil.mutedChannels.bass = false;
                } else {
                    DMAF.getController().patternUtil.mutedChannels.bass = true;
                }
                this.startSpecifiedPattern(data.slot3, "bass");
            }
        }
        if (data.slot4) {
            if (data.slot4 === "deselected") {
                this.startSpecifiedPattern("empty_pattern", "other");
                this.mutedChannels.other = true;
            } else {
                if (!data.mutes.other) {
                    DMAF.getController().patternUtil.mutedChannels.other = false;
                } else {
                    DMAF.getController().patternUtil.mutedChannels.other = true;
                }
                this.startSpecifiedPattern(data.slot4, "other");
            }
        }
        if (data.ambience) {
            if (data.ambience === "deselected") {
                //DMAF.getCore().dispatch("amb_stop");
                this.ambSlot.currentAmbience = data.ambience;
                this.ambSlot.selectedAmbience = data.ambience;
            } else {
                if (!data.mutes.amb) {
                    DMAF.getController().patternUtil.mutedChannels.amb = false;
                    DMAF.getCore().dispatch("amb_" + data.ambience);
                } else {
                    DMAF.getController().patternUtil.mutedChannels.amb = true;
                    DMAF.getCore().dispatch("amb_stop");
                }
                this.ambSlot.currentAmbience = data.ambience;
                this.ambSlot.selectedAmbience = data.ambience;
            }
        }

        if (data.mutes.comp === true) {
            this.muteChannel(0);
        }
        if (data.mutes.drums === true) {
            this.muteChannel(1);
        }
        if (data.mutes.bass === true) {
            this.muteChannel(2);
        }
        if (data.mutes.other === true) {
            this.muteChannel(3);
        }
        if (data.mutes.amb === true) {
            this.muteChannel(4);
        }

        if (data.intensities) {
            this.compSlot.intensity = data.intensities.slot1 === undefined ? 0.5 : parseFloat(data.intensities.slot1);
            this.drumsSlot.intensity = data.intensities.slot2 === undefined ? 0.5 : parseFloat(data.intensities.slot2);
            this.bassSlot.intensity = data.intensities.slot3 === undefined ? 0.5 : parseFloat(data.intensities.slot3);
            this.otherSlot.intensity = data.intensities.slot4 === undefined ? 0.5 : parseFloat(data.intensities.slot4);
            this.ambSlot.intensity = data.intensities.amb === undefined ? 0.5 : parseFloat(data.intensities.amb);
            DMAF.getCore().dispatch("intensity_amb_" + parseFloat(data.intensities.amb));
        }

        if (data.structure && data.structure !== "default" && data.structure !== "deselected") {
            DMAF.getCore().dispatch(data.structure + "__noDelay");
            that.originalStructure = data.structure;
        }
    };
};
