var d3 = require('d3');
var D3BaseChart = require('./D3BaseChart');

// Object constructor
var D3OverviewChart = function() {
  this._pointRadius = 2;
};

D3OverviewChart.prototype = new D3BaseChart;
D3OverviewChart.prototype.constructor = D3OverviewChart;


// Append a new chart within a given DOM element. The props and data used
// to drawn the chart are kept inside the current object.
D3OverviewChart.prototype.create = function(el, props, data) {
  this.props = props;

  var width = props.width;
  var height = props.height;
  var margins = props.margins;

  // Append a drawing area. The use of margins follows the convention in:
  // http://bl.ocks.org/mbostock/3019563
  var svg = d3.select(el).append('svg')
              .classed('overview-chart', true)
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
    .classed('horizonAreaWrapper', true)
    .attr('transform', this._translate())
    .attr('clip-path', 'url(#mainClip)');

 // add the brush group
 svg.append("g")
    .attr("class", "brush")
    .attr('transform', this._translate())
    .attr('clip-path', 'url(#mainClip)');

  this._addTitle(svg);
  this.update(el, data);
};

// Update the current chart with new data.
D3OverviewChart.prototype.update = function(el, data) {
  var svg = d3.select(el).select('svg.overview-chart');

  this._updateBrushFunction(svg, data);
  this._drawAxis(svg, data);
  this._drawHorizonArea(svg, data);
};

//updates the brush function to have the appropriate domain
D3OverviewChart.prototype._updateBrushFunction = function(svg, data) {
  var g = svg.select('g.brush');
  var props = this.props;
  var width = props.width;
  var height = props.height;

  var xScale = this._scales(data.domains).x;

  var _onBrush = function(){
    var s = d3.event.selection;
    if (s) {
      var realStart = s[0];
      var realEnd = s[1];

      var pointStart = Math.floor(xScale.invert(realStart));
      var pointEnd = Math.ceil(xScale.invert(realEnd));

      // call passed in function to handle switching view point
      props.onBrushSelection([pointStart,pointEnd]);
    }
  }

  var brush = d3.brushX()
                .extent( function() { return [[0,0], [width, height]]; })
                .on( "brush", _onBrush);

  g.call(brush);
}


// Remove the current chart
D3OverviewChart.prototype.destroy = function(el) {
  d3.select(el).select('svg.overview-chart').remove();
}

// Draw axes
D3OverviewChart.prototype._drawAxis = function(svg, data) {
  var height = this.props.height;
  var width = this.props.width;
  var domains = data.domains;
  var scales = this._scales(domains);

  // The ticks are spaced with 40 pixels.
  // Set tickSizeInner to -width and -height to create a grid
  var yaxisWrapper = d3.axisLeft(scales.y)
                       .tickSizeInner(-width)
                       .tickPadding(7)
                       .ticks(Math.round(height / 30));
                       
  var xaxisWrapper = d3.axisBottom(scales.x)
                       .tickSizeInner(-height)
                       .tickPadding(7)
                       .ticks(Math.min(Math.round(width / 40), domains.x[1]))
                       .tickFormat(d3.format('d'));

  // Actually draw the axes
  svg.select('g.xaxisWrapper')
     .call(xaxisWrapper);

  svg.select('g.yaxisWrapper')
     .call(yaxisWrapper);

  // Set a low opacity of the tick lines so that it won't obscure the content.
  svg.selectAll('.tick line')
     .style('opacity', 0.2);
}

// Return a list of points which is a merge of all series in a list of series.
D3OverviewChart.prototype._extractRawPointCoords = function(series) {
  var flatten = series.map(function(s) { return s.values; })
                      .reduce(function(prev, cur) {
                        return prev.concat(cur);
                      }, []);
  return flatten;
};

// Draw the HORIZON CHART ASPECT OF THE CHART
D3OverviewChart.prototype._drawHorizonArea = function(svg, data) {
  var scales = this._scales(data.domains);
  var series = data.series;
  var areaFunc = d3.area()
                   .x(function(d) { return scales.x(d[0]); })
                   .y0(this.props.height)
                   .y1(function(d) { return scales.y(d[1]); });

  var pathGroup = svg.select('g.horizonAreaWrapper');

  var paths = pathGroup.selectAll('path').data(series);

  var _color = function(i) {
    var color = '';
    switch(i){
      case 0:
        // entire TS
        color = '#e0af9e'
        break;
      case 1:
        // selected area
        color = '#74a2cc'
        break;
      case 2:
        //match
        color = 'green'
        break;
      default:
        console.log("unexpected array")
        color = 'purple';
    }
    return color;
  }

  var _opacity = function(i) {
    var opacity = '';
    switch(i){
      case 0:
        // entire TS
        opacity = 0.65
        break;
      case 1:
        // selected area
        opacity = 0.8
        break;
      default:
        opacity = 1;
    }
    return opacity;
  }


  // enter + update
  paths.enter()
       .append('path')
       .merge(paths)
       .attr('d', function(d) { return areaFunc(d.values); })
       .style('fill', function(_,i){ return _color(i)})
       .style('stroke-width', 0)
       .style('fill-opacity', function(_,i){ return _opacity(i)})
  // exit
  paths.exit().remove();
};

module.exports = D3OverviewChart;
