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
  width = 975, 
  height = 610;

// Svg
const svg = select('svg')
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

// Color scale
// const colorScale = scaleQuantize([1, 50], schemeBuPu[9]);


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
    const legendSvg = g.append(() => legend({
      title: `Adults age 25 and older with a bachelor's degree or higher`,
      color: colorScale,
      tickFormat: x => Math.round(x) + '%'
    }));

    legendSvg.attr('y', `${height - 100}`);

    
        
  })