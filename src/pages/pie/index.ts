import {
  select,
  pie, arc,
  DefaultArcObject
} from 'd3';

type TArcObject = Pick<DefaultArcObject, "startAngle" | "endAngle">;

const SVG_SIZE = 300;
const PADDING = 20;
const INNER_RADIUS = 15;
const OUTER_RADIUS = SVG_SIZE / 2 - PADDING;
const DATA = [1, 12, 21, 17, 8, 39];
const pieGenerator = pie();
const arcData = pieGenerator(DATA);
const arcGenerator = arc<TArcObject>()
  .innerRadius(INNER_RADIUS)
  .outerRadius(OUTER_RADIUS)
  .padAngle(.02)
  .padRadius(100)
  .cornerRadius(4)

const customArc: (data: TArcObject) => string | null = data => {
  return arcGenerator(data)
}

const svg = select('body')
  .append('svg')
  .attr('width', SVG_SIZE)
  .attr('height', SVG_SIZE)

const centeredGroup = svg
  .append('g')
  .attr('transform', `translate(${SVG_SIZE / 2}, ${SVG_SIZE / 2})`)

const pathGroup = centeredGroup
  .selectAll('g')
  .data(arcData)
  .join('g')

pathGroup
  .selectAll('path')
  .data(d => [d])
  .join('path')
  .attr('d', dataItem => customArc(dataItem))

pathGroup
  .on('mouseenter', function() {
    const currentGroup = (this as SVGGElement);
    currentGroup.classList.add('hovered');

  })

pathGroup
  .on('mouseleave', function() {
    (this as SVGGElement).classList.remove('hovered');
  })
