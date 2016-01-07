var React = require('react');
var render = require('react-dom').render;
var ListContainer = require('./components/ListContainer.js');

var App = React.createClass({
  render: function(){
    return (
      <div className="container">
        <div className="row">
          <ListContainer />
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

// (function() {

//     window.App = {};

//     App.buildChart = function(data) {

//         // Set the dimensions of the canvas / graph
//         var margin = {top: 30, right: 20, bottom: 30, left: 50},
//             width = 800 - margin.left - margin.right,
//             height = 500 - margin.top - margin.bottom;

//         // Parse the date / time
//         var iso = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");
//         var readDate = d3.time.format("%Y-%m-%d");
//         var parseDate = iso.parse;

//         // Set the ranges
//         var x = d3.time.scale.utc().range([0, width]);
//         var y = d3.scale.linear().range([height, 0]);

//         // Define the axes
//         var xAxis = d3.svg.axis().scale(x)
//             .orient("bottom").ticks(5);

//         var yAxis = d3.svg.axis().scale(y)
//             .orient("left").ticks(5);

//         // Define the div for the tooltip
//         var div = d3.select("body")
//             .append("div")   
//                 .attr("class", "tooltip")            
//                 .style("opacity", 0);
            
//         // Adds the svg canvas
//         var svg = d3.select("#app")
//             .append("svg")
//                 .attr("width", width + margin.left + margin.right)
//                 .attr("height", height + margin.top + margin.bottom)
//             .append("g")
//                 .attr("transform", 
//                       "translate(" + margin.left + "," + margin.top + ")");

//         // Get the data
//         data.forEach(function(d) {
//             d.date = parseDate(d.date);
//             d.emotion = +d.emotion;
//         });

//         // Scale the range of the data
//         x.domain(d3.extent(data, function(d) { return d.date; }));
//         y.domain([0, d3.max(data, function(d) { return d.emotion; })]);

//         // Add the scatterplot
//         svg.selectAll("dot")
//             .data(data)
//           .enter().append("circle")
//             .attr("r", 10)
//             .attr("cx", function(d) { return x(d.date); })
//             .attr("cy", function(d) { return y(d.emotion); })
//             .on("mouseover", function(d) { 
//                 div.transition()        
//                     .duration(200)      
//                     .style("opacity", .9);      
//                 div .html('<span class="label">Date: </span>' + readDate(d.date) + '<br/>' +
//                           '<span class="label">Emotion: </span>' + d.emotion + '<br/>' +
//                           '<span class="label">Hydrated?: </span>' + d.hydrate + '<br/>' + 
//                           '<span class="label">Note: </span>' + d.note + '<br/>')  
//                     .style("left", (d3.event.pageX + 20) + "px")     
//                     .style("top", (d3.event.pageY - 28) + "px")    
//                 })                  
//             .on("mouseout", function(d) {
//                 div.transition()        
//                     .duration(500)      
//                     .style("opacity", 0);   
//                 });

//         // Add the X Axis
//         svg.append("g")
//             .attr("class", "x axis")
//             .attr("transform", "translate(0," + height + ")")
//             .call(xAxis);

//         // Add the Y Axis
//         svg.append("g")
//             .attr("class", "y axis")
//             .call(yAxis);
//     };

//     App.getData = function() {
//         $.ajax({
//             url: '/api/users',
//             success: function(data) {
//                 console.log(data[0].date);
//                 App.buildChart(data);
//                 console.log('success!');
//             },
//             error: function(data) {
//                 console.error(data);
//             }
//         })
//     }

// })();