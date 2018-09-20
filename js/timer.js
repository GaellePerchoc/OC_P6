function Timer(second, minute){

	this.second = second;
	this.minute = minute;
	this.hasToStop = false;

	this.timer = function(){
		this.second += 1;

		if(this.second == 59){
			this.minute += 1;
			this.second = 0;
		}
	};

	this.start = function(){
		var that = this;
		var timer = setInterval(function(){
			that.timer();
			that.displayTimer();
		}, 1000);

		$('#result').on('show.bs.modal', function(){
			that.stop(timer);
		});

		$('#regles').on('show.bs.modal', function(){
			$('#regles').off('hide.bs.modal');
			that.pause(timer);
		});

		$('#cookieInfo').on('show.bs.modal', function(){
			$('#cookieInfo').off('hide.bs.modal');
			that.pause(timer);
		});
	};

	this.pause = function(timer){
		clearInterval(timer);

		var that = this;
		$('#regles').on('hide.bs.modal', function(){
			$('#regles').off('show.bs.modal');
			if(that.hasToStop == false){
				that.start();
			} else {
				that.stop(timer);
			}
		});

		$('#cookieInfo').on('hide.bs.modal', function(){
			$('#cookieInfo').off('show.bs.modal');
			if(that.hasToStop == false){
				that.start();
			} else {
				that.stop(timer);
			}
		});
	};

	this.stop = function(timer){
		clearInterval(timer);
	};

	this.displayTimer = function(){
		if(this.minute < 10){
			$('#timer span.minute').text('0'+ this.minute);
		} else {
			$('#timer span.minute').text(this.minute);
		}
			
		if(this.second < 10){
			$('#timer span.second').text('0' + this.second);					
		} else {
			$('#timer span.second').text(this.second);
		}
	};
	
}

