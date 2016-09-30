var React = require('react');
var InsightQuerySlider = require('./InsightQuerySlider');
var InsightQueryOptions = require('./InsightQueryOptions');

/**
 * This dropdown will have all the pre-existing queries
 */
var InsightQuery = React.createClass({
   render: function() {
     var divStyle = {width: this.props.width};

     var queryList=this.props.queryList;
     var queryCurrentIndex=this.props.queryCurrentIndex;

     var distanceJSX = null; /*this.props.viewMode == InsightConstants.VIEW_MODE_SIMILARITY || this.props.viewMode == InsightConstants.VIEW_MODE_SEASONAL ?
     <InsightDistanceDropdown distanceList={this.props.distanceList}
                              distanceCurrentIndex={this.props.distanceCurrentIndex}/> : null;
     */

     /*
     <div className="options">
       <div className="iconWrapper"> <i className="fa fa-upload" aria-hidden="false"></i></div>
       <h3 className="options"> Load query from File  </h3>
     </div>
     <div  className="options">
     <div className="iconWrapper"> <i className="fa fa-gears" aria-hidden="false"></i></div>
       <h3 className="options"> Interative Query Building </h3>
     </div>
     */

     var panelJSX = this.props.dsCurrentLength > 0 ?
     <div className="section">
        <h2> Query </h2>
        <UploadQuery />
        <div>
          <div>
            <InsightQuerySlider qSeq={this.props.qSeq} dsCurrentLength={this.props.dsCurrentLength} />
            <InsightQueryOptions qValues={this.props.qValues} qStart={this.props.qStart} qEnd={this.props.qEnd} />
          </div>
        </div>
     </div> : null;

     return <div> {panelJSX} </div>;
   }
});

var UploadQuery = React.createClass({
  handleDrop: function(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
      output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                  f.size, ' bytes, last modified: ',
                  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                  '</li>');
    }
    document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
  },
  handleDragOver: function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  },
  render: function() {
    return (<div>
      <div id="drop_zone"
           onDrag={this.handleDrag}
           onDrop={this.handleDrop}>
        <input type="file" id="files" name="file" />
      </div>
      <output id="list"></output>
    </div>);
  }
});
module.exports = InsightQuery;
