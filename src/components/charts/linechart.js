var React = require('react');
var d3 = require('d3');
var LineChart = React.createClass({

  // if this component's props ever change, that is our
  // signal to render our chart
  componentDidUpdate: function() {

    // D3 -- configuration + line-drawing function to specify x-y coordinate pairs
    var x = this.props.scale.x,
        y = this.props.scale.y,
        xAxis = this.props.axis.x,
        yAxis = this.props.axis.y,
        height = this.props.height,
        data = this.props.data,
        line = d3.svg.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.emotion); });

    // parse our data so D3 can use it
    helpers.formatData(data);
    helpers.setDomain(x, y, data);

    // render everything
    this.renderAxes(xAxis, yAxis, height);    
    this.renderPath(data, line);
    this.renderPoints(x, y, data);
  },

  renderAxes: function(xAxis, yAxis, height) {
    d3.select(".chart-container").append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    d3.select(".chart-container").append("g")
      .attr("class", "axis y-axis")
      .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".20em")
        .style("text-anchor", "end")
        .text("Emotion");
  },

  renderPath: function(data, line) {

    d3.select(".chart-container").append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
  },

  renderPoints: function(x, y, data) {
    d3.select(".chart-container").append("g").attr("class", "points")
      .selectAll("circle")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 8)
      .attr("cx", function(d) {return x(d.date)})
      .attr("cy", function(d) {return y(d.emotion)});
  },

  render: function() {
    return (
      <g className="chart-container" transform={"translate(" + this.props.margin.left + "," + this.props.margin.top + ")"}>
      </g>
    );
  }

});

var helpers = {

  setDomain: function(x, y, data) {
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain([0, 10]);
  },

  formatData: function(data) {
    var parseDate = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ").parse;

    data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.emotion = +d.emotion;
    });

    data.sort(function(a, b) {
      return a.date - b.date;
    });
  }

};

module.exports = LineChart;