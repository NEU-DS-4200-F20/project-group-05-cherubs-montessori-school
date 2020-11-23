// Initialize a stacked bar chart. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function areaChart() {
    console.log("hey")
    let margin = {
        top: 60,
        left: 50,
        right: 30,
        bottom: 50
      },
      width = 800 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;
      dispatcher = null;

    // Create the area chart by adding an svg to the div with the id 
    // specified by the selector using the given data
      function chart(selector, data) {
        let newData = createTable(data)
        let svg = d3.select(selector)
        .append('svg')
        .attr('preserveAspectRatio', 'xMidYMid meet') 
        .attr('width', '100%') 
        .style('background-color', '#FFFFFF') 
        .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))
    
        let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
        
        //make x axis
        let x = d3.scaleBand().domain(data.map(function(d) { return d.Year; })).range([0, width]).padding(1)

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
    
        //make y axis
        let y = d3.scaleLinear().range([height, 0])
        y.domain([0, getMax(data)])
    
        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y)
            .tickFormat(function(d){
                return d;}))
    
    
        let color = d3.scaleOrdinal()
        .domain(["Income", "Expense"])
        .range(["#FCE205", "#03AC13"]);

        let z = color

        let area = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function(d) { return x(d.year); })
            .y0(y(0))
            .y1(function(d) { return y(d.amount); })

        let columns = ["Income", "Expense"].map(function(id) {
            return {
                id: id,
                values: newData.map(function(d) {
                    return {year: d.year, amount: d[id]}
                })
            }
        })

        z.domain(columns.map(function(a) { return a.id }))

        let column = g.selectAll(".area")
            .data(columns)
            .enter().append("g")
            .attr("class", function(d) { return `area ${d.id}`;})

        column.append("path")
            .attr("d", function(d) {return area(d.values)})
            .style("fill", function(d) { return z(d.id) })
    
        
        // Appending the Y axis label for the bar chart.
          svg.append("text")
          .attr("x", -((height / 2) + margin.top))
          .attr("y", (margin.top / 3) - 40) 
          .attr("transform", "rotate(-90)")
          .attr("text-anchor" ,"middle")
          .text("Amount in Indian Rupees")
    
        //Appending the X axis label for the bar chart.
        svg.append("text")
          .attr("x", width / 2 + margin.top)
          .attr("y", margin.bottom)
          .attr("text-anchor" ,"middle")
          .text("Income and Expense per year showing profit")

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

        function createTable(data) {
            let years = [2015, 2016, 2017, 2018, 2019]
            let inputData = []
            // let i = 0
            for (i = 0; i < years.length; i ++ ) {
                let year = years[i]
                inputData.push({
                    'year': year,
                    'Income' : totalIncome(year, data),
                    'Expense' : totalExpenditure(year, data)
                })
            }

            return inputData
        }

        function totalIncome(year, data) {
            let tIncome = 0
            for (d in data) {
                if(data[d].Year == year && data[d].Name == "Total Income") {
                    tIncome = data[d].Amount
                }
            }

            return tIncome - 0
        }

        function totalExpenditure(year, data) {
            let tExpenditure = 0
            let p = 0
            for (d in data) {
                if(data[d].Year == year && data[d].Name == "Total Expenditure") {
                    tExpenditure = data[d].Amount
                }
                if(data[d].Year == year && data[d].Name == "Net Profit") {
                    p = data[d].Amount
                }
            }

            return tExpenditure - p
        }

        function getMax(data) {
            let table = createTable(data)
            let maxInc = 0
            let maxExp = 0
            for(i = 0; i < table.length; i++) {
                if(table[i]["Income"] > maxInc) {
                    maxInc = table[i]["Income"]
                }
                if(table[i]["Expense"] > maxExp) {
                    maxExp = table[i]["Expense"]
                }
            }
            if(maxInc > maxExp) {
                return maxInc
            }
            else {
                return maxExp
            }
        }

        chart.selectionDispatcher = function (_) {
        if (!arguments.length) return dispatcher;
        dispatcher = _;
        return chart;
        };

        return chart
}