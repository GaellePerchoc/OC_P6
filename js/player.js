function Player(id, posX, posY) {
	Cell.call(this, id, false, true, false, posX, posY); // Chaînage de la classe Player à la classe Cell
	
	this.name = name;
	this.life = 100;
	this.weapon = {name: "Fouet", type: "weapon00", power: 10};
	this.defensePosture = false;
	this.damage;
	this.nbMove = 0;
	this.nbOffensive = 0;
	this.lastPosition;

	this.initPlayer = function(player){ // Initialise les couleurs propres aux deux joueurs
		switch(player){
			case 1:
				this.color1 = "rgb(181, 23, 0)";
				this.color2 = "rgba(181, 23, 0, 0.4)";
				break;
			case 2:
				this.color1 = "rgb(0, 123, 118)";
				this.color2 = "rgba(0, 123, 118, 0.4)";
				break;
		}
	};

	this.goHorizontally = function(lastPosition, grid){ // Permet le déplacement horizontal du joueur
		grid[this.posY].splice(this.posX, 1, this);						// Dans le tableau, le joueur prend la place de la cellule qu'il souhaite occuper					
		grid[this.posY].splice(lastPosition.posX, 1, lastPosition);		// L'ancienne cellule qu'occupait le joueur est réinjectée dans le tableau à sa position initiale
		this.nbMove += 1;												// Ajout d'un déplacement au compteur
	};

	this.goVertically = function(lastPosition, grid){ // Permet le déplacement vertical du joueur
		grid[this.posY].splice(this.posX, 1, this);						// Dans le tableau, le joueur prend la place de la cellule qu'il souhaite occuper
	 	grid[lastPosition.posY].splice(this.posX, 1, lastPosition);		// L'ancienne cellule qu'occupait le joueur est réinjectée dans le tableau à sa position initiale
	 	this.nbMove += 1;												// Ajout d'un déplacement au compteur
	};

	this.collectWeapon = function(grid){ // Collecte d'une arme 
		// Stockage des caractéristiques de l'arme collectée dans trois variables
		var weaponName = this.lastPosition.name;
		var weaponType = this.lastPosition.type;
		var weaponPower = this.lastPosition.power;

		// La position occupée par le joueur prend les caractéristiques de l'ancienne arme du joueur
		this.lastPosition.name = this.weapon.name;
		this.lastPosition.type = this.weapon.type;
		this.lastPosition.power = this.weapon.power;

		// L'arme portée par le joueur devient l'arme qu'il a collecté
		this.weapon = {name: weaponName, type: weaponType, power: weaponPower};
		this.updatePlayerWeaponInfo();
	};

	this.takeDamage = function(attacker){ // Subit des dommages lors d'une attaque
		if(this.defensePosture == false){ 								// Le joueur n'est pas en position de défense, il perd autant de pts de vie que vaut l'arme de son adversaire
			this.damage = attacker.weapon.power;
			this.life = this.life - this.damage;						
		} else if(this.defensePosture == true){							// Le joueur est en position de défense, il perd en pts de vie la moitiée de la force de l'arme de son adversaire
			this.damage = attacker.weapon.power/2
			this.life = this.life - this.damage;
			this.defensePosture = false;
		}

		attacker.nbOffensive += 1;										// Ajout d'une attaque au compteur de l'adversaire
		this.updatePlayerLife();										
	};

	this.protectHimSelf = function(){ // Active la défense du joueur
		if(this.defensePosture == false){
			this.defensePosture = true;
		}
	};

	this.updatePlayerWeaponInfo = function(){ // Mise à jour des infos relatives à l'arme dans le DOM
		$('.' + this.id + ' span.weapon').text(this.weapon.name);
		$('.' + this.id + ' span.strength').text(this.weapon.power);
	};

	this.updatePlayerLife = function(){ // Mise à jour des points de vie du joueur dans le DOM
		if(this.life < 0){
			$('.' + this.id + ' .life .barreLife').css('width', '0');
		} else {
			$('.' + this.id + ' .life .barreLife').css('width', this.life + '%');
		}
	};
	
}

