var React = require('react');
var Select = require('react-select');
var InsightActions = require('./../flux/actions/InsightActions');
var InsightProcess = require('./InsightProcess');

var resizeId;

var InsightThresholdSlider = require('./InsightThresholdSlider');

/**
 * This dropdown will have all the datasets
 */
var InsightDatasetDropdown = React.createClass({
   render: function() {
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
        <InsightProcess datasetIconMode={this.props.datasetIconMode}
                        dsCollectionIndex={this.props.dsCollectionIndex}/>
     </div>;
     return panelJSX;
   },
   _onSelect(val) {
     if (val == null){
       InsightActions.selectDSIndex(null);
     } else {
       InsightActions.selectDSIndex(val.value)
     }
   }
});


module.exports = InsightDatasetDropdown;
