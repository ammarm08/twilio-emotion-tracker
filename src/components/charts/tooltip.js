var React = require('react');
var d3 = require('d3');

var Tooltip = React.createClass({

  componentDidUpdate: function() {
    this.showOnHover(this.props.data);
  },

  showOnHover: function(data) {

    var tooltip = d3.select(".tooltip");

    d3.selectAll("circle").data(data)
      .on("mouseover", function(d) {
        tooltip.transition().duration(500).style("opacity", .9);
        tooltip.html(helpers.templateTooltip(d))
               .style("left", (d3.event.pageX - 400) + "px")
               .style("top", (d3.event.pageY - 30) + "px");
        var width = (d.emotion*10).toString();
        d3.select(".tooltip-chart").style("width", width + "%");
      })
      .on("mouseout", function(d) {
        tooltip.transition().duration(500).style("opacity", 0);
      })
  },

  render: function() {
    return (
      <div className="tooltip">
      </div>
    );
  }
});

var helpers = {

  templateTooltip: function(point) {
    var readDate = d3.time.format("%B %d, %Y");

    var date = '<thead><tr><th>' + readDate(point.date) + '</th></tr></thead>';
    var hr = '<tr><td><hr/></td></tr>';
    var emotion = '<tr><td>' + helpers.renderTooltipChart(point.emotion) + '</td></tr>';
    var hydration = '<tr><td class="tooltip-label">Hydrated? :</td><td>' + point.hydrate + '</td></tr>';
    var note = '<tr><td class="tooltip-label">Note : </td><td>' + point.note + '</td></tr>';

    return '<table><tbody>' + date + hr + emotion + hydration + note + '</tbody></table>';
  },

  renderTooltipChart: function(point) {
    var data = '<span class="data-emotion">' + point + '</span>';
    var chart = '<div class="tooltip-chart">' + data + '</div>';
    return '<div class="tooltip-chart-container">' + chart + '</div>';
  }

};

module.exports = Tooltip;