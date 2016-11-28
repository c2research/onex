class TimeSeries {
  
  constructor(values, seq, start, end, name) {
    this._values = values;
    this._seq = seq;
    this._start = start;
    this._end = end;
    this._name = name;
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

};

module.exports = TimeSeries;