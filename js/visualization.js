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

  d3.csv("data/cleaned grade break down/Combined grade breakdown.csv").then(data => {
    const dispatchString = 'selectionUpdated';

    // Create a stacked bar chart given 
    // a div id selector to put our svg in; and the data to use.
    let gradebreakdown = gradeBreakDown()
      .selectionDispatcher(d3.dispatch(dispatchString))
      ('#vis-svg-3', data);
  })

  d3.csv("data/Revised Income Expenditure/Combined Income Expenditure - Sheet1.csv").then(data => {
    const dispatchString = 'selectionUpdated';
    // const dispatchString_sp_to_lc = 'selectionUpdated.sp-to-lc'

    // Create a stacked bar chart given 
    // a div id selector to put our svg in; and the data to use.
    let expenseAreaChart = expenseChart()
      .selectionDispatcher(d3.dispatch(dispatchString))
      ('#vis-svg-4', data);

    let incomeAreaChart = incomeChart()
    .selectionDispatcher(d3.dispatch(dispatchString))
    ('#vis-svg-5', data);

    let profitAreaChart = areaChart()
    .selectionDispatcher(d3.dispatch(dispatchString))
    ('#vis-svg-2', data);

    expenseAreaChart.selectionDispatcher().on(dispatchString, profitAreaChart.updateSelection);
    incomeAreaChart.selectionDispatcher().on(dispatchString, profitAreaChart.updateSelection);

  })
  
})());