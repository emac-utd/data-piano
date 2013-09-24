var Tau = 2 * Math.PI
module.exports = function(data, lowkey, highkey){
  var max = Math.max.apply(null, data)
  var min = Math.min.apply(null, data)
  var range = max-min
  var keyrange = highkey-lowkey
  this.keys = data.map(function(num) {
    var result = Math.round((num-min)/range * keyrange) + lowkey
    return result
  })
  this.freqs = this.keys.map(this.keyToFreq)
}

module.exports.keyToFreq = function(key) {
  if(key < 1) throw new Exception("Invalid key")
  return Math.pow(2, (key-49)/12) * 440
}
module.exports.prototype.keyToFreq = module.exports.keyToFreq
module.exports.prototype.getSinPlayFunc = function (bps) {
  var freqs = this.freqs
  return function(t) {
    return Math.sin(Tau * t * freqs[Math.floor(t * bps) % freqs.length])
  }
}
module.exports.prototype.getSquarePlayFunc = function (bps) {
  var freqs = this.freqs
  return function(t) {
    return Math.sin(Tau * t * freqs[Math.floor(t * bps) % freqs.length]) < 0 ? -1 : 1
  }
}
module.exports.prototype.getSawtoothPlayFunc = function (bps) {
  var freqs = this.freqs
  return function(t) {
    var freq = freqs[Math.floor(t * bps) % freqs.length]
    return t % (1 / freq) * freq * 2 - 1
  }
}
