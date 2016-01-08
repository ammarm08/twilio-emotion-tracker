var React = require('react');
var d3 = require('d3');

var DataSeries = React.createClass({

  //set hover event listeners on each circle as soon as 
  //component receives new props from parents
  componentDidUpdate: function() {
    this.setCircleHover(this.props.data);
  },

  setCircleHover: function(data) {
    var readDate = d3.time.format("%B %d, %Y");
    var tooltip = d3.select(".tooltip");

    var renderTooltipChart = function(point) {
      var width = (+point/10*100).toString() + "%";
      var chart = '<div class="tooltip-chart" max-width=' + width + '>' + point + '</div>';
      return '<div class="tooltip-chart-container">' + chart + '</div>';
    };

    var tooltipTemplate = function(point) {

      var date = '<thead><tr><th>' + readDate(point.date) + '</th></tr></thead>';
      var hr = '<tr><td><hr/></td></tr>';
      var emotion = '<tr><td>' + renderTooltipChart(point.emotion) + '</td></tr>';
      var hydration = '<tr><td>' + point.hydrate + '</td></tr>';
      var note = '<tr><td>' + point.note + '</td></tr>';

      return '<table><tbody>' + date + hr + emotion + hydration + note + '</tbody></table>';
    };

    d3.selectAll("circle").data(data)
                          .on("mouseover", function(d) {
                            tooltip.transition().duration(200).style("opacity", .9);
                            tooltip.html(tooltipTemplate(d))
                                   .style("left", (d3.event.pageX + 20) + "px")
                                   .style("top", (d3.event.pageY - 30) + "px");
                          })
                          .on("mouseout", function(d) {
                            tooltip.transition().duration(500).style("opacity", 0);
                          });
  },

  render: function() {

    var x = this.props.scale.x,
        y = this.props.scale.y;

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