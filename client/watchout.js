
/*
=================================
GLOBAL VARS
=================================
*/

var width = 800;
var height = 400;









/*
=================================
CREATE BACKGROUND CONTAINER
=================================
*/
var svgContainer = d3.select('.board').append('svg')
                               .attr('width', width)
                               .attr('height', height)
                               .style('fill', '#94d31b');




/*
=================================
VILLIAN FUNCTIONS
=================================
*/

var updateData = function(n) {
  var data = [];

  for (var i = 0; i < n; i++) {
    var tempObj = {};

    tempObj.xPos = Math.random() * width;

    tempObj.yPos = Math.random() * height;

    tempObj.id = i;

    data.push(tempObj);
  }

  return data;
};


var update = function() {
  var villianObjects = updateData(10);

  var villians = svgContainer.selectAll('circle')
                  .data(villianObjects, d => d.id);

                  
  
  // ENTER
  villians.enter().append('circle')
                  .attr('cx', d => d.xPos)
                  .attr('cy', d => d.yPos)
                  .attr('r', villianRadius)
                  .attr('fill', villianColor)
                  .classed('villian', true); 


  // UPDATE
  villians.transition()
          .attr('cx', d => d.xPos)
          .attr('cy', d => d.yPos)
          .duration(5000);
};



// ============================ 
// VILLIAN ATTRIBUTES
// ============================
var villianRadius = 20;

var villianColor = '#000000';



/*
=================================
HERO FUNCTIONALITY
=================================
*/

var drag = d3.behavior
              .drag()
              .on('drag', function(d, i) {
                d.x += d3.event.dx;
                d.y += d3.event.dy;
                d3.select(this).attr('transform', function(d, i) {
                  return 'translate(' + [ d.x, d.y ] + ')';
                });
              });


/*
=================================
HERO ATTRIBUTES
=================================
*/

var heroRadius = 50;

var heroColor = '#94d31b';


var hero = svgContainer.selectAll('hero')
                       .data([{x: width / 2, y: height / 2}]);


hero.enter().append('circle')
              .attr('cx', d => d.x)
              .attr('cy', d => d.y)
             .attr('fill', heroColor) 
             .attr('r', heroRadius)
             .classed('hero', true)
             .call(drag);
















update();
update();
setInterval(update, 5000);



































