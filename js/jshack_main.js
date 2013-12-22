//David Douglas Duncan 

var canvas = document.getElementById('JSHack');
var c = canvas.getContext('2d');



//very important this object, know as the element contains all items that need to be drawn
//might contain data about player/items/monsters later on, who knows XD
//the moving increment for all objects
tileSize = {x: 32, y: 32};
//the size of the game screen
size = {x: 1024, y: 576};

wall = new Image();
wall.src = "img/wall.png";

floor = new Image();
floor.src = "img/dirt.png";

playerImg = new Image();
playerImg.src = "img/player.png";

e = {};

player = {
	loc: {x: 0, y: 0},
	image: playerImg
};



//

//we need some events dear watson
window.addEventListener("load", eventWindowLoaded, false);
window.addEventListener("keydown", eventKeyPressed, true);

canvas.addEventListener("click", mouseClicked, false);


function mapGenerator(sizeX, sizeY){
	var map = [];
	var mapCol = [];
	var mapRow = [];

	this.sizeX = sizeX;
	this.sizeY = sizeY;
	//Generates a blank maze
	this.randomMaze = randomMaze;

	function randomMaze(){
		var map = [];
		for(var dy = 0; dy < sizeY; dy++){
			var mapRow = [];
			for(var dx = 0; dx < sizeX; dx++){
				if(Math.random() > .43){
					mapRow[dx] = 0;
				}else{
					mapRow[dx] = 1;
				};
			}
			map[dy] = mapRow;
		}
		return map;
	};


	this.cellularStep = cellularStep;

	function cellularStep(map){
		var newMap = []
		var deathLimit = 3;
		var birthLimit = 5;
		for(var y = 0; y < map.length; y++){
			var mapRow = []
			for(var x = 0; x < map[y].length; x++){
				wallsAround = countAliveNeighbors(map, x, y);

				if(map[y][x] == 0){
					if( wallsAround > 4){
						mapRow[x] = 0;
					}else{
						mapRow[x] = 1;						
					}
				}
				else{
					if(wallsAround > 5){
						mapRow[x] = 0;
					}else{
						mapRow[x] = 1;						
					}					
				}
				newMap[y] = mapRow; 

			}
		}
		return newMap;
	};

	this.buildCave = buildCave
	function buildCave(steps){
		theMaze = randomMaze();
		for (var i = 0; i < steps; i++) {
			theMaze = cellularStep(theMaze);
		};
		return theMaze;
	}

};

function countAliveNeighbors(map, cellX, cellY){
	var count = 0;
	for(var i = -1; i < 2; i++){
		for(var j = -1; j < 2; j++){
			neighborX = cellX + j;
			neighborY = cellY + i;
			if(i == 0 && j == 0){
			}else if(neighborX < 0 || neighborY < 0 || neighborY >= map.length || neighborX > map[0].length){
				count++;
			}else if(map[neighborY][neighborX] == 0){
				count++;
			}
		}
	}
	return count;
};

level1 = new mapGenerator(size.x/tileSize.x, size.y/tileSize.y);


mainMap = level1.buildCave(2);

changeWindowSize();


/* function placePlayerInMap(map){
	var playerMapLocation = {x:0, y:0};
	for(var dy = 0; dy < map.length; dy++){
		for(var dx = 0; dx < map[dy].length; dx++){
			if(map[dy][dx] == 1 && countAliveNeighbors(map, dx, dy) > 4){
				movePlayer(dx*tileSize.x, dy*tileSize.y);
				drawPlayer();	
				return;
			}
		}
	}
}*/
//do nothing right now
function eventWindowLoaded(){
	//placePlayerInMap(mainMap);
	JSHack();
};

function eventKeyPressed(keyEvent){

	var keyCode = keyEvent.keyCode;
	if(keyCode == 37){
		keyEvent.preventDefault();
		movePlayer(player.loc.x - tileSize.x, player.loc.y);
	}else if(keyCode == 38){
		keyEvent.preventDefault();
		movePlayer(player.loc.x, player.loc.y - tileSize.y);
	}else if(keyCode == 39){
		keyEvent.preventDefault();
		movePlayer(player.loc.x + tileSize.x, player.loc.y);
	}else if(keyCode == 40){
		keyEvent.preventDefault();
		movePlayer(player.loc.x, player.loc.y + tileSize.y);
	};
	//draw all elements on screen.
	JSHack();
	//Needed keycodes: Left: 37
	//Up: 38
	//Right: 39
	//Down: 40
};



