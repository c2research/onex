var React = require('react');
var Select = require('react-select');
var InsightActions = require('./../flux/actions/InsightActions');

var InsightThresholdSlider = require('./InsightThresholdSlider');

/**
 * This dropdown will have all the datasets
 */
var InsightDatasetDropdown = React.createClass({
   render: function() {
     var divStyle = {width: this.props.width};

     var placeholder = "choose a dataset";

     var panelJSX =
     <div className="section">
        <h2> Dataset </h2>
        <Select
            placeholder={placeholder}
            name="form-field-name"
            options={this.props.dsCollectionList}
            value={this.props.dsCollectionIndex}
            onChange={this._onSelect}
        />
        <InsightThresholdSlider  thresholdRange={this.props.thresholdRange}
                                 thresholdCurrent={this.props.thresholdCurrent}
                                 thresholdStep={this.props.thresholdStep}/>
     </div>;
     return panelJSX;
   },
   _onSelect(val) {
     //I would greedily set the value, then send into flux!
     //but, we want to be able to clear the values on a DS change,
     //and have it represented here clearly
     if (val == null){
       InsightActions.selectDSIndex(null);
     } else {
       InsightActions.selectDSIndex(val.value)
     }
   }
});


module.exports = InsightDatasetDropdown;
