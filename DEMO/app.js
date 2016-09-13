var margin = { top: 10, right: 40, bottom: 60, left: 40 };
var width = 800 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;
var svg;
var colors = ['#525252', '#737373', '#969696', '#BDBDBD', '#D9D9D9']

var container = d3.select('#chart');
var url = 'https://raw.githubusercontent.com/CenterForAssessment/Cutscores/master/DEMO/DEMO.json';
d3.json(url, onDataLoaded);

function onDataLoaded (err, data) {
  if (err) throw err;

  initChart();
  var subjectData = data.data.filter(subject => {
    return subject.subject === container.attr('data-subject');
  });
  var data = subjectData.filter(dataset => {
    return dataset.minYear >= container.attr('data-min-year');
  })[0];
  renderChart(data);
}

function initChart () {
  svg = container
    .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr('preserveAspectRatio', 'xMaxYMax')
    .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

  d3.json(url)
}

function renderChart (data) {
  var cut_scores = data.cuts;
  var numLevels = data.labels.length;
  var yScale = d3.scaleLinear()
    .domain([d3.min(cut_scores, n => n.loss), d3.max(cut_scores, n => n.hoss)])
    .range([height, 0]);

  svg.call(d3.axisLeft(yScale));
  svg
    .append('g')
      .attr('transform', `translate(${width}, 0)`)
    .call(d3.axisRight(yScale));

  var xScale = d3.scalePoint()
    .domain(cut_scores.map(d => d.label))
    .range([0, width]);

  svg
    .append('g')
      .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).ticks(5));

  var keys = ['hoss'];
  for (var i = numLevels - 1; i > 0; i--) {
    keys.unshift('cut' + i);
  }
  var z = d3.scaleOrdinal(colors).domain(keys);

  var stack = d3.stack()
    .keys(keys)
    .offset((series, order) => {
      for (var i = series.length - 1; i > -1; i--) {
        for (var j = 0; j < series[i].length; j++) {

          if (i === 0) {
            series[i][j][0] = yScale.domain()[0];
          } else {
            series[i][j][0] = series[i - 1][j][1];
          }
          // top band fills chart area
          if (i === series.length - 1) series[i][j][1] = yScale.domain()[1];
        }
      }
    });

  var area = d3.area()
    .x(d => xScale(d.data.label))
    .y0(d => yScale(d[0]))
    .y1(d => yScale(d[1]))
    .curve(d3.curveCatmullRom.alpha(0.5));

  var bands = svg
    .selectAll('.layer')
    .data(stack(cut_scores));

  // basic update, no transitions
  bands.exit().remove();
  bands
    .enter()
      .append('path')
      .attr('class', 'layer')
      .style('fill', (d) => {
        return z(d.key);
      })
      .style('fill-opacity', 0.5)
      .attr('d', area);
  bands
    .attr('d', area);
}
