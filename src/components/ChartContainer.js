var React = require('react');
var d3 = require('d3');
var Chart = require('./charts/chart');
var Scatterplot = require('./charts/scatter');
var dataStore = require('../stores/dataStore');
var dataActions = require('../actions/dataActions');

var ChartContainer = React.createClass({

  getInitialState: function(){
    return {
      data: dataStore.getList()
    }
  },

  componentDidMount: function(){
    dataStore.addChangeListener(this._onChange);
    dataActions.fetchDataFromServer();
    this.renderTooltip();
  },

  componentWillUnmount: function(){
    dataStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    this.setState({
      data: dataStore.getList()
    });
  },

  renderTooltip: function(data) {
    var tooltip = d3.select("body")
                    .append("div")  
                    .attr("class", "tooltip")            
                    .style("opacity", 0);            
  },

  render: function() {

    // REWRITE IN SEMANTIC REACT --> defaults for x and y scales + width/height
    var margin = {top: 30, right: 20, bottom: 30, left: 50},
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        x = d3.time.scale.utc().range([0, width]),
        y = d3.scale.linear().range([height, 0]),
        xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(5),
        yAxis = d3.svg.axis().scale(y).orient("left").ticks(5);
                          
    return (
      <Chart className="chart" width={width} height={height}>
        < Scatterplot 
          className="scatterplot" 
          data={this.state.data}
          width={width}
          height={height} 
          scale={{x: x, y: y}}
          axis={{x: xAxis, y: yAxis}}/>
      </Chart>
    )
  }

});

module.exports = ChartContainer;