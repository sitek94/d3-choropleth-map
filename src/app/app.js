import {
  select,
  json,
  geoPath,
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

// Data from freeCodeCamp challenge
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
    svg.selectAll('path')
      .data(counties)
      .enter().append('path')
        .attr('fill', 'black')
        .attr('d', pathGenerator);

    // States path
    svg.append('path')
        .attr('stroke', 'blue')
        .attr('d', pathGenerator(states));
  })