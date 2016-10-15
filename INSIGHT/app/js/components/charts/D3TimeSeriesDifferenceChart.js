var d3 = require('d3');
var D3BaseChart = require('./D3BaseChart');

/**
Example props:
{
  width: 700,
  height: 350,
  margins: {left: 10, right: 10, top: 10, bottom: 10},
  strokeWidth: 1,
  color: 'blue'
}
Example data:
{
  series: [{ values: [[0, 0.1], [1, 0.15], [2, 0.1], [3, 0.16], [4, 0.11], [5, 0.2], [6, 0.2], [7, 0.21], [8, 0.22], [9, 0.2], [10, 0.16], [11, 0.14], [12, 0.11], [13, 0.1], [14, 0.09], [15, 0.07], [16, 0.09], [17, 0.06], [18, 0.04]],
           },
           { values: [[0, 0.03], [1, 0.07], [2, 0.08], [3, 0.09], [4, 0.1], [5, 0.11], [6, 0.1], [7, 0.1], [8, 0.07], [9, 0.05], [10, 0.04], [11, 0.03], [12, 0.02], [13, 0.01], [14, 0.0]],
           }],
  maxDomainY: 1,
  warpingPath: [[18, 14], [17, 13], [16, 12], [15, 11], [14, 10], [13, 9], [12, 8], [11, 7], [10, 6], [9, 5], [8, 4], [7, 3], [6, 2], [5, 1], [4, 1], [3, 1], [2, 1], [1, 1], [0, 0]]
},

*/

// Object constructor
var D3TimeSeriesDifferenceChart = function() {
};

D3TimeSeriesDifferenceChart.prototype = new D3BaseChart;
D3TimeSeriesDifferenceChart.prototype.constructor = D3TimeSeriesDifferenceChart;

// Append a new chart within a given DOM element. The props and data used 
// to drawn the chart are kept inside the current object. 
D3TimeSeriesDifferenceChart.prototype.create = function(el, props, data) {
  this.props = props;

  var width = props.width;
  var height = props.height;
  var margins = props.margins;

  // Append a drawing area. The use of margins follows the convention in:
  // http://bl.ocks.org/mbostock/3019563
  var svg = d3.select(el).append('svg')
              .classed('time-series-difference-chart', true)
              .attr('width', width + margins.left + margins.right)
              .attr('height', height + margins.top + margins.bottom);

  svg.append('line').classed('base-line', true)
                    .attr('x1', margins.left)
                    .attr('y1', height / 2 + margins.top)
                    .attr('x2', margins.left + width)
                    .attr('y2', height / 2 + margins.top)
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1)
                    .style('opacity', 0.2); 

  svg.append('g').classed('bar-wrapper', true).attr('transform', this._translate());
  
  // Call update to initiate the first rendering.
  this.update(el, data);
};

// Update the current chart with new data.
D3TimeSeriesDifferenceChart.prototype.update = function(el, data) {
  var svg = d3.select(el).select('svg.time-series-difference-chart'); 

  this._drawBars(svg, data);
};

// Remove the current chart
D3TimeSeriesDifferenceChart.prototype.destroy = function(el) {
  d3.select(el).select('svg.time-series-difference-chart').remove();
}

D3TimeSeriesDifferenceChart.prototype._calcDifference = function(data) {
  var s1 = data.series[0] && data.series[0].values;
  var s2 = data.series[1] && data.series[1].values;
  if (!(s1 && s2 && data.warpingPath)) return [];
  var diff = data.warpingPath.map(function(pair) { return s1[pair[0]][1] - s2[pair[1]][1]; });
  return diff;
}

// Draw lines of the series
D3TimeSeriesDifferenceChart.prototype._drawBars = function(svg, data) {
  var diff = this._calcDifference(data);
  var domains = {
    x: [0, diff.length - 1],
    y: [-data.maxDomainY, data.maxDomainY]
  };
  console.log(diff);
  var scales = this._scales(domains);
  var series = data.series;
  var strokeWidth = this.props.strokeWidth || 1;
  var barGroup = svg.select('g.bar-wrapper');
  var bars = barGroup.selectAll('line').data(diff);

  // enter + update
  bars.enter()
      .append('line')
      .merge(bars)
      .attr('x1', function(d, i) { return scales.x(i); })
      .attr('y1', function(d, i) { return scales.y(0); })
      .attr('x2', function(d, i) { return scales.x(i); })
      .attr('y2', function(d, i) { return scales.y(d); })
      .attr('stroke', this.props.color)
      .attr('stroke-width', strokeWidth)
       
  // exit
  bars.exit().remove();

};

module.exports = D3TimeSeriesDifferenceChart;
