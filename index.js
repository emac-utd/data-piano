var inherits = require('inherits')
var Readable = require('stream').Readable

//Constants
var TAU = 2 * Math.PI
var NOTE_ON = 0x90
var NOTE_OFF = 0x80

function noteOn(channel, pitch, velocity) {
  return [NOTE_ON + channel, pitch, velocity]
}

function noteOff(channel, pitch, velocity) {
  return [NOTE_OFF + channel, pitch, velocity]
}

function existy(value)
{
  return value !== undefined && value !== null
}

module.exports = function(opts){

  var self = this
  Readable.call(self)

  //Defaults
  var lowkey = existy(opts.lowKey) ? opts.lowKey : 60
  var highkey = existy(opts.highKey) ? opts.highKey : 71
  var lowvel = existy(opts.lowVelocity) ? opts.lowVelocity : 0
  var highvel = existy(opts.highVelocity) ? opts.highVelocity : 127
  this.stopvel = existy(opts.stopVelocity) ? opts.stopVelocity : (lowvel + highvel) / 2
  this.streamchannel = existy(opts.streamChannel) ? opts.streamChannel : 0

  //Datasets
  var keydata = opts.data
  var veldata = opts.velocityData

  var max = Math.max.apply(null, keydata)
  var min = Math.min.apply(null, keydata)
  var range = max-min
  var keyrange = highkey-lowkey
  this.keys = keydata.map(function(num) {
    var result = Math.round((num-min)/range * keyrange) + lowkey
    return result
  })
  this.freqs = this.keys.map(this.keyToFreq)
  if(veldata) {
    var maxveldata = Math.max.apply(null, veldata)
    var minveldata = Math.min.apply(null, veldata)
    var veldatarange = maxveldata - minveldata
    var velrange = highvel - lowvel
    this.velocities = veldata.map(function(num) {
      var result = Math.round((num-minveldata)/veldatarange * velrange) + lowvel
      return result
    })
  }
  else {
    //Generate a constant average velocity for every key value
    this.velocities = this.keys.map(function() { return (lowvel + highvel) / 2 })
  }

}

inherits(module.exports, Readable)

module.exports.keyToFreq = function(key) {
  if(key < 0 || key > 127 || key % 1 !== 0) throw new Error("Invalid key")
  return Math.pow(2, (key-69)/12) * 440
}

module.exports.prototype.keyToFreq = module.exports.keyToFreq

module.exports.prototype.getSinPlayFunc = function (bps) {
  var freqs = this.freqs
  return function(t) {
    return Math.sin(TAU * t * freqs[Math.floor(t * bps) % freqs.length])
  }
}

module.exports.prototype.getSquarePlayFunc = function (bps) {
  var freqs = this.freqs
  return function(t) {
    return Math.sin(TAU * t * freqs[Math.floor(t * bps) % freqs.length]) < 0 ? -1 : 1
  }
}

module.exports.prototype.getSawtoothPlayFunc = function (bps) {
  var freqs = this.freqs
  return function(t) {
    var freq = freqs[Math.floor(t * bps) % freqs.length]
    return t % (1 / freq) * freq * 2 - 1
  }
}

module.exports.prototype.getMidiPlayFunc = function (channel) {
  var keys = this.keys
  var vels = this.velocities
  return function(beat) {
    var curBeat = beat % keys.length >= 0 ?
      beat % keys.length :
      beat % keys.length + keys.length
    if(keys[curBeat] === undefined) console.log(curBeat)
    return noteOn(channel, keys[curBeat], vels[curBeat])
  }
}

module.exports.prototype.getMidiStopFunc = function(channel) {
  var keys = this.keys
  var stopvel = this.stopvel
  return function(beat) {
    var prevBeat = (beat - 1) % keys.length >= 0 ?
      (beat - 1) % keys.length :
      (beat - 1) % keys.length + keys.length
    return noteOff(channel, keys[prevBeat], stopvel)
  }
}

var position = 0

module.exports.prototype._read = function(size) {
  //Not gonna worry about size for now
  //Potentially useful for queueing up a whole bunch of notes?
  
  this.push(new Buffer(this.getMidiStopFunc(this.streamchannel)(position)))
  this.push(new Buffer(this.getMidiPlayFunc(this.streamchannel)(position)))
  position++
}
