function Cell (id, isAccessible, isPlayer, isWeapon, posX, posY){	
	this.id = id;
	this.isAccessible = isAccessible;
	this.isPlayer = isPlayer;
	this.isWeapon = isWeapon;
	this.isPath;
	this.posX = posX;
	this.posY = posY;

	this.adjacentPlayer = function(grid){ // Teste si un joueur se trouve sur une case adjacente
		if(this.posX-1 >= 0 && grid[this.posY][this.posX-1].isPlayer == true){
			return true;
		} else if(this.posX+1 <= grid.length-1 && grid[this.posY][this.posX+1].isPlayer == true){
			return true;
		} else if(this.posY-1 >= 0 && grid[this.posY-1][this.posX].isPlayer == true){
			return true;
		} else if(this.posY+1<= grid.length-1 && grid[this.posY+1][this.posX].isPlayer == true){
			return true;
		}
	};

	this.adjacentObstacle = function(grid){ // Teste si un obstacle se trouve sur une case adjacente
		if(this.posX-1 >= 0 && grid[this.posY][this.posX-1].isAccessible == false){
			return true;
		} else if(this.posX+1 <= grid.length-1 && grid[this.posY][this.posX+1].isAccessible == false){
			return true;
		} else if(this.posY-1 >= 0 && grid[this.posY-1][this.posX].isAccessible == false){
			return true;
		} else if(this.posY+1<= grid.length-1 && grid[this.posY+1][this.posX].isAccessible == false){
			return true;
		} else if(this.posX-1 >=0 && this.posY-1 >= 0 && grid[this.posY-1][this.posX-1].isAccessible == false){
			return true;
		} else if(this.posX-1 >=0 && this.posY+1 <= grid.length-1 && grid[this.posY+1][this.posX-1].isAccessible == false){
			return true;
		} else if(this.posX+1 <= grid.length-1 && this.posY-1 >= 0 && grid[this.posY-1][this.posX+1].isAccessible == false){
			return true;
		} else if(this.posX+1 <= grid.length-1 && this.posY+1 <= grid.length-1 && grid[this.posY+1][this.posX+1].isAccessible == false){
			return true;
		}
	};
}
