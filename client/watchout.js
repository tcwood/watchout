
/*
=================================
GLOBAL VARS
=================================
*/

var width = window.innerWidth;
var height = window.innerHeight + 45;
var duration = 2000;

var updateData, detectCollisions, increaseScore, increaseVillians, heroData;

var gameOver = false;

/*
=================================
SCOREBOARD
=================================
*/


var highScore = 0;
var score = 0;


/*
=================================
HERO ATTRIBUTES
=================================
*/

var heroRadius = 30;

var heroColor = '#94d31b';




// ============================ 
// VILLIAN ATTRIBUTES
// ============================
var villianRadius = 20;

var villianColor = '#000000';

var numVillians = 1;

var addVillianRate = 2;



/*
=================================
CREATE BACKGROUND CONTAINER
=================================
*/
var svgContainer = d3.select('.board').append('svg')
                               .attr('id', 'svgContainer')
                               .style('fill', '#ccffff');






/*
=================================
INITIALIZE FUNCTIONS
=================================
*/

var setRandomPositions = function(n) {
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
  var villianObjects = setRandomPositions(numVillians);

  var villians = svgContainer.selectAll('circle')
                  .data(villianObjects, d => d.id);


  // HERO ENTER
  var hero = svgContainer.selectAll('hero')
                         .data(heroData);
  hero.enter().append('circle')
            .attr('cx', d => d.xPos)
            .attr('cy', d => d.yPos)
            .attr('fill', heroColor) 
            .attr('r', heroRadius)
            .classed('hero', true)
            .call(drag);

  // ENTER
  villians.enter().append('circle')
                  .attr('cx', function(d) {
                    var curr = d.xPos;
                    var hero = d3.select('.hero').attr('cx');
            
                    if (Math.abs(curr - hero) < heroRadius + villianRadius + 10) {
                      return d.xPos + (heroRadius + villianRadius) * 2 + 50;
                    } else {
                      return d.xPos;
                    }
                  })
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

  d3.selectAll('.villian').data(villianObjects, d => d.id).exit()
                          .transition().attr('fill', 'rgb(255, 0, 0)').duration(1000)
                          .style('opacity', 0).remove();
  d3.selectAll('.hero').data(heroData).exit().remove();

};




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

/*
=================================
COLLISION LOGIC
=================================
*/



var collision = function() {
  var hX = d3.select('.hero').attr('cx');

  var hY = d3.select('.hero').attr('cy');

  d3.selectAll('.villian').each(d => {
    var vX = d.cX;
    var vY = d.cY;

    xDiff = Math.ceil(Math.abs(vX - hX));
    yDiff = Math.ceil(Math.abs(vY - hY)); 

    centersDistance = Math.pow((Math.pow(xDiff, 2) + Math.pow(yDiff, 2)), .5);
    // COLLISION
    if (centersDistance < heroRadius + villianRadius) {
      d3.select('.hero').attr('fill', 'red');
      gameReset();
    } else if (hX < heroRadius || hX > width - heroRadius || hY < 45 + heroRadius || hY > height - heroRadius * 2) {
      d3.select('.hero').attr('fill', 'red');
      gameReset();
    }

  });


};


/*
=================================
RUNNING THE GAME
=================================
*/



var startGame = function() {
  heroData = [{x: 1, y: 1, xPos: width / 2, yPos: height / 2}];
  //createHero();
  update();
  updateData = setInterval(update, duration);
  detectCollisions = setInterval(collision, 10);
  increaseScore = setInterval( function() {
    score += Math.round(numVillians * .2);
    $('.score').text('Score: ' + score);
    if (score > highScore) {
      highScore = score;
      $('.highScore').text('High Score: ' + score);
    }
  }, 20);
  increaseVillians = setInterval(function() {
    numVillians += addVillianRate;
  }, duration);
  d3.select('.hero').attr('fill', heroColor);
  gameOver = false;
};

var gameReset = function() {
  score = 0;
  gameOver = true;
  numVillians = 1;
  setRandomPositions(0);
  heroData = [];
  d3.select('.hero').transition()
                    .attr('cx', width / 2)
                    .attr('cy', height / 2)
                    .duration(1000);

  clearInterval(updateData);
  clearInterval(setRandomPositions);
  clearInterval(increaseScore);
  clearInterval(increaseVillians);
  clearInterval(detectCollisions);
};

/*
=================================
MAGIC
=================================
*/

startGame();

d3.select('.hero').on('mouseenter', function() {
  if (gameOver) {
    startGame();
  }         
});



