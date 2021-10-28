import { Selection } from "d3";

export function renderPersonNode(g: Selection<SVGGElement, any, any, any>) {
  g
    .append('image')
    .attr('width', 100)
    .attr('height', 100)
    .attr('transform', 'translate(-50, -50)')
    .attr('xlink:href', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Odnoklassniki.svg/584px-Odnoklassniki.svg.png')
    .attr('clip-path', 'url(#pictureCircle)')

  const text = g
    .append('text')
    .attr('transform', 'translate(-50%, -50%)')
    .attr('text-anchor', 'middle')
    .attr('y', 70)

  text
    .append('tspan')
    .attr('x', 0)
    .text('Михаил Васильевич')

  text
    .append('tspan')
    .attr('x', 0)
    .attr('dy', '1em')
    .text('Петров')
}
