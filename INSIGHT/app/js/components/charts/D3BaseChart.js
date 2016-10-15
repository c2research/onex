var d3 = require('d3');

var D3BaseChart = function() {};

// Return the scales with given domains
D3BaseChart.prototype._scales = function(domains) {
  var x = d3.scaleLinear()
            .domain(domains.x)
            .range([0, this.props.width]);

  var y = d3.scaleLinear()
            .domain(domains.y)
            .range([this.props.height, 0]);
  return {x: x, y: y};
};

// Return a string used in translating a group to the main area
D3BaseChart.prototype._translate = function() {
  return 'translate(' + this.props.margins.left + ',' + this.props.margins.top + ')';
};

module.exports = D3BaseChart;