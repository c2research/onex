var React = require('react');
var InsightActions = require('./../../flux/actions/InsightActions');
var InsightConstants = require('./../../flux/constants/InsightConstants');



var MenuIcon = React.createClass({
  /**
   * Gets the initial data for the state of the app
   */
  render: function(){
    var type = this.props.type;
    var active = type == this.props.graphType;
    var activeStyle = active ? ' focus' : ' menu';
    var title = ''
    var message = ''

    //create message
    var [icon, className, title, message] = getTypeInfo(type);
    className += activeStyle;

    var SliderJSX = (this.props.results && active && this.props.type == InsightConstants.GRAPH_TYPE_WARP) ? this.props.renderDTWSlider : null;

    return (
    <div key={type}
         onMouseEnter={(event) => this._handleEnter(active, title, message, icon)}
         onMouseLeave={(event) => this._handleLeave(active)}>
         <i className={className}
            onClick={this.props.onClick}>
         </i>
         {SliderJSX}
    </div>);
  },
  _handleEnter: function(active, title, message, icon) {
    //var iconColor = active && '#7c63d8' || '#ff921a';
    InsightActions.sendMessage([title, icon, '#efefef', '#a3cfec', message, true]);
  },
  _handleLeave: function(active){
    if (active){
      return;
    } else if (this.props.graphType) {
      var [icon, className, title, message] = getTypeInfo(this.props.graphType);
      InsightActions.sendMessage([title, icon, '#efefef', '#a3cfec', message, true]);
    }
  }
});

/**
 * This dropdown will have all the datasets
 */
var InsightMenuBar = React.createClass({
  renderDTWSlider: function() {
    var style = {
      slider: {
        marginRight: 7,
        marginLeft: 10,
        height: 75,
        width: 7,
        WebkitAppearance: 'slider-vertical',  //chrome
        WritingMode: 'bt-lr' //ie lol
        //orient=vertical //firefox (html not css)
      }
    };

    return <div>
            <input
              type="range"
              style={style.slider}
              max={5}
              min={-5}
              step={1}
              value={this.props.dtwBiasValue}
              onChange={this._updateDTWBias}/>
           </div>;
   },
   render: function() {
     var h = this.props.results && (this.props.type == InsightConstants.GRAPH_TYPE_WARP) ? (75+150) : 150;

     var style = {
       //height: this.props.height,
       menuBar: {
         width: this.props.width - 20,
         background: '#f2f2f2',
         marginTop: (1/2 *((4.0/5.0) * this.props.height) - 30) - (1/2 * h),  //this number is pretty fn hardcoded
         paddingTop: 10,                                                 //75 = 1/2 length of the menubar
         paddingRight: 7.5,
         paddingLeft: 7.5,
         paddingBottom: 10,
         borderRadius: 3
       }
     }

     //InsightConstants.GRAPH_TYPE_HORIZON, TODO(charlie): add horizon when complete
     var graphTypeList = [InsightConstants.GRAPH_TYPE_LINE,
                          InsightConstants.GRAPH_TYPE_WARP,
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
              <div>
                {IconsJSX}
              </div>
            </div>);
   },
   _selectGraphType: function(type) {
     InsightActions.selectGraphType(type);
   },
   _updateDTWBias: function(e) {
     InsightActions.updateDTWBias(e.target.value);
   }
});

var getTypeInfo = function(type) {
  var icon, className, title, message;

  switch(type){
    case InsightConstants.GRAPH_TYPE_ERROR:
       icon = "signal";
       className = "fa fa-signal fa-2x";
       title = 'Difference Graph';
       message =  'plots difference between matched points';
       break;
    case InsightConstants.GRAPH_TYPE_CONNECTED:
       icon = "sort-amount-desc";
       className = "fa fa-sort-amount-desc fa-2x";
       title = 'Connected Scatter Plot';
       message =  'plots point values across the axises and indicates time with connections';
       break;
    case InsightConstants.GRAPH_TYPE_HORIZON:
       icon = "area-chart"
       className = "fa fa-area-chart fa-2x";
       title = 'Horizon Charts';
       message =  'Compresses data by using overlapping color by folding the charts at the 0.5 axis';
       break;
    case InsightConstants.GRAPH_TYPE_LINE:
       icon = "line-chart"
       className = "fa fa-line-chart fa-2x";
       title = 'Line Chart';
       message =  'The simple line chart that plots data over time';
       break;
    case InsightConstants.GRAPH_TYPE_WARP:
       icon = "connectdevelop";
       className = "fa fa-connectdevelop fa-2x";
       title = 'Warped Line Chart';
       message =  'Warped Line Charts show the connections between the matched points';
       break;
  }

  return [icon, className, title, message];
}


module.exports = InsightMenuBar;
