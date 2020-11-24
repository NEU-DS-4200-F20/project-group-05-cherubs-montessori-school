// Initialize a stacked bar chart. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function expenseChart() {
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

            
    
        let columnNames = ['Salaries',
        'ElectricityCharges',
        'Advertisement',
        'BankCharges',
        'Bonus',
        'Business Promotion Exp',
        'Telephone exp',
        'Travelling Exp',
        'Printing & Stationery',
        'Accounting Charges',
        'School Maintenance',
        'Property Tax',
        'Repairs & Maintenances',
        'Office Maintenance',
        'Water Charges',
        'Vehicle Maintenance',
        'Security Charges',
        'Festival & Celabration Exp',
        'Legal Fees',
        'Depreciation']

        let color = d3.scaleOrdinal()
        .domain(columnNames.concat([]))
              .range(['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
               '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff',
                '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075',
                 '#808080', '#ffffff', '#000000']);

        let z = color

        let area = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function(d) { return x(d.year); })
            .y0(y(0))
            .y1(function(d) { return y(d.amount); })

        let columns = columnNames.concat([]).map(function(id) {
            return {
                id: id,
                values: newData.map(function(d) {
                    return {year: d.year, amount: d[id]}
                })
            }
        })
        console.log(columns)
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
                    'Salaries': getAmount(year, data, 'Salaries'),
                    'ElectricityCharges': getAmount(year, data, 'ElectricityCharges'),
                    'Advertisement': getAmount(year, data, 'Advertisement'),
                    'BankCharges': getAmount(year, data, 'BankCharges'),
                    'Bonus': getAmount(year, data, 'Bonus'),
                    'Business Promotion Exp': getAmount(year, data, 'Business Promotion Exp'),
                    'Telephone exp': getAmount(year, data, 'Telephone exp'),
                    'Travelling Exp': getAmount(year, data, 'Travelling Exp'),
                    'Printing & Stationery': getAmount(year, data, 'Printing & Stationery'),
                    'Accounting Charges': getAmount(year, data, 'Accounting Charges'),
                    'School Maintenance': getAmount(year, data, 'School Maintenance'),
                    'Property Tax': getAmount(year, data, 'Property Tax'),
                    'Repairs & Maintenances': getAmount(year, data, 'Repairs & Maintenances'),
                    'Office Maintenance': getAmount(year, data, 'Office Maintenance'),
                    'Water Charges': getAmount(year, data, 'Water Charges'),
                    'Vehicle Maintenance': getAmount(year, data, 'Vehicle Maintenance'),
                    'Security Charges': getAmount(year, data, 'Security Charges'),
                    'Festival & Celabration Exp': getAmount(year, data, 'Festival & Celabration Exp'),
                    'Legal Fees': getAmount(year, data, 'Legal Fees'),
                    'Depreciation': getAmount(year, data, 'Depreciation'),
                    'Total Expenditure': getAmount(year, data, 'Total Expenditure')
                })
            }

            return inputData
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
        if (!arguments.length) return dispatcher;
        dispatcher = _;
        return chart;
        };

        return chart
}