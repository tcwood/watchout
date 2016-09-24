
/*
=================================
GLOBAL VARS
=================================
*/

var width = window.innerWidth * .8 + 20;
var height = window.innerHeight * .6 + 20;





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
  var villianObjects = updateData(1);

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
          .duration(500);
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

  d3.selectAll('.villian').each(item => {
    var vX = item.xPos;
    var vY = item.yPos;

    xDiff = Math.ceil(Math.abs(vX - hX));
    yDiff = Math.ceil(Math.abs(vY - hY)); 


    // console.log(item.xPos);

    centersDistance = Math.pow((Math.pow(xDiff, 2) + Math.pow(yDiff, 2)), .5);


    console.log(centersDistance); 


    // if ( centersDistance < villianRadius + heroRadius ) {
    //   console.log(item.yPos);
    //   d3.select('.hero').attr('fill', 'red');  
    //   console.log('X collision');
    // } 
  });


};

// (ifvillianX > heroBufferLeft && villianX < villianBufferRight) && (villianY)



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









// var svg = d3.select('svg');
// svg.on('mousemove', function() {
//   console.log(d3.mouse(this));
// });





  




update();
update();
setInterval(update, 500);
// setInterval(function() {
//   console.log('x:' + x + ', y:' + y);
// }, 100);



setInterval(collision, 30);


attrTween('cx', function() {
  var interpolatorX = d3.interpolate(oldDataX, newDataX)//
  var interpolatorY = d3.interpolate(oldDataY, newDataY)
  return function(t) {
    this.xPos = interpolatorX(t);
    this.yPos = interpolatorY(t);
  }

})































