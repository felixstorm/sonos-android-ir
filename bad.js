"use strict";
var net = require("net");

var SonosDiscovery = require('sonos-discovery');
var discovery = new SonosDiscovery();

var Keyboard = require('./keyboard.js');
var keyboard = new Keyboard('event3');

// This maps the key code from lircd with an action
var actions = {
  "vol_up": function (player) {
    player.setVolume("+1");
    return true;
  },
  "vol_down": function (player) {
    player.setVolume("-1");
    return true;
  },
  "<<": function (player) {
    player.coordinator.previousTrack();
    return false;
  },
  ">>": function (player) {
    player.coordinator.nextTrack();
  },
  "play": function (player) {
    player.coordinator.play();
  },
  "pause": function (player) {
    player.coordinator.pause();
    return false;
  },
  "red": function () {
    console.log("Switching player to Wohnzimmer");
    player = discovery.getPlayer("Wohnzimmer");
  },
  "green": function () {
    console.log("Switching player to Bad");
    player = discovery.getPlayer("Bad");
  },
  "yellow": function () {
    console.log("Switching player to Kueche");
    player = discovery.getPlayer("Kueche");
  }
};

// presets for grouping
var presets = {
  "all": {"players": [
    { "roomName": "Wohnzimmer", "volume": 10 },
    { "roomName": "Bad", "volume": 10 },
    { "roomName": "Kueche", "volume": 10 }
  ]}};

// this maps keycodes to predefined presets
var buttonToPreset = {
  "1a": "all",
  "2a": "tv"
};


var player = null;

// We need an initial player as soon as we have scanned the network
// I auto select the "TV Room" just to have anything controllable
// I mapped my color buttons to change the current player if needed
discovery.on('topology-change', function () {
  if (player == null) {
      console.log("selecting player Wohnzimmer");
    player = discovery.getPlayer("Wohnzimmer");
  }
});

var allowRepeat;

keyboard.on('keyup', console.log);
keyboard.on('keydown', console.log);
keyboard.on('keypress', console.log);

/*
socket.on("data", function (data) {
  var cols = data.toString().split(' ');
  var keyCode = cols[2];
  var repeat = cols[1];
  console.log(repeat, keyCode);
  allowRepeat = repeat == "00" ? true : allowRepeat;

  console.log(" before action ", allowRepeat)
  
  if (allowRepeat && player && actions[keyCode]) {
    allowRepeat = actions[keyCode](player);
  } else if (allowRepeat && presets[buttonToPreset[keyCode]]) {
    discovery.applyPreset(presets[buttonToPreset[keyCode]]);
    allowRepeat = false;
  }

  console.log("after action", allowRepeat);
  
});
*/
