/*
	main.js file
*/
require(['lib/DependencyLoader',
		'BackgroundRenderer',
		'CharacterRenderer',
		'CollisionMap',
		'Agent',
		'Tileset',
		'Joystix'],
function(DependencyLoader,
		BackgroundRenderer,
		CharacterRenderer,
		CollisionMap,
		Agent,
		Tileset,
		Joystix){
	'use strict';

	var map = [
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			[3,0,0,0,0,2,1,3,0,0,0,0,0,0,0,0,0,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
			[3,0,0,0,2,1,3,0,0,0,0,0,0,0,0,0,0,0,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
			[3,0,0,0,2,3,0,0,2,1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,0,0,0,0,0,0,0,0,0,2],
			[3,0,0,0,2,3,0,0,2,1,1,1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
			[3,0,0,0,2,3,0,0,0,0,2,1,1,1,1,3,0,0,0,0,0,0,0,0,0,0,2,3,0,0,0,0,0,0,0,2],
			[3,0,0,0,0,0,0,0,0,0,0,2,1,3,0,0,0,0,0,0,0,0,2,3,0,0,0,0,0,0,0,0,0,0,0,2],
			[3,0,0,0,0,0,0,0,0,0,2,1,3,0,0,0,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
			[3,0,0,0,0,0,0,0,0,0,2,3,0,0,0,2,1,1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1],
			[3,0,0,0,2,3,0,0,0,0,2,1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1],
			[3,0,0,0,0,0,0,0,0,0,2,3,0,0,2,1,1,1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1],
			[3,0,0,0,0,0,0,0,0,2,1,3,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,0,0,0,2,1,1,1,1,1],
			[3,0,0,0,0,0,0,0,0,0,2,3,0,0,0,0,0,0,2,1,1,1,3,0,0,0,0,0,2,1,1,1,1,1,1,1],
			[3,0,0,0,0,0,0,0,0,0,0,0,0,2,3,0,0,0,0,0,0,0,0,0,0,0,2,1,1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
		],
		tileSize = 24,
		$body = $('body'),
		$window = $(window),
		$canvas,
		canvases = [],
		bgRenderer,
		characterRenderer,
		joystick = new Joystix({
			//assumeTouch: true,
			$window: $(window),
			keyboardSpeed: 10
		}),
		spritesToLoad = 2,

		bgTileset = new Tileset({
			spritePath: 'img/sf2-map.png',
			specPath: 'spec/sf2-map.json',
			onReady: loadCb
		}),

		player = new Agent({
			position: {x:1,y:1},
			velocity: {vx:0,vy:0},
			collision: new CollisionMap({
				map: map
			}),
			tileset: new Tileset({
				spritePath: 'img/sf2-characters.png',
				specPath: 'spec/sf2-characters.json',
				onReady: loadCb
			})
		})
		

	function loadCb(){
		spritesToLoad--;
		if(!spritesToLoad){ run(); }
	}
	
	function run(){

		// build layers
		_(4).times(function(i){
			$canvas = $('<canvas width="'+(map[0].length * tileSize)+'" height="'+(map.length * tileSize)+'" data-index="'+i+'" class="gamecanvas canvas'+i+'"/>');
			$body.append($canvas);
			canvases.push($canvas);
		});

		// start renderers
		bgRenderer = new BackgroundRenderer({
			$el: canvases[1],
			map: map,
			tileSet: bgTileset,
			tileSize: tileSize
		});
		characterRenderer = new CharacterRenderer({
			$el: canvases[2],
			tileSize: tileSize,
			agents: [
				player]
		});


		// input
		joystick.onMove(function(movement){
			player.doMove(movement.x1 * 0.01, movement.y1 * 0.01);
		});


		// run game
		function gameLoop(){
			characterRenderer.draw();
			window.requestAnimationFrame(gameLoop);
		}
		gameLoop();

		centerCanvases();
	}


	// resize
	function centerCanvases(){
		_(canvases).each(function($canvas){
			$canvas.css({
				top: ($window.height() - $canvas.height())/2
			});
		});
	}
	$window.resize(_.throttle(centerCanvases,250));


});