import {
  select,
  geoPath,
  zoom
} from 'd3';
import { loadAndProcessData } from './loadAndProcessData';

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
  .then(([counties, states, jsonEducationData]) => {


    // Counties paths
    g.selectAll('path')
      .data(counties)
      .enter().append('path')
        .attr('class', 'county')
        .attr('fill', 'black')
        .attr('stroke-width', '0.05px')
        .attr('stroke', '#fff')
        .attr('d', pathGenerator)
          // Add simple tooltip
          .append('title')
          .text((d, i) => jsonEducationData[i].area_name);

    // States path
    g.append('path')
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('d', pathGenerator(states));
  })