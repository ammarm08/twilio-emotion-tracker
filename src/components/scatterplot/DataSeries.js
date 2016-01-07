var React = require('react');
var d3 = require('d3');
var Bubble = require('./Bubble');

var DataSeries = React.createClass({
  getDefaultProps: function() {
    return {
      title: '',
      data: []
    }
  },

  render: function() {
    var props = this.props;

    var iso = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");
    var readDate = d3.time.format("%Y-%m-%d");
    var parseDate = iso.parse;

    var x = d3.time.scale.utc().range([0, this.props.width]);
    var y = d3.scale.linear().range([this.props.height, 0]);

    props.data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.emotion = +d.emotion;
    });

    x.domain(d3.extent(props.data, function(d) { return d.date; }));
    y.domain([0, 10]);

    var bubbles = this.props.data.map(function(point, i) {
      return (
        <Bubble r={10} cx={x(point.date)} cy={y(point.emotion)} key={i} />
      )
    });

    return (
      <g transform={"translate(50,30)"}>{bubbles}</g>
    );
  }
});


module.exports = DataSeries;