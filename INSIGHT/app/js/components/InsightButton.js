var React = require('react');

var style = {
  button : {
    opacity: 0.7,
    background: 'white',
    color: 'grey',
    fontSize: '0.9em',
    padding: '5px 5px 5px 5px',
    borderRadius: '3px',
    textAlign: 'center'
  },
  buttonHover : {
    opacity: 0.7,
    background: 'white',
    color: 'grey',
    fontSize: '0.9em',
    padding: '5px 5px 5px 5px',
    borderRadius: '3px',
    textAlign: 'center',
    opacity: 1,
    background: '#a9a9a9'
  },
  buttonPress: {
    opacity: 0.7,
    background: 'white',
    color: 'grey',
    fontSize: '0.9em',
    padding: '5px 5px 5px 5px',
    borderRadius: '3px',
    textAlign: 'center',
    backgroundImage: '-webkit-linear-gradient(top, #c2c2d6, #a9a9a9)'
  }
}

/**
 * This is a style-ized button for insight
 */
var InsightButton = React.createClass({
   render: function() {
     var buttonJSX =
     <div className={'insightButton'}
          onClick={this.props.onClick}>
          {this.props.text}
     </div>

     return buttonJSX;
   }
});

module.exports = InsightButton;
