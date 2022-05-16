var DMAF = DMAF || {};
DMAF.Synth = DMAF.Synth || {};
DMAF.Actions = DMAF.Actions || {};
DMAF.Managers = DMAF.Managers || {};
DMAF.Factories = DMAF.Factories || {};
DMAF.Processors = DMAF.Processors || {};
DMAF.AudioNodes = DMAF.AudioNodes || {};
DMAF.Iterators = DMAF.Iterators || {};
DMAF.Sounds = DMAF.Sounds || {};
DMAF.Utils = DMAF.Utils || {};
/*
 * Issue list:
 * vad händer om man laddar samma xml twice?
 * sound basic ska inte ha stop och sound ID
 * soundstep ska kunna ha endast ett ljud
 */
//-----------------------------------------------------------------------------------
//------------------------------------PROJECT SPECIFIC-------------------------------
//-----------------------------------------------------------------------------------
DMAF.soundsPath = "DMAF/sounds/";
//DMAF.soundsPath = "sounds/";
//DMAF.actionsPath = "/xml/";
DMAF.actionsPath = "DMAF/xml/";
DMAF.midiPath = "DMAF/midi/";
DMAF.preListen = 30;
DMAF.tempo = 120;
DMAF.FPS = 16;
DMAF.dispatchFrames = true;

//location of the actions-xml
if(navigator.userAgent.match(/(iPad|iPhone|iPod)/g)){
    DMAF.actionsXMLsrc = DMAF.actionsPath+"config_mobile.xml";
} else {
    DMAF.actionsXMLsrc = DMAF.actionsPath+"config.xml";
}


var a = document.createElement('audio');
if(!!(a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''))){
    DMAF.fileFormat = ".ogg";
} else if(!!(a.canPlayType && a.canPlayType('audio/mp4; codecs="mp4a.40.2"').replace(/no/, ''))){
    DMAF.fileFormat = ".aac";
} else {
    console.log("Can't play audio format!");
    DMAF.contextAvailable = false;
}
a = null;


//locations of the libraries, format: [url], [loadNow], [loadevent]]
//loadNow and loadevent are optional, if omited - loadnow = true
if(DMAF.fileFormat === ".ogg"){
    DMAF.libraryXMLList = [
        [DMAF.actionsPath+"PreSoundsOGG.xml", false, "loadGlobal"]
    ];
} else if(DMAF.fileFormat === ".aac"){
    DMAF.libraryXMLList = [
        [DMAF.actionsPath+"PreSoundsAAC.xml", false, "loadGlobal"]
    ];
}


//-----------------------------------------------------------------------------------
//------------------------------------DO NOT EDIT------------------------------------
//-----------------------------------------------------------------------------------

function EventDispatcher() {
    this._listeners = {};
    this._globalListeners = [];
}
EventDispatcher.prototype = {
    constructor: EventDispatcher,
    addEventListener: function(a, b) {
        if (a === "*") {
            this._globalListeners.push(b);
        } else {
            if (typeof this._listeners[a] == "undefined") {
                this._listeners[a] = [];
            }
            this._listeners[a].push(b);
        }
    },
    removeEventListener: function(a, b) {
        if (this._listeners[a] instanceof Array) {
            var c = this._listeners[a];
            for (var d = 0; d < c.length; d++) {
                if (c[d] === b) {
                    c.splice(d, 1);
                    break;
                }
            }
        }
    },
    dispatch: function(a, params) {
        if (typeof a == "string") {
            a = {
                type: a
            };
        } else {
            DMAF.debug("DMAFError: DMAF.dispatch needs a string as an argument. Dispatch aborted.");
            return;
        }
        if (!a.target) {
            a.target = this;
        }
        if (this._listeners[a.type] instanceof Array) {
            var b = this._listeners[a.type];
            for (var c = 0; c < b.length; c++) {
                b[c].call(this, a, params);
            }
        }
        for (var d = 0; d < this._globalListeners.length; d++) {
            this._globalListeners[d].call(this, a, params);
        }
    }
};
