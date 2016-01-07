var React = require('react');

var Bubble = React.createClass({
  getDefaultProps: function() {
    return {
      width: 0,
      height: 0,
      offset: 0
    }
  },

  render: function() {
    return (
      <circle r={this.props.r}
        cx={this.props.cx} cy={this.props.cy} />
    );
  }
});

module.exports = Bubble;