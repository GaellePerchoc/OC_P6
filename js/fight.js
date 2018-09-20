function Fight(game, chrono, cplayer01, cplayer02, cookieConsent){

	this.startFight = function(attacker, opponent){ // Amorce du combat
		this.transformBoard(attacker, opponent);
		this.attack(attacker, opponent);
		this.defense(attacker, opponent);		
	};

	this.attack = function(attacker, opponent){ // Attaque du current player
		var that = this;															// Stockage de "this" dans "that" pour pouvoir y faire référence après l'évènement "click"
		$('#attack').one('click', function(){
			$('#defense').off('click');												// Supprime le clic sur le bouton defense pour ce tour
			$('#attack').off('click');												// Supprime le clic sur le bouton attaque pour ce tour

			opponent.takeDamage(attacker);											// L'adversaire perd des pts de vie lors de l'attaque
			that.animationAttack(opponent);											// Animation de la perte des points
			
			setTimeout(function(){ 													// Test des points de vie
				if(opponent.life > 0){												// Si supérieur à 0, changement de tour
					that.getNextPlayer(attacker, opponent);
				} else if(opponent.life <= 0){										// Si inférieur ou égal à 0, fin du jeu
					chrono.hasToStop = true;
					that.endOfTheGame(attacker, opponent);
				}
			}, 400);
			
		});			
	};

	this.defense = function(attacker, opponent){ // Défense du current player
		var that = this;															// Stockage de "this" dans "that" pour pouvoir y faire référence après l'évènement "click"
		$('#defense').one('click', function(){							
			$('#defense').off('click');												// Supprime le clic sur le bouton defense pour ce tour
			$('#attack').off('click');												// Supprime le clic sur le bouton attaque pour ce tour

			attacker.protectHimSelf();												// Le current player active sa défense
			that.animationDefense(attacker);										// Animation 
		
			setTimeout(function(){													// Changement de joueur avec bref délai
				that.getNextPlayer(attacker, opponent);
			}, 400);
		});
	};

	this.getNextPlayer = function(attacker, adversaire){ // Changement de tour et définition des rôles attaquant / défenseur

		if(attacker == game.players()[0]){
			attacker = game.players()[1];
			opponent = game.players()[0];
		} else if(attacker == game.players()[1]){
			attacker = game.players()[0];
			opponent = game.players()[1];
		}

		this.attack(attacker, opponent);
		this.defense(attacker, opponent);
		this.displayCurrentAttacker(attacker, opponent);
	}; 

	this.transformBoard = function(attacker, opponent){ // Transformation du plateau de jeu à l'amorce d'un combat
		$('#container div').not('.player').css("opacity", "0.7");

		$('#attack').css("background-color", attacker.color2);
		$('#attack').css("color", attacker.color1);
		$('#attack').css("cursor", "pointer");
		$('#attack').css('box-shadow', '0 0 5px #5E5E5E');
		$('#attack').mousedown(function(){
			$('#attack').css('box-shadow', '');
		});

		$('#defense').css("background-color", attacker.color2);
		$('#defense').css("color", attacker.color1);
		$('#defense').css("cursor", "pointer");
		$('#defense').css('box-shadow', '0 0 5px #5E5E5E');
		$('#defense').mousedown(function(){
			$('#defense').css('box-shadow', '');
		});
		
		$('#' + attacker.id).css("background-color", attacker.color1);
		$('#' + opponent.id).css("background-color", opponent.color2);
	};

	this.displayCurrentAttacker = function(attacker, opponent){ // Affichage du plateau de jeu au couleur de l'attaquant
		$('#attack').css("background-color", attacker.color2);
		$('#attack').css("color", attacker.color1);
		$('#attack').css('box-shadow', '0 0 5px #5E5E5E');
		$('#defense').css("background-color", attacker.color2);
		$('#defense').css("color", attacker.color1);
		$('#defense').css('box-shadow', '0 0 5px #5E5E5E');
		$('#' + attacker.id).css("background-color", attacker.color1);
		$('#' + opponent.id).css("background-color", opponent.color2);
	};

	this.endOfTheGame = function (attacker, opponent){ // Affichage du message de fin
		var wayToKill = ["liquide", "dessoude", "refroidit", "dégèle", "envoie ad patres", "fait passer le goût du pain à","étripaille"];
		var placeToKill = ["dans la cuisine","dans l'arrière-cuisine","dans le cellier","dans la réserve","dans la chambre froide","dans la cave à vins","au potager"];
		$('#attack').css('box-shadow', '');
		$('#defense').css('box-shadow', '');

		$('#result').modal('show');
		$('#result .modal-body').css('background-color', attacker.color2);
		$('#result span#winner').text(attacker.name);
		$('#result span#wayToKill').text(wayToKill[randomNb(0,7)]);
		$('#result span#looser').text(opponent.name);
		$('#result span#where').text(placeToKill[randomNb(0,7)]);
		$('#result span#weaponName').text(attacker.weapon.name);
		$('#result span#move').text(attacker.nbMove);
		$('#result span#offensive').text(attacker.nbOffensive);
		$('#result span#minute').text(chrono.minute);
		$('#result span#second').text(chrono.second);

		$('.' + attacker.id + '.card').css('box-shadow', '0px 0px 20px #5E5E5E');

		this.replay();		
	};

	this.replay = function(){ // Evénements sur les boutons du message de fin permettant ou non de relancer une partie
		$('#replay #yes').on('click', function(){
			$('#result').modal('hide');
				for(var i=0; i < game.players().length; i++){

					// Si l'utilisateur a consenti aux cookies, on stocke les pseudos des joueurs dans un cookie
					if(cookieConsent.checkCookieConsent() == true){ 	
						if(game.players()[i].id == "player01"){
							cplayer01.setCookie("player01", game.players()[i].name, 1);
						} else if(game.players()[i].id == "player02"){
							cplayer02.setCookie("player02", game.players()[i].name, 1);
						}
					}

				}

				location.reload();
		});

		$('#replay #no').on('click', function(){
			$('#result').modal('hide');
		});
	};

	this.animationAttack = function(opponent){ // Animation d'une attaque
		$('#' + opponent.id + '.cell').append('<div class="damage' + opponent.id + '"> -' + opponent.damage +'</div>');
		$('.damage' + opponent.id).fadeIn().animate({
			opacity:0,
			top:'-100%',
			}, 
			700,
			'linear', 
			function(){
				$('.damage'+ opponent.id).remove();
			}
		);	
	};

	this.animationDefense = function(attacker){ // Animation d'une défense
		$('#' + attacker.id + '.cell').append('<div class="damage' + attacker.id + '">Résistance</div>');
		$('.damage' + attacker.id).fadeIn().animate({
			opacity:0,
				top:'-100%',
			}, 
			700,
			'linear', 
			function(){
				$('.damage'+ attacker.id).remove();
			}
		);
	};

}