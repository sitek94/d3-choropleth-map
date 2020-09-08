import {
  select,
  json,
  geoPath,
} from 'd3';
import {
  feature
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

    const counties = feature(jsonCountiesData, jsonCountiesData.objects.counties);
    
    console.log(counties);
    const path = geoPath();

    svg.selectAll('path')
      .data(counties.features)
      .enter().append("path")
        .attr("fill", 'black')
        .attr("d", d => path(d))
  })