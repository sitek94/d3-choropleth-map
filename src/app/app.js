import {
  select,
  json,
  geoPath,
  zoom
} from 'd3';
import {
  feature,
  mesh
} from 'topojson-client';

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

// Zoom functionality
svg.call(zoom()
  .extent([[0, 0], [width, height]])
  .scaleExtent([1, 8])
  .on("zoom", zoomed));
// Zoom function
function zoomed({ transform }) {
  g.attr("transform", transform);
}

// Data urls from freeCodeCamp challenge
const educationData = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
const countiesData = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

// Fetch education and counties data
Promise.all([
    json(educationData), 
    json(countiesData)
  ])
  .then(([jsonEducationData, jsonCountiesData]) => {
    console.log(jsonEducationData);
    console.log(jsonCountiesData);

    const counties = feature(jsonCountiesData, jsonCountiesData.objects.counties).features;
    const states = mesh(jsonCountiesData, jsonCountiesData.objects.states, (a, b) => a !== b);
    console.log(counties);
    const pathGenerator = geoPath();

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