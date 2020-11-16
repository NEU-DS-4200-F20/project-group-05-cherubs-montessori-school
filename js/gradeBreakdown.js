// Initialize a stacked bar chart. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function gradeBreakDown() {
    let margin = {
        top: 60,
        left: 50,
        right: 30,
        bottom: 35
      },
      width = 800 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;
      dispatcher = null;

    // Create the bar chart by adding an svg to the div with the id 
    // specified by the selector using the given data
      function chart(selector, data) {
        let newData = mainDict(data)
        let svg = d3.select(selector)
        .append('svg')
        .attr('preserveAspectRatio', 'xMidYMid meet') 
        .attr('width', '100%') 
        .style('background-color', '#FFFFFF') 
        .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))
    
        let g = svg.append("g").attr("transform", "translate(" + (margin.left +20) + "," + margin.top + ")");
    
        //Groups to divide the bar graphs into to make stacked bar graph.
        var keys = ["M0", "M1", "M2", "M3"]
    
        let x = d3.scaleBand().domain(data.map(function(d) { return d.Year; })).range([0, width]).padding(0.4)
    
        g.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x))
    
        let y = d3.scaleLinear().range([height, 0])
        y.domain([0, 15482701])
    
        g.append("g").call(d3.axisLeft(y).tickFormat(function(d){
          return d;}))
    
    
        let color = d3.scaleOrdinal().domain(keys).range(["green", "red", "lightblue", "orange"])
    
        //Making stacked data
        let stackedData = d3.stack().keys(keys)(newData)
    
        //Create the stacked bars
        g.append("g")
          .selectAll("g")
          .data(stackedData)
          .enter().append("g")
            .attr("fill", function(d) {
              return color(d.key)
            })
            .selectAll("rect")
            .data(function(d) {return d})
            .enter().append("rect")
              .attr("x", function(d) {return x(d.data.year)})
              .attr("y", function(d) {
                return y(d[1])
              })
              .attr("height", function(d) { 
                return y(d[0]) - y(d[1]); })
              .attr("width", x.bandwidth())
    
    
        //Appending the Y axis label for the bar chart.
          svg.append("text")
          .attr("x", -((height / 2) + margin.top))
          .attr("y", margin.top / 3)
          .attr("transform", "rotate(-90)")
          .attr("text-anchor" ,"middle")
          .text("Total Revenue")
    
        //Appending the X axis label for the bar chart.
        svg.append("text")
          .attr("x", width / 2 + margin.top)
          .attr("y", margin.bottom)
          .attr("text-anchor" ,"middle")
          .text("Grade Breakdown by Revenue")

        svg.append("text")
          .attr("x", width / 2 + margin.top)
          .attr("y", height + 100)
          .attr("text-anchor" ,"middle")
          .text("Academic Year")
    
    
          var legendClassArray = [];
    
          var legend = svg.selectAll(".legend")
          .data(color.domain().slice().reverse())
          .enter().append("g")
          .attr("class", function (d) {
            legendClassArray.push(d.replace(/\s/g, ''));
            return "legend";
          })
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
    
          legendClassArray = legendClassArray.reverse();
    
          legend.append("rect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color)
          .attr("id", function (d, i) {
            return "id" + d.replace(/\s/g, '');
          })
    
          legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d; });

          return chart
        
        }

        //function to create a dictionary of the academic year and number of students in that year.
        function yearDict(data) {
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
      
          //Helper function to count the number of students in a given year.
          function countByYear(data, year) {
            let result = 0;
            for (d in data) {
              if(data[d].Starting_Year == year) {
                result = result + 1
              }
            }
            return result
          }
      
        //   //Helper function to get the maximum number of students in a year from the 5 years.
        //   function getMax(data) {
        //     let dict = yearDict(data);
        //     let result = 0
        //     let b;
        //     for (b = 0; b < Object.keys(dict).length; b++){
        //       if(dict[Object.keys(dict)[b]] > result) {
        //         result = dict[Object.keys(dict)[b]]
        //       }
        //     }
        //     return result
        //   }
      
          //Helper function for the mainDict function.
          function helperDict(data) {
            let types = []
            for (d in data) {
              if (types.includes(data[d].Year)) {
      
              }
              else {
                types.push(data[d].Year)
              }
            }
      
            let dict = {}
            let i;
            for (i = 0; i < types.length; i++) {
              dict[types[i]] = amountByYearAndGrade(data, types[i])
            }
      
            return dict
          }
      
          function amountByYearAndGrade(data, year) {
            let result = {"M0":0, "M1":0, "M2":0, "M3":0};
            for (d in data) {
              if(data[d].Year == year) {
                if(data[d].Grade == "M0") {
                  result["M0"] = data[d].Total
                }
                else if(data[d].Grade == "M1") {
                    result["M1"] = data[d].Total
                }
                else if(data[d].Grade == "M2") {
                    result["M2"] = data[d].Total
                }
                else if(data[d].Grade == "M3") {
                    result["M3"] = data[d].Total
                }
              }
            }
            return result
          }
      
          //Create main object that graph uses. Contains the year and number of students in each grade for the 5 years.
          function mainDict(data) {
            let years = [2015, 2016, 2017, 2018, 2019]
            let dict = helperDict(data)
            let inputData = []
            for(var i = 0; i < 5; i++) {
              let year = years[i];
              inputData.push( {
                'year': year,
                'M0' : dict[year]["M0"],
                'M1' : dict[year]["M1"],
                'M2' : dict[year]["M2"],
                'M3' : dict[year]["M3"],
              })
            }
            return inputData
          }

          chart.selectionDispatcher = function (_) {
            if (!arguments.length) return dispatcher;
            dispatcher = _;
            return chart;
          };

        return chart
}