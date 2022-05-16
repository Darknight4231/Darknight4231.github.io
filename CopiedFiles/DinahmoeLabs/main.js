// jscs:disable
console.log("is live");
window.onload = function() {

    window.performance = window.performance || {};
    performance.now = (function() {
        return performance.now       ||
            performance.mozNow    ||
            performance.msNow     ||
            performance.oNow      ||
            performance.webkitNow ||
            Date.now;  /*none found - fallback to browser default */
    })();

    var dmaf = new DMAF.Framework(),
        intensitySlider = getElement("intensity");

    if(!dmaf.enabled){
        console.log("DMAF not active", dmaf);
        getElement("container").style.top = (window.innerHeight / 2 - 311) + "px";
        getElement("container").className = getElement("container").className.replace("hidden", "");
        getElement("footer").className = getElement("footer").className.replace("hidden", "");
        getElement("brandingContainer_alt").className = "faded";
        getElement("brandingContainer").className = "hidden";
        getElement("random").className = "invisible";
        return;
    }
    var slots = {
            comp: "slot1",
            drums: "slot2",
            bass: "slot3",
            other: "slot4",
            master: "",
            amb: "ambience"
        },
        vuProcessors = {
            comp: DMAF.context.createScriptProcessor(1024, 1, 1),
            drums: DMAF.context.createScriptProcessor(1024, 1, 1),
            bass: DMAF.context.createScriptProcessor(1024, 1, 1),
            other: DMAF.context.createScriptProcessor(1024, 1, 1)
        },
        followedLink = false,
        isMobile = (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false),
        clickEvent = isMobile ? "touchstart" : "click";

    if (isMobile) {
        dmaf.dispatch("isMobile");
        //document.getElementById("amb").className += " disabled";
        //document.getElementById("ambOn").className += " disabled";
        document.addEventListener('touchmove', function(e){
            if(e.target.type === "range"){
                //console.log("is input", e);
            } else {
                //console.log("not input");
                e.preventDefault();
            }
        });
    }
    dmaf.dispatch("loadGlobal");

    var location = window.location.href.split("?");
    if (location.length > 1) {
        var values = location[1].split("=");
        if (values[0] === "song") {
            followedLink = true;
            getElement("random").value = "play score";
            var settings = JSON.parse(decodeURIComponent(values[1]));
            DMAF.getCore().setMusicData(settings);
        }
    }

    function getElement(id) {
        return document.getElementById(id);
    }

    //setup the VU processors
    var vuGain = DMAF.context.createGain();
    vuGain.gain.value = 0;
    vuGain.connect(DMAF.context.destination);
    vuProcessors["comp"].onaudioprocess = generateVUProcessor("comp");
    vuProcessors["drums"].onaudioprocess = generateVUProcessor("drums");
    vuProcessors["bass"].onaudioprocess = generateVUProcessor("bass");
    vuProcessors["other"].onaudioprocess = generateVUProcessor("other");
    vuProcessors["comp"].connect(vuGain);
    vuProcessors["drums"].connect(vuGain);
    vuProcessors["bass"].connect(vuGain);
    vuProcessors["other"].connect(vuGain);

    //do some positioning
    getElement("container").style.top = (window.innerHeight / 2 - 350) + "px";
    getElement("container").className = getElement("container").className.replace("hidden", "");
    getElement("footer").className = getElement("footer").className.replace("hidden", "");

    window.addEventListener("resize", resize);

    function resize() {
        var top = (window.innerHeight / 2 - 350);
        if (top < 10) {
            top = 10;
        }
        getElement("container").style.top = top + "px";
    }
    resize();

    if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i)) {
        document.getElementsByTagName("html")[0].className = "ipad ios7";
    }

    /*

        Score generation

    */

    function generateLoadCallback(channel, instrument) {
        return function loadCallback() {
            getElement(channel + "On").value = "on";
            dmaf.removeEventListener("loadComplete_" + instrument, loadCallback);
            var synth = DMAF.Managers.getSynthManager().getActiveInstance(instrument);
            if (synth) {
                synth.output.connect(vuProcessors[channel]);
            } else {
                //probably using the same sample map as another instument and loadComplete_ is triggered before the synth has been added to activeInstances
                setTimeout(function() {
                    synth = DMAF.Managers.getSynthManager().getActiveInstance(instrument);
                    if (synth) {
                        synth.output.connect(vuProcessors[channel]);
                    }
                }, 15);
            }
        };
    }

    function listenForLoad(channel, data) {
        var instrument = data[slots[channel]].split("__")[0];
        instrument = instrument.replace("_weird", "");
        instrument = instrument.replace("_half", "");
        if (instrument !== "fx_for_walking" && instrument !== "pad_es2_warm") {
            instrument = instrument.replace("_w", "");
        }
        if (instrument === "cello_pluck_bass_h") {
            instrument = "cello_pluck_bass";
        }
        dmaf.addEventListener("loadComplete_" + instrument, generateLoadCallback(channel, instrument));
    }

    function generateVUProcessor(channel) {
        var buffer,
            maxVal,
            length;
        return function VUCallback(e) {
            buffer = e.inputBuffer.getChannelData(0);

            maxVal = 0;
            length = buffer.length;
            // Iterate through buffer to check for the highest value
            for (var i = 0; i < length; i+=4) {
                if (maxVal < buffer[i]) {
                    maxVal = buffer[i];
                }
            }
            if (maxVal <= 0.01) {
                getElement(channel + "VU").className = "vuBar";
            } else if (maxVal > 1) {
                getElement(channel + "VU").className = "vuBar VU1 VU2 VU3 VU4 VU5 VU6";
            } else if (maxVal > 0.2) {
                getElement(channel + "VU").className = "vuBar VU1 VU2 VU3 VU4 VU5";
            } else if (maxVal > 0.1) {
                getElement(channel + "VU").className = "vuBar VU1 VU2 VU3 VU4";
            } else if (maxVal > 0.05) {
                getElement(channel + "VU").className = "vuBar VU1 VU2 VU3";
            } else if (maxVal > 0.025) {
                getElement(channel + "VU").className = "vuBar VU1 VU2";
            } else if (maxVal > 0.01) {
                getElement(channel + "VU").className = "vuBar VU1";
            }
        };
    }

    var randomizeButton = getElement("random");
    randomizeButton.addEventListener(clickEvent, onrandombuttonclick);
    function onrandombuttonclick () {
        //expand the panel if this is the first randomize
        randomizeButton.style.cssText = "";
        randomizeButton.style.visibility = "visibile";
        var extra = getElement("extra");
        if (extra.className.search("expanded") === -1) {
            extra.className += " expanded";
            getElement("panel").className += " panelExpanded";
            getElement("panel").className = getElement("panel").className.replace("invisible", "visible");
            getElement("divider2").className = getElement("divider2").className.replace("invisible", "visible");
            getElement("branding").removeChild(getElement("sub"));
            getElement("brandingContainer").innerHTML = "";
            getElement("branding").removeChild(getElement("brandingLinks"));
            getElement("off").className = getElement("off").className.replace("invisible", "visible");
            getElement("share").className = getElement("share").className.replace("hidden", "");

            getElement("brandingContainer").appendChild(getElement("filters"));

            var kick = DMAF.context.createBufferSource(),
                buffer = DMAF.context.createBuffer(1, 100, 44100);
            kick.buffer = buffer;
            kick.start(0);
            if(!followedLink){
                dmaf.dispatch("wet_0.2");
            }
        }

        //make sure the on/off buttons are set to the proper state when randomizing
        var data = DMAF.getCore().getTreeMusicData(),
            mutes = data.mutes;

        if (!followedLink) {
            dmaf.dispatch("generateScore");
            data = DMAF.getCore().getTreeMusicData();
            //reset the intensity slider
            //getElement("intensity").value = 0.2;
            //dmaf.dispatch("intensity_"+getElement("intensity").value);
        } else {
            getElement("intensity").value = data.intensities.amb;
            getElement("wet").value = parseFloat(data.wet);
        }

        for (var channel in mutes) {
            if (mutes[channel] === true) {
                getElement(channel + "On").value = "off";
            } else {
                if (channel === "amb") {
                    getElement(channel + "On").value = "on";
                    break;
                }
                getElement(channel + "On").value = "loading...";
            }
            //change button color and attach VU when loaded
            listenForLoad(channel, data);
        }

        randomizeButton.value = "Generate New Score";
        getElement("random").className = "";

        dmaf.dispatch("musicOff");
        setTimeout(function() {
            dmaf.dispatch("musicOn");
            //force VU listeners to attach
            setTimeout(dispatchIntensity, 500);
            if (followedLink) {
                followedLink = false;
            }
        }, 1000);
    }


    /*

        Misc. UI

     */
    var musicOffButton = getElement("off"),
        musicOffImg = getElement("offImg");
    musicOffButton.addEventListener(clickEvent, function() {
        if (musicOffImg.src.search("speaker32.png") !== -1) {
            //dmaf.dispatch("musicOff");
            dmaf.dispatch("muteButtonPressed");
            musicOffImg.src = "img/speakermute32.png";
        } else {
            //dmaf.dispatch("musicOn");
            dmaf.dispatch("unmuteButtonPressed");
            musicOffImg.src = "img/speaker32.png";
        }
    });

    var randomizeChordsButton = getElement("changechords");
    randomizeChordsButton.addEventListener(clickEvent, function() {
        DMAF.getCore().randomizeStructure();
        dmaf.dispatch("randomKey");
    });

    var value = -1,
        intesityTimeout = 0,
        lastInstensityDispatch = -1,
        timeNow = -1;
    function dispatchIntensity() {
        clearTimeout(intesityTimeout);
        timeNow = performance.now();
        value = intensitySlider.value;
        if(lastInstensityDispatch + 200 > timeNow){
            intesityTimeout = setTimeout(function(){
                doDispatchIntensity(value);
            },200);
            return;
        }
        doDispatchIntensity(value);
    }

    function doDispatchIntensity(intensityValue){
        lastInstensityDispatch = performance.now();
        dmaf.dispatch("intensity_" + intensityValue);
        dmaf.dispatch("intensity_comp_" + intensityValue);
        dmaf.dispatch("intensity_drums_" + intensityValue);
        dmaf.dispatch("intensity_bass_" + intensityValue);
        dmaf.dispatch("intensity_other_" + intensityValue);
        dmaf.dispatch("intensity_amb_" + intensityValue);
    }

    var generateLinkButton = getElement("generateLink");
    generateLinkButton.addEventListener(clickEvent, function() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://api.bit.ly/v3/shorten?login=dinahmoe&apiKey=R_932e5f9aefb6938ec7b02187766b2c39&longUrl=" + encodeURIComponent("http://dinahmoelabs.com/_theme/?song=" + DMAF.getCore().getTreeMusicData(true)), true);
        xhr.onload = function(e) {
            console.log("bitly 1 response");
            var response = JSON.parse(e.target.response),
                url = response.data.url;
            var tweetOwn = getElement("tweetOwn");
            if (tweetOwn) {
                getElement("sharePanel").removeChild(tweetOwn);
            }

            var second_xhr = new XMLHttpRequest();
            second_xhr.open("GET", "http://api.bit.ly/v3/shorten?login=dinahmoe&apiKey=R_932e5f9aefb6938ec7b02187766b2c39&longUrl=" + encodeURIComponent("http://dinahmoelabs.com/theme/#theme-" + url), true);
            second_xhr.onload = function(e) {
                console.log("bitly 2 response");
                var response = JSON.parse(e.target.response),
                    second_url = response.data.url;

                // sharing buttons
                var gplus = document.createElement("div"),
                    gplusImg = document.createElement("img"),
                    twitter = document.createElement("div"),
                    twitterImg = document.createElement("img"),
                    face = document.createElement("div"),
                    faceImg = document.createElement("img"),
                    faceLink = document.createElement("a"),
                    shareText = "I’ve created my own soundtrack with #ThEME by @DinahmoeSTHLM Listen to it here:",
                    shareContainer = document.createElement("div");

                twitter.className = "share-logo";
                twitterImg.src = "http://a6c2ddd44eeb424bbd81-387f99874fb8448921e210828b10137d.r13.cf5.rackcdn.com/img/Twitter_logo_blue.png";
                twitterImg.className = "logo-img";
                twitter.appendChild(twitterImg);
                twitterImg.onclick = function () {
                    var href = "http://twitter.com/share?url=";
                    //href += url;
                    href += second_url;
                    href += "&text=" + shareText.replace("#", "%23").replace("@", "%40");
                    //href += "&hashtags=tonecraft";
                    var popup = window.open(href, "share", "height=315, width=415");
                    if (window.focus) {
                        popup.focus();
                    }
                };

                face.className = "share-logo";
                faceImg.src = "http://a6c2ddd44eeb424bbd81-387f99874fb8448921e210828b10137d.r13.cf5.rackcdn.com/img/FB-f-Logo__blue_512.png";
                faceImg.className = "logo-img";
                face.appendChild(faceImg);
                faceImg.onclick = function () {
                    var href = "https://www.facebook.com/sharer/sharer.php?u=" + second_url;
                    var popup = window.open(href, "share", "height=315, width=415");
                    if (window.focus) {
                        popup.focus();
                    }
                };

                // gplus has an initialization step below, but it needs to happen
                // after the element has been attached to the document
                gplus.className = "share-logo";
                gplusImg.src = "http://a6c2ddd44eeb424bbd81-387f99874fb8448921e210828b10137d.r13.cf5.rackcdn.com/img/g+icon_red.png";
                gplusImg.className = "logo-img";
                gplusImg.id = "gplus-img";
                gplus.appendChild(gplusImg);

                shareContainer.id = "share-container";
                shareContainer.appendChild(gplus);
                shareContainer.appendChild(twitter);
                shareContainer.appendChild(face);

                var sharePanelHtml = '<h3>Tweet or share your link to let your friends hear your composition.</h3>';
                sharePanelHtml += '<p class="uniqueLink"><span="linkLabel">Direct link:</span> ' + second_url + '</p>';
                //sharePanelHtml += '<a id="tweetOwn" href="https://twitter.com/share" class="twitter-share-button" data-lang="en" data-text="Listen to my Exquisite Music and make your own soundtrack! #ThEME by @DinahmoeSTHLM ' + url + '" data-count="none">Tweet</a>';
                //sharePanelHtml += '<a id="fb_own" href="http://www.facebook.com/dialog/feed?app_id=586249694720587&link=' + url + '&name=Listen%20to%20my%20Exquisite%20Music&description=Make%20your%20own%20soundtrack%20with%20This%20Exquisite%20Music%20Engine%20by%20DinahMoe%20%23ThEME&redirect_uri=' + encodeURIComponent("http://dinahmoelabs.com/theme/?song=" + DMAF.getCore().getTreeMusicData(true)) + '" target="_blank"><img src="img/share.png" alt="facebook"/></a>';
                sharePanelHtml += '<div id="closeShare"><img src="img/close.png" alt="close"/></div>';
                getElement("sharePanel").innerHTML = sharePanelHtml;
                getElement("sharePanel").style.left = (window.innerWidth / 2 - 206) + "px";
                getElement("sharePanel").style.top = (window.innerHeight / 2 - 39) + "px";
                getElement("sharePanel").appendChild(shareContainer);
                document.body.removeChild(getElement("twitter-wjs"));
                runTweetScript();
                getElement("overlay").className = getElement("overlay").className.replace("invisible", "visible");
                getElement("sharePanel").className = getElement("sharePanel").className.replace("invisible", "visible");
                getElement("overlay").addEventListener(clickEvent, closeShare);
                getElement("closeShare").addEventListener(clickEvent, closeShare);

                // init google share
                gapi.interactivepost.render("gplus-img", {
                    contenturl: second_url,
                    clientid: "417089818181-c98sdu60qp21k1epujijnrk3t9242v9k.apps.googleusercontent.com",
                    prefilltext: shareText + " " + second_url,
                    cookiepolicy: "single_host_origin",
                    calltoactionlabel: "CREATE",
                    calltoactionurl: second_url,
                });
            };
            second_xhr.send(null);
        };
        xhr.send(null);
    });

    function closeShare() {
        getElement("overlay").className = getElement("overlay").className.replace("visible", "invisible");
        getElement("sharePanel").className = getElement("sharePanel").className.replace("visible", "invisible");
        getElement("overlay").removeEventListener(clickEvent, closeShare);
    }

    /*

        SLOTS

     */

    function generateSlotMuteCallback(button, channelNumber) {
        return function() {
            if (button.value === "on") {
                dmaf.dispatch("mute_" + channelNumber);
                button.value = "off";
            } else {
                dmaf.dispatch("unmute_" + channelNumber);
                button.value = "on";
            }
        };
    }

    var muteCompButton = getElement("compOn");
    muteCompButton.addEventListener(clickEvent, generateSlotMuteCallback(muteCompButton, "0"));

    var muteDrumsButton = getElement("drumsOn");
    muteDrumsButton.addEventListener(clickEvent, generateSlotMuteCallback(muteDrumsButton, "1"));

    var muteBassButton = getElement("bassOn");
    muteBassButton.addEventListener(clickEvent, generateSlotMuteCallback(muteBassButton, "2"));

    var muteOtherButton = getElement("otherOn");
    muteOtherButton.addEventListener(clickEvent, generateSlotMuteCallback(muteOtherButton, "3"));

    var muteAmbButton = getElement("ambOn");
    muteAmbButton.addEventListener(clickEvent, generateSlotMuteCallback(muteAmbButton, "4"));

    function generateSlotRandomizeCallback(button, channel) {
        return function() {
            button.value = "loading...";
            DMAF.getCore().randomizeInstrument(channel);
            listenForLoad(channel, DMAF.getCore().getTreeMusicData());
        };
    }

    var randomizeCompButton = getElement("comp");
    randomizeCompButton.addEventListener(clickEvent, generateSlotRandomizeCallback(muteCompButton, "comp"));

    var randomizeDrumsButton = getElement("drums");
    randomizeDrumsButton.addEventListener(clickEvent, generateSlotRandomizeCallback(muteDrumsButton, "drums"));

    var randomizeBassButton = getElement("bass");
    randomizeBassButton.addEventListener(clickEvent, generateSlotRandomizeCallback(muteBassButton, "bass"));

    var randomizeOtherButton = getElement("other");
    randomizeOtherButton.addEventListener(clickEvent, generateSlotRandomizeCallback(muteOtherButton, "other"));

    var randomizeAmbButton = getElement("amb");
    randomizeAmbButton.addEventListener(clickEvent, function() {
        DMAF.getCore().randomizeAmbience();
        muteAmbButton.value = "loading";
        //do quick visual change to indicate that something happened. :)
        setTimeout(function(){
            muteAmbButton.value = "on";
        },50);
    });


    /*

        SLIDERS

     */

    function generateFilterChangeCallback(slider, marker1Id, marker2Id, dispatchString) {
        var marker1 = getElement(marker1Id),
            marker2 = getElement(marker2Id);

        return function() {
            if (slider.value === "0") {
                marker1.style.marginLeft = "75px";
                marker2.style.marginLeft = "125px";
            } else if (slider.value === "1") {
                marker1.style.marginLeft = "25px";
                marker2.style.marginLeft = "75px";
            } else {
                marker1.style.marginLeft = "25px";
                marker2.style.marginLeft = "125px";
            }
            dmaf.dispatch(dispatchString + slider.value);
            getElement("random").className = "changed";
        };
    }

    var slider = getElement("mood");
    slider.onchange = generateFilterChangeCallback(slider, "moodMarker1", "moodMarker2", "struct_");

    slider = getElement("style");
    slider.onchange = generateFilterChangeCallback(slider, "styleMarker1", "styleMarker2", "character_");

    slider = getElement("rhythm");
    slider.onchange = generateFilterChangeCallback(slider, "rhythmMarker1", "rhythmMarker2", "rhythm_");

    //slider = getElement("complexity");
    //slider.onchange = generateFilterChangeCallback(slider, "complexityMarker1", "complexityMarker2", "complexity_");

    //slider = getElement("weird");
    //slider.onchange = generateFilterChangeCallback(slider, "weirdMarker1", "weirdMarker2", "weird_");

    slider = getElement("intensity");
    slider.oninput = dispatchIntensity;

    slider = getElement("wet");
    slider.oninput = (function() {
        return function() {
            dmaf.dispatch("wet_" + slider.value);
        };
    })();
    if (/iPhone/.test(navigator.userAgent) || /iPad/.test(navigator.userAgent) || /Android/.test(navigator.userAgent)) {
        document.body.innerHTML = "<p class='mobileCopy'>Sorry, the Exquisite Music Engine is not available on mobile devices.<br />Please come back using Chrome or Safari for desktop.<br /><a href='http://www.dinahmoe.com'>DinahMoe</a></p>";
    }

    // for portal
    setTimeout(onrandombuttonclick, 1000);
};
