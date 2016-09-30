var React = require('react');
var ReactDOM = require('react-dom');
var d3 = require('d3');

var LineChart = require('rd3').LineChart;
var AreaChart = require('rd3').AreaChart;
var {Table, Column, Cell} = require('fixed-data-table');

//temp fake data
const rows = [
  ['a1', 'b1', 'c1'],
  ['a2', 'b2', 'c2'],
  ['a3', 'b3', 'c3'],
  // .... and more
];

/**
 * This is the data table
 */
var InsightViewTable = React.createClass({
   render: function() {
     var tableJSX =
     <div className="view">
     <Table
      rowHeight={50}
      rowsCount={rows.length}
      width={this.props.width}
      height={this.props.height}
      headerHeight={50}>
      <Column
        header={<Cell>Col 1</Cell>}
        cell={<Cell>Column 1 static content</Cell>}
        width={this.props.width / 3}
      />
      <Column
        header={<Cell>Col 2</Cell>}
        cell={<Cell>Column 1 static content</Cell>}
        width={this.props.width / 3}
      />
      <Column
        header={<Cell>Col 3</Cell>}
        cell={({rowIndex, ...props}) => (
          <Cell {...props}>
            Data for column 3: {rows[rowIndex][2]}
          </Cell>
        )}
        width={this.props.width / 3}
      />
    </Table>
    </div>;

     return tableJSX;
   }
});

module.exports = InsightViewTable;
