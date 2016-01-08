var React = require('react');
var d3 = require('d3');

var DataSeries = React.createClass({

  //set hover event listeners on each circle as soon as 
  //component receives new props from parents
  componentDidUpdate: function() {
    this.setCircleHover(this.props.data);
  },

  setCircleHover: function(data) {
    var readDate = d3.time.format("%Y-%m-%d");

    var tooltip = d3.select(".tooltip");
    var tooltipTemplate = function(point) {
      return '<span class="label">Date: </span>' + readDate(point.date) + '<br/>' +
             '<span class="label">Emotion: </span>' + point.emotion + '<br/>' +
             '<span class="label">Hydrated?: </span>' + point.hydrate + '<br/>' + 
             '<span class="label">Note: </span>' + point.note + '<br/>'
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