var React = require('react');
var InsightConstants = require('./../flux/constants/InsightConstants');

var {Table, Column, ColumnGroup, Cell} = require('fixed-data-table');

var DatasetNameCell = function({rowIndex, data, ...props}) {
  return <Cell {...props}>
          {data[rowIndex]['dsName']['name']}
         </Cell>;
}

var SameDataset = function({rowIndex, data, ...props}) {
  return <Cell {...props}>
           {data[rowIndex]['qTypeLocal'] == InsightConstants.QUERY_TYPE_DATASET ? "Y" : "N"}
         </Cell>
}

var TextCell = function({rowIndex, data, field, ...props}) {
  return <Cell {...props}>
           {data[rowIndex][field]}
         </Cell>;
}

var DecimalCell = function({rowIndex, data, field, ...props}) {
  return <Cell {...props}>
           {data[rowIndex][field].toFixed(2)}
         </Cell>;
}

/**
 * Data table
 */
var InsightViewTable = React.createClass({
  render: function() {
    var resultData = this.props.results;

    var QueryGroup =
      <ColumnGroup
        header={<Cell>Query</Cell>}>
        <Column
          header={<Cell>Dataset Name</Cell>}
          cell={<DatasetNameCell data={resultData} />}
          width={150}
        />
        <Column
          header={<Cell>From same dataset?</Cell>}
          cell={<SameDataset data={resultData} />}
          width={170}
        />
        <Column
          header={<Cell>Sequence</Cell>}
          cell={<TextCell data={resultData} field="qSeq" />}
          width={100}
        />
        <Column
          header={<Cell>Start</Cell>}
          cell={<TextCell data={resultData} field="qStart" />}
          width={50}
        />
        <Column
          header={<Cell>End</Cell>}
          cell={<TextCell data={resultData} field="qEnd" />}
          width={50}
        />
      </ColumnGroup>

    var ResultGroup =
      <ColumnGroup
        header={<Cell>Result</Cell>}>
        <Column
          header={<Cell>Sequence</Cell>}
          cell={<TextCell data={resultData} field="rSeq" />}
          width={100}
        />
        <Column
          header={<Cell>Start</Cell>}
          cell={<TextCell data={resultData} field="rStart" />}
          width={50}
        />
        <Column
          header={<Cell>End</Cell>}
          cell={<TextCell data={resultData} field="rEnd" />}
          width={50}
        />
        <Column
          header={<Cell>Similarity</Cell>}
          cell={<DecimalCell data={resultData} field="similarityValue" />}
          width={100}
        />
      </ColumnGroup>

    var tableJSX =
    <div className="viewTable">
      <Table
        rowHeight={50}
        rowsCount={resultData.length}
        width={this.props.width}
        height={200}
        groupHeaderHeight={40}
        headerHeight={40}>
       {QueryGroup}
       {ResultGroup}
      </Table>
    </div>;

    return tableJSX;
  }
});

module.exports = InsightViewTable;
