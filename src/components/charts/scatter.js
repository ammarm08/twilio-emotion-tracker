var React = require('react');
var d3 = require('d3');
var DataSeries = require('./data-series');

var Scatterplot = React.createClass({

  renderAxes: function(x, y, height) {
    var xAxis = d3.svg.axis().scale(x)
                  .orient("bottom").ticks(5);

    var yAxis = d3.svg.axis().scale(y)
                  .orient("left").ticks(5);

    d3.select("svg").append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    d3.select("svg").append("g")
      .attr("class", "y axis")
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

    this.renderAxes(x, y, this.props.height);

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