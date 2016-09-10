var React = require('react');
var ReactDOM = require('react-dom');

const Plotly = require('react-plotlyjs');


/**
 * This is a prototype for an initial view
 */
var InsightView = React.createClass({

   render: function() {
     var style = {
       width: 900 + "px",
       height: 500 + "px",
     }
     //return <div id="myDiv" style={style}> </div>;
     //return <div id='wind-speed' className="chart" style={style}></div>;
     let data = [
      {
        type: 'scatter',  // all "scatter" attributes: https://plot.ly/javascript/reference/#scatter
        x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],     // more about "x": #scatter-x
        y: [6, 2, 3, 3, 1, 2, 3, 3, 4, 5],     // #scatter-y
        marker: {         // marker is an object, valid marker keys: #scatter-marker
          color: 'rgb(16, 32, 77)' // more about "marker.color": #scatter-marker-color
        }
      }
    ];
    let layout = {                     // all "layout" attributes: #layout
      title: 'prototype',  // more about "layout.title": #layout-title
      xaxis: {                  // all "layout.xaxis" attributes: #layout-xaxis
        title: 'time'         // more about "layout.xaxis.title": #layout-xaxis-title
      },
      annotations: [            // all "annotation" attributes: #layout-annotations
        {
          x: 0,                         // #layout-annotations-x
          y: 0,                         // #layout-annotations-y
        }
      ]
    };
    let config = {
      showLink: false,
      displayModeBar: false
    };
    return (
      <div className="chart" style={style}>
        <Plotly className="whatever" data={data} layout={layout} config={config}/>
      </div>
    );
   }
});

module.exports = InsightView;
