function Game (chrono, cplayer01, cplayer02, cookieConsent){

	this.board = new Board(10, randomNb(10,15)); // Instanciation du plateau de jeu
	this.board.addObjectsOnBoard(this.board.grid); // Ajout des objets sur le plateau

	this.players = function(){ // Stockage des joueurs dans un tableau
		var players = [ ];	
		for (var i=0; i < this.board.grid.length; i++){
			for (var j=0; j < this.board.grid[i].length; j++){
				if(this.board.grid[i][j].isPlayer == true){
					players.push(this.board.grid[i][j]);				
				}
			}
		}
		return players;
	};

	this.firstPlayer = this.players()[randomNb(0,2)]; // Définition du joueur qui commence la partie 

	this.changeCurrentPlayer = function(currentPlayer){ // Permet le changement de joueur	
		if(currentPlayer === this.players()[0]){
			currentPlayer = this.players()[1];
		} else if(currentPlayer === this.players()[1]){
			currentPlayer = this.players()[0];
		}
		this.getMovementPossibility(currentPlayer);
	};

	this.getMovementPossibility = function(currentPlayer){ // Définit les possibilités de déplacements du current player
		
		this.displayCurrentPlayer(currentPlayer);

		var posX = currentPlayer.posX;
		var posY = currentPlayer.posY;
		var id;

		// Gauche		
		for(var i = posX-1; i >= posX-3; i--) {
			if(this.board.grid[posY][i] === undefined || this.board.grid[posY][i].isAccessible == false){
				break;
			} else if(this.board.grid[posY][i].isAccessible == true) {
				this.board.grid[posY][i].isPath = true;
				id = '#' + i + '-' + posY;
				this.displayPath(currentPlayer, id);
			}
		}

		// Droite
		for(var i = posX+1; i <= posX+3; i++) {
			if(this.board.grid[posY][i] === undefined || this.board.grid[posY][i].isAccessible == false){
				break;
			} else if(this.board.grid[posY][i].isAccessible == true) {
				this.board.grid[posY][i].isPath = true;
				id = '#' + i + '-' + posY;
				this.displayPath(currentPlayer, id);
			}		
		}

		// Haut
		for(var i = posY-1; i >= posY-3; i--) {
			if(this.board.grid[i] === undefined || this.board.grid[i][posX].isAccessible == false){
				break;
			} else if(this.board.grid[i][posX].isAccessible == true) {
				this.board.grid[i][posX].isPath = true;
				id = '#' + posX + '-' + i;
				this.displayPath(currentPlayer, id);
			}		
		}

		// Bas
		for(var i = posY+1; i <= posY+3; i++) {
			if(this.board.grid[i] === undefined || this.board.grid[i][posX].isAccessible == false){
				break;
			} else if(this.board.grid[i][posX].isAccessible == true) {
				this.board.grid[i][posX].isPath = true;
				id = '#' + posX + '-' + i;
				this.displayPath(currentPlayer, id);
			}		
		}

		this.movePlayer(currentPlayer);
	}

	this.movePlayer = function(currentPlayer){ // Permet le déplacement du joueur		
		var that = this; 															// Stockage de "this" dans "that" pour pouvoir y faire référence après l'évènement "click"				
		$('#container').one('click', '.path', function(e){	
		 	var idClickedCell = e.target.getAttribute('id');
		 	for(var i=0; i < that.board.grid.length ; i++){
		 		for (var j=0; j < that.board.grid[i].length; j++){
		 			if(that.board.grid[i][j].id == idClickedCell){
		 				var lastPosition = currentPlayer.lastPosition;				// On enregistre la dernière position occupée par le joueur dans "lastPosition"
		 				currentPlayer.lastPosition = that.board.grid[i][j];			// La position cliquée devient la dernière position occupée par le joueur
		 				currentPlayer.posX = j;
		 				currentPlayer.posY = i;
		 				
		 				if(currentPlayer.lastPosition.isWeapon == true){ 			// Si la position occupée par le joueur est une arme, collecte de l'arme
		 					currentPlayer.collectWeapon(that.board.grid);
		 				}

		 				if(currentPlayer.posY != lastPosition.posY){ 				// Déplacement vertical
		 					currentPlayer.goVertically(lastPosition, that.board.grid);
		 				} else if(currentPlayer.posX != lastPosition.posX){ 		// Déplacement horizontal
							currentPlayer.goHorizontally(lastPosition, that.board.grid);
						}		 				
		 			}
		 		}
		 	}

		 	that.displayMovePlayer(currentPlayer, idClickedCell, lastPosition); 	// Affichage du résultat du mouvement dans le navigateur		 	
		 	that.removePath(that.board.grid, idClickedCell); 						// Retrait des cellules fléchées comme "path"

		 	setTimeout(function(){
		 		if(currentPlayer.adjacentPlayer(that.board.grid) == true){ 			// Test des positions adjacentes. Si valeur retournée est true, le combat peut commencer
					that.fight(currentPlayer);
		 		} else {
					that.changeCurrentPlayer(currentPlayer); 						// Sinon, changement de joueur
				}	
		 	},200);
		 							
	 	});
	};

	this.fight = function(currentPlayer){ // Initialise le combat
		var newFight = new Fight(this,chrono,cplayer01,cplayer02,cookieConsent);    // Instanciation du combat		
		var attacker = currentPlayer;												// Définition des rôles au début du combat
		var opponent;
		if(attacker == this.players()[0]){
			opponent = this.players()[1];
		} else if(attacker == this.players()[1]){
			opponent = this.players()[0];
		}

		newFight.startFight(attacker, opponent);									// Lancement du combat
	};

	this.displayCurrentPlayer = function(currentPlayer){ // Affichage des caractéristiques du current player dans le DOM
		$('.' + currentPlayer.id + '.card').css("box-shadow", "0px 0px 5px #5E5E5E");
		$('#' + currentPlayer.id).css("background-color", currentPlayer.color1);
	};

	this.displayPath = function(currentPlayer, id){ // Affichage des possibilités de déplacement du current player
		$(id).addClass('path');
		$('.path').css("background-color", currentPlayer.color2);
		$('.path').css("cursor","pointer");
	};

	this.removePath = function(grid, id){ // Retrait des possibilités de déplacement du current player sur le plateau et dans le DOM
		for(var i=0; i < grid.length; i++){
	 		for(var j=0; j < grid[i].length; j++){
				grid[i][j].isPath = false;
		 	}
		}
		$('.path').css('transition', '');
		$('.path').css("background-color",'#D6D5D5');
		$('.path').css("cursor","initial");
		$('.cell').removeClass('path');
	};

	this.displayMovePlayer = function(currentPlayer, idClickedCell, lastPosition){ // Affichage du résultat du déplacement du current player
		$('#' + idClickedCell).removeClass();										// Retrait de toutes les classes de la cellule cliquée
		$('#' + idClickedCell).addClass('player cell');								// Ajout des classes player et cell

		$('#' + currentPlayer.id).removeClass();									// Retrait de toutes les classes de la cellule précédemment occupée par le joueur
		$('#' + currentPlayer.id).addClass('cell');									// Ajout de la classe cell
		$('#' + currentPlayer.id).css("background-color", "");						// Réinitialisation de la couleur de la cellule

		if(lastPosition.isWeapon == true){ 
		 	$('#' + currentPlayer.id).addClass(lastPosition.type);					// Si la position qui était occupée par le joueur contenait une arme, il laisse l'arme qu'il possédait avant sur cette position
		}

		$('#' + currentPlayer.id).attr('id', lastPosition.id);						// L'ancienne position occupée par le joueur reprend son id initial
		$('#' + idClickedCell).attr('id', currentPlayer.id);						// La cellule clickée prend l'id du current player pour id
		$('#' + currentPlayer.id).css("cursor", "initial");
		$('#' + idClickedCell).css("cursor", "initial");

		$('.' + currentPlayer.id + '.card').css("box-shadow", "");					// Retrait de l'ombre sur la carte du current player
			
		if(currentPlayer.lastPosition.isWeapon == true){							// Si le joueur collecte une arme, animation
			this.collectWeaponAnimation(currentPlayer);
		}	
		
	};

	this.collectWeaponAnimation = function(currentPlayer){ // Animation de la collecte d'une arme
		$('#' + currentPlayer.id).append('<div class="collectWeapon ' + currentPlayer.weapon.type +'"></div>');
		$('.collectWeapon.' + currentPlayer.weapon.type).animate({
			opacity:0,
			top:'-10px'
		},
		600,
		'swing',
		function(){
			$('.collectWeapon.' + currentPlayer.weapon.type).remove();
		})
	}
}
