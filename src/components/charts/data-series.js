var React = require('react');
var d3 = require('d3');

var DataSeries = React.createClass({

  //set hover event listeners on each circle as soon as 
  //component receives new props from parents
  componentDidUpdate: function() {
    this.drawLines(this.props.scale.x, this.props.scale.y, this.props.data);
    // this.setCircleHover(this.props.data);
  },

  drawLines: function(x, y, data) {
    var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.emotion); });

    d3.select(".emotions")
      .append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
  },

  // setCircleHover: function(data) {
    
  //   var tooltip = d3.select(".tooltip");

  //   d3.selectAll("circle").data(data)
  //     .on("mouseover", function(d) {
  //       tooltip.transition().duration(200).style("opacity", .9);
  //       tooltip.html(helpers.templateTooltip(d))
  //              .style("left", (d3.event.pageX + 20) + "px")
  //              .style("top", (d3.event.pageY - 30) + "px");
  //       var width = (d.emotion*10).toString();
  //       d3.select(".tooltip-chart").style("width", width + "%");
  //     })
  //     .on("mouseout", function(d) {
  //       tooltip.transition().duration(500).style("opacity", 0);
  //     })
  // },

  render: function() {

    // var points = this.props.data.map(function(point, i) {
    //   return (
    //     <g 
    //       r={6} 
    //       cx={x(point.date)} 
    //       cy={y(point.emotion)} 
    //       key={i} />
    //   )
    // });

    return (
      <g className="emotions">
      </g>
    );
  }
});

var helpers = {

  templateTooltip: function(point) {
    var readDate = d3.time.format("%B %d, %Y");

    var date = '<thead><tr><th>' + readDate(point.date) + '</th></tr></thead>';
    var hr = '<tr><td><hr/></td></tr>';
    var emotion = '<tr><td>' + helpers.renderTooltipChart(point.emotion) + '</td></tr>';
    var hydration = '<tr><td>' + point.hydrate + '</td></tr>';
    var note = '<tr><td>' + point.note + '</td></tr>';

    return '<table><tbody>' + date + hr + emotion + hydration + note + '</tbody></table>';
  },

  renderTooltipChart: function(point) {
    var data = '<span class="data-emotion">' + point + '</span>';
    var chart = '<div class="tooltip-chart">' + data + '</div>';
    return '<div class="tooltip-chart-container">' + chart + '</div>';
  }

};



module.exports = DataSeries;