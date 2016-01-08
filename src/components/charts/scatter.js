var React = require('react');
var d3 = require('d3');
var DataSeries = require('./data-series');

var Scatterplot = React.createClass({

  componentDidMount: function() {
    this.renderAxes(this.props.axis.x, this.props.axis.y, this.props.height);
  },

  renderAxes: function(xAxis, yAxis, height) {
    
    d3.select("svg").append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    d3.select("svg").append("g")
      .attr("class", "axis")
      .call(yAxis);

  },

  render: function() {

    var x = this.props.scale.x,
        y = this.props.scale.y;

    var parseDate = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ").parse;

    // parse date and emotion attributes into usuable formats
    this.props.data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.emotion = +d.emotion;
    });

    // set the domain and range w/ the now updated data
    x.domain(d3.extent(this.props.data, function(d) { return d.date; }));
    y.domain([0, 10]);

    return (
      <g>
        <DataSeries 
          className="data-series" 
          data={this.props.data}
          scale={this.props.scale} />
      </g>
    );
  }

});

module.exports = Scatterplot;