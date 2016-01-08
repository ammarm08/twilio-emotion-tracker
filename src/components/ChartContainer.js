var React = require('react');
var d3 = require('d3');
var Chart = require('./charts/chart');
var Scatterplot = require('./charts/scatter');
var dataStore = require('../stores/dataStore');
var dataActions = require('../actions/dataActions');

var ChartContainer = React.createClass({
  // on initial load
  getInitialState: function(){
    return {
      data: dataStore.getList()
    }
  },

  //once component ready
  componentDidMount: function(){
    dataStore.addChangeListener(this._onChange);
    dataActions.fetchDataFromServer();
  },

  //once component out
  componentWillUnmount: function(){
    dataStore.removeChangeListener(this._onChange);
  },

  //what component does after dispatcher emits change event
  _onChange: function(){
    this.setState({
      data: dataStore.getList()
    });
  },

  render: function() {

    // REWRITE IN SEMANTIC REACT --> defaults for x and y scales + width/height
    var width = 800,
        height = 500,
        x = d3.time.scale.utc().range([0, width]),
        y = d3.scale.linear().range([height, 0]);

    return (
      <Chart className="chart" width={width} height={height}>
        < Scatterplot 
          className="scatterplot" 
          data={this.state.data}
          width={width}
          height={height} 
          scale={{x: x, y: y}}/>
      </Chart>
    )
  }

});

module.exports = ChartContainer;