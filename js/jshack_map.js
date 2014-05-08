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