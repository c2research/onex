var d3 = require('d3');
var D3BaseChart = require('./D3BaseChart');

/**
Example props:
{
  width: 700,
  height: 350,
  margins: {left: 10, right: 10, top: 10, bottom: 10}
  strokeWidth: 1
}
Example data:
{
  series: [{ values: [[0, 0.1], [1, 0.15], [2, 0.1], [3, 0.16], [4, 0.11], [5, 0.2], [6, 0.2], [7, 0.21], [8, 0.22], [9, 0.2], [10, 0.16], [11, 0.14], [12, 0.11], [13, 0.1], [14, 0.09], [15, 0.07], [16, 0.09], [17, 0.06], [18, 0.04]],
             color: 'red',
             strokeWidth: 3
           },
           { values: [[0, 0.03], [1, 0.07], [2, 0.08], [3, 0.09], [4, 0.1], [5, 0.11], [6, 0.1], [7, 0.1], [8, 0.07], [9, 0.05], [10, 0.04], [11, 0.03], [12, 0.02], [13, 0.01], [14, 0.0]],
             color: 'blue'
           }],
  domains: {x: [0, 20], y: [0, 50]},
},

*/

// Object constructor
var D3RadialChart = function() {
};

D3RadialChart.prototype = new D3BaseChart;
D3RadialChart.prototype.constructor = D3RadialChart;

// Append a new chart within a given DOM element. The props and data used
// to drawn the chart are kept inside the current object.
D3RadialChart.prototype.create = function(el, props, data) {
  this.props = props;

  var width = props.width;
  var height = props.height;
  var margins = props.margins;
  var center = this._center();

  // Append a drawing area. The use of margins follows the convention in:
  // http://bl.ocks.org/mbostock/3019563
  var svg = d3.select(el).append('svg')
              .classed('d3-radial-chart', true)
              .attr('width', width + margins.left + margins.right)
              .attr('height', height + margins.top + margins.bottom);

  svg.append('circle')
     .attr('cx', center.x)
     .attr('cy', center.y)
     .attr('r', this._maxRadius())
     .attr('stroke', 'gray')
     .attr('stroke-width', 1)
     .attr('fill', 'none');
  // Set up groups of components

  // The axes are translated to left and bottom edge of the main area, which is bounded by the four magins.
  svg.append('g').classed('radial-axes', true);

  // Other groups are translated to the main area.
  svg.append('g')
     .classed('lines-wrapper', true)
     .attr('transform', 'translate(' + center.x + ',' + center.y + ')');

  svg.append('g')
     .classed('voronoiWrapper', true);

  var tooltipWrapper = svg.append('g').classed('tooltipWrapper', true);

  // Tooltip is hidden initially
  tooltipWrapper.style('opacity', 0)
  tooltipWrapper.append('rect')
                .attr('id', 'tooltip')
                .attr('fill', 'lightsteelblue')
                .attr('rx', 5)
                .attr('ry', 5)
                .style('pointer-events', 'none');
  tooltipWrapper.append('text')
                .attr('id', 'tooltipText')
                .attr('font-size', '12px')
                .attr('font-weight', 'bold')
                .style('pointer-events', 'none')
                .style('font-family', 'sans-serif')
                .style('text-anchor', 'middle');

  // Call update to initiate the first rendering.
  this._addTitle(svg);
  this.update(el, data);
};

// Update the current chart with new data.
D3RadialChart.prototype.update = function(el, data) {
  var svg = d3.select(el).select('svg.d3-radial-chart');

  this._drawRadialAxis(svg, data);
  this._drawLines(svg, data);
  //this._drawVoronoi(svg, data);
};

// Remove the current chart
D3RadialChart.prototype.destroy = function(el) {
  d3.select(el).select('svg.d3-radial-chart').remove();
};

D3RadialChart.prototype._center = function() {
  var margins = this.props.margins;
  var cx = (this.props.width + margins.left + margins.right) / 2;
  var cy = (this.props.height + margins.top + margins.bottom) / 2;
  return { x: cx, y: cy };
};

D3RadialChart.prototype._maxRadius = function() {
  return Math.min(this.props.width, this.props.height) / 2;
};

D3RadialChart.prototype._polarScales = function(domains) {
  var r = d3.scaleLinear()
            .domain(domains.y)
            .range([0, Math.min(this.props.width, this.props.height) / 2]);

  var theta = d3.scaleLinear()
            .domain(domains.x)
            .range([0, 2 * Math.PI]);

  return {r: r, theta: theta};
};

D3RadialChart.prototype._polarToRect = function(r, theta, origin) {
  var x = r * Math.cos(theta - Math.PI / 2) + origin.x;
  var y = r * Math.sin(theta - Math.PI / 2) + origin.y;
  return { x: x, y: y };
}

