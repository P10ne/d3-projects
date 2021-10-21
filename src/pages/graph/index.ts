import {
  select,
  tree, hierarchy
} from 'd3';

// const data = [
//   { name: 'a', size: 1, sum: 12 },
//   { name: 'b', size: 4, sum: 10 },
//   { name: 'c', size: 3, sum: 13 },
//   { name: 'd', size: 9, sum: 32 },
//   { name: 'e', size: 2, sum: 31 },
// ];

const data =
  {
    "name": "Eve",
    "children": [
      {
        "name": "Cain"
      },
      {
        "name": "Seth",
        "children": [
          {
            "name": "Enos"
          },
          {
            "name": "Noam"
          }
        ]
      },
      {
        "name": "Abel"
      },
      {
        "name": "Awan",
        "children": [
          {
            "name": "Enoch"
          }
        ]
      },
      {
        "name": "Azura"
      }
    ]
  }


// const d1 = rollup(data, d => d.length, d => d.name, d => d.size);
// console.log(d1);
const preparedData = hierarchy(data);
console.log(preparedData);
const treeLayout = tree().size([380, 290]);
const root = treeLayout(preparedData);

const svg =
  select('body')
  .append('svg')
  .attr('width', 400)
  .attr('height', 300)

const group = svg
  .append('g')
  .attr('width', 380)
  .attr('height', 290)
  .attr('transform', `translate(10, 5)`)

group
  .selectAll('circle')
  .data(root.descendants())
  .join('circle')
  .attr('cx', d => d.x)
  .attr('cy', d => d.y)
  .attr('r', 4)


group
  .selectAll('line')
  .data(root.links())
  .join('line')
  .attr('x1', d => d.source.x)
  .attr('y1', d => d.source.y)
  .attr('x2', d => d.target.x)
  .attr('y2', d => d.target.y)
  .attr('stroke', 'black')

group
  .selectAll('text')
  .data(root.descendants())
  .join('text')
  .attr('x', d => d.x + 10)
  .attr('y', d => d.y + 5)
  // @ts-ignore
  .html(d => d.data.name)