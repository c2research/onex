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
  color: 'red',
  strokeWidth: 3,
  series: [{ values: [[0, 0.1], [1, 0.15], [2, 0.1], [3, 0.16], [4, 0.11], [5, 0.2], [6, 0.2], [7, 0.21], [8, 0.22], [9, 0.2], [10, 0.16], [11, 0.14], [12, 0.11], [13, 0.1], [14, 0.09], [15, 0.07], [16, 0.09], [17, 0.06], [18, 0.04]],
             color: 'red',  #ignored
             strokeWidth: 3 #ignored
           },
           { values: [[0, 0.03], [1, 0.07], [2, 0.08], [3, 0.09], [4, 0.1], [5, 0.11], [6, 0.1], [7, 0.1], [8, 0.07], [9, 0.05], [10, 0.04], [11, 0.03], [12, 0.02], [13, 0.01], [14, 0.0]],
             color: 'blue'
           }],
  warpingPath: [[18, 14], [17, 13], [16, 12], [15, 11], [14, 10], [13, 9], [12, 8], [11, 7], [10, 6], [9, 5], [8, 4], [7, 3], [6, 2], [5, 1], [4, 1], [3, 1], [2, 1], [1, 1], [0, 0]]
},

*/

// Object constructor
var D3ConnectedScatterPlot = function() {
  this._pointRadius = 2;
};

D3ConnectedScatterPlot.prototype = new D3BaseChart;
D3ConnectedScatterPlot.prototype.constructor = D3ConnectedScatterPlot;

// Append a new chart within a given DOM element. The props and data used
// to drawn the chart are kept inside the current object.
//Does not use passed in domain - constructs it from given values
D3ConnectedScatterPlot.prototype.create = function(el, props, data) {
  this.props = props;
  var width = props.width > 0.3 ? props.height : props.width;
  var height = width;

  //in order to keep it centered and have the axis 'correct' from 0 to 1
  //we need to update the scales function.
  this._scales = function(domains) {
      var x = d3.scaleLinear()
                .domain(domains.x)
                .range([0, width]);

      var y = d3.scaleLinear()
                .domain(domains.y)
                .range([height, 0]);
      return {x: x, y: y};
  }

  var margins = props.margins;

  if (width < props.width) {
      margins.left += ((props.width - width) / 2);
  }

  // Append a drawing area. The use of margins follows the convention in:
  // http://bl.ocks.org/mbostock/3019563
  var svg = d3.select(el).append('svg')
              .classed('multi-time-series-chart', true)
              .attr('width', width + margins.left + margins.right)
              .attr('height', height + margins.top + margins.bottom);

  // Set up groups of components

  // The axes are translated to left and bottom edge of the main area, which is bounded by the four magins.
  svg.append('g').classed('xaxisWrapper', true)
     .attr('transform', 'translate(' + margins.left + ', ' + (height + margins.top) + ')')
  svg.append('g').classed('yaxisWrapper', true)
     .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')')

  // Clip everything that is out of the main view
  svg.append('clipPath').attr('id', 'mainClip')
     .append('rect')
     .attr('x', 0)
     .attr('y', 0)
     .attr('width', width)
     .attr('height', height);

  // Other groups are translated to the main area.
  svg.append('g')
     .classed('linesWrapper', true)
     .attr('transform', this._translate())
     .attr('clip-path', 'url(#mainClip)');

  svg.append('g')
     .classed('warpingPathWrapper', true)
     .attr('transform', this._translate())
     .attr('clip-path', 'url(#mainClip)');

  svg.append('g')
     .classed('pointsWrapper', true)
     .attr('transform', this._translate())
     .attr('clip-path', 'url(#mainClip)');

  svg.append('g')
     .classed('voronoiWrapper', true)
     .attr('transform', this._translate())
     .attr('clip-path', 'url(#mainClip)');

  var tooltipWrapper = svg.append('g').classed('tooltipWrapper', true).attr('transform', this._translate())

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

  this._addTitle(svg);
  this.update(el, data);
};

D3ConnectedScatterPlot.prototype._generateConnectedPath = function(data) {
  var s1 = data.series[0] && data.series[0].values;
  var s2 = data.series[1] && data.series[1].values;
  if (!(s1 && s2 && data.warpingPath)) return [];
  var connected = data.warpingPath.map(function(pair) {
    return[s1[pair[0]][1], s2[pair[1]][1]]
  });
  return connected;
}

// Update the current chart with new data.
D3ConnectedScatterPlot.prototype.update = function(el, d) {
  var svg = d3.select(el).select('svg.multi-time-series-chart');

  var values = this._generateConnectedPath(d);

  var color = d.color || 'red';

  //All current values are
  var domains = {x: [0, 1], y: [0, 1]}

  var data = {
    values: values,
    color: color,
    strokeWidth: d.strokeWidth || 3,
    domains: domains
  }

  this._drawAxis(svg, data);
  this._drawLines(svg, data);
  this._drawPoints(svg, data);
  this._drawVoronoi(svg, data);
};

// Remove the current chart
D3ConnectedScatterPlot.prototype.destroy = function(el) {
  d3.select(el).select('svg.multi-time-series-chart').remove();
}

// Draw axes
D3ConnectedScatterPlot.prototype._drawAxis = function(svg, data) {
  var width = this.props.width > this.props.height ? this.props.height : this.props.width;
  var height = width;
  var scales = this._scales(data.domains);

  // The ticks are spaced with 40 pixels.
  // Set tickSizeInner to -width and -height to create a grid
  var p = d3.precisionFixed(0.5),
      f = d3.format("." + p + "f");

  var yaxisWrapper = d3.axisLeft(scales.y)
                       .tickSizeInner(-width)
                       .tickPadding(7)
                       .ticks(10)
                       .tickFormat(f);

  var xaxisWrapper = d3.axisBottom(scales.x)
                       .tickSizeInner(-height)
                       .tickPadding(7)
                       .ticks(10)
                       .tickFormat(f);

  // Actually draw the axes
  svg.select('g.xaxisWrapper')
     .call(xaxisWrapper);

  svg.select('g.yaxisWrapper')
     .call(yaxisWrapper);

  // Set a low opacity of the tick lines so that it won't obscure the content.
  svg.selectAll('.tick line')
     .style('opacity', 0.2);
}

