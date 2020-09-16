import {
  select,
  geoPath,
  zoom,
  scaleOrdinal,
  scaleQuantize,
  schemeCategory10,
  scaleSequential,
  interpolateBlues,
  schemeBuPu,
  schemeBlues,
  extent,
  schemeSpectral,
  scaleQuantile,
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
const root = select('#root');

const title = root.append('h1')
  .attr('id', 'title')
  .attr('class', 'title')
  .html('United States Educational Attainment');

// Svg
const svg = root.append('svg')
  .attr('class', 'map')
  .attr('width', width)
  .attr('viewBox', [0, 0, 975, 610]);

// Container g element
const g = svg.append('g');

// Path generator
const pathGenerator = geoPath();

// Zoom functionality
svg.call(zoom()
  .extent([[0, 0], [width, height]])
  .scaleExtent([1, 8])
  .on('zoom', zoomed));
// Zoom function
function zoomed({ transform }) {
  g.attr('transform', transform);
}

loadAndProcessData()
  .then(([counties, states]) => {
    
    // Color value accessor
    const colorValue = d => d.properties.bachelorsOrHigher;

    const colorScale = scaleQuantize()
      .domain(extent(counties, colorValue))
      .range(schemeBuPu[9]);

      console.log(schemeBuPu[9]);
      console.log(schemeBuPu[11]);

    // Counties paths
    g.selectAll('path')
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
    g.append('path')
        .attr('class', 'states-path')
        .attr('d', pathGenerator(states));

    // Append color legend
    root.append(() => legend({
      title: `Adults age 25 and older with a bachelor's degree or higher`,
      color: colorScale,
      tickFormat: x => Math.round(x) + '%'
    }));       
  })