function movePlayer(desiredX, desiredY){
	var locInMaze = mainMap[desiredY/tileSize.y][desiredX/tileSize.x];

	if(locInMaze == 1){
		player.loc 	= {x: desiredX, y: desiredY};
		e['player'].locX = desiredX;
		e['player'].locY = desiredY;
		return true;

	}else{
		return false;
	};
};

function mouseClicked(event){
	
	mapX = Math.floor(event.offsetX/tileSize.x);
	mapY = Math.floor(event.offsetY/tileSize.y);
	console.log(mapX + " " + mapY)
	console.log(level1.countAliveNeighbors(mainMap, mapX, mapY));
	JSHack();
};
function changeWindowSize(){
	canvas.width = size.x;
	canvas.height = size.y;
};


function clearCanvas(){
	c.clearRect(0,0, canvas.width, canvas.height)
};

//Add the box to the element object
function drawBox(style, sizeX, sizeY, boxX, boxY, index, elementName){
	var boxStyles = {}

	//important because the draw function needs to know how to draw it. 
	boxStyles.elementType = 'box';

	//the color of the box
	boxStyles.fillStyle = style;

	//determine the bottom right corner based on the box size
	boxStyles.secondX = boxX + sizeX;
	boxStyles.secondY = boxY + sizeY;

	//top right corner is easy. 
	boxStyles.locX = boxX;
	boxStyles.locY = boxY;


	e[elementName] = boxStyles; 
};

function drawImage(image, imageX, imageY, index, elementName){
	var imageStyles = {}

	//important because the draw function needs to know how to draw it. 
	imageStyles.elementType = 'image';

	imageStyles.image = image;

	//top right corner is easy. 
	imageStyles.locX = imageX;
	imageStyles.locY = imageY;


	e[elementName] = imageStyles; 
};

function drawMap(map){
	var i = 0;
	for(var dy = 0; dy < map.length; dy++){
		for(var dx = 0; dx < map[dy].length; dx++){
			i++;
			var tileStyle = mapTileHandler(map[dy][dx]);
			if(typeof tileStyle === 'string'){
				drawBox(tileStyle, tileSize.x, tileSize.y, tileSize.x * dx, tileSize.y * dy, 0, ("mapTile" + i));
			}else{
				drawImage(tileStyle, tileSize.x*dx, tileSize.y*dy, 0,("mapTile" + i));
			}
		}
	}
};
function drawPlayer(){
if(e['player']){
		//Yes! Good

	}else{
		//Bad! Let's draw him. 
	 	drawImage( playerImg, player.loc.x, player.loc.y, 0, 'player');
	}
};

function mapTileHandler(tileNumber){

	if(tileNumber == 0){
		return wall;
	};
	if(tileNumber == 1){
		return floor;
	}
	return wall ;
}
//another important function. Takes all the elements from the element list (e) and draws them on the screen
// still need to find a way to handle z indexs. Somehow need to rearrange keys in object by the z index.
function drawScreen(elements){
	clearCanvas();
	for(var i = 0; i < Object.keys(e).length; i++){

		var eBeta = Object.keys(e)[i];
		var ePrime = e[eBeta];

		//drawing a box is different from drawing a square or other object
		if(ePrime.elementType == "box"){
			c.fillStyle = ePrime.fillStyle;
			c.fillRect(ePrime.locX, ePrime.locY, ePrime.secondX, ePrime.secondY);
		} else if(ePrime.elementType == "image"){
			c.drawImage(ePrime.image, ePrime.locX, ePrime.locY);
		};
	};
};
function JSHack() {

	drawMap(mainMap);
	drawPlayer();
	drawScreen();
	//might handle game logic later on. Depreciated function.
};
