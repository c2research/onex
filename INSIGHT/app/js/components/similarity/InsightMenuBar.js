var React = require('react');
var InsightActions = require('./../../flux/actions/InsightActions');
var InsightConstants = require('./../../flux/constants/InsightConstants');



var MenuIcon = React.createClass({
  /**
   * Gets the initial data for the state of the app
   */
  getInitialState: function() {
    return {'visibility' : false}
  },
  componentWillMount: function() {
    this.setState({'visibility' : false});
  },
  render: function(){
    var type = this.props.type;
    var active = type == this.props.graphType;
    var activeStyle = active ? ' focus' : ' menu';
    var className;
    var toolTipTextTitle = ''
    var toolTipText = ''

    // react inline does not support ::after so some css is in the style sheet
    var style = {
      tooltipcontainer: {
        position: 'relative',
        display: 'inline-block',
        zIndex: 999,
        paddingTop: 10,
        paddingBottom: 10
      },
      tooltipcontainertext: {
        width: 120,
        backgroundColor: '#555',
        color: '#fff',
        textAlign: 'center',
        padding: '5 0',
        borderRadius: 6,

        /* Position the tooltip text */
        position: 'absolute',
        zIndex: 9999,
        top: -5,
        right: '105%',

        /* Fade in tooltip */
        opacity: 0,
        transition: 'opacity 1'
      },
    }

    switch(type){
      case InsightConstants.GRAPH_TYPE_ERROR:
         className = "fa fa-signal fa-2x" + activeStyle;
         toolTipTextTitle = 'Difference Graph';
         toolTipText =  'plots difference between matched points';
         break;
      case InsightConstants.GRAPH_TYPE_CONNECTED:
         className = "fa fa-sort-amount-desc fa-2x" + activeStyle;
         toolTipTextTitle = 'Connected Scatter Plot';
         toolTipText =  'plots point values across the axises and indicates time with connections';
         break;
      case InsightConstants.GRAPH_TYPE_HORIZON:
         className = "fa fa-area-chart fa-2x" + activeStyle;
         toolTipTextTitle = 'Horizon Charts';
         toolTipText =  'Compresses data by using overlapping color by folding the charts at the 0.5 axis';
         break;
      case InsightConstants.GRAPH_TYPE_LINE:
         className = "fa fa-line-chart fa-2x" + activeStyle;
         toolTipTextTitle = 'Line Chart';
         toolTipText =  'The simple line chart that plots data over time';
         break;
      case InsightConstants.GRAPH_TYPE_WARP:
         className = "fa fa-connectdevelop fa-2x" + activeStyle;
         toolTipTextTitle = 'Warped Line Chart';
         toolTipText =  'Warped Line Charts show the connections between the matched points';
         break;
    }

    var SliderJSX = this.props.results && active ? this.props.renderDTWSlider : null;
    var toolTipJSX = this.state.visibility ?
    <div style={style.tooltipcontainertext}>
      <div>
        <h4>{toolTipTextTitle}</h4>
        {toolTipText}
      </div>
    </div> : null;


    return (
    <div key={type} className={'menuIconSpacer'}
           onMouseEnter={(event) => this.setState({'visibility' : !this.state.visibility})}
           onMouseLeave={(event) => this.setState({'visibility' : !this.state.visibility})}>

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

module.exports = InsightMenuBar;
