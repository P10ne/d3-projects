import {
  select,
  scaleBand, scaleLinear,
  axisBottom, axisLeft,
  max
} from 'd3';

const DATA = [
  {year: 2011, value: 45},
  {year: 2012, value: 45},
  {year: 2013, value: 52},
  {year: 2014, value: 70},
  {year: 2015, value: 75},
  {year: 2016, value: 78}
];

const svgWidth = 400;
const svgHeight = 300;
const padding = 25;
const viewWidth = svgWidth - 2 * padding;
const viewHeight = svgHeight - 2 * padding;

const svg = select('body')
  .append('div')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)

const xScale = scaleBand()
  .domain(DATA.map(dataItem => dataItem.year.toString()))
  .range([0, viewWidth])
  .padding(0.4)

const yScale = scaleLinear()
  .domain([0, max(DATA, d => d.value)!])
  .range([viewHeight, 0])

const xAxis = axisBottom(xScale)

const yAxis = axisLeft(yScale)

const viewGroup = svg
  .append('g')
  .attr('transform', `translate(${padding}, ${padding})`)

viewGroup
  .append('g')
  .attr('transform', `translate(0, ${viewHeight})`)
  .call(xAxis)

viewGroup
  .append('g')
  .call(yAxis)

viewGroup
  .selectAll('rect')
  .data(DATA)
  .join('rect')
  .attr('fill', 'blue')
  .attr('x', dataItem => xScale(dataItem.year.toString())!)
  .attr('y', dataItem => yScale(dataItem.value))
  .attr('width', xScale.bandwidth())
  .attr('height', dataItem => viewHeight - yScale(dataItem.value))
