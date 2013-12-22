//David Douglas Duncan 

var canvas = document.getElementById('JSHack');
var c = canvas.getContext('2d');


//very important this object, know as the element contains all items that need to be drawn
//might contain data about player/items/monsters later on, who knows XD

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

wall = new Image();
wall.src = "img/wall.png";

floor = new Image();
floor.src = "img/dirt.png";

playerImg = new Image();
playerImg.src = "img/player.png";


//

//we need some events dear watson
window.addEventListener("load", eventWindowLoaded, false);
window.addEventListener("keydown", eventKeyPressed, true);

canvas.addEventListener("click", mouseClicked, false);


function mapGenerator(sizeX, sizeY){
	var map = [];
	var mapCol = [];
	var mapRow = [];
	//Generates a blank maze
	for(var dy = 0; dy < sizeY; dy++){
		mapRow = [];
		for(var dx = 0; dx < sizeX; dx++){
			if(Math.random() > .5){
				mapRow[dx] = 0;
			}else{
				mapRow[dx] = 1;
			};
		}
		map[dy] = mapRow;
	}

	return map;

}
//the moving increment for all objects
tileSize = {x: 32, y: 32};
//the size of the game screen
size = {x: 1024, y: 576};

mainMap = mapGenerator(size.x/tileSize.x, size.y/tileSize.y);

changeWindowSize();

//do nothing right now
function eventWindowLoaded(){
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
