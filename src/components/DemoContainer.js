var React = require('react');
var d3 = require('d3');

var Chart = require('./charts/chart');
var LineChart = require('./charts/linechart');
var Tooltip = require('./charts/tooltip');

var dataStore = require('../stores/dataStore');
var dataActions = require('../actions/dataActions');

// this component does the same exact thing as ChartContainer,
// the only difference being that it invokes fetchDemoData (logged-out experience)
// rather than fetchDataFromServer (which relies on having a logged-in user)
var DemoContainer = React.createClass({

  getInitialState: function(){
    return {
      data: dataStore.getList()
    }
  },

  componentDidMount: function(){
    dataStore.addChangeListener(this._onChange);
    dataActions.fetchDemoData();
  },

  componentWillUnmount: function(){
    dataStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    this.setState({
      data: dataStore.getList()
    });
  },

  render: function() {

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom,
        x = d3.time.scale.utc().range([0, width]),
        y = d3.scale.linear().range([height,0]),
        xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(10),
        yAxis = d3.svg.axis().scale(y).orient("left").ticks(10);
                          
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

module.exports = DemoContainer;