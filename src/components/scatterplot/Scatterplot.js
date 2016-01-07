var React = require('react');
var d3 = require('d3');
var Chart = require('./Chart');
var DataSeries = require('./DataSeries');

var Scatterplot = React.createClass({

  render: function() {
    return (
      <Chart width={this.props.width} height={this.props.height}>
        <DataSeries data={this.props.data} width={this.props.width} height={this.props.height} color="cornflowerblue" />
      </Chart>
    );
  }
});

module.exports = Scatterplot;