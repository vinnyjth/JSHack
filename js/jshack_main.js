//David Douglas Duncan 

var canvas = document.getElementById('JSHack');
var c = canvas.getContext('2d');


//very important this object, know as the element contains all items that need to be drawn
//might contain data about player/items/monsters later on, who knows XD
e = {};

wall = new Image();
wall.src = "img/wall.png";

floor = new Image();
floor.src = "img/dirt.png";

mainMap = [
[1,0,0,0,0,0,0,0,0,3,0,0,0,0,0],
[0,1,0,0,0,1,1,1,3,0,0,0,0,0,3],
[0,1,0,0,1,1,1,0,1,3,0,0,0,0,0],
[1,0,0,0,0,0,0,0,0,3,0,0,0,0,0],
[0,1,0,0,0,0,1,1,1,3,0,0,0,0,0],
[0,1,0,0,1,1,1,0,1,3,0,0,0,0,0],
[1,0,0,0,0,0,0,0,0,3,0,0,0,0,0],
[0,1,0,0,0,0,1,1,1,3,0,0,0,0,0],
[0,1,0,0,1,1,1,0,1,3,0,0,0,0,0],
[1,0,0,0,0,0,0,0,0,3,0,0,0,0,0],
[0,1,0,0,0,0,1,1,1,3,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];
//we need some events dear watson
window.addEventListener("load", eventWindowLoaded, false);
window.addEventListener("keydown", eventKeyPressed, true);

canvas.addEventListener("click", mouseClicked, false);



//the moving increment for all objects
tileSize = {x: 32, y: 32};
//the size of the game screen
size = {x: 1024, y: 576};

changeWindowSize();

//do nothing right now
function eventWindowLoaded(){
	JSHack();
};

function eventKeyPressed(keyEvent){
	var keyCode = keyEvent.keyCode;
	var player;

	//is the player box there?
	if(e['player']){
		//Yes! Good
		player = e['player'];
	}else{
		//Bad! Let's draw him. 
	 	drawBox('#eafc25', 32, 32, 0, 0, 0, 'player');
	 	player = e['player'];
	}
	if(keyCode == 37){
		keyEvent.preventDefault();
		e['player'].locX -= tileSize.x;
	}else if(keyCode == 38){
		keyEvent.preventDefault();
		e['player'].locY -= tileSize.y;
	}else if(keyCode == 39){
		keyEvent.preventDefault();
		e['player'].locX += tileSize.x;
	}else if(keyCode == 40){
		keyEvent.preventDefault();
		e['player'].locY += tileSize.y;
	};


	//draw all elements on screen.
	JSHack();
	//Needed keycodes: Left: 37
	//Up: 38
	//Right: 39
	//Down: 40
};

function mouseClicked(event){
	console.log(event);

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
	console.log('Yes player!')
		//Yes! Good

	}else{
		//Bad! Let's draw him. 
	 	drawBox('#eafc25', 32, 32, 0, 0, 0, 'player');
	}
};

function mapTileHandler(tileNumber){

	if(tileNumber == 0){
		return wall;
	};
	if(tileNumber == 1){
		return floor;
	}
	return wall;
}
//another important function. Takes all the elements from the element list (e) and draws them on the screen
// still need to find a way to handle z indexs. Somehow need to rearrange keys in object by the z index.
function drawScreen(elements){
	clearCanvas();
	console.log(elements);
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
	console.log("We drew " + i + " boxes");
	console.log("We should have drawn " + (mainMap.length*mainMap[0].length) + " boxes");
};
function JSHack() {

	drawMap(mainMap);
	drawPlayer();
	drawScreen();
	console.log(e);
	//might handle game logic later on. Depreciated function.
};
