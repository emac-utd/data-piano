var dp = require('../index.js')
var Tau = 2 * Math.PI
describe("keyToFreq", function(){
  var piano
  it("should return a frequency that corresponds to a piano key number", function(){
    expect(dp.keyToFreq(69)).toBe(440) //A4
    expect(dp.keyToFreq(60)).toBeCloseTo(261.626, 3) //Middle C
  })
  it("should not allow any keys below 0", function(){
    var shouldFail = function() { dp.keyToFreq(-1) }
    var shouldNotFail = function() { dp.keyToFreq(0) }
    expect(shouldFail).toThrow("Invalid key")
    expect(shouldNotFail).not.toThrow()
  })
  it("should not allow any keys above 127", function(){
    var shouldFail = function() { dp.keyToFreq(128) }
    var shouldNotFail = function() { dp.keyToFreq(127) }
    expect(shouldFail).toThrow("Invalid key")
    expect(shouldNotFail).not.toThrow()
  })
  it("should not allow fractional key numbers", function(){
    var shouldFail = function () { dp.keyToFreq(1.24) }
    expect(shouldFail).toThrow("Invalid key")
  })
  it("should be usable as an instance method as well as a static method", function(){
    piano = new dp({
      data: [
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
      ],
      lowKey: 69,
      highKey: 82
    })
    expect(piano.keyToFreq(69)).toBe(440) //A4
    expect(piano.keyToFreq(60)).toBeCloseTo(261.626, 3) //Middle C
  })
})

describe("The constructor, when called with one data set", function(){
  var piano
  var playFunc2
  var playFunc4
  beforeEach(function() {
    piano = new dp({
      data: [
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
      ],
      lowKey: 69,
      highKey: 80,
      lowVelocity: 42,
      highVelocity: 96
    })
  })
  it("should map a series of numbers to a specified range of keys", function(){
    expect(piano.keys.length).toBe(12)
    for(var i = 0; i < piano.keys.length; i++)
    {
      expect(piano.keys[i]).toBe(69 + i)
    }
  })
  it("should map those keys to their corresponding frequencies", function(){
    for(var i = 0; i < piano.freqs.length; i++)
    {
      expect(piano.freqs[i]).toBeCloseTo(piano.keyToFreq(69 + i), 3)
    }
  })
  it("should construct a readable stream", function(){
    expect(typeof piano.read).toBe('function')
    expect(typeof piano.pipe).toBe('function')
  })
})

describe("The constructor, when called with one data set and default parameters", function(){
  var piano
  var playFunc2
  var playFunc4
  beforeEach(function() {
    piano = new dp({
      data: [
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
      ]
    })
  })
  it("should map a series of numbers to keys 60-71 (C4 to B4)", function(){
    expect(piano.keys.length).toBe(12)
    for(var i = 0; i < piano.keys.length; i++)
    {
      expect(piano.keys[i]).toBe(60 + i)
    }
  })
  it("should map those keys to their corresponding frequencies", function(){
    for(var i = 0; i < piano.freqs.length; i++)
    {
      expect(piano.freqs[i]).toBeCloseTo(piano.keyToFreq(60 + i), 3)
    }
  })
  it("should construct a readable stream", function(){
    expect(typeof piano.read).toBe('function')
    expect(typeof piano.pipe).toBe('function')
  })
})

