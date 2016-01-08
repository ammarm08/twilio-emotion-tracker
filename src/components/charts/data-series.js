var React = require('react');
var d3 = require('d3');

var DataSeries = React.createClass({

  render: function() {

    var x = this.props.scale.x,
        y = this.props.scale.y;

    // map a circle element for each data point
    var points = this.props.data.map(function(point, i) {
      return (
        <circle 
          r={8} 
          cx={x(point.date)} 
          cy={y(point.emotion)} 
          key={i} />
      )
    });

    return (
      <g transform={"translate(50,30)"}>{points}</g>
    );
  }
});


module.exports = DataSeries;