var React = require('react');
var render = require('react-dom').render;
var ChartContainer = require('./components/ChartContainer.js');

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

window.onload = function() {

  var reactLineChart = document.getElementById("app");
  if (reactLineChart) {
    render(<App />, reactLineChart);
  }

}


module.exports = App;