describe("DataPiano#getSinPlayFunc", function() {
  var piano
  var playFunc2
  var playFunc4
  beforeEach(function() {
    piano = new dp({
      data: [
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
      ],
      lowKey: 69,
      highKey: 80,
      lowVelocity: 42,
      highVelocity: 96
    })
    playFunc2 = piano.getSinPlayFunc(2);
    playFunc4 = piano.getSinPlayFunc(4);
  })
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
  var piano
  var playFunc2
  var playFunc4
  beforeEach(function() {
    piano = new dp({
      data: [
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
      ],
      lowKey: 69,
      highKey: 80,
      lowVelocity: 42,
      highVelocity: 96
    })
    playFunc2 = piano.getSquarePlayFunc(2);
    playFunc4 = piano.getSquarePlayFunc(4);
  })
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
  var piano
  var playFunc2
  var playFunc4
  beforeEach(function() {
    piano = new dp({
      data: [
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
      ],
      lowKey: 69,
      highKey: 80,
      lowVelocity: 42,
      highVelocity: 96
    })
    playFunc2 = piano.getSawtoothPlayFunc(2);
    playFunc4 = piano.getSawtoothPlayFunc(4);
  })
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
describe("DataPiano#getMidiPlayFunc", function() {
  var piano
  var piano2
  var playFunc
  var playFunc2
  beforeEach(function() {
    piano = new dp({
      data: [
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
      ],
      lowKey: 69,
      highKey: 80,
      lowVelocity: 42,
      highVelocity: 96
    })
    piano2 = new dp({
      data: [
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
      ],
      velocityData: [
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
      ],
      lowKey: 69,
      highKey: 80,
      lowVelocity: 85,
      highVelocity: 96
    })
    //Note that midi tempo is defined by a clock,
    //so instead we'll return a function that takes
    //a beat number using a given channel.
    playFunc = piano.getMidiPlayFunc(1);
    playFunc2 = piano2.getMidiPlayFunc(2);
  })
  it("should return a function", function() {
    expect(typeof playFunc).toBe('function')
    expect(typeof playFunc2).toBe('function')
  })
  it("should return a function that returns constant velocity midi notes on the given channel when not given velocity data", function() {
    for(var i = 0; i < piano.keys.length * 2; i++)
    {
      expect(playFunc(i)).toEqual([0x91, 69 + i % 12, (42+96)/2])
    }
  })
  it("should return a function that returns variable velocity midi notes on the given channel when given velocity data", function() {
    for(var i = 0; i < piano.keys.length * 2; i++)
    {
      expect(playFunc2(i)).toEqual([0x92, 69 + i % 12, 85 + i % 12])
    }
  })
  it("should also work in reverse", function() {
    for(var i = 0; i > piano.keys.length * -2; i--)
    {
      i % 12 === 0 ?
        expect(playFunc2(i)).toEqual([0x92, 69, 85]) :
        expect(playFunc2(i)).toEqual([0x92, 69 + (i % 12) + 12, 85 + (i % 12) + 12])
    }
  })
})

describe("DataPiano#getMidiStopFunc", function() {
  var piano
  var piano2
  var stopFunc
  var stopFunc2
  beforeEach(function() {
    piano = new dp({
      data: [
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
      ],
      lowKey: 69,
      highKey: 80,
      lowVelocity: 42,
      highVelocity: 96
    })
    piano2 = new dp({
      data: [
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
      ],
      lowKey: 69,
      highKey: 80,
      lowVelocity: 42,
      highVelocity: 96,
      stopVelocity: 80
    })
    stopFunc = piano.getMidiStopFunc(1);
    stopFunc2 = piano2.getMidiStopFunc(1);
  })
  it("should return a function", function() {
    expect(typeof stopFunc).toBe('function')
  })
  it("should return a function that stops the previous midi note on the given channel using a constant velocity", function() {
    for(var i = 0; i < piano.keys.length * 2; i++)
    {
      i % 12 > 0 ?
      expect(stopFunc(i)).toEqual([0x81, 69 + (i - 1) % 12, (42+96)/2]) :
      expect(stopFunc(i)).toEqual([0x81, 80, (42+96)/2])
    }
  })
  it("should allow the stop velocity constant to be set at configuration time", function() {
    for(var i = 0; i < piano.keys.length * 2; i++)
    {
      i % 12 > 0 ?
      expect(stopFunc2(i)).toEqual([0x81, 69 + (i - 1) % 12, 80]) :
      expect(stopFunc2(i)).toEqual([0x81, 80, 80])
    }
  })
  it("should also work in reverse", function() {
    for(var i = 0; i > piano.keys.length * -2; i--)
    {
      (i - 1) % 12 < 0 ?
        expect(stopFunc2(i)).toEqual([0x81, 81 + (i - 1) % 12, 80]) :
        expect(stopFunc2(i)).toEqual([0x81, 69, 80])
    }
  })
})

describe("DataPiano#read", function() {
  beforeEach(function() {
    piano = new dp({
      data: [
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
      ],
      lowKey: 69,
      highKey: 80,
      lowVelocity: 42,
      highVelocity: 96,
      streamChannel: 1
    })
    piano2 = new dp({
      data: [
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
      ],
      lowKey: 69,
      highKey: 80,
      lowVelocity: 42,
      highVelocity: 96
    })
  })
  it('should stream midi instructions in a loop', function() {
    for(var i = 0; i < piano.keys.length * 2; i++)
    {
      var midiBuf = piano.read()
      expect(midiBuf[0]).toBe(0x81)
      i % 12 > 0 ?
        expect(midiBuf[1]).toBe(69 + (i-1) % 12) :
        expect(midiBuf[1]).toBe(80)
      expect(midiBuf[2]).toBe((42+96)/2)
      expect(midiBuf[3]).toBe(0x91)
      expect(midiBuf[4]).toBe(69 + i % 12)
      expect(midiBuf[5]).toBe((42+96)/2)
    }
  })
  it('should use channel 0 by default', function() {
    for(var i = 0; i < piano2.keys.length * 2; i++)
    {
      var midiBuf = piano2.read()
      expect(midiBuf[0]).toBe(0x80)
      i % 12 > 0 ?
        expect(midiBuf[1]).toBe(69 + (i-1) % 12) :
        expect(midiBuf[1]).toBe(80)
      expect(midiBuf[2]).toBe((42+96)/2)
      expect(midiBuf[3]).toBe(0x90)
      expect(midiBuf[4]).toBe(69 + i % 12)
      expect(midiBuf[5]).toBe((42+96)/2)
    }
  })
})
