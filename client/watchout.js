
/*
=================================
GLOBAL VARS
=================================
*/

var width = window.innerWidth * .8 + 20;
var height = window.innerHeight * .6 + 20;
var duration = 5000;
var numVillians = 10;

var addVillians = function() {
  
}
setInterval(function() {
  numVillians++;
}, duration);



/*
=================================
CREATE BACKGROUND CONTAINER
=================================
*/
var svgContainer = d3.select('.board').append('svg')
                               .attr('id', 'svgContainer')
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
  var villianObjects = updateData(numVillians);

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
  villians
          .transition()
          .attr('cx', d => d.xPos)
          .attr('cy', d => d.yPos)
          .duration(duration)
          .tween('cx', function(d) {
            var newX = d.xPos;
            var oldX = this.getAttribute('cx');
            var interpolatorX = d3.interpolateNumber(oldX, newX);
            return function(t) {
              d.cX = interpolatorX(t);
              return interpolatorX(t);
            };
          })
          .tween('cy', function(d) {
            var newY = d.yPos;
            var oldY = this.getAttribute('cy');
            var interpolatorY = d3.interpolateNumber(oldY, newY);
            return function(t) {
              d.cY = interpolatorY(t);
              return interpolatorY(t);
            };
          });
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
                d3.select(this).attr('cx', (width / 2) + d.x)
                               .attr('cy', (height / 2) + d.y);
              });


var collision = function() {


  var hX = d3.select('.hero').attr('cx');

  var hY = d3.select('.hero').attr('cy');

  d3.selectAll('.villian').each(d => {
    var vX = d.cX;
    var vY = d.cY;

    xDiff = Math.ceil(Math.abs(vX - hX));
    yDiff = Math.ceil(Math.abs(vY - hY)); 

    centersDistance = Math.pow((Math.pow(xDiff, 2) + Math.pow(yDiff, 2)), .5);
    // console.log(centersDistance);
    if (centersDistance < heroRadius + villianRadius) {
      console.log('COLLISION!!!!');

    }

  });


};

/*
=================================
HERO ATTRIBUTES
=================================
*/

var heroRadius = 30;

var heroColor = '#94d31b';


var hero = svgContainer.selectAll('hero')
                       .data([{x: 1, y: 1, xPos: width / 2, yPos: height / 2}]);


hero.enter().append('circle')
              .attr('cx', d => d.xPos)
              .attr('cy', d => d.yPos)
             .attr('fill', heroColor) 
             .attr('r', heroRadius)
             .classed('hero', true)
             .call(drag);


update();
update();
setInterval(update, duration);



setInterval(collision, 10);

































