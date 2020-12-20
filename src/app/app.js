import {
  select,
  geoPath,
  zoom,
  scaleQuantize,
  schemePuBuGn,
  extent,
  zoomIdentity,
} from 'd3';
import { loadAndProcessData } from './loadAndProcessData';
import { legend } from './legend';
import { tooltip } from './tooltip';

// Constants
const width = 975;
const height = 610;

// Root element
const root = select('.root');

// Legend container
const legendContainer = root.append('div');

// Svg
const svg = root.append('svg')
  .attr('class', 'map')
  .attr('width', width)
  .attr('viewBox', [0, 0, width, height]);

// Container g element
const containerG = svg.append('g')
  .attr('width', width)
  .attr('height', height)
  .attr('viewBox', [0, 0, width, height]);

// Path generator
const pathGenerator = geoPath();

// Zoom functionality
const mapZoom = zoom()
  .extent([[0, 0], [width, height]])
  .scaleExtent([1, 8])
  .on('zoom', zoomed);

// Apply zoom to the container
svg.call(mapZoom);

// Zoom function
function zoomed({ transform }) {
  containerG.attr('transform', transform);
}
// Reset zoom button on click handler
select('.reset-btn')
  .on('click', () => {
    svg.transition()
    .duration(750)
    .call(mapZoom.transform, zoomIdentity);
  });

loadAndProcessData()
  .then(([counties, states]) => {

    // Color value accessor
    const colorValue = d => d.properties.bachelorsOrHigher;

    // Color scale
    const colorScale = scaleQuantize()
      .domain(extent(counties, colorValue))
      .range(schemePuBuGn[9]);

    // Append color legend
    legendContainer.append(() => legend({
      title: `Adults age 25 and older with a bachelor's degree or higher (2010-2014)`,
      color: colorScale,
      tickFormat: x => Math.round(x) + '%'
    }));

    // Get event handlers from the tooltip
    const { handleMouseover, handleMouseout } = tooltip();

    // Counties paths
    containerG.selectAll('path')
      .data(counties)
      .enter().append('path')
        .attr('class', 'county')
        .attr('fill', d => colorScale(colorValue(d)))
        .attr('stroke-width', '0.05px')
        .attr('stroke', '#fff')
        .attr('d', pathGenerator)
        // Event handlers
        .on('mouseover', handleMouseover)
        .on('mouseout', handleMouseout)

        // Data attributes
        .attr('data-fips', d => d.properties.fips)
        .attr('data-education', d => d.properties.bachelorsOrHigher)
          // Add simple tooltip
          .append('title')
          .text(d => d.properties.area_name);

    // States path
    containerG.append('path')
      .attr('class', 'states')
      .attr('d', pathGenerator(states));
  })