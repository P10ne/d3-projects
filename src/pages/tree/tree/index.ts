import {
  select,
  forceSimulation, forceManyBody, forceLink, forceY, forceX,
  Selection, BaseType
} from 'd3';
import { INode } from "./models/INode";
import { DataSource } from "./DataSource";
import { Storage } from "./Storage";
import { map } from "rxjs";
import { IPerson } from "./models/IPerson";
import { renderPersonNode } from "./functions/renderPersonNode";
import { getLinks } from "./functions/getLinks";

let dataSource: DataSource<INode<IPerson>>;

let checkedNodes: INode[] = [];

export async function init() {
  const storage = new Storage<INode<IPerson>>();
  // todo вынести INode<IPerson> в отдельный тип
  dataSource = new DataSource<INode<IPerson>>(storage);
  subscribeToDataSource(dataSource);
  await dataSource.update();
}

document.querySelector('#addChildBtn')!.addEventListener('click', async function() {
  await dataSource.addChild({
    data: {name: {first: 'f', last: 'as'}, birthDate: 'asf'}, parentIds: [], childrenIds: [], depth: checkedNodes[0].depth + 1
  }, checkedNodes[0], checkedNodes[1]);

  checkedNodes = [];
})

document.querySelector('#addNodeBtn')!.addEventListener('click', async function() {
  const depth = Number.parseInt(document.querySelector<HTMLInputElement>('#depthInput')!.value);
  await dataSource.add({
    data: {name: {first: 'f', last: 'as'}, birthDate: 'asf'}, parentIds: [], childrenIds: [], depth: depth
  })
})

document.querySelector('#removeNode')!.addEventListener('click', async function() {
  await dataSource.remove(checkedNodes[0]);
  checkedNodes = [];
})

document.querySelector('#clearChecked')!.addEventListener('click', function() {
  checkedNodes = [];
})

function subscribeToDataSource(dataSource: DataSource<INode<IPerson>>) {
  dataSource.data$.pipe(
    map(data => ({
      nodes: data,
      links: getLinks(data)
    }))
  ).subscribe(({ nodes, links }) => {
    const originalNodes = JSON.parse(JSON.stringify(nodes)) as INode<IPerson>[];
    const svg = select('#simulation')

    let svgNodes: Selection<any, any, any, any>;
    let svgLinks: Selection<any, any, any, any>;

    const redraw = () => {
      svgLinks = svg
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke', 'grey')
        .attr('stroke-opacity', 0.5)
        // @ts-ignore
        .attr('x1', d => d.source.x)
        // @ts-ignore
        .attr('y1', d => d.source.y)
        // @ts-ignore
        .attr('x2', d => d.target.x)
        // @ts-ignore
        .attr('y2', d => d.target.y)

      svgNodes = svg
        .selectAll('g')
        .data(nodes)
        .join('g')
        // @ts-ignore
        .call(renderPersonNode)
        .on('click', (e, dataItem) => {
          e.stopPropagation();
          checkedNodes.push(originalNodes.find(n => n.id === dataItem.id)!);
          console.log('Выбранные ноды: ', checkedNodes);
        })
    }

    const ticked = () => {
      svgNodes
        .attr('transform', d => `translate(${d.x}, ${d.y})`)

      svgLinks
        // @ts-ignore
        .attr('x1', d => d.source.x)
        // @ts-ignore
        .attr('y1', d => d.source.y)
        // @ts-ignore
        .attr('x2', d => d.target.x)
        // @ts-ignore
        .attr('y2', d => d.target.y)
    }

    // @ts-ignore
    const simulation = forceSimulation(nodes)
      .force('charge', forceManyBody().strength(-300))
      // .force('center', forceCenter(640, 275))
      .force('link', forceLink().links(links).distance(220))
      .force('x', forceX().x(d => 640).strength(0.01))
      .force('y', forceY().y(d => {
        // @ts-ignore
        return d.depth * 220 + 220
      }).strength(0.3))
      .on('tick', ticked)

    redraw();

  });
}