// Draw axes
D3RadialChart.prototype._drawRadialAxis = function(svg, data) {
  var height = this.props.height;
  var width = this.props.width;
  var center = this._center();
  var maxRadius = this._maxRadius();
  var that = this;
  var scales = this._polarScales(data.domains);
  var axesGroup = svg.select('g.radial-axes')

  var ticks = scales.theta.ticks(Math.min(32, data.domains.x[1]));
  var tickFormat = scales.theta.tickFormat(Math.min(32, data.domains.x[1]), 'd');
  ticks = ticks.map(tickFormat);
  var tickNum = ticks.length;

  var angles = [];
  for (var i = 0; i < tickNum; i++) {
    angles.push(i * 2 * Math.PI / tickNum);
  }

  axesGroup.attr('font-size', 12);

  var lines = axesGroup.selectAll('line').data(angles);
  lines.enter()
       .append('line')
       .merge(lines)
       .attr('x1', center.x)
       .attr('y1', center.y)
       .attr('x2', function(d) { return that._polarToRect(maxRadius, d, center).x; })
       .attr('y2', function(d) { return that._polarToRect(maxRadius, d, center).y; })
       .attr('stroke', 'gray')
       .attr('opacity', 0.5)
       .attr('stroke-width', 1);
  lines.exit().remove();

  var padding = 10;
  var texts = axesGroup.selectAll('text').data(angles);
  texts.enter()
       .append('text')
       .merge(texts)
       .attr('text-anchor', 'middle')
       .attr('alignment-baseline', 'central')
       .attr('x', function(d, i) { return that._polarToRect(maxRadius + padding, d, center).x; })
       .attr('y', function(d, i) { return that._polarToRect(maxRadius + padding, d, center).y; })
       .text(function(d, i) { return ticks[i]; });
  texts.exit().remove();
};

// Draw lines of the series
D3RadialChart.prototype._drawLines = function(svg, data) {
  var scales = this._polarScales(data.domains);
  var series = data.series;
  var center = this._center();
  var strokeWidth = this.props.strokeWidth || 1;
  var that = this;
  var lineFunc = d3.radialLine()
                   .angle(function(d) { return scales.theta(d[0]); })
                   .radius(function(d) { return scales.r(d[1]); } )
                   .curve(d3.curveLinearClosed);

  var pathGroup = svg.select('g.lines-wrapper');
  var paths = pathGroup.selectAll('path').data(series);

  // enter + update
  paths.enter()
       .append('path')
       .merge(paths)
       .attr('d', function(d) { return lineFunc(d.values); })
       .attr('stroke', function(d) { return d.color || 'black'; })
       .attr('stroke-width', function(d) { return d.strokeWidth || strokeWidth })
       .attr('fill', 'none');

  // exit
  paths.exit().remove();

};

// Draw the invisible Voronoi diagram to assist user experience
// D3MultiTimeSeriesChart.prototype._drawVoronoi = function(svg, data) {
//   var scales = this._scales(data.domains);

//   var points = this._extractRawPointCoords(data.series);
//   var width = this.props.width;
//   var height = this.props.height;
//   var voronoi = d3.voronoi()
//                   .x(function(d) { return scales.x(d[0]); })
//                   .y(function(d) { return scales.y(d[1]); })
//                   .extent([[0, 0], [width, height]]);

//   var voronoiGroup = svg.select('g.voronoiWrapper')

//   // Get an array of polygon. Each polygon is itself a array of points
//   var polygons = voronoi(points).polygons();

//   var voronoiPaths = voronoiGroup.selectAll('path').data(polygons);
//   var that = this;
//   voronoiPaths.enter()
//               .append('path')
//               .merge(voronoiPaths)
//               .attr('d', function(d) {
//                 return d && ('M' + d.join('L') + 'Z');
//               })
//               .style('stroke', 'none')
//               .style('fill', 'none')
//               .style('pointer-events', 'all')
//               .on('mouseover', function(d, i) {
//                 d3.select('circle.circle_' + i)
//                   .attr('fill', 'red');
//                 that._showToolTip(svg, scales.x(d.data[0]), scales.y(d.data[1]), d.data[1]);
//               })
//               .on('mouseout', function(d, i) {
//                 d3.select('circle.circle_' + i)
//                   .attr('fill', 'black');
//                 that._removeToolTip(svg);
//               });

//   voronoiPaths.exit().remove();
// }

// D3MultiTimeSeriesChart.prototype._showToolTip = function(svg, x, y, text) {
//   var tooltipWrapper = svg.select('g.tooltipWrapper');
//   var tooltip = tooltipWrapper.select('rect#tooltip');
//   var tooltipText = tooltipWrapper.select('text#tooltipText');

//   tooltipText.text(text);

//   // Get bounding box of current text
//   var textBBox = tooltipText.node().getBBox();
//   var tooltipWidth = textBBox.width + 20;
//   var tooltipHeight = textBBox.height + 10;

//   // Position the text at the middle of the tooltip box
//   tooltipText.attr('x', x)
//              .attr('y', y + tooltipHeight / 2 + textBBox.height / 2)

//   // Tooltip box is shown below selected point
//   tooltip.attr('x', x - tooltipWidth / 2)
//          .attr('y', y + this._pointRadius)
//          .attr('width', tooltipWidth)
//          .attr('height', tooltipHeight);

//   tooltipWrapper.transition()
//                 .style('opacity', 0.8);
// }

// D3MultiTimeSeriesChart.prototype._removeToolTip = function(svg) {
//   svg.select('g.tooltipWrapper').transition().style('opacity', 0);
// }

module.exports = D3RadialChart;
