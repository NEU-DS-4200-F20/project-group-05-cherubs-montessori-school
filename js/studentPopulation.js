// Initialize a stacked bar chart. Modeled after Mike Bostock's
// Reusable Chart framework https://bost.ocks.org/mike/chart/
function barChart() {
  let margin = {
    top: 60,
    left: 50,
    right: 30,
    bottom: 50
  },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
  dispatcher = null;

  // Create the bar chart by adding an svg to the div with the id 
  // specified by the selector using the given data
  function chart(selector, data) {
    let newData = mainDict(data)
    let newerData = locationData(data)
    let yearData = yearsSpentData(data)
    let svg = d3.select(selector)
      .append('svg')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('width', '100%')
      .style('background-color', '#FFFFFF')
      .attr('viewBox', [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))

    let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Groups to divide the bar graphs into to make stacked bar graph.
    var keys = ["M0", "M1", "M2", "M3"]

    //make x axis
    let x = d3.scaleBand().domain(data.map(function (d) { return d.Starting_Year; })).range([0, width]).padding(0.4)

    g.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x))

    //make y axis
    let y = d3.scaleLinear().range([height, 0])
    y.domain([0, getMax(data)])

    g.append("g").call(d3.axisLeft(y).tickFormat(function (d) {
      return d;
    }))


    //define the colors to use
    let color = d3.scaleOrdinal().domain(keys).range(["steelblue", "darkorange", "lightblue", "darkblue"])

    //Making stacked data
    let stackedData = d3.stack().keys(keys)(newData)
    console.log(stackedData)

    //Create the stacked bars
    g.append("g")
      .selectAll("g")
      .data(stackedData)
      .enter().append("g")
      .attr("fill", function (d) {
        return color(d.key)
      })
      .selectAll("rect")
      .data(function (d) {
        console.log(d)
        return d
      })
      .enter().append("rect")
      .attr("x", function (d) {
        console.log(d)
        return x(d.data.year)
      })
      .attr("y", function (d) {
        return y(d[1])
      })
      .attr("height", function (d) {
        return y(d[0]) - y(d[1]);
      })
      .attr("width", x.bandwidth())
      .on("mouseover", function (d, i) {
        let numStudents = i[1]-i[0]
        var grade = ""
        if(i.data["M0"] == numStudents){
          grade = "M0" + ": " + i.data["M0"]
        }
        else if (i.data["M1"] == numStudents){
          grade = "M1"+ ": " + i.data["M1"]
        }
        else if (i.data["M2"] == numStudents){
          grade = "M2"+ ": " + i.data["M2"]
        }
        else if (i.data["M3"] == numStudents){
          grade = "M3"+ ": " + i.data["M3"]
        }
        tooltip.transition().delay(30).duration(200).style("opacity", 1)
        tooltip.html(i.data.year + '<br/>' + grade).style("left", d.pageX + "px").style("top", d.pageY + "px")
      })
      .on("mouseout", function (d) {
        tooltip.transition().duration(100).style("opacity", 0)
        // return tooltip.style("visibility", "hidden");
      });



    //Appending the Y axis label for the bar chart.
    svg.append("text")
      .attr("x", -((height / 2) + margin.top))
      .attr("y", margin.top / 3)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Number of Students")

    //Appending the X axis label for the bar chart.

    svg.append("text")
      .attr("x", width / 2 + margin.top)
      .attr("y", margin.bottom)
      .attr("text-anchor", "middle")
      .text("Student population breakdown by grade per year")

    svg.append("text")
      .attr("x", width / 2 + margin.top)
      .attr("y", height + 100)
      .attr("text-anchor", "middle")
      .text("Academic Year")


    let legendClassArray = [];

    let legend = svg.selectAll(".legend")
      .data(color.domain().slice().reverse())
      .enter().append("g")
      .attr("class", function (d) {
        legendClassArray.push(d.replace(/\s/g, ''));
        return "legend";
      })
      .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

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
      .text(function (d) { return d; });

    // Create Tooltip and set it to be hidden	
    let tooltip = d3.select("div.tooltip2")


    function updateLocationData() {

      // clear the svg to place the new graph
      svg.selectAll("*").remove();

      let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      //make x axis
      let x = d3.scaleBand().domain(data.map(function (d) { return d.Starting_Year; })).range([0, width]).padding(0.4)

      g.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x))

      //make y axis
      let y = d3.scaleLinear().range([height, 0])
      y.domain([0, getMax(data)])

      g.append("g").call(d3.axisLeft(y).tickFormat(function (d) {
        return d;
      }))

      let newkeys = ["HSR Layout", "Kudlu Gate", "Kaikondrahalli", "Bommanahalli", "Sarjapur Road", "Begur", "BTM 1st Stage", "Devarabisanahalli", "Kodichikkanahalli", "Hosa Road"
        , "ITI Layout", "other"];

      let newcolor = d3.scaleOrdinal().domain(newkeys).range(["steelblue", "darkorange", "lightblue", "darkblue", "red", "yellow", "black", "green", "orange", "pink", "grey", "purple"])


      let newStackedData = d3.stack().keys(newkeys)(newerData)

      g.append("g")
        .selectAll("g")
        .data(newStackedData)
        .enter().append("g")
        .attr("fill", function (d) {
          return newcolor(d.key)
        })
        .selectAll("rect")
        .data(function (d) {
          return d
        })
        .enter().append("rect")
        .attr("x", function (d) { return x(d.data.year) })
        .attr("y", function (d) {
          return y(d[1])
        })
        .attr("height", function (d) {
          return y(d[0]) - y(d[1]);
        })
        .attr("width", x.bandwidth())
        .on("mouseover", function (d, i) {
          console.log(i)
          let numStudents = i[1]-i[0]
          var grade = ""
          console.log(Object.keys(i.data))
          for(key in Object.keys(i.data)){
            if (i.data[Object.keys(i.data)[key]] == numStudents)
            grade = Object.keys(i.data)[key] + ": " + numStudents
          }
          tooltip.transition().delay(30).duration(200).style("opacity", 1)
          tooltip.html(i.data.year + '<br/>' + grade).style("left", d.pageX + "px").style("top", d.pageY + "px")
        })
        .on("mouseout", function (d) {
          tooltip.transition().duration(100).style("opacity", 0)
          // return tooltip.style("visibility", "hidden");
        });


      //Appending the Y axis label for the bar chart.
      svg.append("text")
        .attr("x", -((height / 2) + margin.top))
        .attr("y", margin.top / 3)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Number of Students")

      //Appending the X axis label for the bar chart.

      svg.append("text")
        .attr("x", width / 2 + margin.top)
        .attr("y", margin.bottom)
        .attr("text-anchor", "middle")
        .text("Student population breakdown by location")

      svg.append("text")
        .attr("x", width / 2 + margin.top)
        .attr("y", height + 100)
        .attr("text-anchor", "middle")
        .text("Academic Year")

      let legendClassArray = [];

      let legend = svg.selectAll(".legend")
        .data(newcolor.domain().slice().reverse())
        .enter().append("g")
        .attr("class", function (d) {
          legendClassArray.push(d.replace(/\s/g, ''));
          return "legend";
        })
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

      legendClassArray = legendClassArray.reverse();

      legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", newcolor)
        .attr("id", function (d, i) {
          return "id" + d.replace(/\s/g, '');
        })

      legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) { return d; });

    }

    function updateGradeData() {

      // clear the svg to place the new graph
      svg.selectAll("*").remove();

      let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      //make x axis
      let x = d3.scaleBand().domain(data.map(function (d) { return d.Starting_Year; })).range([0, width]).padding(0.4)

      g.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x))

      //make y axis
      let y = d3.scaleLinear().range([height, 0])
      y.domain([0, getMax(data)])

      g.append("g").call(d3.axisLeft(y).tickFormat(function (d) {
        return d;
      }))

      g.append("g")
        .selectAll("g")
        .data(stackedData)
        .enter().append("g")
        .attr("fill", function (d) {
          return color(d.key)
        })
        .selectAll("rect")
        .data(function (d) {
          return d
        })
        .enter().append("rect")
        .attr("x", function (d) { return x(d.data.year) })
        .attr("y", function (d) {
          return y(d[1])
        })
        .attr("height", function (d) {
          return y(d[0]) - y(d[1]);
        })
        .attr("width", x.bandwidth())
        .on("mouseover", function (d, i) {
          console.log(i)
          let numStudents = i[1]-i[0]
          var grade = ""
          if(i.data["M0"] == numStudents){
            grade = "M0" + ": " + i.data["M0"]
          }
          else if (i.data["M1"] == numStudents){
            grade = "M1"+ ": " + i.data["M1"]
          }
          else if (i.data["M2"] == numStudents){
            grade = "M2"+ ": " + i.data["M2"]
          }
          else if (i.data["M3"] == numStudents){
            grade = "M3"+ ": " + i.data["M3"]
          }
          tooltip.transition().delay(30).duration(200).style("opacity", 1)
          tooltip.html(i.data.year + '<br/>' + grade).style("left", d.pageX + "px").style("top", d.pageY + "px")
        })
        .on("mouseout", function (d) {
          tooltip.transition().duration(100).style("opacity", 0)
          // return tooltip.style("visibility", "hidden");
        });


      //Appending the Y axis label for the bar chart.
      svg.append("text")
        .attr("x", -((height / 2) + margin.top))
        .attr("y", margin.top / 3)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Number of Students")

      //Appending the X axis label for the bar chart.

      svg.append("text")
        .attr("x", width / 2 + margin.top)
        .attr("y", margin.bottom)
        .attr("text-anchor", "middle")
        .text("Student population breakdown by Grade")

      svg.append("text")
        .attr("x", width / 2 + margin.top)
        .attr("y", height + 100)
        .attr("text-anchor", "middle")
        .text("Academic Year")

      let legendClassArray = [];

      let legend = svg.selectAll(".legend")
        .data(color.domain().slice().reverse())
        .enter().append("g")
        .attr("class", function (d) {
          legendClassArray.push(d.replace(/\s/g, ''));
          return "legend";
        })
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

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
        .text(function (d) { return d; });

    }

    function updateYearsData() {

      // clear the svg to place the new graph
      svg.selectAll("*").remove();

      let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      //make x axis
      let x = d3.scaleBand().domain(data.map(function (d) { return d.Starting_Year; })).range([0, width]).padding(0.4)

      g.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x))

      //make y axis
      let y = d3.scaleLinear().range([height, 0])
      y.domain([0, getMax(data)])

      g.append("g").call(d3.axisLeft(y).tickFormat(function (d) {
        return d;
      }))

      let newkeys = ["1", "2", "3", "4", "5"];

      let newcolor = d3.scaleOrdinal().domain(newkeys).range(["#FFC300", "#FF5733", "#C70039", "#900C3F", "#581845"])


      let newStackedData = d3.stack().keys(newkeys)(yearData)
      console.log(newStackedData)

      g.append("g")
        .selectAll("g")
        .data(newStackedData)
        .enter().append("g")
        .attr("fill", function (d) {
          return newcolor(d.key)
        })
        .selectAll("rect")
        .data(function (d) {
          console.log(d)
          return d
        })
        .enter().append("rect")
        .attr("x", function (d) { return x(d.data.year) })
        .attr("y", function (d) {
          console.log(d)
          return y(d[1])
        })
        .attr("height", function (d) {
          console.log(d)
          return y(d[0]) - y(d[1]);
        })
        .attr("width", x.bandwidth())
        .on("mouseover", function (d, i) {
          let numStudents = i[1]-i[0]
          console.log(numStudents)
          var grade = ""
          console.log(i)
          console.log(Object.keys(i.data))
          for(key in Object.keys(i.data)){
            if (i.data[Object.keys(i.data)[key]] == numStudents)
            grade = "Years spent: " + Object.keys(i.data)[key] + "<br/> Number of Students: " + numStudents
          }
          tooltip.transition().delay(30).duration(200).style("opacity", 1)
          tooltip.html(i.data.year + '<br/>' + grade).style("left", d.pageX + "px").style("top", d.pageY + "px")
        })
        .on("mouseout", function (d) {
          tooltip.transition().duration(100).style("opacity", 0)
          // return tooltip.style("visibility", "hidden");
        });


      //Appending the Y axis label for the bar chart.
      svg.append("text")
        .attr("x", -((height / 2) + margin.top))
        .attr("y", margin.top / 3)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Number of Students")

      //Appending the X axis label for the bar chart.

      svg.append("text")
        .attr("x", width / 2 + margin.top)
        .attr("y", margin.bottom)
        .attr("text-anchor", "middle")
        .text("Student population breakdown by years spent")

      svg.append("text")
        .attr("x", width / 2 + margin.top)
        .attr("y", height + 100)
        .attr("text-anchor", "middle")
        .text("Academic Year")

      let legendClassArray = [];

      let legend = svg.selectAll(".legend")
        .data(newcolor.domain().slice().reverse())
        .enter().append("g")
        .attr("class", function (d) {
          legendClassArray.push(d.replace(/\s/g, ''));
          return "legend";
        })
        .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

      legendClassArray = legendClassArray.reverse();

      legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", newcolor)
        .attr("id", function (d, i) {
          return "id" + d.replace(/\s/g, '');
        })



      legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) { return d; });

    }

    d3.select("#studentLocation").on("click", function () {
      updateLocationData();
    });

    d3.select("#studentGrade").on("click", function () {
      updateGradeData();
    });

    d3.select("#studentYears").on("click", function () {
      updateYearsData();
    });


    return chart

  }


  function yearsSpentData(data) {
    let years = [2015, 2016, 2017, 2018, 2019]
    let dict = helperDictYearsSpent(data);
    let inputData = []
    for (let i = 0; i < 5; i++) {
      let year = years[i];
      inputData.push({
        'year': year,
        '1': dict[year]["1"],
        '2': dict[year]["2"],
        '3': dict[year]["3"],
        '4': dict[year]["4"],
        '5': dict[year]["5"],
      })
    }
    return inputData

  }

  function helperDictYearsSpent(data) {
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
      dict[types[i]] = helperyearspent(data, types[i])
    }

    console.log(dict)

    return dict
  }

  function helperyearspent(data, year) {
    let result = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
    let list1 = year_list(data, 2015)
    let list2 = year_list(data, 2016)
    let list3 = year_list(data, 2017)
    let list4 = year_list(data, 2018)
    let list5 = year_list(data, 2019)
    for (d in data) {
      if (data[d].Starting_Year == year && year == 2015) {
        if (list1.includes(data[d].Si_No)) {
          result["1"] = result["1"] + 1
        }
      }
      else if (data[d].Starting_Year == year && year == 2016) {
        if (list1.includes(data[d].Si_No) && list2.includes(data[d].Si_No)) {
          result["2"] = result["2"] + 1
        }
        else if (list2.includes(data[d].Si_No)) {
          result["1"] = result["1"] + 1
        }
      }
      else if (data[d].Starting_Year == year && year == 2017) {
        if (list1.includes(data[d].Si_No) && list2.includes(data[d].Si_No) && list3.includes(data[d].Si_No)) {
          result["3"] = result["3"] + 1
        }
        else if (list2.includes(data[d].Si_No) && list3.includes(data[d].Si_No)) {
          result["2"] = result["2"] + 1
        }
        else if (list3.includes(data[d].Si_No)) {
          result["1"] = result["1"] + 1
        }
      }
      else if (data[d].Starting_Year == year && year == 2018) {
        if (list1.includes(data[d].Si_No) && list2.includes(data[d].Si_No) && list3.includes(data[d].Si_No) && list4.includes(data[d].Si_No)) {
          result["4"] = result["4"] + 1
        }
        else if (list2.includes(data[d].Si_No) && list3.includes(data[d].Si_No) && list4.includes(data[d].Si_No)) {
          result["3"] = result["3"] + 1
        }
        else if (list3.includes(data[d].Si_No) && list4.includes(data[d].Si_No)) {
          result["2"] = result["2"] + 1
        }
        else if (list4.includes(data[d].Si_No)) {
          result["1"] = result["1"] + 1
        }
      }
      else if (data[d].Starting_Year == year && year == 2019) {
        if (list1.includes(data[d].Si_No) && list2.includes(data[d].Si_No) && list3.includes(data[d].Si_No) && list4.includes(data[d].Si_No) && list5.includes(data[d].Si_No)) {
          result["5"] = result["5"] + 1
        }
        else if (list2.includes(data[d].Si_No) && list3.includes(data[d].Si_No) && list4.includes(data[d].Si_No) && list5.includes(data[d].Si_No)) {
          result["4"] = result["4"] + 1
        }
        else if (list3.includes(data[d].Si_No) && list4.includes(data[d].Si_No) && list5.includes(data[d].Si_No)) {
          result["3"] = result["3"] + 1
        }
        else if (list4.includes(data[d].Si_No) && list5.includes(data[d].Si_No)) {
          result["2"] = result["2"] + 1
        }
        else if (list5.includes(data[d].Si_No)) {
          result["1"] = result["1"] + 1
        }
      }
    }

    return result
  }

  function year_list(data, year) {
    let result = []
    for (d in data) {
      if (data[d].Starting_Year == year) {
        result.push(data[d].Si_No)
      }
    }
    return result
  }



  function locationData(data) {
    let years = [2015, 2016, 2017, 2018, 2019]
    let dict = helperDictlocation(data)
    let inputData = []
    for (let i = 0; i < 5; i++) {
      let year = years[i];
      inputData.push({
        'year': year,
        'HSR Layout': dict[year]["HSR Layout"],
        'Kudlu Gate': dict[year]["Kudlu Gate"],
        'Kaikondrahalli': dict[year]["Kaikondrahalli"],
        'Bommanahalli': dict[year]["Bommanahalli"],
        'Sarjapur Road': dict[year]["Sarjapur Road"],
        'Begur': dict[year]["Begur"],
        'BTM 1st Stage': dict[year]["BTM 1st Stage"],
        'Devarabisanahalli': dict[year]["Devarabisanahalli"],
        'Kodichikkanahalli': dict[year]["Kodichikkanahalli"],
        'Hosa Road': dict[year]["Hosa Road"],
        'ITI Layout': dict[year]["ITI Layout"],
        'other': dict[year]["other"]
      })
    }
    return inputData
  }

  function helperDictlocation(data) {
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
      dict[types[i]] = helperlocationData(data, types[i])
    }

    return dict
  }

  function helperlocationData(data, year) {
    let result = {
      "HSR Layout": 0, "Kudlu Gate": 0, "Kaikondrahalli": 0, "Bommanahalli": 0, "Sarjapur Road": 0, "Begur": 0, "BTM 1st Stage": 0, "Devarabisanahalli": 0, "Kodichikkanahalli": 0, "Hosa Road": 0
      , "ITI Layout": 0, "other": 0
    };
    for (d in data) {
      if (data[d].Starting_Year == year) {
        if (data[d].Location == "HSR Layout") {
          result["HSR Layout"] = result["HSR Layout"] + 1
        }
        else if (data[d].Location == "Kudlu Gate") {
          result["Kudlu Gate"] = result["Kudlu Gate"] + 1
        }
        else if (data[d].Location == "Kaikondrahalli") {
          result["Kaikondrahalli"] = result["Kaikondrahalli"] + 1
        }
        else if (data[d].Location == "Bommanahalli") {
          result["Bommanahalli"] = result["Bommanahalli"] + 1
        }
        else if (data[d].Location == "Sarjapur Road") {
          result["Sarjapur Road"] = result["Sarjapur Road"] + 1
        }
        else if (data[d].Location == "Begur") {
          result["Begur"] = result["Begur"] + 1
        }
        else if (data[d].Location == "BTM 1st Stage") {
          result["BTM 1st Stage"] = result["BTM 1st Stage"] + 1
        }
        else if (data[d].Location == "Devarabisanahalli") {
          result["Devarabisanahalli"] = result["Devarabisanahalli"] + 1
        }
        else if (data[d].Location == "Kodichikkanahalli") {
          result["Kodichikkanahalli"] = result["Kodichikkanahalli"] + 1
        }
        else if (data[d].Location == "ITI Layout") {
          result["ITI Layout"] = result["ITI Layout"] + 1
        }
        else if (data[d].Location == "Hosa Road") {
          result["Hosa Road"] = result["Hosa Road"] + 1
        }
        else {
          result["other"] = result["other"] + 1
        }
      }
    }
    return result
  }


  function countLocation(data, location) {
    var locationDict = {}
    for (d in data) {
      if (locationDict[location] === undefined) {
        locationDict[location] = 0;
      } else {
        locationDict[location] = locationDict[location] + 1;
      }
    }
    return locationDict
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
      if (data[d].Starting_Year == year) {
        result = result + 1
      }
    }
    return result
  }

  //Helper function to get the maximum number of students in a year from the 5 years.
  function getMax(data) {
    let dict = yearDict(data);
    let result = 0
    let b;
    for (b = 0; b < Object.keys(dict).length; b++) {
      if (dict[Object.keys(dict)[b]] > result) {
        result = dict[Object.keys(dict)[b]]
      }
    }
    return result
  }

  //Helper function for the mainDict function.
  function helperDict(data) {
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
      dict[types[i]] = countByYearAndGrade(data, types[i])
    }

    return dict
  }

  function countByYearAndGrade(data, year) {
    let result = { "M0": 0, "M1": 0, "M2": 0, "M3": 0 };
    for (d in data) {
      if (data[d].Starting_Year == year) {
        if (data[d].Grade == "M0") {
          result["M0"] = result["M0"] + 1
        }
        else if (data[d].Grade == "M1") {
          result["M1"] = result["M1"] + 1
        }
        else if (data[d].Grade == "M2") {
          result["M2"] = result["M2"] + 1
        }
        else if (data[d].Grade == "M3") {
          result["M3"] = result["M3"] + 1
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
    for (var i = 0; i < 5; i++) {
      let year = years[i];
      inputData.push({
        'year': year,
        'M0': dict[year]["M0"],
        'M1': dict[year]["M1"],
        'M2': dict[year]["M2"],
        'M3': dict[year]["M3"],
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