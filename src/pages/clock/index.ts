import {
  select,
  scaleLinear,
  arc,
  Selection
} from 'd3';

(() => {
  const SVG_SIZE = 300;
  const CLOCK_RADIUS = 140;

  const PI = Math.PI;
  const SCALE_SECONDS = scaleLinear().domain([0, 59 + 999/1000]).range([0, 2 * PI]);
  const SCALE_MINUTES = scaleLinear().domain([0, 59 + 59/60]).range([0, 2 * PI]);
  const SCALE_HOURS = scaleLinear().domain([0, 11 + 59/60]).range([0, 2 * PI]);

  const CLOCK_HANDS_LENGTH = {
    HOUR: CLOCK_RADIUS - 45,
    MINUTE: CLOCK_RADIUS - 30,
    SECOND: CLOCK_RADIUS - 15
  }

  let clockHandsGroup: Selection<SVGGElement, unknown, HTMLElement, any>;

  const prepareTmp = () => {
    const svg = select('body')
      .append('div')
      .append('svg')
      .attr('width', SVG_SIZE)
      .attr('height', SVG_SIZE)

    const centeredGroup = svg
      .append('g')
      .attr('transform', `translate(${SVG_SIZE / 2}, ${SVG_SIZE / 2})`)

    centeredGroup
      .append('circle')
      .attr('r', CLOCK_RADIUS)
      .attr('fill', 'none')
      .attr('stroke', 'black')

    centeredGroup
      .append('circle')
      .attr('r', 4)

    clockHandsGroup = centeredGroup.append('g')
  }


  const rerenderClockHands = () => {
    const UNITS = {
      HOURS: 'HOURS',
      MINUTES: 'MINUTES',
      SECONDS: 'SECONDS'
    };
    const currentDate = new Date();
    const hours = currentDate.getHours() + currentDate.getMinutes() / 60;
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    const data = [
      { units: UNITS.HOURS, value: hours },
      { units: UNITS.MINUTES, value: minutes },
      { units: UNITS.SECONDS, value: seconds }
    ]

    const hoursArc = arc<number>()
      .outerRadius(CLOCK_HANDS_LENGTH.HOUR)
      .innerRadius(0)
      .startAngle(hours => SCALE_HOURS(hours))
      .endAngle(hours => SCALE_HOURS(hours))

    const minutesArc = arc<number>()
      .outerRadius(CLOCK_HANDS_LENGTH.MINUTE)
      .innerRadius(0)
      .startAngle(minutes => SCALE_MINUTES(minutes))
      .endAngle(minutes => SCALE_MINUTES(minutes))

    const secondsArc = arc<number>()
      .outerRadius(CLOCK_HANDS_LENGTH.SECOND)
      .innerRadius(0)
      .startAngle(seconds => SCALE_SECONDS(seconds))
      .endAngle(seconds => SCALE_SECONDS(seconds))

    clockHandsGroup
      .selectAll('.clockHand')
      .remove()

    clockHandsGroup
      .selectAll('.clockHand')
      .data(data)
      .enter()
      .append('path')
      .attr('d', dataItem => {
        const { value } = dataItem;
        switch(dataItem.units) {
          case UNITS.HOURS:
            return hoursArc(value % 12);
          case UNITS.MINUTES:
            return minutesArc(value);
          case UNITS.SECONDS:
            return secondsArc(value);
          default:
            return '';
        }
      })
      .attr('class', 'clockHand')
      .attr('stroke', 'black')
  }


  prepareTmp();

  setInterval(() => {
    rerenderClockHands();
  }, 1000);
})();