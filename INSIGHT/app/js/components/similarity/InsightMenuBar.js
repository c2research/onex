var React = require('react');
var InsightActions = require('./../../flux/actions/InsightActions');
var InsightConstants = require('./../../flux/constants/InsightConstants');

//TODO(charlie): add tooltips
var MenuIcon = React.createClass({
  render: function(){
    var type = this.props.type;
    var active = type == this.props.graphType;
    var activeStyle = active ? ' focus' : ' menu';
    var className;

    switch(type){
      case InsightConstants.GRAPH_TYPE_ERROR:
         className = "fa fa-signal fa-lg" + activeStyle;
         break;
      case InsightConstants.GRAPH_TYPE_CONNECTED:
         className = "fa fa-sort-amount-desc fa-lg" + activeStyle;
         break;
      case InsightConstants.GRAPH_TYPE_HORIZON:
         className = "fa fa-area-chart fa-lg" + activeStyle;
         break;
      case InsightConstants.GRAPH_TYPE_LINE:
         className = "fa fa-line-chart fa-lg" + activeStyle;
         break;
      case InsightConstants.GRAPH_TYPE_WARP:
         className = "fa fa-connectdevelop fa-lg" + activeStyle;
         break;
    }

    var SliderJSX = this.props.results && active && (type == InsightConstants.GRAPH_TYPE_WARP) ? this.props.renderDTWSlider : null;

    return (<div key={type}>
      <i className={className}
        onClick={this.props.onClick}>
      </i>
      {SliderJSX}
    </div>);

  }
});

/**
 * This dropdown will have all the datasets
 */
var InsightMenuBar = React.createClass({
  renderDTWSlider: function() {
    var style =  {
      slider: {
        marginRight: 7,
        marginLeft: 10,
        height: 75,
        width: 7,
        WebkitAppearance: 'slider-vertical',  //chrome
        WritingMode: 'bt-lr' //ie lol
        //orient=vertical //firefox (html not css)
      }
    }
    return <div style={style.icon}>
            <input
              type="range"
              style={style.slider}
              max={5}
              min={-5}
              step={1}
              value={this.props.DTWBias}
              onChange={this._updateDTWBias}/>
           </div>
   },
   render: function() {
     var style = {
       menuBar: {
         height: this.props.height,
         width: this.props.width,
         background: '#f2f2f2'
       }
     }

     var graphTypeList = [InsightConstants.GRAPH_TYPE_LINE,
                          InsightConstants.GRAPH_TYPE_WARP,
                          InsightConstants.GRAPH_TYPE_HORIZON,
                          InsightConstants.GRAPH_TYPE_CONNECTED,
                          InsightConstants.GRAPH_TYPE_ERROR];

     var that = this;
     var IconsJSX = graphTypeList.map(function(i) {
       return <MenuIcon key={i}
                        type={i}
                        graphType={that.props.graphType}
                        results={that.props.results}
                        onClick={(event) => that._selectGraphType(i)}
                        renderDTWSlider={that.renderDTWSlider()} />
     });

     return (<div style={style.menuBar}>
      {IconsJSX}
     </div>);
   },
   _selectGraphType: function(type) {
     InsightActions.selectGraphType(type);
   },
   _updateDTWBias: function(e) {
     InsightActions.updateDTWBias(e.target.value);
   }
});

module.exports = InsightMenuBar;
