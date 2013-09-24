var dp = require('../index.js')
var piano
var playFunc2
var playFunc4
var Tau = 2 * Math.PI
describe("keyToFreq", function(){
  it("should return a frequency that corresponds to a piano key number", function(){
    expect(dp.keyToFreq(49)).toBe(440) //A4
    expect(dp.keyToFreq(40)).toBeCloseTo(261.626, 3) //Middle C
  })
  it("should not allow any keys below 1", function(){
    var firstFailure = function() { dp.keyToFreq(-1) }
    var secondFailure = function() { dp.keyToFreq(0) }
    expect(firstFailure).toThrow()
    expect(secondFailure).toThrow()
  })
  it("should be usable as an instance method as well as a static method", function(){
    piano = new dp([
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12
    ], 49, 62)
    expect(piano.keyToFreq(49)).toBe(440) //A4
    expect(piano.keyToFreq(40)).toBeCloseTo(261.626, 3) //Middle C
  })
})

describe("The constructor", function(){
  beforeEach(function() {
    piano = new dp([
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12
    ], 49, 60)
  });
  it("should map a series of numbers to a specified range of keys", function(){
    expect(piano.keys.length).toBe(12)
    for(var i = 0; i < piano.keys.length; i++)
    {
      expect(piano.keys[i]).toBe(49 + i)
    }
  })
  it("should map those keys to their corresponding frequencies", function(){
    for(var i = 0; i < piano.freqs.length; i++)
    {
      expect(piano.freqs[i]).toBeCloseTo(piano.keyToFreq(49 + i), 3)
    }
  })
})

describe("DataPiano#getSinPlayFunc", function() {
  beforeEach(function() {
    piano = new dp([
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12
    ], 49, 60)
    playFunc2 = piano.getSinPlayFunc(2);
    playFunc4 = piano.getSinPlayFunc(4);
  });
  it("should return a function when passed an integer", function() {
    expect(typeof playFunc2).toBe('function');
    expect(typeof playFunc4).toBe('function');
  })
  it("should return a function that changes the tone returned for a time based on given bps", function() {
    for(var i = 0; i < piano.freqs.length; i++) {
      expect(playFunc2(i * .5)).toBe(Math.sin(Tau * i * .5 * piano.freqs[i]))
    }
    for(var i = 0; i < piano.freqs.length; i++) {
      expect(playFunc4(i * .25)).toBe(Math.sin(Tau * i * .25 * piano.freqs[i]))
    }
  })
})
describe("DataPiano#getSquarePlayFunc", function() {
  beforeEach(function() {
    piano = new dp([
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12
    ], 49, 60)
    playFunc2 = piano.getSquarePlayFunc(2);
    playFunc4 = piano.getSquarePlayFunc(4);
  });
  it("should return a function when passed an integer", function() {
    expect(typeof playFunc2).toBe('function');
    expect(typeof playFunc4).toBe('function');
  })
  it("should return a function that changes the tone returned for a time based on given bps", function() {
    for(var i = 0; i < piano.freqs.length; i++) {
      expect(playFunc2(i * .5)).toBe(Math.sin(Tau * i * .5 * piano.freqs[i]) < 0 ? -1 : 1)
    }
    for(var i = 0; i < piano.freqs.length; i++) {
      expect(playFunc4(i * .25)).toBe(Math.sin(Tau * i * .25 * piano.freqs[i]) < 0 ? -1 : 1)
    }
  })
})

describe("DataPiano#getSawtoothPlayFunc", function() {
  beforeEach(function() {
    piano = new dp([
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12
    ], 49, 60)
    playFunc2 = piano.getSawtoothPlayFunc(2);
    playFunc4 = piano.getSawtoothPlayFunc(4);
  });
  it("should return a function when passed an integer", function() {
    expect(typeof playFunc2).toBe('function');
    expect(typeof playFunc4).toBe('function');
  })
  it("should return a function that changes the tone returned for a time based on given bps", function() {
    for(var i = 0; i < piano.freqs.length; i++) {
      expect(playFunc2(i * .5)).toBe(i * .5 % (1/piano.freqs[i]) * piano.freqs[i] * 2 -1)
    }
    for(var i = 0; i < piano.freqs.length; i++) {
      expect(playFunc4(i * .25)).toBe(i * .25 % (1/piano.freqs[i]) * piano.freqs[i] * 2 -1)
    }
  })
})
