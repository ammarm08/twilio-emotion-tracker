var React = require('react');
var d3 = require('d3');

var Chart = require('./charts/chart');
var LineChart = require('./charts/linechart');
var Tooltip = require('./charts/tooltip');

var dataStore = require('../stores/dataStore');
var dataActions = require('../actions/dataActions');

var ChartContainer = React.createClass({

  getInitialState: function(){
    return {
      data: dataStore.getList()
    }
  },

  // upon render:
  // --- set up an event listening relationship w/ dataStore
  // --- tell dataStore to fetch user data from the server
  componentDidMount: function(){
    dataStore.addChangeListener(this._onChange);
    dataActions.fetchDataFromServer();
  },

  // removes event listeners after component isn't being rendered
  componentWillUnmount: function(){
    dataStore.removeChangeListener(this._onChange);
  },

  // whenever there's a change event emitted by Flux, this component
  // grabs the latest data from dataStore and adds it to its state
  _onChange: function(){
    this.setState({
      data: dataStore.getList()
    });
  },

  render: function() {

    // D3 -- axis + dimensions configuration
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom,
        x = d3.time.scale.utc().range([0, width]),
        y = d3.scale.linear().range([height,0]),
        xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(10),
        yAxis = d3.svg.axis().scale(y).orient("left").ticks(10);
    
    // render an SVG-based line chart + tooltip div              
    return (
      <Chart className="chart" width={width + margin.left + margin.right} height={height + margin.top + margin.bottom}>
        < LineChart 
            className="line-chart" 
            data={this.state.data}
            width={width}
            height={height} 
            margin={margin}
            scale={{x: x, y: y}}
            axis={{x: xAxis, y: yAxis}} />
        <Tooltip 
            data={this.state.data}
            opacity={0} />
      </Chart>
    )
  }

});

module.exports = ChartContainer;