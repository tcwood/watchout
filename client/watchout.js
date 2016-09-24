
/*
=================================
GLOBAL VARS
=================================
*/

var width = window.innerWidth;
var height = window.innerHeight + 45;
var duration = 2000;
var numVillians = 1;
var gameOver = false;
var addVillianRate = 2;
var highScore = 0;
var score = 0;



var addVillians = function() {
  setInterval(function() {
    numVillians += addVillianRate;
  }, duration);
};



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
SCOREBOARD
=================================
*/

var increaseScore = setInterval( function() {
  if (!gameOver) {
    score += Math.round(numVillians * .2);
    $('.score').text('Score: ' + score);
    if (score > highScore) {
      $('.highScore').text('High Score: ' + score);
    }
  }
}, 20);



/*
=================================
GAME RESET
=================================
*/
var gameReset = function() {
  score = 0;
  gameOver = false;
  numVillians = 1;


};


/*
=================================
VILLIAN FUNCTIONS
=================================
*/

var updateData = function(n, trigger) {
  var data = [];
  if (trigger) {       //empty array if game over
    return data;
  }

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
  var villianObjects = updateData(numVillians, gameOver);

  var villians = svgContainer.selectAll('circle')
                  .data(villianObjects, d => d.id);

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
      
      d3.select('.hero').attr('fill', 'red');
      gameOver = true;
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



var createHero = function() {
  var hero = svgContainer.selectAll('hero')
                         .data([{x: 1, y: 1, xPos: width / 2, yPos: height / 2}]);
  hero.enter().append('circle')
            .attr('cx', d => d.xPos)
            .attr('cy', d => d.yPos)
            .attr('fill', heroColor) 
            .attr('r', heroRadius)
            .classed('hero', true)
            .call(drag);
};

var startGame = function() {
  createHero();
  update();
  setInterval(update, duration);
  setInterval(collision, 10);
  addVillians();
};

startGame();


