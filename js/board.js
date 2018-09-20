function Board (size, nbObstacle) {

	this.grid = (function(){ // Initialisation d'une grille vide
		var grid = new Array;
		for(var i=0; i < size; i++){
			grid[i] = new Array;
			for(var j=0; j < size; j++){
				var id = j + '-' + i;
				var cell = new Cell(id, true, false, false, j, i); 
				grid[i].push(cell);
			}			
		}
		return grid;
	})();

	this.addObstacle = function(grid){ // Place des obstacles aléatoirement sur le plateau de jeu
		for(var i = 0; i < nbObstacle; i++){
			var x = randomNb(0, size);
			var y = randomNb(0, size);
			if(grid[y][x].adjacentObstacle(grid) == true || grid[y][x].isAccessible == false){
				i--;
			} else {
				grid[y][x].isAccessible = false;
			}	
		}
	};

	this.addWeapon = function(grid){ // Place 4 armes aléatoirement sur le plateau de jeu
		for(var i = 1; i <= 4; i++) {			
			var x = randomNb(0, size);
			var	y = randomNb(0, size);
			var typeWeapon = randomNb(0, 5);			
			if(grid[y][x].isWeapon == false && grid[y][x].isAccessible == true){
				var id = x + '-' + y;
				grid[y][x] = new Weapon(id, x, y);
				grid[y][x].initWeapon(typeWeapon);
			} else {
				i--;
			}
		}
	};

	this.addPlayers = function(grid){ // Place les 2 joueurs aléatoirement sur le plateau
		for(var i = 1; i <= 2; i++){
			var x = randomNb(0, size);
			var	y = randomNb(0, size);				
			if(grid[y][x].adjacentPlayer(grid) == true || grid[y][x].isAccessible == false || grid[y][x].isWeapon == true || grid[y][x].isPlayer == true){
				i--;
			} else {
				var idLastPosition = x + '-' + y;
				grid[y][x] = new Player('player0' + i, x, y);
				grid[y][x].initPlayer(i);
				grid[y][x].lastPosition = new Cell(idLastPosition, true, false, false, x, y);			
			}
		}
	};

	this.addObjectsOnBoard = function(grid){
		this.addObstacle(grid);
		this.addWeapon(grid);
		this.addPlayers(grid);
	};
		
	this.displayBoard = function(grid){ // Affiche le plateau de jeu dans le DOM
		for(var i = 0 ; i < size; i++){
			for (var j=0; j < size; j++){	 			
	 			if(grid[i][j].isWeapon == true){
					$('#container').append('<div id="'+ grid[i][j].id +'" class="cell ' + grid[i][j].type + '"></div>');
				} else if(grid[i][j].isPlayer == true){
					$('#container').append('<div id="'+ grid[i][j].id +'" class="cell player"></div>');
				} else if(grid[i][j].isAccessible == true){
					$('#container').append('<div id="'+ grid[i][j].id + '" class="cell"></div>'); 
				} else if(grid[i][j].isAccessible == false){
					$('#container').append('<div id="'+ grid[i][j].id +'" class="cell obstacle"></div>');
				}
			}
		}		
	};

};
