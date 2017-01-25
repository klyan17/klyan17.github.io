var movieMatrix = [[],[],[],[],[],[],[],[],[],[]
                  ,[],[],[],[],[],[],[],[],[],[]];

var oneDegree = 0.0174533;
var minRadian = oneDegree/2;

var maxValue;
var minBarHeight = 10;
var maxBarHeight = 40;
var svg;
var fill;
var width = 1000,
    height = 800,
    innerRadius = 200,
    outerRadius = innerRadius * 1.25;

function createChart(matrix) {

  var chord = d3.layout.chord()
      .padding(0.025)
      .matrix(matrix);

  fill = d3.scale.ordinal()
      .domain(d3.range(20))
      .range(['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a'
        ,'#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd']);

  svg = d3.select("#chart").append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ") rotate(-90)");

//create inner black circle
  svg.append("circle")
      .attr("r", innerRadius)
      .attr("fill", "#333");

//creates the height of the sections
  var arcs = svg.append("g").selectAll("path")
      .data(chord.groups);

  var paths = arcs.enter().append("path")
      .attr("class", "arcs")
      .style("fill", function(d) { return fill(d.index); })
      .style("stroke", function(d) { return fill(d.index); })
      // .attr("d", d3.svg.arc().innerRadius(outerRadius).outerRadius(function(d) { return outerRadius + d.value * 1.5; }))
      .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(function(d) { return innerRadius + ((d.value/maxValue) * maxBarHeight) + minBarHeight; }))
      .on("mouseover", fade(.1))
      .on("mouseover", highlight(true))
      .on("click", function(d) { displayInfo(d); })
      .on("mouseout", fade(1))
      .on("mouseout", highlight(false));

//creates labels
  svg.append("g").selectAll("text")
      .data(chord.groups)
    .enter()
    .append("text")
      .each(function(d) { 
        d.angle = (d.startAngle + d.endAngle) / 2;
        d.distance = innerRadius + ((d.value/maxValue) * maxBarHeight) + 10; 
      })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return (d.angle < (Math.PI/2) || d.angle > (3 * Math.PI/2)) ? "end" : null; })
      .attr("transform", function(d) {
        return "rotate(" + ((d.angle * 180 / Math.PI) - 90) + ")"
            + "translate(" + (d.distance + 10) + ")"
            + (d.angle < (Math.PI/2) ? "rotate(180)" : "")
            + (d.angle > (3 * Math.PI/2) ? "rotate(180)" : "");
      })
      .attr("font-size", "15px")
      .style("fill", function(d) { return fill(d.index); })
      .text(function(d) { console.log(matrixList[d.index]); return matrixList[d.index]; });

//creates the inner circle
  // svg.append("g").selectAll("path")
  //     .data(chord.groups)
  //   .enter().append("path")
  //     .style("fill", function(d) { return "ffffff"; })
  //     .style("stroke", function(d) { return fill(d.index); })
  //     .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
  //     .on("mouseover", fade(.1))
  //     .on("mouseout", fade(1));

//creates the chords
  svg.append("g")
      .attr("class", "chord")
    .selectAll("path")
      .data(chord.chords)
    .enter().append("path")
      .attr("d", d3.svg.chord().radius(innerRadius))
      .style("fill", function(d) { return fill(d.source.index); })
      .style("stroke", function(d) { return LightenDarkenColor(fill(d.source.index), 20);})
      .style("opacity", 1);


//create radial lines
for (var i = 0; i < 5; i++) {
  svg.append("circle")
      .attr("r", innerRadius + 50 * i)
      .attr("fill", "none")
      .attr("stroke", "#fff")
      .style("opacity", 0.5);
}
  // Returns an event handler for fading a given chord group.
  function fade(opacity) {
    return function(g, i) {
      svg.selectAll(".chord path")
          .filter(function(d) { return d.source.index != i && d.target.index != i; })
        .transition()
          .style("opacity", opacity);
    };
  }

  function highlight(bool) {
    return function(g, i) {
      console.log(g);
      svg.selectAll(".arcs")
        .filter(function(d) { return d.index == i; })
      .transition()
        .style("stroke", bool ? "white" : LightenDarkenColor(fill(g.index), 20))
        .style("stroke-width", bool ? "5px" : "1px");
    };
  }
}

function displayInfo(d) {
  console.log(d);
  if (d.index > 9) {
    getGenreDetail(matrixList[d.index]);
  } else {
    getDistDetail(matrixList[d.index]);
  }
}

function swapColors(option) {
  svg.selectAll(".chord path")
    .transition()
    .style("fill", function(d) { 
      if (option == "target") {
        return fill(d.target.index)
      } else {
        return fill(d.source.index);
      }
    })
    .style("stroke", function(d) { 
      if (option == "target") {
        return LightenDarkenColor(fill(d.target.index), 20);
      } else {
        return LightenDarkenColor(fill(d.source.index), 20);
      }
    });
}

function showGross() {
  setMatrixGross(resultMovies);
  updateChart();
}

function showFilmCount() {
  setMatrixFilmCount(resultMovies);
  updateChart();
}

function updateChart() {
  var chord = d3.layout.chord()
    .padding(0.025)
    .matrix(movieMatrix);

//readjust the arcs
  var arcs = svg.selectAll(".arcs")
        .data(chord.groups)
        .transition()
        .each(function(d) {
          if ((d.endAngle - d.startAngle) < oneDegree) {
            d.startAngle -= minRadian;
            d.endAngle += minRadian;
          }
        })
        .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(function(d) { return innerRadius + ((d.value/maxValue) * maxBarHeight) + minBarHeight; }));

//readjust the text
  var text = svg.selectAll("text")
      .data(chord.groups)
      .each(function(d) { 
        d.angle = (d.startAngle + d.endAngle) / 2;
        d.distance = innerRadius + ((d.value/maxValue) * maxBarHeight) + 10; 
      })
      .transition()
      .attr("text-anchor", function(d) { return (d.angle < (Math.PI/2) || d.angle > (3 * Math.PI/2)) ? "end" : null; })
      .attr("transform", function(d) {
        return "rotate(" + ((d.angle * 180 / Math.PI) - 90) + ")"
            + "translate(" + (d.distance + 10) + ")"
            + (d.angle < (Math.PI/2) ? "rotate(180)" : "")
            + (d.angle > (3 * Math.PI/2) ? "rotate(180)" : "");
      });
//readjust the chords
  var chords = svg.selectAll(".chord path")
      .data(chord.chords)
      .transition()
      .attr("d", d3.svg.chord().radius(innerRadius));

  console.log("update chart");
}


function LightenDarkenColor(col, amt) {
    var usePound = false;
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
    var num = parseInt(col,16);
    var r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
    var b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
    var g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}