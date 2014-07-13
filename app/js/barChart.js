function createBarChart(data){
  var margin = {top: 30, right: 10, bottom: 10, left: 150},
    width = 400 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .range([0, width])

  var y = d3.scale.ordinal()
      .rangeRoundBands([0, height], .2);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("top");
      
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")

  var svg = d3.select("#chartArea").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  x.domain([0, d3.max(data, function(d) { return d.frequency; })]);
  y.domain(data.map(function(d) { return d.animal; }));

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("x", function(d) { return x(Math.min(0, d.frequency)); })
      .attr("y", function(d) { return y(d.animal); })
      .attr("fill",function(d){ return d.color;})
      .attr("width", function(d) { return Math.abs(x(d.frequency) - x(0)); })
      .attr("height", y.rangeBand());

  svg.append("g")
      .attr("class", "axis")
      .call(xAxis);

  svg.append("g")
      .attr("class", "axis")
      .call(yAxis);
  
}