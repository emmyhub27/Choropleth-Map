document.addEventListener("DOMContentLoaded", function (){
    //Fetch data.
    Promise.all([
        d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"),
        d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
      ]).then(([educationData, countyData]) => {
        console.log(educationData);
        console.log(countyData);

        // Map education data to county FIPS.
        const educationMap = {};
        educationData.forEach(d => {
            educationMap[d.fips] = {
              education: d.bachelorsOrHigher,
              area_name: d.area_name,
              state: d.state
              };
            });

            //Create SVG container.
            const svg = d3. select("#canvas")
                          .attr("width", 1000)
                          .attr("height", 600);
          //   Add tooltip
       const tooltip = d3.select("#tooltip");

            //Draw counties.
      svg.selectAll("path")
          .data(topojson.feature(countyData, countyData.objects.counties).features)
          .enter()
          .append("path")
          .attr("d", d3.geoPath())
          .attr("class", "county")
          .attr("data-fips", d => d.id) 
          .attr("data-education", d => educationMap[d.id]?.education || 0) // Default to 0 if data is missing
          .attr("fill", d => {
            const education = educationMap[d.id]?.education || 0;
            if (education <= 15) {
                return "#ebb54b";
              } else if (education <= 30) {
                return "#a14299";
              } else if (education <= 45) {
                return "#b2de76";
              } else {
                return "#a576de";
              }
          })
          .on("mouseover", showTooltip)
          .on("mouseout", hideTooltip);

          function showTooltip (event, d) {
            tooltip.style("display", "block")
              .attr("data-education", educationMap[d.id]?.education || 0)
              .style('left', `${event.pageX}px`)
              .style('top', `${event.pageY}px`)
              .html(`County: ${educationMap[d.id]?.area_name || 'Unknown'}<br> State: ${educationMap[d.id]?.state}<br>Education: ${educationMap[d.id]?.education || 0}%`)
              console.log(educationMap[d.id]?.education)
              console.log(educationMap[d.id]?.area_name)
          };


          function hideTooltip () {
              tooltip.style("display", "none");
          };
    })
})