// Draw lines of the series
D3ConnectedScatterPlot.prototype._drawLines = function(svg, data) {
  var scales = this._scales(data.domains);
  var values = data.values;
  var strokeWidth = data.strokeWidth || 1;
  var lineFunc = d3.line()
                   .x(function(d) { return scales.x(d[0]); })
                   .y(function(d) { return scales.y(d[1]); })
                   .curve(d3.curveLinear);

  var pathGroup = svg.select('g.linesWrapper');
  var paths = pathGroup.selectAll('path').data([values]);
  // var colours = ["#6363FF", "#6373FF", "#63A3FF", "#63E3FF", "#63FFFB", "#63FFCB",
  //                "#63FF9B", "#63FF6B", "#7BFF63", "#BBFF63", "#DBFF63", "#FBFF63",
  //                "#FFD363", "#FFB363", "#FF8363", "#FF7363", "#FF6364"];
  //
  // var heatmapColour = d3.scale.linear()
  //   .domain(d3.range(0, 1, 1.0 / (colours.length - 1)))
  //   .range(colours);
  //
  // // dynamic bit...
  // var colorScale = d3.scale.linear().domain(d3.extent(dataset)).range([0,1]);
  //
  // // use the heatmap to fill in a canvas or whatever you want to do...
  // canvas.append("svg:rect")
  //   .data(dataset)
  //   .enter()
  //   // snip...
  //   .style("fill", function(d) {
  //      return heatmapColour(colorScale(d));
  //
  //
  // 0.3e.log(data);

  // enter + update
  paths.enter()
       .append('path')
       .merge(paths)
       .attr('d', function(d) { return lineFunc(d); })
       .attr('stroke', function(d) { return data.color })
       .attr('stroke-width', function() { return data.strokeWidth || strokeWidth })
       .attr('fill', 'none');

  // exit
  paths.exit().remove();

};

// Draw points of the series
D3ConnectedScatterPlot.prototype._drawPoints = function(svg, data) {

  var scales = this._scales(data.domains);
  var pointGroup = svg.select('g.pointsWrapper');
  var circles = pointGroup.selectAll('circle').data(data.values);

  // enter + update
  circles.enter()
         .append('circle')
         .merge(circles)
         .attr('cx', function(d) { return scales.x(d[0]); })
         .attr('cy', function(d) { return scales.y(d[1]); })
         .attr('r', this._pointRadius)
         .attr('class', function(d, i) { return 'circle_' + i; });

  // exit
  circles.exit().remove();
};

// Draw the invisible Voronoi diagram to assist user experience
D3ConnectedScatterPlot.prototype._drawVoronoi = function(svg, data) {
  var scales = this._scales(data.domains);

  var points = data.values;
  var width = this.props.width > this.props.height ? this.props.height : this.props.width;
  var height = width;

  var voronoi = d3.voronoi()
                  .x(function(d) { return scales.x(d[0]); })
                  .y(function(d) { return scales.y(d[1]); })
                  .extent([[0, 0], [width, height]]);

  var voronoiGroup = svg.select('g.voronoiWrapper')

  // Get an array of polygon. Each polygon is itself a array of points
  var polygons = voronoi(points).polygons();

  var voronoiPaths = voronoiGroup.selectAll('path').data(polygons);
  var that = this;
  voronoiPaths.enter()
              .append('path')
              .merge(voronoiPaths)
              .attr('d', function(d) {
                return d && ('M' + d.join('L') + 'Z');
              })
              .style('stroke', 'none')
              .style('fill', 'none')
              .style('pointer-events', 'all')
              .on('mouseover', function(d, i) {
                d3.select('circle.circle_' + i)
                  .attr('fill', 'red');
                that._showToolTip(svg, scales.x(d.data[0]), scales.y(d.data[1]), d.data[1]);
              })
              .on('mouseout', function(d, i) {
                d3.select('circle.circle_' + i)
                  .attr('fill', 'black');
                that._removeToolTip(svg);
              });

  voronoiPaths.exit().remove();
}

D3ConnectedScatterPlot.prototype._showToolTip = function(svg, x, y, text) {
  var tooltipWrapper = svg.select('g.tooltipWrapper');
  var tooltip = tooltipWrapper.select('rect#tooltip');
  var tooltipText = tooltipWrapper.select('text#tooltipText');

  tooltipText.text(text);

  // Get bounding box of current text
  var textBBox = tooltipText.node().getBBox();
  var tooltipWidth = textBBox.width + 20;
  var tooltipHeight = textBBox.height + 10;

  // Position the text at the middle of the tooltip box
  tooltipText.attr('x', x)
             .attr('y', y + tooltipHeight / 2 + textBBox.height / 2)

  // Tooltip box is shown below selected point
  tooltip.attr('x', x - tooltipWidth / 2)
         .attr('y', y + this._pointRadius)
         .attr('width', tooltipWidth)
         .attr('height', tooltipHeight);

  tooltipWrapper.transition()
                .style('opacity', 0.8);
}

D3ConnectedScatterPlot.prototype._removeToolTip = function(svg) {
  svg.select('g.tooltipWrapper').transition().style('opacity', 0);
}

module.exports = D3ConnectedScatterPlot;
