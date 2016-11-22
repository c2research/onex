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

// Return a string used in translating a group to the main area
D3BaseChart.prototype._addTitle = function(svg) {
  if (this.props.title) {
    svg.append("text")
      .attr('transform', this._translate())
      .attr("x", this.props.width - 5)
      .attr("y", 15)
      .attr("text-anchor", "end")
      .style("font-size", "12px")
      .text(this.props.title);
  }
};



module.exports = D3BaseChart;
