
/*
=================================
GLOBAL VARS
=================================
*/

var width = window.innerWidth * .8 + 20;
var height = window.innerHeight * .6 + 20;



console.log(window.innerHeight);





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
                d3.select(this).attr('cx', (width / 2) + d.x)
                               .attr('cy', (height / 2) + d.y);


                // d3.select(this).attr('transform', function(d, i) {
                //   return 'translate(' + [ d.x, d.y ] + ')';
                // });
              });


var collision = function() {


  var heroXPos = d3.select('.hero').attr('cx');

  var heroYPos = d3.select('.hero').attr('cy');

  var heroXBufferLeft = heroXPos - heroRadius;
  var heroXBufferRight = heroXPos + heroRadius; 

  var heroYBufferTop = heroYPos + heroRadius;
  var heroYBufferBottom = heroYPos - heroRadius; 


  d3.selectAll('.villian').each(item => {
    if ( item.xPos >= heroXBufferLeft && item.xPos <= heroXBufferRight ) {
      d3.select('.hero').attr('fill', 'red');  
    
      console.log("X collision");
    } 
  });


};



/*
=================================
HERO ATTRIBUTES
=================================
*/

var heroRadius = 15;

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
setInterval(update, 5000);
// setInterval(function() {
//   console.log('x:' + x + ', y:' + y);
// }, 100);



setInterval(collision, 300);































