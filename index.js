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

module.exports = function(opts){

  //Defaults
  var lowkey = opts.lowKey ? opts.lowKey : 60
  var highkey = opts.highKey ? opts.highKey : 71
  var lowvel = opts.lowVelocity ? opts.lowVelocity : 0
  var highvel = opts.highVelocity ? opts.highVelocity : 127

  //Datasets
  var keydata = opts.data;
  var veldata = opts.veldata;

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
    var maxvel = Math.max.apply(null, veldata)
    var minvel = Math.min.apply(null, veldata)
    var velrange = maxvel - minvel
    this.velocities = veldata.map(function(num) {
    })
  }
}

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
