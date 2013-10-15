data-piano
==========

[![Build Status](https://travis-ci.org/emac-utd/data-piano.png?branch=master)](https://travis-ci.org/emac-utd/data-piano)

Map numeric data to MIDI keyboard keys (where key 60 is Middle C)

Created primarily for use with [baudio](https://github.com/substack/baudio), but should work for other sound synthesis projects

Reference
---------

[Wikipedia article on piano key frequencies](https://en.wikipedia.org/wiki/Piano_key_frequencies) (note that this uses a standard 88-key piano rather than a MIDI keyboard)

[Dominique Vandennucker's MIDI tutorial for programmers](http://www.music-software-development.com/midi-tutorial.html)

Example
-------
```javascript
var DataPiano = require('data-piano')
var baudio = require('baudio')

var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

var piano = new DataPiano({
    data: data, //Note data
    velocityData: data, //MIDI velocity data
    lowKey: 60, //C4
    highKey: 71, //B4
    lowVelocity: 42, //piano
    highVelocity: 80, //forte
    stopVelocity: 80 //Velocity sent with midi stop command, usually doesn't matter
  })

console.log(piano.keys) //[60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71]
console.log(piano.freqs) //Associated note frequency for each key
console.log(piano.velocities) //Associated velocity for each key

//Play two notes every second with baudio
var playFunc = piano.getSinPlayFunc(2)
var b = baudio(playFunc)
b.play()

//Get node-midi compatible "note on" message for the first beat
var firstBeat = piano.getMidiPlayFunc(0)(0)
console.log(firstBeat) //[144, 60, 42]
```

Defaults
--------

```javascript
{
  data: undefined, //Required
  velocityData: undefined, //Not required, defaults to generating constant velocity from averaging high and low
  lowKey: 60, //C4
  highKey: 71, //B4
  lowVelocity: 0,
  highVelocity: 127,
  stopVelocity: (lowVelocity+highVelocity)/2
}
```

API
---

###var DataPiano = require('data-piano')

Main class for data-piano

###DataPiano.keyToFreq(key)
###DataPiano#keyToFreq(key)

Utility function that returns the corresponding frequency for a given piano key.  Can be used as either a static or instance method.

###DataPiano#getSinPlayFunc(bps)

Returns a function of time that represents the data played in sequence as sine waves, changing to the next key `bps` times per second

###DataPiano#getSquarePlayFunc(bps)

Returns a function of time that represents the data played in sequence as square waves, changing to the next key `bps` times per second

###DataPiano#getSawtoothPlayFunc(bps)

Returns a function of time that represents the data played in sequence as sawtooth waves, changing to the next key `bps` times per second

###DataPiano#getMidiPlayFunc(channel)

Returns a function of beat # that represents the midi instruction to play the data in sequence, changing to the next key on each beat of the midi clock

###DataPiano#getMidiStopFunc(channel)

Returns a function of beat # that represents the midi instruction to turn off the note from the previous beat, an instruction that must be passed every time you want to change to a new note
