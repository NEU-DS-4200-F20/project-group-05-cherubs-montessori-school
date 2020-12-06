// Initialize a stacked bar chart. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function expenseChart() {
    let margin = {
        top: 0,
        left: 0,
        right: 30,
        bottom: 50
      },
      width = 800 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom,
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

        let tooltip = d3.select("div.tooltip2")
    
        //make x axis
        let x = d3.scaleBand().domain(data.map(function(d) { return d.Year; })).range([0, width]).padding(1)

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
    
        //make y axis
        let y = d3.scaleLinear().range([height, 0])
        y.domain([0, getnewMax(data)])
    
        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y)
            .tickFormat(function(d){
                return d;}))

            
    
        let columnNames = [
        'Printing & Stationery',
        'Accounting Charges',
        'School Maintenance',
        'Property Tax',
        'Repairs & Maintenances']
        // 'Office Maintenance',
        // 'Water Charges',
        // 'Vehicle Maintenance',
        // 'Security Charges',
        // 'Festival & Celabration Exp',
        // 'Legal Fees',
        // 'Depreciation']

        let color = d3.scaleOrdinal()
        .domain(columnNames.concat([]))
              .range(['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231']);
            //    '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff']);

        // let z = color

        let z = color

        let keys = ['Printing & Stationery',
        'Accounting Charges',
        'School Maintenance',
        'Property Tax',
        'Repairs & Maintenances']

        var stackedData = d3.stack()
        .keys(keys)(newData)

        svg.selectAll("mylayers")
        .data(stackedData)
        .enter()
        .append("path")
        .attr("fill", function(d) {
            name = d.key;
            return z(name)})
        .attr("d", d3.area()
        .x(function(d,i) { 
            return x(d.data.year)})
        .y0(function(d) {return y(d[0])})
        .y1(function(d) {return y(d[1])})
        )
        .on("click", function (d, i) {
            let expenseType = i.key
            let years = [2015, 2016, 2017, 2018, 2019]
            let result = []
            for (let x = 0; x < years.length; x++) {
                result.push({
                    "year": years[x],
                    "type": expenseType,
                    "amount": i[x].data[expenseType]
                })
            }
            console.log(result)
            console.log(expenseType)

            d3.select(this).classed('selected')
            let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0];
            console.log(dispatchString, "ds")
            console.log(g, "this")
            dispatcher.call(dispatchString, this, result);
          })
          .on("mouseover", function (d, i) {
            console.log(i, "i")
            console.log(d, "d")
            tooltip.transition().delay(30).duration(200).style("opacity", 1)
            // console.log(d.screenx)
            // let xp = x.invert("expense")
            // let currentXPosition = d3.mouse(this);
            console.log(this, "pos")

            // console.log(d3.pointer(d, this), "current pos")

            let xp = d3.pointer(d, this)[0]
            let yp = d3.pointer(d, this)[1]
            console.log(xp, yp, "coordinates")
            if(xp < 240 && xp > 115) {
                tooltip.html("amount : " + i[0].data[i.key] + '<br/>' + "year : 2015" + '<br/>' + "type : " + i.key).style("left", d.pageX + "px").style("top", d.pageY + "px")
            }
            else if(xp > 240 && xp < 360) {
                tooltip.html("amount : " + i[1].data[i.key] + '<br/>' + "year : 2016" + '<br/>' + "type : " + i.key).style("left", d.pageX + "px").style("top", d.pageY + "px")
            }
            else if(xp > 360 && xp < 480) {
                tooltip.html("amount : " + i[2].data[i.key] + '<br/>' + "year : 2017" + '<br/>' + "type : " + i.key).style("left", d.pageX + "px").style("top", d.pageY + "px")
            }
            else if(xp > 480 && xp < 600) {
                tooltip.html("amount : " + i[3].data[i.key] + '<br/>' + "year : 2018" + '<br/>' + "type : " + i.key).style("left", d.pageX + "px").style("top", d.pageY + "px")
            }
        })
        .on("mouseout", function (d) {
            tooltip.transition().duration(100).style("opacity", 0)
            // return tooltip.style("visibility", "hidden");
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
          .text("Expenditure per year by Category")

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
                    'Printing & Stationery': getAmount(year, data, 'Printing & Stationery'),
                    'Accounting Charges': getAmount(year, data, 'Accounting Charges'),
                    'School Maintenance': getAmount(year, data, 'School Maintenance'),
                    'Property Tax': getAmount(year, data, 'Property Tax'),
                    'Repairs & Maintenances': getAmount(year, data, 'Repairs & Maintenances')
                    // 'Office Maintenance': getAmount(year, data, 'Office Maintenance'),
                    // 'Water Charges': getAmount(year, data, 'Water Charges'),
                    // 'Vehicle Maintenance': getAmount(year, data, 'Vehicle Maintenance'),
                    // 'Security Charges': getAmount(year, data, 'Security Charges'),
                    // 'Festival & Celabration Exp': getAmount(year, data, 'Festival & Celabration Exp'),
                    // 'Legal Fees': getAmount(year, data, 'Legal Fees'),
                    // 'Depreciation': getAmount(year, data, 'Depreciation'),
                    // 'Total Expenditure': getAmount(year, data, 'Total Expenditure')
                })
            }

            return inputData
        }

        function getnewMax(data) {
            let info = createTable(data)
            let sum = 0
            let result = 0
            for (let i = 0; i < info.length; i++) {
                sum = parseInt(info[i]['Printing & Stationery']) + parseInt(info[i]['Accounting Charges']) + parseInt(info[i]['School Maintenance']) + parseInt(info[i]['Property Tax']) + parseInt(info[i]['Repairs & Maintenances'])
                if(sum > result) {
                    result = sum
                }
                sum = 0
            }
            return result
        }

        function getAmount(year, data, name) {
            let tExpense = 0
            for (d in data) {
                if(data[d].Year == year && data[d].Name == name) {
                    tExpense = data[d].Amount
                }
            }
            return tExpense
        }

        function getMax(data) {
            let table = createTable(data)
            let maxExp = 0

            for(i = 0; i < table.length; i++) {
                if(table[i]["Total Expenditure"] > maxExp) {
                    maxExp = table[i]["Total Expenditure"]
                }
            }
            return maxExp
        }

        chart.selectionDispatcher = function (_) {
            console.log(dispatcher, "dispatcher")
            if (!arguments.length) return dispatcher;
            dispatcher = _;
            return chart;
        };

        chart.updateSelection = function (selectedData) {
            console.log(selectedData)
            if (!arguments.length) return;
        
            // Select an element if its datum was selected
            selectableElements.classed('selected', d =>
              selectedData.includes(d)
            );
          };

        return chart
}