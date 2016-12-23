var React = require('react');
var InsightActions = require('./../../flux/actions/InsightActions');
var InsightConstants = require('./../../flux/constants/InsightConstants');

var InsightMenuBarResult = React.createClass({
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    dtwBias: React.PropTypes.number,
    graphType: React.PropTypes.string,
    resultSelected: React.PropTypes.bool
  },

  render: function() {
    var menubarStyle = {
      height: this.props.height,
      width: this.props.width,
      background: '#f2f2f2',
      paddingTop: 10,
      paddingLeft: 5,
      position: 'absolute',
      right: 0,
      top: 0
    }

    var graphTypeList = [InsightConstants.GRAPH_TYPE_LINE,
                          InsightConstants.GRAPH_TYPE_WARP,
                          InsightConstants.GRAPH_TYPE_CONNECTED,
                          InsightConstants.GRAPH_TYPE_RADIAL,
                          InsightConstants.GRAPH_TYPE_ERROR,
                          InsightConstants.GRAPH_TYPE_SPLIT];

    var that = this;

    var IconsJSX = graphTypeList.map(function(type) {
      var moreJSX;
      var active = that.props.graphType === type;
      if (active && type === InsightConstants.GRAPH_TYPE_WARP && that.props.resultSelected) {
        moreJSX = <DTWSlider dtwBias={that.props.dtwBias}/>;
      }
      return <MenuIcon
              key={type}
              type={type}
              active={that.props.graphType === type}
              onClick={(event) => InsightActions.selectGraphType(type)}
              more={moreJSX} />
    });

    return (
      <div style={menubarStyle}>
        {IconsJSX}
      </div>
    );
   },
});

var DTWSlider = React.createClass({
  propTypes: {
    dtwBias: React.PropTypes.number,
  },

  render: function() {
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

    return (
      <input type="range" style={style.slider} max={5} min={-5} step={1}
        value={this.props.dtwBias}
        onChange={e => InsightActions.updateDTWBias(e.target.value)}/>
    );
  },
});

var MenuIcon = React.createClass({
  propTypes: {
    more: React.PropTypes.object,
    type: React.PropTypes.string,
    active: React.PropTypes.bool
  },

  render: function() {
    var type = this.props.type;
    var active = this.props.active;
    var activeStyle = active ? ' focus' : ' menu';

    var [icon, className, title, message] = getTypeInfo(type);
    className += activeStyle;

    var MoreJSX = this.props.more;

    return (
      <div>
        <i className={className}
          onClick={this.props.onClick}
          onMouseEnter={(event) => this._handleEnter(active, title, message, icon)}
          onMouseLeave={(event) => this._handleLeave(active)}>
        </i>
        {MoreJSX}
      </div>);
  },
  _handleEnter: function(active, title, message, icon) {
    InsightActions.sendMessage([title, icon,  '#58768f','#bbcddb', message, true]);
  },
  _handleLeave: function(active){
    InsightActions.sendMessage(['', '', '', '', '', false]);
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
       message =  'plots data over time';
       break;
    case InsightConstants.GRAPH_TYPE_WARP:
       icon = "connectdevelop";
       className = "fa fa-connectdevelop fa-2x";
       title = 'Warped Line Chart';
       message =  'connects the matched points';
       break;
    case InsightConstants.GRAPH_TYPE_SPLIT:
       icon = "list";
       className = "fa fa-list fa-2x";
       title = 'Layered Line Chart';
       message =  'Layers the query and result';
       break;
    case InsightConstants.GRAPH_TYPE_RADIAL:
       icon = "sun-o";
       className = "fa fa-sun-o fa-2x";
       title = 'Radial Chart';
       message =  'Plots data around a single circle';
       break;
  }

  return [icon, className, title, message];
};


module.exports = InsightMenuBarResult;
