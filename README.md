data-piano
==========

Map numeric data to keyboard keys (where key 49 is A4)

Created primarily for use with baudio, but should work for other sound synthesis projects

Reference
---------

[Wikipedia article on piano key frequencies](https://en.wikipedia.org/wiki/Piano_key_frequencies)

Example
-------
```javascript
var DataPiano = require('data-piano')
var baudio = require('baudio')

var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

var piano = new DataPiano(data, 40, 51) //Key range from C4 to B4

console.log(piano.keys) //[40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51]
console.log(piano.freqs) //Associated note frequency for each key

//Play two notes every second with baudio
var playFunc = piano.getSinPlayFunc(2)
var b = baudio(playFunc)
b.play()
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
