define(['KeyboardController',
		'lib/requestAnimationFrame'],
function(
		 KeyboardController){
	'use strict';

	function Joystix(opts){
		this.$window = opts.$window;

		this.moveCb = function(){};
		this.buttonCb = function(){};

		this.numButtons = 15;
		this.keyboardSpeed = opts.keyboardSpeed || 5;
		this.assumeTouch = !!opts.assumeTouch;

		KeyboardController.init(this.$window);

		this.poll();
	}

	Joystix.prototype.onMove = function(cb){
		this.moveCb = cb;
	};

	Joystix.prototype.onButtonPress = function(cb){
		this.buttonCb = cb;
	};

	Joystix.prototype.getMovementForKeyboard = function(movementStatus){
		var x = movementStatus.RIGHT ? this.keyboardSpeed : (movementStatus.LEFT ? -this.keyboardSpeed : 0),
			y = movementStatus.DOWN ? this.keyboardSpeed : (movementStatus.UP ? -this.keyboardSpeed : 0);
			// console.log(x, y)
			// debugger;
		return {
			x1: x,
			y1: y,
			x2: 0,
			y2: 0
		};
	};

	Joystix.prototype.getButtonsForKeyboard = function(isPressed){
		var buttonArray = [];
		_(this.numButtons).times(function(){
			buttonArray.push(false);
		});
		buttonArray[0] = isPressed;
		return buttonArray;
	};

	Joystix.prototype.poll = function(){
		var self = this;

		function loop(){
			var status;
			self.moveCb(self.getMovementForKeyboard(KeyboardController.getMovement()));
			self.buttonCb(self.getButtonsForKeyboard(KeyboardController.getButtonPress()));
			window.requestAnimationFrame(loop);
		}
		loop();
	};

	return Joystix;

});