import {
  scaleLinear,
  axisBottom,
  format,
} from 'd3';


export const colorLegend = (selection, props) => {
  console.log(props);
  const {
    colorScale,
    width,
    height,
  } = props;

  // X scale
  const xScale = scaleLinear()
  .domain(colorScale.domain())
  .range([0, width]);

  // X axis
  const xAxis = axisBottom(xScale)
    .tickSize(40)
    .tickValues(colorScale.domain())
    .tickFormat(format('.2f'))
    .tickPadding(10);

  // Append legend container to provided selection element
  const container = selection.append('g').call(xAxis);

  // Remove domain line
  container.select('.domain').remove();

  // Construct dataset, important when working with threshold scales
  const dataset = colorScale.range()
    .map(color => {
      // For each color I need to have an array of first and second number
      // Sth like this [ [-6, -5], [-5, -4], [-4, -3], [-2, -1] ]
      // Nice explanation of all this:
      // https://stackoverflow.com/questions/48161257/understanding-invertextent-in-a-threshold-scale
      const d = colorScale.invertExtent(color);

      if (d[0] == null) d[0] = xScale.domain()[0];
      if (d[1] == null) d[1] = xScale.domain()[1];

      return d;
    });

  container.selectAll('rect')
    .data(dataset)
  .enter().insert('rect', '.tick')
    .attr('x', d => xScale(d[0]))
    .attr('height', height)
    .attr('width', d => xScale(d[1]) - xScale(d[0]))
    .attr('fill', d => colorScale(d[0]));

  // container.append('text')
  //   .attr('fill', '#000')
  //   .attr('font-weight', 'bold')
  //   .attr('text-anchor', 'start')
  //   .attr('y', -6)
  //   .text('Percentage of stops that involved force');
}
