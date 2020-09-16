import {
  select,
  geoPath,
  zoom,
  scaleQuantize,
  schemeBuPu,
  extent,
  zoomIdentity,
} from 'd3';
import { loadAndProcessData } from './loadAndProcessData';

import { legend } from './legend';

// Constants
const 
  // Svg dimensions
  aspectRatio = 975 / 610,
  width = 975,
  height = width / aspectRatio;

// Root element
const root = select('.root');

// Legend container
const legendContainer = root.append('div');

// Svg
const svg = root.append('svg')
  .attr('class', 'map')
  .attr('width', width)
  .attr('viewBox', [0, 0, 975, 610]);

// Container g element
const containerG = svg.append('g')

// Path generator
const pathGenerator = geoPath();

// Zoom functionality
const mapZoom = zoom()
  .extent([[0, 0], [width, height]])
  .scaleExtent([1, 8])
  .on('zoom', zoomed);

// Apply zoom to 
containerG.call(mapZoom);


// Zoom function
function zoomed({ transform }) {
  containerG.attr('transform', transform);
}
// Reset zoom button
const resetBtn = select('.reset-btn')
  .on('click', () => {
    containerG.transition()
    .duration(750)
    .call(mapZoom.transform, zoomIdentity);
  })
  

loadAndProcessData()
  .then(([counties, states]) => {
    
    // Color value accessor
    const colorValue = d => d.properties.bachelorsOrHigher;

    // Color scale
    const colorScale = scaleQuantize()
      .domain(extent(counties, colorValue))
      .range(schemeBuPu[9]);

    // Append color legend
    legendContainer.append(() => legend({
      title: `Adults age 25 and older with a bachelor's degree or higher (2010-2014)`,
      color: colorScale,
      tickFormat: x => Math.round(x) + '%'
    }));    

    // Counties paths
    containerG.selectAll('path')
      .data(counties)
      .enter().append('path')
        .attr('class', 'county-path')
        .attr('fill', d => colorScale(colorValue(d)))
        .attr('stroke-width', '0.05px')
        .attr('stroke', '#fff')
        .attr('d', pathGenerator)
          // Add simple tooltip
          .append('title')
          .text(d => d.properties.area_name);

    // States path
    containerG.append('path')
        .attr('class', 'states-path')
        .attr('d', pathGenerator(states));

       
  })