var React = require('react');
var InsightQuerySlider = require('./../InsightQuerySlider');
var InsightActions = require('./../../flux/actions/InsightActions');
var InsightConstants = require('./../../flux/constants/InsightConstants');
var InsightFindSeasonalButton = require('./InsightFindSeasonalButton');
var AnnotatedSlider = require('./../AnnotatedSlider');

var InsightSeasonalQuery = React.createClass({
  render: function() {

    var querySlider = <InsightQuerySlider
                        qSeq={this.props.qSeq} 
                        dsCurrentLength={this.props.dsCurrentLength} 
                        onChange={this._handleQueryChange} />

    var lengthSlider = <div className="panel" >
                        <h4>Select the length of each pattern</h4>
                          <div className="options">
                            <AnnotatedSlider
                              value={this.props.qLength}
                              min={3}
                              max={this.props.qValues.length - 1}
                              step={1}
                              onChange={this._handleLengthChange}/>
                          </div>
                        </div>;

    var panelJSX = this.props.dsCurrentLength > 0 &&
    <div className="section">
      <h2> Query </h2>
        <div>
          {querySlider}
          {lengthSlider}
          <InsightFindSeasonalButton show={true} />
        </div>
    </div>;

    return <div> {panelJSX} </div>;
  },

  _handleQueryChange: function(e) {
    InsightActions.selectSeasonalQuery(parseInt(e.target.value, 10));
    clearTimeout(this._queryChangedId);
    this._queryChangedId = setTimeout(InsightActions.loadSeasonalQuery, 50);
   },

  _handleLengthChange: function(e) {
    InsightActions.selectSeasonalLength(parseInt(e.target.value, 10));
  }

});

module.exports = InsightSeasonalQuery;
