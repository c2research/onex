var React = require('react');
var Select = require('react-select');

/**
 * This dropdown will have all the datasets
 */
var InsightDatasetDropdown = React.createClass({
   getInitialState () {
     return {};
   },
   render: function() {
     var divStyle = {width: this.props.width};

     var datasetList=this.props.datasetList;
     var datasetCurrentIndex=this.props.datasetCurrentIndex;

     var options = [
         { value: 'one', label: 'One' },
         { value: 'two', label: 'Two' }
     ];

     var placeholder = "choose a dataset";

     var panelJSX =
     <div className="section">
        <h2> Dataset </h2>
        <Select
            placeholder={placeholder}
            name="form-field-name"
            options={options}
            value={this.state.value}
            onChange={this._onSelect}
        />
     </div>;

     return <div> {panelJSX} </div>;
   },
   _onSelect(val) {
     if (val == null){
       this.setState({value: null});
     } else {
       this.setState({value: val.value});
     }
   }
});


module.exports = InsightDatasetDropdown;
