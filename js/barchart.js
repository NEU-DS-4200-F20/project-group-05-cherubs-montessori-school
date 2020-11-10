function barchart() {
    let margin = {
        top: 60,
        left: 50,
        right: 30,
        bottom: 35
      },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
    // xValue = d => d[0],
    // yValue = d => d[1],
    xLabelText = '',
    yLabelText = '',
    yLabelOffsetPx = 0,
    xScale = d3.scaleBand(),
    yScale = d3.scaleLinear(),
    ourBrush = null,
    selectableElements = d3.select(null),
    // dispatcher;

    function bar(selector, data) {
        let svg = d3.select(selector)
        .append('svg')
        .attr('preserveAspectRatio', 'xMidYMid meet') // this will scale your visualization according to the size of the page.
        .attr('width', '100%') // this is now required by Chrome to ensure the SVG shows up at all
        .style('background-color', '#FFFFFF') // change the background color to white
        .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))

        let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //Prepare the xScale and yScale to configure the meachanism of scaling. The scales below will convert the data to coordinates.
        xScale.range([0, width]).padding(0.4)
        yScale.range([height, 0]);

        //add domains to both scales.
        xScale.domain(data.map(function(d) { return d.Starting_Year; }));
        yScale.domain([0, getMax(data)]);

        //appends the X axis to the first graph. 
        g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

        //appends the Y axis to the first graph.
        g.append("g")
        .call(d3.axisLeft(yScale).tickFormat(function(d){
            return d;}))

        
        let dict = typeDict(data);


        //Create the bars on the graph giving each bar a unique color.
        g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(d.Starting_Year); })
        .attr("y", function(d) { return yScale(dict[d.Starting_Year]);})
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(dict[d.Starting_Year]); })

        return bar

    }

    chart.selectionDispatcher = function (_) {
        if (!arguments.length) return dispatcher;
        dispatcher = _;
        return chart;
      };

    function typeDict(data) {
        let types = []
        for (d in data) {
          if (types.includes(data[d].Starting_Year)) {
  
          }
          else {
            types.push(data[d].Starting_Year)
          }
        }
  
        let dict = {}
        let i;
        for (i = 0; i < types.length; i++) {
          dict[types[i]] = countByYear(data, types[i])
        }
  
        return dict
      }
  
      //Helper function to count the number of pokemon given a type.
      function countByYear(data, year) {
        let result = 0;
        for (d in data) {
          if(data[d].Starting_Year == year) {
            result = result + 1
          }
        }
        return result
      }
  
      //Helper function to get the maximum value from the pokemon type dictionary.
      function getMax(data) {
        let dict = typeDict(data);
        let result = 0
        let b;
        for (b = 0; b < Object.keys(dict).length; b++){
          if(dict[Object.keys(dict)[b]] > result) {
            result = dict[Object.keys(dict)[b]]
          }
        }
        return result
      }
  
}