function Play(){

	this.cookieConsent = new Cookie();
	this.cplayer01 = new Cookie();
	this.cplayer02 = new Cookie();
	this.chrono = new Timer(0,0);
	this.game = new Game(this.chrono, this.cplayer01, this.cplayer02, this.cookieConsent);
	this.game.board.displayBoard(this.game.board.grid);
	this.namePlayer01 = null;
	this.namePlayer02 = null;

	this.getPlayerName = function(){ // Définition des noms de joueurs au début du jeu
		$('#welcome').modal('show');												// Ouverture fenêtre modale
		$('#welcome').on('shown.bs.modal', function(){
			$('input#player1').focus();
		});

		this.resetFormControl();													// Remise à zéro de l'état du formulaire au focus après contrôle

		var that = this;															// Stockage de "this" dans "that" pour pouvoir y faire référence après l'évènement "click"
		$('#submit').on('click', function(e){	
			e.preventDefault();

			that.namePlayer01 = $('#player1').val();								// On récupère les noms des joueurs
			that.namePlayer02 = $('#player2').val();
			that.formControl();														// Test des noms des joueurs

			if (that.namePlayer01.length >= 1 && that.namePlayer01.length <= 15 && that.namePlayer02.length >= 1 && that.namePlayer02.length <= 15 && that.namePlayer01 != that.namePlayer02) {	
				$('#welcome').modal('hide');
				that.setPlayerName(that.namePlayer01,that.namePlayer02);
				that.displayPlayerName(that.namePlayer01,that.namePlayer02);
				$('#player1').val("");
				$('#player2').val("");				
			}
		})	
	};

	this.startGame = function(){ // Lancement du jeu
		this.cookieConsent.getCookieConsent();										// Affichage de la bannière d'alerte d'info sur les cookies si besoin
		this.namePlayer01 = this.cplayer01.getCookie("player01");					// On récupère les pseudos des joueurs stockés dans les cookies								
		this.namePlayer02 = this.cplayer02.getCookie("player02");

		if(this.namePlayer01 != "" && this.namePlayer02 != ""){						// Cas du replay avec consentement utilisateur pour l'utilisation des cookies
			this.setPlayerName(this.namePlayer01,this.namePlayer02);
			this.displayPlayerName(this.namePlayer01,this.namePlayer02);
			this.chrono.start();
			this.game.getMovementPossibility(this.game.firstPlayer);
			
		} else {		
			this.getPlayerName();
			var that = this;
			$('#welcome').on('hide.bs.modal', function(){	
				that.chrono.start();
				that.game.getMovementPossibility(that.game.firstPlayer);
			});
		}

		this.cplayer01.eraseCookie("player01");										// On supprime les cookies
		this.cplayer02.eraseCookie("player02");

	};

	this.formControl = function(){ // Contrôle du formulaire au début du jeu
		if(this.namePlayer01.length == 0 && this.namePlayer02.length == 0){
				$('input[type="text"]').css('box-shadow', '0px 0px 5px #B51700');
				$('input[type="text"]').attr('data-original-title', 'Merci de saisir un nom').attr('data-toggle', 'tooltip').attr('data-placement', 'right').tooltip('show');
			} else if(this.namePlayer02 == this.namePlayer01){
				$('input[type="text"').css('box-shadow', '0px 0px 5px #B51700');
				$('input[type="text"]').attr('data-original-title','Les noms saisis doivent être différents').attr('data-toggle', 'tooltip').attr('data-placement', 'right').tooltip('show');
			} else if(this.namePlayer01.length == 0){
				$('input#player1 ').css('box-shadow', '0px 0px 5px #B51700');
				$('input#player1 ').attr('data-original-title', 'Merci de saisir un nom').attr('data-toggle', 'tooltip').attr('data-placement', 'right').tooltip('show');
			} else if(this.namePlayer02.length == 0){
				$('input#player2 ').css('box-shadow', '0px 0px 5px #B51700');	
				$('input#player2').attr('data-original-title', 'Merci de saisir un nom').attr('data-toggle', 'tooltip').attr('data-placement', 'right').tooltip('show');		
			}
	};

	this.resetFormControl = function(){ // Retrait des contrôles les input quand retour du focus
		$('input#player1').on('focus', function(){
				$('input#player1').css('box-shadow', '0px 0px 10px #5E5E5E');
				$('input#player1').removeAttr('data-original-title').removeAttr('data-toggle').removeAttr('data-placement').tooltip('hide');
		})

		$('input#player2').on('focus', function(){
				$('input#player2').css('box-shadow', '0px 0px 10px #5E5E5E');
				$('input#player2').removeAttr('data-original-title').removeAttr('data-toggle').removeAttr('data-placement').tooltip('hide');
		})
	};

	this.setPlayerName = function(namePlayer01, namePlayer02){ // Attribution des noms des joueurs aux instances players
		for(var i=0; i < this.game.players().length; i++){
			if(this.game.players()[i].id == "player01"){
				this.game.players()[i].name = namePlayer01;
			} else if(this.game.players()[i].id == "player02"){
				this.game.players()[i].name = namePlayer02;
			}
		}		
	};

	this.displayPlayerName = function(namePlayer01, namePlayer02){ // Affichage des noms des joueurs sur leur carte dans le DOM
		$('.player01 .playerName').text(namePlayer01);
		$('.player02 .playerName').text(namePlayer02);
	};


} 

$(function(){
	var game = new Play(); // Instanciation du jeu
	game.startGame(); // Lancement du jeu
});