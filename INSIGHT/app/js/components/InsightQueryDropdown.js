var React = require('react');
var Select = require('react-select');

/**
 * This dropdown will have all the datasets
 */
var InsightQueryDropdown = React.createClass({
   getInitialState () {
     return {};
   },
   render: function() {
     //var divStyle = {width: this.props.width};

     //var datasetList=this.props.datasetList;
     //var datasetCurrentIndex=this.props.datasetCurrentIndex;

     var options = [
         { value: 'one', label: 'One' },
         { value: 'two', label: 'Two' }
     ];

     var placeholder = "choose from the dataset";

     var panelJSX =
     <Select
            width="215px"
            placeholder={placeholder}
            name="form-field-name"
            options={options}
            value={this.state.value}
            onChange={this._onSelect}
      />;

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


module.exports = InsightQueryDropdown;
