import {
  select,
  geoPath,
  zoom,
  scaleOrdinal,
  scaleQuantize,
  schemeCategory10,
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
  width = 960, 
  height = 600;

const margin = { 
  top: 0, 
  right: 20, 
  bottom: 75, 
  left: 180 
};
// inner width and height
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Root element
const root = select('#root');

// Svg
const svg = root.append('svg')
  .attr('width', width)
  .attr('height', height);

// Container g element
const g = svg.append('g');

// Path generator
const pathGenerator = geoPath();

// Zoom functionality
svg.call(zoom()
  .extent([[0, 0], [width, height]])
  .scaleExtent([1, 8])
  .on("zoom", zoomed));
// Zoom function
function zoomed({ transform }) {
  g.attr("transform", transform);
}

loadAndProcessData()
  .then(([counties, states]) => {

    console.log(counties);
    
    // Color value accessor
    const colorValue = d => d.properties.bachelorsOrHigher;

    const colorScale = scaleQuantile()
      .domain(extent(counties, colorValue))
      .range(schemeBuPu[9]);

    // Counties paths
    g.selectAll('path')
      .data(counties)
      .enter().append('path')
        .attr('class', 'county')
        .attr('fill', d => colorScale(colorValue(d)))
        .attr('stroke-width', '0.05px')
        .attr('stroke', '#fff')
        .attr('d', pathGenerator)
          // Add simple tooltip
          .append('title')
          .text(d => d.properties.area_name);

    // States path
    g.append('path')
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('d', pathGenerator(states));

    // Append color legend
    const legendSvg = root.append(() => legend({
      title: `Adults age 25 and older with a bachelor's degree or higher`,
      color: colorScale,
      tickFormat: x => Math.round(x) + '%'
    }));

    legendSvg.attr('y', `${height - 100}`);

    
        
  })