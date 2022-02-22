import { ILink, INode, IPerson } from "./models";
import {
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  Simulation,
  SimulationNodeDatum,
  Selection,
  ForceLink,
  select,
  SimulationLinkDatum,
  forceCollide
} from "d3";
import { Publisher } from "./Publisher";


export type NodesType = SimulationNodeDatum & INode<IPerson>;
type LinksType = SimulationLinkDatum<NodesType>;
type TSVGGNodesSelection = Selection<SVGGElement, NodesType, any, any>;
type TSVGLineLinksSelection = Selection<SVGLineElement, LinksType, any, any>;
type LinksSelectionDataValue = Required<NodesType>;


export enum ESimulationEvents {
  CheckedNodesChanged= 'CheckedNodesChanged'
}
type TEvents = {
  [ESimulationEvents.CheckedNodesChanged]: (nodes: NodesType[]) => void
}

export class D3Simulation extends Publisher<TEvents>{
  private _simulation: Simulation<NodesType, ILink>;
  private _svgGNodesSelection!: TSVGGNodesSelection
  private _svgLineLinksSelection!: TSVGLineLinksSelection;

  private _nodes: NodesType[] = [];
  private _links: LinksType[] = [];

  private _checkedNodes: NodesType[] = [];

  private set checkedNodes(newNodes: NodesType[]) {
    this._checkedNodes = newNodes;
    this.publish(ESimulationEvents.CheckedNodesChanged, newNodes);
  }

  public clearCheckedNodes(): void {
    this.checkedNodes = [];
    this.redraw(this._nodes, this._links);
  }

  constructor(
    private _svg: SVGElement
  )
  {
    super();
    this._simulation = this.createSimulation();
    this._svg.addEventListener('click', this.svgClickHandler.bind(this));
  }

  private createSimulation(): Simulation<NodesType, ILink> {
    return forceSimulation<NodesType, LinksType>([])
      .stop()
      .force('charge', forceManyBody().strength(-300))
      .force('link', forceLink().links([]).distance(220))
      .force('collide', forceCollide().radius(90))
      .force('x', forceX<NodesType>().x(d => 640).strength(0.01))
      .force('y', forceY<NodesType>().y(d => {
        return d.depth * 220 + 220
      }).strength(0.3))
      .on('tick', this.tick.bind(this))
  }

  update(
    nodes: INode<IPerson>[],
    links: ILink[]
  ): void {
    // todo cloning objects
    const newNodes = JSON.parse(JSON.stringify(nodes)) as NodesType[];
    const newLinks = JSON.parse(JSON.stringify(links)) as LinksType[];

    const old = new Map(this._nodes.map(d => [d.id, d]));
    this._nodes = newNodes.map(d => Object.assign(old.get(d.id) || {}, d));
    this._links = newLinks.map(d => Object.assign({}, d));

    this._simulation.nodes(this._nodes);
    (this._simulation.force('link') as ForceLink<NodesType, LinksType>).links(this._links);

    const data = this.redraw(this._nodes, this._links);
    const { svgNodes, svgLinks } = data;
    this._svgGNodesSelection = svgNodes;
    this._svgLineLinksSelection = svgLinks;
    this._simulation.alpha(1).restart();
  }

  private tick(): void {
    this._svgGNodesSelection
      .attr('transform', d => `translate(${d.x}, ${d.y})`)

    this._svgLineLinksSelection
      .attr('x1', d => (d.source as LinksSelectionDataValue).x)
      .attr('y1', d => (d.source as LinksSelectionDataValue).y)
      .attr('x2', d => (d.target as LinksSelectionDataValue).x)
      .attr('y2', d => (d.target as LinksSelectionDataValue).y)
  }

  private redraw(
    nodes: NodesType[],
    links: LinksType[]
  ): {
    svgNodes: TSVGGNodesSelection,
    svgLinks: TSVGLineLinksSelection
  } {
    const selectedSvg = select(this._svg);
    const svgLinks = selectedSvg
      .selectAll<SVGLineElement, void>('line')
      .data(links)
      .join('line')
      .attr('stroke', 'grey')
      .attr('stroke-opacity', 0.5)

    const svgNodes = selectedSvg
      .selectAll<SVGGElement, void>('g')
      .data(nodes)
      .join('g')
      .call(this.renderPersonNode.bind(this))
    .on('click', this.nodeClickHandler.bind(this))

    return { svgNodes, svgLinks };
  }

  private nodeClickHandler(e: PointerEvent, dataItem: NodesType): void {
    e.stopPropagation();
    if (e.ctrlKey) {
      const alreadyCheckedNode = this._checkedNodes.find(cn => cn === dataItem);
      if (alreadyCheckedNode) {
        this.checkedNodes = this._checkedNodes.filter(n => n !== alreadyCheckedNode);
      } else {
        this.checkedNodes = [...this._checkedNodes, dataItem];
      }
      this.redraw(this._nodes, this._links);
    }
  }

  private svgClickHandler(e: MouseEvent): void {
    e.stopPropagation();
    this._checkedNodes = [];
    this.redraw(this._nodes, this._links);
  }

  private renderPersonNode(g: Selection<SVGGElement, any, any, any>) {
    g.html('') // todo can full node redraw be optimized?

    g
      .append('image')
      .attr('width', 100)
      .attr('height', 100)
      .attr('transform', 'translate(-50, -50)')
      .attr('xlink:href', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Odnoklassniki.svg/584px-Odnoklassniki.svg.png')
      .attr('clip-path', 'url(#pictureCircle)')

    g.call(this.markIfChecked.bind(this))

    const text = g
      .append('text')
      .attr('transform', 'translate(-50%, -50%)')
      .attr('text-anchor', 'middle')
      .attr('y', 70)

    text
      .append('tspan')
      .attr('x', 0)
      .text(({ data: { name: { first, middle } } }) => `${first} ${middle}`)

    text
      .append('tspan')
      .attr('x', 0)
      .attr('dy', '1em')
      .text(d => d.data.name.last)
  }

  private markIfChecked(g: Selection<SVGGElement, any, any, any>): void {
    g
      .attr('stroke-width', d =>
        this._checkedNodes.includes(d)
          ? '1px'
          : null
      )

    g
      .attr('stroke', d =>
        this._checkedNodes.includes(d)
          ? 'black'
          : null
      )
  }
}
