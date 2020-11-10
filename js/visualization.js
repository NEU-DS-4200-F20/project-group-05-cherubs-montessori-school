// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
((() => {

  d3.csv("data/Revised Student Data/Student Data Cleaned Combined - env_list_combined (1).csv").then(data => {
    const dispatchString = 'selectionUpdated';

    // Create a stacked bar chart given 
    // a div id selector to put our svg in; and the data to use.
    let studentBarChart = barChart()
      .selectionDispatcher(d3.dispatch(dispatchString))
      ('#vis-svg-1', data);
  })
})());