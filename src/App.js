var React = require('react');
var render = require('react-dom').render;
var ChartContainer = require('./components/ChartContainer.js');
var DemoContainer = require('./components/DemoContainer.js');

var App = React.createClass({
  render: function(){
    return (
      <div className="container">
        <div className="row">
          <ChartContainer />
        </div>
      </div>
    )
  }
});

var Demo = React.createClass({
  render: function(){
    return (
      <div className="container">
        <div className="row">
          <DemoContainer />
        </div>
      </div>
    )
  }
});

window.onload = function() {

  var reactLineChart = document.getElementById("app");
  if (reactLineChart) {
    render(<App />, reactLineChart);
  }

  var demoLineChart = document.getElementById("demo");
  if (demoLineChart) {
    render(<Demo />, demoLineChart);
  }

}


module.exports = App;