var d3 = require('d3');

class TimeSeries {

  constructor(values, name, loc, seq, start, end) {
    this._values = values;
    this._loc = loc; // = 0: from dataset, = 1: from query file
    this._seq = seq;
    this._start = start;
    this._end = end;
    this._name = name;
  }

  getLocation() {
    return this._loc;
  }

  getValues() {
    return this._values;
  }

  getSeq() {
    return this._seq;
  }

  getStart() {
    return this._start;
  }

  getEnd() {
    return this._end;
  }

  getName() {
    return this._name;
  }

  getMax() {
    return Math.max(...this._values.map((x) => x[1]));
  }

  getMin() {
    return Math.min(...this._values.map((x) => x[1]));
  }

  denormalize(oriMax, oriMin) {
    var diff = oriMax - oriMin;
    this._values = this._values.map((x) => [x[0], (x[1] * diff + oriMin).toFixed(2)]);
  }

  /*
   * tests for value equality, EXCLUDING the actual values and the name
   */
  equivalent(other) {
    return this._start === other.getStart() &&
           this._end === other.getEnd() &&
           this._loc === other.getLocation() &&
           this._seq === other.getSeq();
  }

  slice(start, end) {
    var newStart = this._start + start;
    var newEnd = Math.min(this._start + end - 1, this._end);
    return new TimeSeries(this._values.slice(start, end),
                          this._name,
                          this._loc,
                          this._seq,
                          newStart,
                          newEnd);
  }
};

module.exports = TimeSeries;
