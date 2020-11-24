// Initialize a stacked bar chart. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function incomeChart() {
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
        console.log(newData)
        let newmax = getnewMax(data)
        console.log(newmax)
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
        y.domain([0, newmax])
    
        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y)
            .tickFormat(function(d){
                return d;}))

            
        let columnNames = ['Application Fees',
        'Day Care Fees',
        'Interest',
        'Summer camp fees',
        'Sale of Alto Car']

        let color = d3.scaleOrdinal()
        .domain(columnNames)
              .range(['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231']);

        let z = color

        let keys = ['Application Fees',
        'Day Care Fees',
        'Interest',
        'Summer camp fees',
        'Sale of Alto Car']

        var stackedData = d3.stack()
        .keys(keys)(newData)

        svg.selectAll("mylayers")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("fill", function(d) {
            console.log(d)
            name = d.key;
            console.log(name)
            return z(name)})
        .attr("d", d3.area()
        .x(function(d,i) { 
            console.log(d)
            return x(d.data.year)})
        .y0(function(d) {return y(d[0])})
        .y1(function(d) {return y(d[1])})
        )
        .attr("height", function (d) {
            console.log(d)
            return y(d[0]) - y(d[1]);
          })
    
        
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
          .text("Income per year by Category")

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
                    'Application Fees': getAmount(year, data, 'Application Fees'),
                    'Day Care Fees': getAmount(year, data, 'Day Care Fees'),
                    'Interest': getAmount(year, data, 'Interest'),
                    'Summer camp fees': getAmount(year, data, 'Summer camp fees'),
                    'Sale of Alto Car': getAmount(year, data, 'Sale of Alto Car'),
                    'Total Income': getAmount(year, data, 'Total Income')
                })
            }
            return inputData
        }

        function getnewMax(data) {
            let info = createTable(data)
            let sum = 0
            let result = 0
            for (let i = 0; i < info.length; i++) {
                sum = parseInt(info[i]['Application Fees']) + parseInt(info[i]['Day Care Fees']) + parseInt(info[i]['Interest']) + parseInt(info[i]['Summer camp fees']) + parseInt(info[i]['Sale of Alto Car'])
                // console.log(sum)
                if(sum > result) {
                    result = sum
                }
                sum = 0
            }
            return result
        }

        function getAmount(year, data, name) {
            let tIncome = 0
            for (d in data) {
                if(data[d].Year == year && data[d].Name == name) {
                    tIncome = data[d].Amount
                }
            }
            return tIncome
        }

        function getMax(data) {
            let table = createTable(data)
            let maxInc = 0

            for(i = 0; i < table.length; i++) {
                if(table[i]["Total Income"] > maxInc) {
                    maxInc = table[i]["Total Income"]
                }
            }
            return maxInc
        }

        chart.selectionDispatcher = function (_) {
        if (!arguments.length) return dispatcher;
        dispatcher = _;
        return chart;
        };

        return chart
}