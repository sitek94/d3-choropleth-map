import {
  select,
} from 'd3';

export const tooltip = () => {

  // Tooltip container
  const tooltip = select('body').append('div')
  .attr('id', 'tooltip')
  .attr('class', 'tooltip')
  .style('opacity', 0);

  // Tooltip details
  const tooltipDetails = tooltip
  .append('p')
  .attr('class', 'tooltip-details');

  // Mouse over handler
  const handleMouseover = (event, data) => {

  // Tooltip transition
  tooltip.transition()		
    .duration(200)		
    .style("opacity", .9);

  // Get details
  const { area_name, state, bachelorsOrHigher } = data.properties;

  // Construct details string
  const details = [
    `${area_name}, ${state}`,
    `Bachelor's degree or higher: ${bachelorsOrHigher}%`,
  ].join('<br>');
  
  // Update details
  tooltipDetails.html(details);

  // Get constants to construct tooltip position
  const { pageX, pageY } = event;
  const { scrollLeft, offsetLeft } =  document.body;
  const yOffset = -120;
  const xOffset = scrollLeft + offsetLeft;

  // Update tooltip position and data-year
  tooltip
    .attr('data-education', bachelorsOrHigher)
    .style("left", pageX + xOffset + "px")		
    .style("top", pageY + yOffset + "px");
  }
  // Mouse out handler
  const handleMouseout = () => {
  tooltip.transition()		
    .duration(500)		
    .style("opacity", 0);	
  }

  return { handleMouseover, handleMouseout };
}