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