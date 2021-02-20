var trex, trex_running, edges;
var ground, groundImage;
var invisible;
var cloud, cloudImage;
var score;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var obstacle1Image, obstacle2Image, obstacle3Image, obstacle4Image, obstacle5Image, obstacle6Image;
var obstacleGroup, cloudGroup;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex_collided;
var gameOver, gameOverImage, restart, restartImage;
var highScore;
var die, jump, checkPoint;
var backgroundImage;

function preload() {
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImage = loadImage("ground2.png")
  cloudImage = loadImage("cloud.png");
  obstacle1Image = loadImage("obstacle1.png");
  obstacle2Image = loadImage("obstacle2.png");
  obstacle3Image = loadImage("obstacle3.png");
  obstacle4Image = loadImage("obstacle4.png");
  obstacle5Image = loadImage("obstacle5.png");
  obstacle6Image = loadImage("obstacle6.png");
  trex_collided = loadAnimation("trex_collided.png");
  gameOverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
  die = loadSound("die.mp3");
  jump = loadSound("jump.mp3");
  checkPoint = loadSound("checkPoint.mp3");
  backgroundImage = loadImage("background.jpg");
}

function setup() {
  createCanvas(displayWidth-10,displayHeight-120);
  
  // creating trex
  trex = createSprite(displayWidth/2-500,displayHeight-220,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  edges = createEdgeSprites();
  
  //adding scale and position to trex  
  trex.scale = 0.5;
  //trex.x = 50
  
  //ground = createSprite(300, 180, 600, 15);
  ground = createSprite(displayWidth/2, displayHeight-180, displayWidth, 15);
  ground.addImage("ground", groundImage);
  ground.x = ground.width/2;
  
  invisible = createSprite(displayWidth/2-250,displayHeight-180, displayWidth, 5);
  invisible.visible = false;
  
  score = 0;
  
  obstacleGroup = new Group();
  cloudGroup = new Group();
  
  gameOver = createSprite(displayWidth/2, displayHeight/2-50, 10, 10);
  gameOver.addImage("image", gameOverImage);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  restart = createSprite(displayWidth/2, displayHeight/2-100, 10, 10);
  restart.addImage("image", restartImage);
  restart.scale = 0.5;
  restart.visible = false;
  
  highScore = 0;
}

function draw() {
  //set background color 
  background(backgroundImage);
  
  textSize(15);
  text("Score : "+score, displayWidth-450, displayHeight-700);
  
  textSize(15);
  text("High Score : "+highScore, displayWidth-300, displayHeight-700);
  
  if(gameState == PLAY) {
    ground.velocityX = -(4+3*score/100);
    if (score%100 == 0 && score>0) {
    checkPoint.play();
    }
    score = score+Math.round(getFrameRate()/60);
    if(keyDown("space") && trex.y>=displayHeight/2+150) {
      trex.velocityY = -10;
      jump.play();
    }
    trex.velocityY = trex.velocityY + 0.5;
    if(ground.x<displayWidth/2) {
      ground.x = ground.width/2;
    }
    spawnClouds();
    spawnObstacles();
    if(obstacleGroup.isTouching(trex)) {
      gameState = END;
      die.play();
    }
  }
  else if(gameState == END) {
    ground.velocityX = 0;
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    trex.changeAnimation("collided", trex_collided);
    trex.velocityY = 0;
    gameOver.visible = true;
    restart.visible = true;
  }
  
  if (mousePressedOver(restart)) {
    gameState = PLAY;
    obstacleGroup.destroyEach();
    cloudGroup.destroyEach();
    gameOver.visible = false;
    restart.visible = false;
    trex.changeAnimation("running", trex_running);
    if (score>highScore) {
      highScore=score;
    }
    score=0;
  }
  
  //stop trex from falling down
  trex.collide(invisible);
  
  drawSprites();
}

function spawnClouds() {
  if(frameCount % 60 == 0) {
    cloud = createSprite(displayWidth-400, displayHeight-100, 40, 10);
    cloud.velocityX = -3;
    cloud.y = random(70, 120);
    cloud.addImage("image", cloudImage);
    cloud.scale = 0.5;
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    cloud.lifetime = 200;
    cloudGroup.add(cloud);
  }
}

function spawnObstacles() {
  if(frameCount % 60 == 0) {
    obstacle = createSprite(displayWidth-400, displayHeight-200, 10, 40);
    obstacle.velocityX = -(6+3*score/100);
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1:obstacle.addImage(obstacle1Image);
        break;
      case 2:obstacle.addImage(obstacle2Image);
        break;
      case 3:obstacle.addImage(obstacle3Image);
        break;
      case 4:obstacle.addImage(obstacle4Image);
        break;
      case 5:obstacle.addImage(obstacle5Image);
        break;
      case 6:obstacle.addImage(obstacle6Image);
        break;
      default : break;
    }
    obstacle.lifetime = 150;
    obstacle.scale = 0.5;
    obstacleGroup.add(obstacle);
  }
}