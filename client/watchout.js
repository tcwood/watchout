/*
=================================
CREATE BACKGROUND CONTAINER
=================================
*/
var svgContainer = d3.select('.board').append('svg')
                               .attr('width', 800)
                               .attr('height', 400)
                               .style('fill', '#94d31b');


/*
=================================
HELPER FUNCTIONS
=================================
*/

var updateData = function(n) {
  var data = [];

  for (var i = 0; i < n; i++) {
    var tempObj = {};

    tempObj.xPos = Math.random() * 400;

    tempObj.yPos = Math.random() * 400;

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
                  .attr('fill', villianColor);  


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
HERO ATTRIBUTES
=================================
*/

var heroRadius = 50;

var heroColor = '#94d31b';

var hero = svgContainer.













update();
update();
setInterval(update, 5000);



































