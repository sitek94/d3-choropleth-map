import { json } from 'd3';
import { feature, mesh } from 'topojson-client';

// Data urls from freeCodeCamp challenge
const educationData = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
const countiesData = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

// Fetch education and counties data
export const loadAndProcessData = () => 
  Promise.all([
    json(educationData), 
    json(countiesData)
  ])
  .then(([jsonEducationData, jsonCountiesData]) => {

    // Use feature and mesh from topojson-client to process the data
    const counties = feature(jsonCountiesData, jsonCountiesData.objects.counties).features;
    const states = mesh(jsonCountiesData, jsonCountiesData.objects.states, (a, b) => a !== b);

    // Create object with properties of each county 
    const rowById = jsonEducationData.reduce((accumulator, d) => {
      accumulator[d.fips] = d;
      return accumulator;
    }, {})

    // Add properties to each county
    counties.forEach(d => {
      d.properties = rowById[d.id];
    })

    return [counties, states];
  })



