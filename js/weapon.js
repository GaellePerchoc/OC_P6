function Weapon (id, posX, posY){
	Cell.call(this, id, true, false, true, posX, posY); // Chaînage de la classe Weapon à la classe Cell

	this.initWeapon = function(typeWeapon){ // Initialise les armes et définit leurs caractéristiques
		switch(typeWeapon){
			case 0:
				this.name = 'Fouet'; 
				this.type = 'weapon00';
				this.power = 10;
			case 1:
				this.name = 'Rouleau à pâtisserie';
				this.type = 'weapon01';
				this.power = 15;
				break;
			case 2:
				this.name = 'Tire-bouchon';
				this.type = 'weapon02';
				this.power = 20;
				break;
			case 3:
				this.name = 'Couteau office';
				this.type = 'weapon03';
				this.power = 25;
				break;
			case 4:
				this.name = 'Couteau hâchoir';
				this.type = 'weapon04';
				this.power = 35;
				break;
		}
	};
}


